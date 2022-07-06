import { lineLineIntersection, pointInCapsule } from "./math"

function circleLineSweep(from, to, rad, l1, l2, debugHelper, drawDebug = false) {
  const sweepVec = to.sub(from)

  const lineCastSweep = lineCastTest(from, to, rad, l1, l2, debugHelper, drawDebug) // infinite line test
  if (lineCastSweep) {
    if (lineCastSweep.location.sub(from).lenSq() > sweepVec.lenSq()) return undefined
    return lineCastSweep
  }

  const glancingLineSweep = glancingLinePtTest(from, to, rad, l1, l2, debugHelper, drawDebug)
  if (glancingLineSweep) {
    return glancingLineSweep
  }

  return undefined
}

function lineCastTest(from, to, rad, l1, l2, debugHelper, drawDebug = false) {
  const overlap = spansLine(from, to, rad, l1, l2)
  if (overlap) return undefined

  const sweepVec = to.sub(from)
  const vec = l2.sub(l1)
  const dir = vec.norm()
  const normal = vec.norm().perpCCW()

  const perpOut = l1.add(normal.scale(rad))
  const paralellStart = perpOut.sub(dir.scale(100))
  const paralellEnd = perpOut.add(dir.scale(100))

  const sweepPos = lineLineIntersection(from, to, paralellStart, paralellEnd, true)

  const dist = sweepPos.sub(from).lenSq()
  if (dist > sweepVec.lenSq()) return undefined

  // Filter out intersections behind circle move direction
  const isBehind = sweepVec.norm().dot(sweepPos.sub(from).norm()) < 0
  if (isBehind) return undefined

  // Collision is only valid if it occurs within the length of the line
  const limitA = l1.add(normal.scale(rad))
  const limitB = l2.add(normal.scale(rad))
  const ab = limitA.sub(limitB).lenSq()
  const ac = limitA.sub(sweepPos).lenSq()
  const bc = limitB.sub(sweepPos).lenSq()
  if (ac > ab || bc > ab) return undefined

  if (drawDebug) {
    debugHelper.drawDebugPoint(limitA, 2)
    debugHelper.drawDebugPoint(limitB, 2)
    debugHelper.drawDebugLine(limitA, limitB, { color: "green", lineWidth: 0.5 })
    debugHelper.drawDebugPoint(sweepPos, rad, { color: "red" })
  }

  return {
    location: sweepPos,
    t: from.sub(sweepPos).lenSq() / to.sub(from).lenSq(),
  }
}

function glancingLinePtTest(from, to, rad, l1, l2, debugHelper, drawDebug = false) {
  // test if the lines points are within the capsule
  const p1InCap = pointInCapsule(l1, from, to, rad)
  const p2InCap = pointInCapsule(l2, from, to, rad)
  if (!p1InCap && !p2InCap) return undefined

  // only operate on the closest point
  let linePt
  if (p1InCap && p2InCap) {
    linePt = from.sub(l1).lenSq() < from.sub(l2).lenSq() ? l1 : l2
  } else {
    linePt = p1InCap ? l1 : l2
  }

  // Now we begin testing the point for collision
  const sweepVec = to.sub(from)
  const dir = sweepVec.norm()
  const velPerp = dir.perpCW()
  const speed = sweepVec.len()

  if (drawDebug) {
    debugHelper.drawDebugPoint(linePt, 4, "red")
  }

  const dia1 = from.add(velPerp.scale(rad))
  const dia2 = dia1.add(velPerp.scale(-1 * rad * 2))
  // point projected from line point along inverse velocity vector
  const p2 = linePt.add(dir.scale(-1).scale(speed + rad))
  // intersection between linePt->p2 and circle diameter
  const horizIntersect = lineLineIntersection(linePt, p2, dia1, dia2, true)
  if (!horizIntersect) return undefined

  const adj = from.sub(horizIntersect).len()
  const hyp = rad
  const theta = Math.acos(adj / hyp) // solve theta
  const opp = Math.sin(theta) * hyp // then use it to get length of opposite
  const circumIntersect = horizIntersect.add(dir.scale(opp)) // the is the point that will collide with linePt

  const diff = linePt.sub(circumIntersect)
  const sweepPos = from.add(diff) // swept circle position

  if (drawDebug) {
    debugHelper.drawDebugPoint(sweepPos, rad, { color: "red" })
    debugHelper.drawDebugCapsule(from, to, rad, { color: "green" })
  }

  return {
    location: sweepPos,
    t: from.sub(sweepPos).lenSq() / to.sub(from).lenSq(),
  }
}

function spansLine(from, to, rad, l1, l2) {
  const dir = to.sub(from).norm()
  const c1 = from.add(dir.perpCW().scale(rad))
  const c2 = from.add(dir.perpCCW().scale(rad))
  const c1l1 = l1.sub(c1)
  const c2l1 = l1.sub(c2)
  const l = l2.sub(l1).norm()
  const cross1 = Math.sign(l.cross(c1l1.norm()))
  const cross2 = Math.sign(l.cross(c2l1.norm()))
  return Math.sign(cross1) !== Math.sign(cross2)
}

export default circleLineSweep
