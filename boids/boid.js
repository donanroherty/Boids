import vec2 from "./vec2.js"

function boid(pos, vel, flock, app) {
  let position = pos
  let velocity = vel

  let config = flock.getConfig()

  const self = {
    update,
    draw,
    getPosition,
    getVelocity,
    getConfig,
    setConfig,
    getFlock,
  }

  function update(dt) {
    const boids = getBoidsInRange()

    // update forces
    {
      if (boids.length > 0) {
        addForce(cohesion(filterRelevantBoids(boids, config.coheseWithOtherFlocks)))
        addForce(alignment(filterRelevantBoids(boids, config.alignWithOtherFlocks)))
        addForce(separation(filterRelevantBoids(boids, config.separateFromOtherFlocks)))
      }
      velocity = velocity.clampedLen(config.minSpeed, config.maxSpeed)
      addForce(drag())
    }

    position = position.add(velocity.scale(dt))

    mirrorOutOfBounds()
  }

  function getBoidsInRange() {
    const allBoids = app.getFlocks().reduce((acc, f) => acc.concat(f.getBoids()), [])
    const relevantBoids = allBoids.filter(
      (b) =>
        b !== self &&
        position.sub(b.getPosition()).lenSq() < config.detectionRange * config.detectionRange
    )
    return relevantBoids
  }

  function filterRelevantBoids(boids, filter) {
    return boids.filter((b) => {
      if (getFlock() === b.getFlock()) return true
      if (filter) return true
      return false
    })
  }

  function cohesion(boids) {
    if (boids.length === 0) return vec2()

    const avgPos = boids
      .reduce((acc, b) => {
        acc = acc.add(b.getPosition())
        return acc
      }, vec2())
      .div(vec2(boids.length, boids.length))

    const toGroupCenter = avgPos.sub(position)
    return toGroupCenter.scale(config.cohesionFactor)
  }

  function alignment(boids) {
    if (boids.length === 0) return vec2()

    const avgVel = boids
      .reduce((acc, b) => {
        acc = acc.add(b.getVelocity())
        return acc
      }, vec2())
      .div(vec2(boids.length, boids.length))

    const diff = avgVel.sub(velocity)
    return diff.clampedLen(0, config.alignmentMaxStrength)
  }

  function separation(boids) {
    if (boids.length === 0) return vec2()

    const boidsTooClose = boids.filter(
      (b) => position.sub(b.getPosition()).lenSq() < config.separationRange * config.separationRange
    )

    return boidsTooClose.reduce((acc, other) => {
      const ba = getPosition().sub(other.getPosition())
      const dist = ba.len()

      const perc = 1 - dist / config.separationRange
      return acc.add(ba.norm().scale(config.separationMaxStrength * perc))
    }, vec2())
  }

  function drag() {
    return velocity.scale(-config.dragFactor)
  }

  function addForce(force) {
    velocity = velocity.add(force)
  }

  function mirrorOutOfBounds() {
    const { x, y } = app.getSceneSize()

    if (position.y > y) {
      position.y = position.y - y
    } else if (position.y < 0) {
      position.y = y + position.y
    }

    if (position.x > x) {
      position.x = position.x - x
    } else if (position.x < 0) {
      position.x = x + position.x
    }
  }

  function draw(canvas) {
    const ctx = canvas.getContext("2d")

    const hei = config.size
    const wid = config.size * 0.7

    const p0 = vec2(-wid * 0.5, -hei * 0.5)
    const p1 = vec2(0, hei * 0.5)
    const p2 = vec2(wid * 0.5, -hei * 0.5)

    ctx.save()

    const direction = velocity.norm()

    ctx.translate(position.x, position.y)
    ctx.rotate(Math.atan2(direction.y, direction.x) - Math.PI / 2)
    ctx.beginPath()
    ctx.moveTo(p0.x, p0.y)
    ctx.lineTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.closePath()
    ctx.strokeStyle = config.color
    ctx.stroke()
    ctx.restore()
  }

  function getPosition() {
    return position
  }

  function getVelocity() {
    return velocity
  }

  function getConfig() {
    return config
  }

  function setConfig(cfg) {
    config = cfg
  }

  function getFlock() {
    return flock
  }

  return self
}

export default boid
