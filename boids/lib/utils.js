import { clamp } from "./math"

function rayCast(from, to, cols) {
  const hits = cols.reduce((acc, collider) => {
    const lineHits = collider.edges.reduce((acc, l) => {
      const hitLoc = lineLineIntersection(from, to, l.start, l.end)

      if (hitLoc) {
        const rayLen = to.sub(from).lenSq()
        const hitDist = hitLoc.sub(from).lenSq()
        const hit = {
          collider,
          location: hitLoc,
          t: hitDist / rayLen,
        }
        acc.push(hit)
      }
      return acc
    }, [])

    acc = acc.concat(lineHits)
    return acc
  }, [])

  hits.sort((a, b) => b.t - a.t)

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

export { clamp, lineLineIntersection, closestPointOnLine, rayCast }
