import { Line, Point, Rect } from "../types"

type QuadTreeNode = {
  bounds: Rect
  capacity: number
  points: Point[]
  subdivisions: NodeDivisions | null
}

type NodeDivisions = {
  bottomLeft: QuadTreeNode
  topLeft: QuadTreeNode
  topRight: QuadTreeNode
  bottomRight: QuadTreeNode
}

function pointQuadTree(bounds: Rect, capacity: number, points: Point[]) {
  const subdivisions = points.length > capacity ? subdivide(bounds, capacity, points) : null

  return {
    bounds,
    capacity,
    points,
    subdivisions,
  }
}

function isInBounds(pt: Point, bounds: Rect) {
  const { x, y, w, h } = bounds
  return pt.x >= x && pt.x <= x + w && pt.y >= y && pt.y <= y + h
}

function subdivide(bounds: Rect, cap: number, pts: Point[]): NodeDivisions {
  const { x, y, w, h } = bounds
  const bl = { x: x, y: y, w: w * 0.5, h: h * 0.5 }
  const tl = { x: x, y: y + h * 0.5, w: w * 0.5, h: h * 0.5 }
  const tr = { x: x + w * 0.5, y: y + h * 0.5, w: w * 0.5, h: h * 0.5 }
  const br = { x: x + w * 0.5, y: y, w: w * 0.5, h: h * 0.5 }

  // Perform includes
  const divPts = pts.reduce(
    (acc: { bl: Point[]; tl: Point[]; tr: Point[]; br: Point[] }, pt: Point) => {
      if (isInBounds(pt, bl)) acc.bl.push(pt)
      else if (isInBounds(pt, tl)) acc.tl.push(pt)
      else if (isInBounds(pt, tr)) acc.tr.push(pt)
      else if (isInBounds(pt, br)) acc.br.push(pt)
      return acc
    },
    { bl: [], tl: [], tr: [], br: [] }
  )

  const subdivs: NodeDivisions = {
    bottomLeft: pointQuadTree(bl, cap, divPts.bl),
    topLeft: pointQuadTree(tl, cap, divPts.tl),
    topRight: pointQuadTree(tr, cap, divPts.tr),
    bottomRight: pointQuadTree(br, cap, divPts.br),
  }

  return subdivs
}

function circleQuery(quadtree: QuadTreeNode, position: Point, radius: number) {
  const rect = {
    x: position.x - radius,
    y: position.y - radius,
    w: radius * 2,
    h: radius * 2,
  }

  return recurse(quadtree)

  function recurse(node: QuadTreeNode, inPoints = []) {
    const pts = inPoints

    // if rect is fully contained in circle, return all points
    if (circleContainsRect(rect, position, radius)) {
      return [...pts, ...node.points]
    }

    if (rectIntersectsRect(rect, node.bounds)) {
      if (node.subdivisions) {
        // recurse on subdivs, return concatenated points
        const blPts: Point[] = recurse(node.subdivisions.bottomLeft, [])
        const tlPts: Point[] = recurse(node.subdivisions.topLeft, [])
        const trPts: Point[] = recurse(node.subdivisions.topRight, [])
        const brPts: Point[] = recurse(node.subdivisions.bottomRight, [])
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

function circleContainsRect(rect: Rect, pos: Point, rad: number) {
  const dx = Math.max(pos.x - rect.x, pos.x - rect.x + rect.w)
  const dy = Math.max(pos.y - rect.y, pos.y - rect.y + rect.h)
  return dx <= rad && dy <= rad
}

function rectIntersectsRect(rectA: Rect, rectB: Rect) {
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

  function getRectLines(rect: Rect) {
    return [
      { x: rect.x, y: rect.y },
      { x: rect.x, y: rect.y + rect.h },
      { x: rect.x + rect.w, y: rect.y + rect.h },
      { x: rect.x + rect.w, y: rect.y },
    ].map((pt, i, arr) => {
      const next = i === arr.length - 1 ? 0 : i + 1
      return { from: pt, to: arr[next] }
    })
  }

  function aaLinesIntersect(lineA: Line, lineB: Line) {
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

function rectContainsPoint(pt: Point, rect: Rect) {
  const res = pt.x >= rect.x && pt.y >= rect.y && pt.x <= rect.x + rect.w && pt.y <= rect.y + rect.h
  return res
}

function drawQuadTree(quadTree: QuadTreeNode, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.beginPath()
  ctx.rect(quadTree.bounds.x, quadTree.bounds.y, quadTree.bounds.w, quadTree.bounds.h)
  ctx.strokeStyle = "blue"
  ctx.lineWidth = 1
  ctx.stroke()

  const subdivs = quadTree.subdivisions
  if (subdivs) {
    const { bottomLeft, topLeft, topRight, bottomRight } = subdivs

    drawQuadTree(bottomLeft, canvas)
    drawQuadTree(topLeft, canvas)
    drawQuadTree(topRight, canvas)
    drawQuadTree(bottomRight, canvas)
  }
}

export { pointQuadTree, circleQuery, drawQuadTree }
export type { QuadTreeNode }
