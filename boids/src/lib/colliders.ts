import { drawLine, drawPolygon } from "./rendering.js"
import vec2, { Vec2 } from "./vec2.js"

type Shape = {
  options: ShapeRenderOptions
  edges: Edge[]
  draw: (canvas: HTMLCanvasElement) => void
}

type ShapeRenderOptions = {
  visible?: boolean
  color?: string
  lineWidth?: number
  drawNormal?: boolean
  fill?: boolean
  openClosePath?: boolean
  alpha?: number
}

type Edge = {
  start: Vec2
  end: Vec2
  normal: Vec2
}

function edgeCollider(start: Vec2, end: Vec2, options: Partial<ShapeRenderOptions>): Shape {
  const opts: ShapeRenderOptions = {
    visible: true,
    color: "black",
    lineWidth: 1,
    drawNormal: false,
    openClosePath: true,
    ...options,
  }

  const v = end.sub(start)
  const normal = v.norm().perpCCW()

  const edge = { start, end, normal: normal }

  function draw(canvas: HTMLCanvasElement) {
    if (opts.visible) drawLine(canvas, edge.start, edge.end, edge.normal, opts)
  }

  return {
    edges: [edge],
    options: opts,
    draw,
  }
}

function polygonCollider(pts: Vec2[], options: Partial<ShapeRenderOptions>): Shape {
  const opts = {
    visible: true,
    color: "black",
    lineWidth: 1,
    fill: false,
    drawNormal: true,
    openClosePath: false,
    ...options,
  }

  const edges = pts.map((pt, i, arr) => {
    const end = arr[i + 1 < arr.length ? i + 1 : 0]
    const v = end.sub(pt)
    const normal = v.norm().perpCCW()

    const edge: Edge = {
      start: pt,
      end,
      normal,
    }
    return edge
  })

  function draw(canvas: HTMLCanvasElement) {
    if (opts.visible) drawPolygon(canvas, edges, opts)
  }

  return {
    edges,
    options: opts,
    draw,
  }
}

function boxCollider(
  pos: Vec2,
  size: Vec2,
  options: Partial<ShapeRenderOptions>,
  normalCW = false
): Shape {
  const opts: ShapeRenderOptions = {
    visible: true,
    color: "black",
    lineWidth: 1,
    fill: false,
    drawNormal: false,
    ...options,
  }
  let pts = [pos, pos.add(vec2(0, size.y)), pos.add(size), pos.add(vec2(size.x, 0))]
  if (normalCW) pts.reverse()

  return { ...polygonCollider(pts, opts) }
}

export { boxCollider, polygonCollider, edgeCollider }
export type { Shape, Edge, ShapeRenderOptions }
