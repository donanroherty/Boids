import { Vec2 } from "./vec2"

function radToDeg(radians: number) {
  return radians * (180 / Math.PI)
}

function degToRad(degrees: number) {
  return degrees * (Math.PI / 180)
}

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max)
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

function lineLineIntersection(
  aStart: Vec2,
  aEnd: Vec2,
  bStart: Vec2,
  bEnd: Vec2,
  bInfiniteLines = false
) {
  const s1 = aEnd.sub(aStart)
  const s2 = bEnd.sub(bStart)

  const s =
    (-s1.y * (aStart.x - bStart.x) + s1.x * (aStart.y - bStart.y)) / (-s2.x * s1.y + s1.x * s2.y)

  const t =
    (s2.x * (aStart.y - bStart.y) - s2.y * (aStart.x - bStart.x)) / (-s2.x * s1.y + s1.x * s2.y)

  if (isNaN(s) || isNaN(t) || !isFinite(s) || !isFinite(t)) return undefined

  const intersection = aStart.add(s1.scale(t))

  if (bInfiniteLines) return intersection

  const collides = s >= 0 && s <= 1 && t >= 0 && t <= 1
  if (collides) return intersection

  return undefined
}

function pointInCapsule(pt: Vec2, start: Vec2, end: Vec2, rad: number) {
  const closestPt = closestPointOnLine(pt, start, end)
  if (closestPt && pt.sub(closestPt).lenSq() < rad * rad) return true
  if (pt.sub(end).lenSq() < rad * rad) return true
  if (pt.sub(start).lenSq() < rad * rad) return true

  return false
}

export { radToDeg, degToRad, clamp, closestPointOnLine, lineLineIntersection, pointInCapsule }
