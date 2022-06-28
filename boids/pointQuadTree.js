function pointQuadTree(bounds, capacity, points) {
  const subdivisions = points.length > capacity ? subdivide(bounds, capacity, points) : null

  return {
    bounds,
    capacity,
    points,
    subdivisions,
  }
}

function isInBounds(pt, bounds) {
  const { x, y, w, h } = bounds
  return pt.x >= x && pt.x <= x + w && pt.y >= y && pt.y <= y + h
}

function subdivide(bounds, cap, pts) {
  const { x, y, w, h } = bounds
  const bl = { x: x, y: y, w: w * 0.5, h: h * 0.5 }
  const tl = { x: x, y: y + h * 0.5, w: w * 0.5, h: h * 0.5 }
  const tr = { x: x + w * 0.5, y: y + h * 0.5, w: w * 0.5, h: h * 0.5 }
  const br = { x: x + w * 0.5, y: y, w: w * 0.5, h: h * 0.5 }

  // Perform includes
  const divPts = pts.reduce(
    (acc, pt) => {
      if (isInBounds(pt, bl)) acc.bl.push(pt)
      else if (isInBounds(pt, tl)) acc.tl.push(pt)
      else if (isInBounds(pt, tr)) acc.tr.push(pt)
      else if (isInBounds(pt, br)) acc.br.push(pt)
      return acc
    },
    { bl: [], tl: [], tr: [], br: [] }
  )

  const subdivs = {
    bottomLeft: pointQuadTree(bl, cap, divPts.bl),
    topLeft: pointQuadTree(tl, cap, divPts.tl),
    topRight: pointQuadTree(tr, cap, divPts.tr),
    bottomRight: pointQuadTree(br, cap, divPts.br),
  }

  return subdivs
}

export { pointQuadTree }
