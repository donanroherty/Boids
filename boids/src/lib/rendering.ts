import { Edge, ShapeRenderOptions } from "./colliders"
import { QuadTreeNode } from "./pointQuadTree"
import vec2, { Vec2 } from "./vec2"

function scaleCanvasToPixelRatio(canvas: HTMLCanvasElement) {
  const { width, height } = canvas
  const rect = canvas.getBoundingClientRect()
  const pixelRatio = window.devicePixelRatio || 1

  canvas.width = Math.round(pixelRatio * rect.right) - Math.round(pixelRatio * rect.left)
  canvas.height = Math.round(pixelRatio * rect.bottom) - Math.round(pixelRatio * rect.top)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  const ctx = canvas.getContext("2d")
  if (ctx) ctx.scale(pixelRatio, pixelRatio)
}

function drawBoid(
  canvas: HTMLCanvasElement,
  pos: Vec2,
  dir: Vec2,
  size: number,
  color: string,
  isSolid: boolean
) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const hei = size
  const wid = size * 0.7

  const p0 = vec2(-wid * 0.5, -hei * 0.5)
  const p1 = vec2(0, hei * 0.5)
  const p2 = vec2(wid * 0.5, -hei * 0.5)

  ctx.save()

  ctx.translate(pos.x, pos.y)
  ctx.rotate(Math.atan2(dir.y, dir.x) - Math.PI / 2)
  ctx.beginPath()
  ctx.moveTo(p0.x, p0.y)
  ctx.lineTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.closePath()
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.stroke()

  if (isSolid) {
    ctx.fillStyle = color
    ctx.fill()
  }
  ctx.restore()
}

function drawCircle(canvas: HTMLCanvasElement, position: Vec2, radius: number, options: Object) {
  const opts = {
    color: "red",
    lineWidth: 1,
    alpha: 1,
    ...options,
  }
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.globalAlpha = opts.alpha
  ctx.beginPath()
  ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI)
  ctx.strokeStyle = opts.color
  ctx.lineWidth = opts.lineWidth
  ctx.stroke()
  ctx.globalAlpha = 1
}

function drawArcCone(
  canvas: HTMLCanvasElement,
  pos: Vec2,
  dir: Vec2,
  fov: number,
  radius: number,
  color: string,
  alpha = 0.05
) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const fovRads = fov * (Math.PI / 180)
  const arcStart = Math.PI * 0.5 + fovRads * 0.5
  const arcEnd = arcStart - fovRads

  ctx.save()
  ctx.translate(pos.x, pos.y)
  ctx.rotate(Math.atan2(dir.y, dir.x) - Math.PI * 0.5)

  {
    // ctx.globalCompositeOperation = "destination-in"
    ctx.globalAlpha = alpha
    ctx.beginPath()
    const coneGrad = ctx.createConicGradient(arcEnd, 0, 0)
    const transWhite = "rgba(255,255,255,0)"
    const fade = 0.01
    coneGrad.addColorStop(0, transWhite)
    coneGrad.addColorStop(fade, color)
    coneGrad.addColorStop(Math.max(fov / 360 - fade, 0), color)
    coneGrad.addColorStop(fov / 360, transWhite)
    ctx.arc(0, 0, radius, 0, Math.PI * 2, true)
    ctx.fillStyle = coneGrad
    ctx.fill()
  }

  // draw arc stroke
  {
    ctx.globalAlpha = 0.2
    ctx.beginPath()
    ctx.arc(0, 0, radius, arcStart, arcEnd, true)
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.stroke()
  }

  ctx.globalAlpha = 1
  ctx.restore()
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

function drawPolygon(canvas: HTMLCanvasElement, edges: Edge[], options: Object) {
  const opts = {
    color: "black",
    lineWidth: 1,
    fill: false,
    ...options,
  }

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  ctx.beginPath()

  edges.forEach((edge) => drawLine(canvas, edge.start, edge.end, edge.normal, opts))

  ctx.lineWidth = opts.lineWidth
  ctx.strokeStyle = opts.color
  ctx.stroke()
  if (opts.fill) {
    ctx.fillStyle = opts.color
    ctx.fill()
  }

  ctx.closePath()
}

function drawLine(
  canvas: HTMLCanvasElement,
  start: Vec2,
  end: Vec2,
  normal: Vec2,
  options: ShapeRenderOptions,
  drawNormal = false
) {
  const opts: ShapeRenderOptions = {
    color: "black",
    lineWidth: 1,
    ...options,
  }

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const v = end.sub(start)

  if (opts.openClosePath) {
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
  } else {
    ctx.lineTo(start.x, start.y)
  }

  if (drawNormal) {
    const normalLen = 5
    const normalStart = start.add(v.scale(0.5))
    const normalEnd = normalStart.add(normal.scale(normalLen))

    ctx.lineTo(normalStart.x, normalStart.y)
    ctx.lineTo(normalEnd.x, normalEnd.y)
    ctx.lineTo(normalStart.x, normalStart.y)
  }

  ctx.lineTo(end.x, end.y)
  ctx.lineWidth = opts.lineWidth!
  ctx.strokeStyle = opts.color!

  ctx.stroke()

  if (opts.openClosePath) {
    ctx.closePath()
  }
}

function drawCapsule(
  canvas: HTMLCanvasElement,
  start: Vec2,
  end: Vec2,
  radius: number,
  options: Object
) {
  const opts = {
    color: "black",
    lineWidth: 1,
    ...options,
  }

  const dir = end.sub(start).norm()
  const rot = Math.atan2(dir.y, dir.x) - Math.PI / 2

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  ctx.save()

  ctx.beginPath()
  ctx.arc(start.x, start.y, radius, Math.PI * 2 + rot, Math.PI * 3 + rot, true) // bottom arc
  ctx.arc(end.x, end.y, radius, Math.PI + rot, Math.PI * 2 + rot, true) // top arc
  ctx.closePath()

  // style
  ctx.lineWidth = opts.lineWidth
  ctx.strokeStyle = opts.color
  ctx.stroke()

  ctx.restore()
}

export {
  scaleCanvasToPixelRatio,
  drawBoid,
  drawCircle,
  drawQuadTree,
  drawArcCone,
  drawLine,
  drawPolygon,
  drawCapsule,
}
