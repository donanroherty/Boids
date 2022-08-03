import { Hit, RayHit } from "../types"
import { Edge } from "./colliders"
import { clamp } from "./math"
import vec2, { Vec2 } from "./vec2"
import circleLineSweep from "./circleLineSweep"
import debugHelper from "./debugHelper"

function rayCast(from: Vec2, to: Vec2, edges: Edge[]) {
  const hits = edges.reduce((acc: RayHit[], edge) => {
    const hitLoc = lineLineIntersection(from, to, edge.start, edge.end)
    if (!hitLoc) return acc

    const rayLen = to.sub(from).lenSq()
    const hitDist = hitLoc.sub(from).lenSq()
    const normal = to.sub(from).norm()

    const hit: RayHit = {
      location: hitLoc,
      normal,
      t: hitDist / rayLen,
      other: edge,
    }

    acc.push(hit)
    return acc
  }, [])

  hits.sort((a, b) => a.t - b.t)

  return hits
}

function raycastCone(
  from: Vec2,
  dir: Vec2,
  angle: number,
  rad: number,
  numRays: number,
  edges: Edge[],
  drawDebug = false
) {
  const fov = (angle / 360) * Math.PI * 2
  const segAngle = fov / (numRays - 1)
  const ang = dir.angle()

  const targets = Array(numRays)
    .fill(undefined)
    .map((_, i) => {
      const theta = fov * 0.5 + segAngle * i
      const x = from.x + rad * Math.cos(theta - ang)
      const y = from.y + rad * Math.sin(theta - ang)
      return vec2(x, y)
    })

  const hits = targets.reduce((acc: RayHit[], target) => {
    if (drawDebug) debugHelper.drawDebugLine(from, target, { lineWidth: 0.2 })
    const hits = rayCast(from, target, edges)

    if (hits.length > 0) acc.push(hits[0]) // push closest hit, if it exists
    return acc
  }, [])

  if (drawDebug) hits.forEach((hit) => debugHelper.drawDebugPoint(hit.location, 4))

  return hits
}

function lineLineIntersection(aStart: Vec2, aEnd: Vec2, bStart: Vec2, bEnd: Vec2) {
  const s1 = aEnd.sub(aStart)
  const s2 = bEnd.sub(bStart)

  const s =
    (-s1.y * (aStart.x - bStart.x) + s1.x * (aStart.y - bStart.y)) / (-s2.x * s1.y + s1.x * s2.y)

  const t =
    (s2.x * (aStart.y - bStart.y) - s2.y * (aStart.x - bStart.x)) / (-s2.x * s1.y + s1.x * s2.y)

  const intersection = aStart.add(s1.scale(t))

  const collides = s >= 0 && s <= 1 && t >= 0 && t <= 1
  if (collides) return intersection

  return undefined
}

function closestPointOnLine(pt: Vec2, l1: Vec2, l2: Vec2, bEndpointFallback = false) {
  const dl = l2.sub(l1)
  const dp = pt.sub(l1)
  const dotL = dp.dot(dl)
  const dotP = dl.dot(dl)
  if (dotP > 0.0001) {
    let t = dotL / dotP
    if (t >= -0.0001 && t <= 1.0001) {
      t = clamp(t, 0.0, 1.0)
      return l1.add(dl.scale(t))
    }
  }

  if (bEndpointFallback) {
    const l1p = pt.sub(l1)
    const l2p = pt.sub(l2)
    return l1p.lenSq() < l2p.lenSq() ? l1 : l2
  }

  return undefined
}

function getFirstSweptHit(from: Vec2, to: Vec2, rad: number, edges: Edge[]): Hit | undefined {
  const hit = edges.reduce((closest: Hit | undefined, edge) => {
    const hit = circleLineSweep(from, to, rad, edge)

    if (!hit) return closest
    if (closest && closest.t < hit.t) return closest
    return hit
  }, undefined)

  return hit
}

export { raycastCone, lineLineIntersection, closestPointOnLine, rayCast, getFirstSweptHit }
