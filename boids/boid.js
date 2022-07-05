import { circleQuery } from "./pointQuadTree.js"
import { drawArcCone, drawBoid, drawCircle } from "./rendering.js"
import vec2 from "./vec2.js"

function createConfig(override = {}) {
  return {
    color: "black",
    numBoids: 50,
    size: 5,
    fov: 340,
    detectionRange: 50,
    cohesionFactor: 0.2,
    alignmentMaxStrength: 0.3,
    separationMaxStrength: 10,
    separationRange: 30,
    predatorAttack: 0.9,
    predatorAvoid: 40,
    dragFactor: 0.01,
    minSpeed: 50,
    maxSpeed: 150,
    coheseWithOtherFlocks: false,
    alignWithOtherFlocks: false,
    separateFromOtherFlocks: false,
    isPredator: false,
    drawDebug: true,
    ...override,
  }
}

function createBoid(position, velocity, flock, index, config) {
  return {
    position,
    velocity,
    config,
    flock,
    index,
    hasPrey: false,
    visibleBoids: [],
  }
}

function updateVisibleBoids(b, app, quadTree) {
  let inRange = []
  if (quadTree) {
    let positions = circleQuery(quadTree, b.position, b.detectionRange)
    inRange = Array.from(app.entities).filter(
      (b) => positions.find((p) => p.x === b.position.x && p.y === b.position.y) !== undefined
    )
  } else {
    inRange = Array.from(app.entities).filter(
      (b) => b.position.sub(b.position).lenSq() < b.detectionRange * b.detectionRange
    )
  }

  b.visibleBoids = inRange.filter((o) => o !== b && canSee(b, o))
}

function updateBoid(b, dt, sceneSize) {
  // update forces
  {
    const newVel = vec2(b.velocity.x, b.velocity.y)
      .add(cohesion(b, b.visibleBoids))
      .add(alignment(b, b.visibleBoids))
      .add(separation(b, b.visibleBoids))
      .add(avoidPredator(b, b.visibleBoids))
      .add(chasePrey(b, b.visibleBoids))
      .clampedLen(b.config.minSpeed, b.config.maxSpeed)
      .add(drag(b, vec2(b.velocity.x, b.velocity.y)))

    b.velocity.x = newVel.x
    b.velocity.y = newVel.y
  }

  const newPos = vec2(b.position.x, b.position.y).add(vec2(b.velocity.x, b.velocity.y).scale(dt))
  const OOBFix = mirrorOutOfBounds(newPos, sceneSize)
  b.position.x = OOBFix.x
  b.position.y = OOBFix.y
}

function canSee(b, other) {
  const toOther = vec2(other.position.x, other.position.y).sub(b.position).norm()
  const dir = vec2(b.velocity.x, b.velocity.y).norm()
  const dot = dir.dot(toOther)
  const perc = (b.config.fov * 0.5) / 180
  const mapped = 1 - 2 * perc
  return dot > mapped
}

function canPreyOn(b, other) {
  return b.config.isPredator && other.config.size < b.config.size
}

function isPrey(b, other) {
  return other.config.isPredator && other.config.size > b.config.size
}

function mirrorOutOfBounds(pos, sceneSize) {
  const { x, y } = sceneSize

  if (pos.y > y) {
    pos.y = pos.y - y
  } else if (pos.y < 0) {
    pos.y = y + pos.y
  }

  if (pos.x > x) {
    pos.x = pos.x - x
  } else if (pos.x < 0) {
    pos.x = x + pos.x
  }

  return pos
}

function renderBoid(b, canvas) {
  drawBoid(
    canvas,
    b.position,
    vec2(b.velocity.x, b.velocity.y).norm(),
    b.config.size,
    b.config.color,
    b.hasPrey
  )
  drawDebug(b, canvas)
}

function drawDebug(b, canvas) {
  if (b.index !== 0) return

  b.visibleBoids.forEach((o) => {
    if (o !== b) drawCircle(o.position, o.config.size, canvas, o.config.color, 0.4)
  })

  drawArcCone(
    canvas,
    b.position,
    vec2(b.velocity.x, b.velocity.y).norm(),
    b.config.fov,
    b.config.detectionRange,
    b.config.color,
    0.03
  )
}

function cohesion(b, others) {
  const flockmates = others.filter((o) => b.config.coheseWithOtherFlocks || sameFlock(b, o))

  if (flockmates.length === 0) return vec2()

  const avgPos = flockmates
    .reduce((acc, o) => {
      acc = acc.add(o.position)
      return acc
    }, vec2())
    .div(vec2(flockmates.length, flockmates.length))

  const toGroupCenter = avgPos.sub(b.position)
  return toGroupCenter.scale(b.config.cohesionFactor)
}

function alignment(b, others) {
  const flockmates = others.filter((o) => b.config.alignWithOtherFlocks || sameFlock(b, o))
  if (flockmates.length === 0) return vec2()

  const avgVel = flockmates
    .reduce((acc, o) => {
      acc = acc.add(o.velocity)
      return acc
    }, vec2())
    .div(vec2(flockmates.length, flockmates.length))

  const diff = avgVel.sub(b.velocity)
  return diff.clampedLen(0, b.config.alignmentMaxStrength)
}

function separation(b, others) {
  const flockmates = others.filter((o) => {
    if (!(sameFlock(b, o) || b.config.separateFromOtherFlocks)) return false
    const otherPos = o.position
    const distSq = vec2(b.position.x, b.position.y).sub(otherPos).lenSq()
    return distSq < b.config.separationRange * b.config.separationRange
  })

  return flockmates.reduce((acc, o) => {
    const ba = vec2(b.position.x, b.position.y).sub(o.position)
    const dist = ba.len()
    const perc = 1 - dist / b.config.separationRange
    return acc.add(ba.norm().scale(b.config.separationMaxStrength * perc))
  }, vec2())
}

function avoidPredator(b, others) {
  const predators = others.filter((o) => isPrey(b, o))

  return predators.reduce((acc, other) => {
    const ba = b.position.sub(other.position)
    const dist = ba.len()
    const perc = 1 - dist / b.config.detectionRange
    return acc.add(ba.norm().scale(b.config.predatorAvoid * perc))
  }, vec2())
}

function chasePrey(b, others) {
  const prey = others.filter((o) => canPreyOn(b, o))
  b.hasPrey = prey.length > 0

  if (!b.hasPrey) return vec2()

  const target = prey
    .reduce((acc, o) => {
      acc = acc.add(o.position)
      return acc
    }, vec2())
    .div(vec2(prey.length, prey.length))

  // const target = prey.reduce((target, o) => {
  //   const toOther = b.position.sub(o.position).lenSq()
  //   const toTarget = b.position.sub(target).lenSq()
  //   return toOther < toTarget ? o.position : target
  // }, prey[0].position)

  const toTarget = target.sub(b.position)
  return toTarget.scale(b.config.predatorAttack)
}

function drag(b, vel) {
  return vel.scale(-b.config.dragFactor)
}

function sameFlock(a, b) {
  return a.flock === b.flock
}

export { createBoid, updateVisibleBoids, updateBoid, renderBoid, createConfig }
