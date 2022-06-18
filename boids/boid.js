import vec2 from "./vec2.js"

function createBoid(pos, vel, canvas) {
  let position = pos
  let velocity = vel

  let config = {
    size: 5,
    detectionRange: 50,
    cohesionFactor: 0.2,
    alignmentMaxStrength: 0.3,
    separationMaxStrength: 10,
    separationRange: 30,
    minSpeed: 50,
    maxSpeed: 150,
  }

  function update(dt, boids) {
    const boidsInRange = boids.filter(
      (b) =>
        position !== b.getPosition() &&
        position.sub(b.getPosition()).lenSq() < config.detectionRange * config.detectionRange
    )

    if (boidsInRange.length > 0) {
      addForce(cohesion(boidsInRange))
      addForce(alignment(boidsInRange))
      addForce(separation(boidsInRange))
    }

    velocity = velocity.clampedLen(config.minSpeed, config.maxSpeed)
    position = position.add(velocity.scale(dt))

    mirrorOutOfBounds()
  }

  function cohesion(boids) {
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

  function addForce(force) {
    velocity = velocity.add(force)
  }

  function mirrorOutOfBounds() {
    const { clientWidth: x, clientHeight: y } = canvas

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
    ctx.fillStyle = "black"
    ctx.fill()
    ctx.restore()
  }

  function getPosition() {
    return position
  }

  function getVelocity() {
    return velocity
  }

  return {
    update,
    draw,
    getPosition,
    getVelocity,
  }
}

export default createBoid
