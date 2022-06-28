import { drawArcCone, drawCircle } from "./rendering.js"
import vec2 from "./vec2.js"

function boid(pos, vel, flock, app) {
  let position = pos
  let velocity = vel

  let config = flock.getConfig()

  let hasPrey = false
  let boidsInRange = []

  const self = {
    update,
    draw,
    getPosition,
    getVelocity,
    getConfig,
    setConfig,
    getFlock,
    updateBoidsInRange,
  }

  function updateBoidsInRange() {
    boidsInRange = app
      .getBoidsInRange(position, config.detectionRange)
      .filter((o) => o !== self && canSee(o))
  }

  function update(dt) {
    if (config.drawDebug) drawDebug(app.getCanvas())

    // update forces
    {
      addForce(cohesion(boidsInRange))
      addForce(alignment(boidsInRange))
      addForce(separation(boidsInRange))
      addForce(avoidPredator(boidsInRange))
      addForce(chasePrey(boidsInRange))
      velocity = velocity.clampedLen(config.minSpeed, config.maxSpeed)
      addForce(drag())
    }

    position = position.add(velocity.scale(dt))

    mirrorOutOfBounds()
  }

  function cohesion(boids) {
    const flockmates = boids.filter((o) => config.coheseWithOtherFlocks || sameFlock(o))

    if (flockmates.length === 0) return vec2()

    const avgPos = flockmates
      .reduce((acc, b) => {
        acc = acc.add(b.getPosition())
        return acc
      }, vec2())
      .div(vec2(flockmates.length, flockmates.length))

    const toGroupCenter = avgPos.sub(position)
    return toGroupCenter.scale(config.cohesionFactor)
  }

  function alignment(boids) {
    const flockmates = boids.filter((o) => config.alignWithOtherFlocks || sameFlock(o))
    if (flockmates.length === 0) return vec2()

    const avgVel = flockmates
      .reduce((acc, b) => {
        acc = acc.add(b.getVelocity())
        return acc
      }, vec2())
      .div(vec2(flockmates.length, flockmates.length))

    const diff = avgVel.sub(velocity)
    return diff.clampedLen(0, config.alignmentMaxStrength)
  }

  function separation(boids) {
    const flockmates = boids.filter((o) => {
      if (!(sameFlock(o) || config.separateFromOtherFlocks)) return false
      const otherPos = o.getPosition()
      const distSq = position.sub(otherPos).lenSq()
      return distSq < config.separationRange * config.separationRange
    })

    return flockmates.reduce((acc, o) => {
      const ba = getPosition().sub(o.getPosition())
      const dist = ba.len()
      const perc = 1 - dist / config.separationRange
      return acc.add(ba.norm().scale(config.separationMaxStrength * perc))
    }, vec2())
  }

  function avoidPredator(boids) {
    const predators = boids.filter((o) => isPrey(self, o))

    return predators.reduce((acc, other) => {
      const ba = getPosition().sub(other.getPosition())
      const dist = ba.len()
      const perc = 1 - dist / config.detectionRange
      return acc.add(ba.norm().scale(config.predatorAvoid * perc))
    }, vec2())
  }

  function chasePrey(boids) {
    const preyFlock = boids.filter((o) => canPreyOn(self, o))
    hasPrey = preyFlock.length > 0

    if (!hasPrey) return vec2()

    const avgPos = preyFlock
      .reduce((acc, b) => {
        acc = acc.add(b.getPosition())
        return acc
      }, vec2())
      .div(vec2(preyFlock.length, preyFlock.length))

    const toGroupCenter = avgPos.sub(position)
    return toGroupCenter.scale(config.predatorAttack)
  }

  function drag() {
    return velocity.scale(-config.dragFactor)
  }

  function addForce(force) {
    velocity = velocity.add(force)
  }

  function sameFlock(other) {
    return flock === other.getFlock()
  }

  function canSee(other) {
    const toOther = other.getPosition().sub(position).norm()
    const dir = velocity.norm()
    const dot = dir.dot(toOther)
    const perc = (config.fov * 0.5) / 180
    const mapped = 1 - 2 * perc
    return dot > mapped
  }

  function canPreyOn(a, b) {
    return a.getConfig().isPredator && b.getConfig().size < a.getConfig().size
  }

  function isPrey(a, b) {
    return b.getConfig().isPredator && b.getConfig().size > a.getConfig().size
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

    if (hasPrey) {
      ctx.fillStyle = config.color
      ctx.fill()
    }
    ctx.restore()
  }

  function drawDebug(canvas) {
    if (getFlock().getBoids()[0] !== self) return
    const ctx = canvas.getContext("2d")

    boidsInRange.forEach((b) => {
      if (b !== self) drawCircle(b.getPosition(), b.getConfig().size, canvas, config.color, 0.15)
    })

    drawArcCone(
      canvas,
      position,
      velocity.norm(),
      getConfig().fov,
      config.detectionRange,
      config.color,
      0.03
    )
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
