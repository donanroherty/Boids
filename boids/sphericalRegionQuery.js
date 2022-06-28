function sphericalRegionQuery(quadtree, position, radius) {
  const rect = {
    x: position.x - radius,
    y: position.y - radius,
    w: radius * 2,
    h: radius * 2,
  }

  return recurse(quadtree)

  function recurse(node, inPoints = []) {
    const pts = inPoints

    // if rect is fully contained in circle, return all points
    if (circleContainsRect(rect, position, radius)) {
      return [...pts, ...node.points]
    }

    if (rectIntersectsRect(rect, node.bounds)) {
      if (node.subdivisions) {
        // recurse on subdivs, return concatenated points
        const blPts = recurse(node.subdivisions.bottomLeft, [])
        const tlPts = recurse(node.subdivisions.topLeft, [])
        const trPts = recurse(node.subdivisions.topRight, [])
        const brPts = recurse(node.subdivisions.bottomRight, [])
        return [...pts, ...blPts, ...tlPts, ...trPts, ...brPts]
      }

      // if node has no subdivs its a leaf node, test all points
      const out = node.points.filter((pt) => {
        const ab = { x: position.x - pt.x, y: position.y - pt.y }
        return ab.x * ab.x + ab.y * ab.y < radius * radius
      })

      return [...pts, ...out]
    }

    return pts
  }
}

function circleContainsRect(rect, cPos, cRad) {
  const dx = Math.max(cPos.x - rect.x, cPos.x - rect.x + rect.w)
  const dy = Math.max(cPos.y - rect.y, cPos.y - rect.y + rect.h)
  return dx <= cRad && dy <= cRad
}

function rectIntersectsRect(rectA, rectB) {
  const aContainsB =
    rectContainsPoint({ x: rectB.x, y: rectB.y }, rectA) ||
    rectContainsPoint({ x: rectB.x, y: rectB.y + rectB.h }, rectA) ||
    rectContainsPoint({ x: rectB.x + rectB.w, y: rectB.y + rectB.h }, rectA) ||
    rectContainsPoint({ x: rectB.x + rectB.w, y: rectB.y }, rectA)
  if (aContainsB) return true

  const bContainsA =
    rectContainsPoint({ x: rectA.x, y: rectA.y }, rectB) ||
    rectContainsPoint({ x: rectA.x, y: rectA.y + rectA.h }, rectB) ||
    rectContainsPoint({ x: rectA.x + rectA.w, y: rectA.y + rectA.h }, rectB) ||
    rectContainsPoint({ x: rectA.x + rectA.w, y: rectA.y }, rectB)
  if (bContainsA) return true

  const aLines = getRectLines(rectA)
  const bLines = getRectLines(rectB)

  return (
    aaLinesIntersect(aLines[0], bLines[1]) ||
    aaLinesIntersect(aLines[0], bLines[3]) ||
    aaLinesIntersect(aLines[2], bLines[1]) ||
    aaLinesIntersect(aLines[2], bLines[3]) ||
    aaLinesIntersect(bLines[0], aLines[1]) ||
    aaLinesIntersect(bLines[0], aLines[3]) ||
    aaLinesIntersect(bLines[2], aLines[1]) ||
    aaLinesIntersect(bLines[2], aLines[3])
  )

  function getRectLines(r) {
    return [
      { x: r.x, y: r.y },
      { x: r.x, y: r.y + r.h },
      { x: r.x + r.w, y: r.y + r.h },
      { x: r.x + r.w, y: r.y },
    ].map((pt, i, arr) => {
      const next = i === arr.length - 1 ? 0 : i + 1
      return { from: pt, to: arr[next] }
    })
  }

  function aaLinesIntersect(lineA, lineB) {
    const pIsXAligned = lineA.from.y === lineA.to.y
    const qIsXAligned = lineB.from.y === lineB.to.y

    if (pIsXAligned === qIsXAligned) return false

    const h0 = pIsXAligned ? lineA.from : lineB.from
    const h1 = pIsXAligned ? lineA.to : lineB.to
    const v0 = pIsXAligned ? lineB.from : lineA.from
    const v1 = pIsXAligned ? lineB.to : lineA.to

    const overlapsOnX = (h0.y > v0.y && h0.y < v1.y) || (h0.y < v0.y && h0.y > v1.y)
    const overlapsOnY = (v0.x > h0.x && v0.x < h1.x) || (v0.x < h0.x && v0.x > h1.x)
    return overlapsOnX && overlapsOnY
  }
}

function rectContainsPoint(pt, rect) {
  const res = pt.x >= rect.x && pt.y >= rect.y && pt.x <= rect.x + rect.w && pt.y <= rect.y + rect.h
  return res
}

export { sphericalRegionQuery }
