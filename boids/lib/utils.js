import { clamp } from "./math"
import vec2 from "./vec2"

function rayCast(from, to, edges) {
  const hits = edges.reduce((acc, l) => {
      const hitLoc = lineLineIntersection(from, to, l.start, l.end)
    if (!hitLoc) return acc

        const rayLen = to.sub(from).lenSq()
        const hitDist = hitLoc.sub(from).lenSq()
        const hit = {
          location: hitLoc,
          t: hitDist / rayLen,
        }

    return acc.concat(hit)
    }, [])

  hits.sort((a, b) => a.t - b.t)

  return hits
}

function raycastCone(from, dir, angle, rad, numRays, edges, drawDebug = false) {
  const fov = (angle / 360) * Math.PI * 2
  const segAngle = fov / (numRays - 1)
  const ang = dir.angle()

  const targets = Array(numRays)
    .fill()
    .map((_, i) => {
      const theta = fov * 0.5 + segAngle * i
      const x = from.x + rad * Math.cos(theta - ang)
      const y = from.y + rad * Math.sin(theta - ang)
      return vec2(x, y)
    })

  const hits = targets
    .map((target) => {
      if (drawDebug) debugHelper.drawDebugLine(from, target, { lineWidth: 0.2 })
      const rayHits = rayCast(from, target, edges)
      return rayHits.length === 0 ? undefined : rayHits[0]
    })
    .filter((hit) => hit !== undefined)
  if (drawDebug) hits.forEach((hit) => debugHelper.drawDebugPoint(hit.location, 4))

  return hits
}

function lineLineIntersection(aStart, aEnd, bStart, bEnd) {
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

function closestPointOnLine(pt, l1, l2, bEndpointFallback = false) {
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

export { raycastCone, lineLineIntersection, closestPointOnLine, rayCast }
