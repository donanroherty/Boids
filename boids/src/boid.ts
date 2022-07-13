import { SpatialIndexSystem } from "./lib/spatialHash"
import { circleQuery } from "./lib/pointQuadTree"
import { QuadTreeNode } from "./lib/pointQuadTree.js"
import { drawArcCone, drawBoid, drawCircle } from "./lib/rendering.js"
import { closestPointOnLine, raycastCone } from "./lib/utils.js"
import { getFirstSweptHit } from "./lib/utils"
import vec2, { Vec2 } from "./lib/vec2.js"
import { Hit } from "./types.js"
import debugHelper from "./lib/debugHelper"

type BoidConfig = ReturnType<typeof createConfig>
type Boid = {
  position: Vec2
  velocity: Vec2
  direction: Vec2
  config: BoidConfig
  defaultConfig: BoidConfig
  flock: number
  index: number
  hasPrey: boolean
  visibleBoids: Boid[]
}

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
    obstacleAvoid: 5,
    coheseWithOtherFlocks: false,
    alignWithOtherFlocks: false,
    separateFromOtherFlocks: false,
    isPredator: false,
    drawDebug: false,
    ...override,
  }
}

function createBoid(
  position: Vec2,
  velocity: Vec2,
  flock: number,
  index: number,
  config: BoidConfig
): Boid {
  return {
    position,
    velocity,
    direction: velocity.norm(),
    config,
    defaultConfig: config,
    flock,
    index,
    hasPrey: false,
    visibleBoids: [],
  }
}

function updateVisibleBoids(
  b: Boid,
  entities: Set<Boid>,
  quadTree: QuadTreeNode | null,
  boidHashTable: SpatialIndexSystem,
  drawDebug: boolean = false
) {
  b.visibleBoids = []
  let inRange: Boid[] = []

  if (boidHashTable) {
    inRange = boidHashTable.boxQuery(
      b.position,
      b.config.detectionRange * 2,
      drawDebug && isDebugBoid(b)
    )
  } else if (quadTree) {
    let positions = circleQuery(quadTree, b.position, b.config.detectionRange)
    inRange = Array.from(entities).filter(
      (o) => positions.find((p) => p.x === o.position.x && p.y === o.position.y) !== undefined
    )
  } else {
    inRange = Array.from(entities).filter(
      (o) =>
        vec2(o.position.x, o.position.y).sub(b.position).lenSq() <
        b.config.detectionRange * b.config.detectionRange
    )
  }
  b.visibleBoids = inRange.filter((o) => o !== b && canSee(b, o))
}

function updateBoid(
  b: Boid,
  deltatime: number,
  sceneSize: Vec2,
  geomHashTable: SpatialIndexSystem,
  isPaused: boolean
) {
  // update forces
  let vel = vec2(b.velocity.x, b.velocity.y)
  vel = vel.add(cohesion(b, b.visibleBoids))
  vel = vel.add(alignment(b, b.visibleBoids))
  vel = vel.add(separation(b, b.visibleBoids))
  vel = vel.add(avoidPredator(b, b.visibleBoids))
  vel = vel.add(chasePrey(b, b.visibleBoids))
  vel = vel.add(avoidObstacles(b, geomHashTable))
  vel = vel.add(drag(b, vel))
  vel = vel.clampedLen(b.config.minSpeed, b.config.maxSpeed)

  if (isPaused) return

  // sweep position
  const [position, velocity] = sweepAndSlidePosition(
    b.position.clone(),
    vel,
    deltatime,
    b.config.size * 0.5,
    geomHashTable,
    0.1,
    2
  )

  b.velocity.set(velocity)
  b.direction.set(b.velocity.norm())
  b.position.set(mirrorOutOfBounds(position, sceneSize))
}

function canSee(b: Boid, other: Boid) {
  const toOther = other.position.sub(b.position).norm()
  const dir = b.velocity.norm()
  const dot = dir.dot(toOther)
  const perc = (b.config.fov * 0.5) / 180
  const mapped = 1 - 2 * perc
  return dot > mapped
}

function canPreyOn(b: Boid, other: Boid) {
  return b.config.isPredator && other.config.size < b.config.size
}

function isPrey(b: Boid, other: Boid) {
  return other.config.isPredator && other.config.size > b.config.size
}

function mirrorOutOfBounds(pos: Vec2, sceneSize: Vec2) {
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

function renderBoid(b: Boid, canvas: HTMLCanvasElement) {
  drawBoid(
    canvas,
    b.position,
    vec2(b.velocity.x, b.velocity.y).norm(),
    b.config.size,
    b.config.color,
    b.hasPrey
  )

  if (isDebugBoid(b)) drawDebug(b, canvas)
}

function drawDebug(b: Boid, canvas: HTMLCanvasElement) {
  b.visibleBoids.forEach((o) => {
    if (o !== b)
      drawCircle(canvas, o.position, o.config.size, { color: o.config.color, alpha: 0.4 })
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

function cohesion(b: Boid, others: Boid[]) {
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

function alignment(b: Boid, others: Boid[]) {
  const flockmates = others.filter((o) => b.config.alignWithOtherFlocks || sameFlock(b, o))
  if (flockmates.length === 0) return vec2()

  const avgVel = flockmates
    .reduce((acc: Vec2, o: Boid) => acc.add(o.velocity), vec2())
    .div(vec2(flockmates.length, flockmates.length))

  const diff = avgVel.sub(b.velocity)
  return diff.clampedLen(0, b.config.alignmentMaxStrength)
}

function separation(b: Boid, others: Boid[]) {
  const flockmates = others.filter((o) => {
    if (!(sameFlock(b, o) || b.config.separateFromOtherFlocks)) return false
    const otherPos = o.position
    const distSq = vec2(b.position.x, b.position.y).sub(otherPos).lenSq()
    return distSq < b.config.separationRange * b.config.separationRange
  })

  return flockmates.reduce((acc: Vec2, o: Boid) => {
    const ba = vec2(b.position.x, b.position.y).sub(o.position)
    const dist = ba.len()
    const perc = 1 - dist / b.config.separationRange
    return acc.add(ba.norm().scale(b.config.separationMaxStrength * perc))
  }, vec2())
}

function avoidPredator(b: Boid, others: Boid[]) {
  const predators = others.filter((o) => isPrey(b, o))

  return predators.reduce((acc, other: Boid) => {
    const ba = b.position.sub(other.position)
    const dist = ba.len()
    const perc = 1 - dist / b.config.detectionRange
    return acc.add(ba.norm().scale(b.config.predatorAvoid * perc))
  }, vec2())
}

function chasePrey(b: Boid, others: Boid[]) {
  const prey = others.filter((o) => canPreyOn(b, o))
  b.hasPrey = prey.length > 0

  if (!b.hasPrey) return vec2()

  const target = prey.reduce((target, o: Boid) => {
    const toOther = b.position.sub(o.position).lenSq()
    const toTarget = b.position.sub(target).lenSq()
    return toOther < toTarget ? o.position : target
  }, prey[0].position)

  const toTarget = target.sub(b.position)
  return toTarget.scale(b.config.predatorAttack)
}

// todo: this should pick a safe path away from collisions, not just push away from them
function avoidObstacles(b: Boid, geomHashTable: SpatialIndexSystem) {
  const edges = getCollisionGeometry(b.position, b.config.detectionRange, geomHashTable, false)

  const hits = raycastCone(
    b.position,
    b.direction,
    b.config.fov,
    b.config.detectionRange,
    5,
    edges,
    false
  )

  const headingTollerance = 0.1

  const out = hits
    .map((hit) => {
      const { location } = hit
      const dir = b.velocity.norm()
      const toPt = b.position.sub(location)
      if (dir.dot(toPt.norm()) > headingTollerance) return vec2()

      const dist = toPt.len()
      const alpha = 1 - dist / (b.config.detectionRange + b.config.size * 0.5)
      const vel = toPt.norm().scale(b.config.obstacleAvoid * alpha)

      return vel
    })
    .reduce((acc, v) => acc.add(v), vec2())

  return out
}

function drag(b: Boid, vel: Vec2) {
  return vel.scale(-b.config.dragFactor)
}

function sameFlock(a: Boid, b: Boid) {
  return a.flock === b.flock
}

function sweepAndSlidePosition(
  start: Vec2,
  velocity: Vec2,
  deltatime: number,
  rad: number,
  geomHashTable: SpatialIndexSystem,
  padding: number,
  maxBounces: number
) {
  let from = start.clone()
  let vel = velocity.clone()
  let to = from.add(vel.scale(deltatime))
  let len = vel.len()

  let dir = vel.norm()
  let initialSpeed = velocity.len()

  let prevHit

  // must do minimum 1 sweep check
  for (let i = 0; i < maxBounces + 1; i++) {
    const collisionGeo = getCollisionGeometry(from, (len + rad) * deltatime, geomHashTable, false)

    const hit: Hit | undefined = getFirstSweptHit(from, to, rad, collisionGeo)
    if (!hit) break

    const { location: location, hitNormal, colliderNormal, t } = hit

    const paddingOffset = vel.norm().scale(padding)
    const safeLocation = location.sub(paddingOffset)

    // get slide dir based on hit angle
    const cross = colliderNormal.cross(hitNormal)
    let slideDir = cross > 0 ? colliderNormal.perpCCW() : colliderNormal.perpCW()

    // raycast in slide dir to see if it is viable, else reverse
    if (prevHit) {
      const cPos = safeLocation.add(slideDir.scale(padding * 1.5))
      const pt = closestPointOnLine(cPos, prevHit.other.start, prevHit.other.end)
      const moveWillCollide = pt && cPos.sub(pt).lenSq() < rad * rad
      if (moveWillCollide) slideDir = slideDir.scale(-1)
    }

    const isLastBounce = i === maxBounces

    len = vel.sub(vel.scale(t)).len() // remove already spent distance
    dir = slideDir
    vel = slideDir.scale(len)
    from = safeLocation
    to = isLastBounce ? from : from.add(vel.scale(deltatime))

    prevHit = hit
    i++
  }

  const outVelocity = dir.scale(initialSpeed) // maintain oiginal speed, but direction may change

  return [to, outVelocity] // position, velocity
}

function getCollisionGeometry(
  pos: Vec2,
  radius: number,
  geomHashTable: SpatialIndexSystem,
  drawDebug = false
) {
  const edges = geomHashTable.boxQuery(pos, radius * 2, drawDebug).filter((edge) => {
    // boid is on the colliding side of the edge
    const ptToBoid = pos.sub(edge.start).norm()
    if (ptToBoid.dot(edge.normal) < 0) return false

    return true
  })

  if (drawDebug) {
    edges.forEach((edge) => {
      debugHelper.drawDebugLine(edge.start, edge.end, { lineWidth: 3 })
      debugHelper.drawDebugPoint(edge.start, 2, {})
    })
  }

  return edges
}

function isDebugBoid(b: Boid) {
  return b.index === 0 && b.config.drawDebug
}

export { createBoid, updateVisibleBoids, updateBoid, renderBoid, createConfig }
export type { Boid, BoidConfig }
