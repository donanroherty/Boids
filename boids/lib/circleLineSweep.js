import { lineLineIntersection, pointInCapsule } from "./math"

function circleLineSweep(from, to, rad, edge, debugHelper, drawDebug = false) {
  const sweepVec = to.sub(from)

  const parallelLineHit = parallelLineTest(from, to, rad, edge, debugHelper, drawDebug) // infinite line test
  if (parallelLineHit) {
    if (parallelLineHit.location.sub(from).lenSq() > sweepVec.lenSq()) return undefined
    return parallelLineHit
  }

  const lineEndPointHit = lineEndPointTest(from, to, rad, edge, debugHelper, drawDebug)
  if (lineEndPointHit) {
    return lineEndPointHit
  }

  return undefined
}

function parallelLineTest(from, to, rad, edge, debugHelper, drawDebug = false) {
  const { start: l1, end: l2 } = edge
  const overlap = spansLine(from, to, rad, l1, l2)
  if (overlap) return undefined

  const sweepVec = to.sub(from)
  const colVec = l2.sub(l1)
  const colDir = colVec.norm()
  const colNormal = colVec.norm().perpCCW()

  const perpOut = l1.add(colNormal.scale(rad))
  const paralellStart = perpOut.sub(colDir.scale(100))
  const paralellEnd = perpOut.add(colDir.scale(100))

  const sweepPos = lineLineIntersection(from, to, paralellStart, paralellEnd, true)
  if (!sweepPos) return undefined

  const dist = sweepPos.sub(from).lenSq()
  if (dist > sweepVec.lenSq()) return undefined

  const sweepDir = sweepVec.norm()

  // Filter out intersections behind circle move direction
  const isBehind = sweepDir.dot(sweepPos.sub(from).norm()) < 0
  if (isBehind) return undefined

  // Collision is only valid if it occurs within the length of the line
  const limitA = l1.add(colNormal.scale(rad))
  const limitB = l2.add(colNormal.scale(rad))
  const ab = limitA.sub(limitB).lenSq()
  const ac = limitA.sub(sweepPos).lenSq()
  const bc = limitB.sub(sweepPos).lenSq()
  if (ac > ab || bc > ab) return undefined

  if (drawDebug) {
    debugHelper.drawDebugLine(limitA, limitB, { color: "green", lineWidth: 0.5 })
    debugHelper.drawDebugPoint(sweepPos, rad, { color: "red" })
    debugHelper.drawDebugCapsule(from, to, rad, { color: "green" })
  }

  return {
    location: sweepPos,
    hitLocation: sweepPos.add(colDir.scale(-1 * rad)),
    hitNormal: sweepDir,
    colliderNormal: colNormal,
    t: from.sub(sweepPos).lenSq() / to.sub(from).lenSq(),
    edge,
  }
}

function lineEndPointTest(from, to, rad, edge, debugHelper, drawDebug = false) {
  const { start: l1, end: l2 } = edge
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
  const dirPerp = dir.perpCW()
  const speed = sweepVec.len()

  if (drawDebug) {
    debugHelper.drawDebugPoint(linePt, 4, "red")
  }

  const dia1 = from.add(dirPerp.scale(rad))
  const dia2 = dia1.add(dirPerp.scale(-1 * rad * 2))
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

  // colliderNormal
  const colliderNormal = sweepPos.sub(linePt).norm()

  if (drawDebug) {
    debugHelper.drawDebugPoint(sweepPos, rad, { color: "red" })
    debugHelper.drawDebugCapsule(from, to, rad, { color: "green" })
  }

  return {
    location: sweepPos,
    hitLocation: linePt,
    hitNormal: dir,
    colliderNormal,
    t: from.sub(sweepPos).lenSq() / to.sub(from).lenSq(),
    edge,
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
