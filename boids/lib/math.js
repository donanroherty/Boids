function radToDeg(radians) {
  return radians * (180 / Math.PI)
}

function degToRad(degrees) {
  return degrees * (Math.PI / 180)
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
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
    return l1p.mag() < l2p.mag() ? l1 : l2
  }

  return undefined
}

function lineLineIntersection(aStart, aEnd, bStart, bEnd, bInfiniteLines = false) {
  const s1 = aEnd.sub(aStart)
  const s2 = bEnd.sub(bStart)

  const s =
    (-s1.y * (aStart.x - bStart.x) + s1.x * (aStart.y - bStart.y)) / (-s2.x * s1.y + s1.x * s2.y)

  const t =
    (s2.x * (aStart.y - bStart.y) - s2.y * (aStart.x - bStart.x)) / (-s2.x * s1.y + s1.x * s2.y)

  const intersection = aStart.add(s1.scale(t))

  if (bInfiniteLines) return intersection

  const collides = s >= 0 && s <= 1 && t >= 0 && t <= 1
  if (collides) return intersection

  return undefined
}

function pointInCapsule(pt, start, end, rad) {
  const closestPt = closestPointOnLine(pt, start, end)
  if (closestPt && pt.sub(closestPt).len() < rad) return true
  if (pt.sub(end).len() < rad) return true
  if (pt.sub(start).len() < rad) return true

  return false
}

function pointInBox(pt, p0, p1, p2, p3) {
  return pointInTriangle(pt, p0, p1, p2) || pointInTriangle(pt, p0, p2, p3)
}

function pointInTriangle(pt, p0, p1, p2) {
  const denom = (p1.y - p2.y) * (p0.x - p2.y) + (p2.y - p1.x) * (p0.y - p2.y)
  const a = ((p1.y - p2.y) * (pt.x - p2.y) + (p2.y - p1.x) * (pt.y - p2.y)) / denom
  const b = ((p2.y - p0.y) * (pt.x - p2.y) + (p0.x - p2.y) * (pt.y - p2.y)) / denom
  const c = 1 - a - b

  return a >= 0 && a <= 1 && b >= 0 && b <= 1 && c >= 0 && c <= 1
}

function angleBetweenNormVectors(v1, v2) {
  const mid = v1.add(v2.sub(v1).scale(0.5))
  const opp = v1.sub(mid).len()
  const adj = mid.len()
  return Math.atan(opp / adj)
}

export {
  radToDeg,
  degToRad,
  clamp,
  closestPointOnLine,
  lineLineIntersection,
  pointInTriangle,
  pointInBox,
  pointInCapsule,
  angleBetweenNormVectors as angleBetweenNormalizedVectors,
}
