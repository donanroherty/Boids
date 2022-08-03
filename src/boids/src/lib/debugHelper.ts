import { ShapeRenderOptions } from "./colliders.js"
import { drawLine, drawCircle, drawCapsule, drawRect } from "./rendering.js"
import vec2, { Vec2 } from "./vec2.js"

function createDebugHelper() {
  let canvas: HTMLCanvasElement | undefined

  return { init, drawDebugLine, drawDebugPoint, drawDebugCapsule, drawDebugRect }

  function init(cvs: HTMLCanvasElement) {
    canvas = cvs
  }

  function drawDebugLine(start: Vec2, end: Vec2, options?: ShapeRenderOptions) {
    const opts = {
      color: "red",
      lineWidth: 1,
      ...options,
    }
    if (canvas) drawLine(canvas, start, end, vec2(), opts)
  }

  function drawDebugRect(pos: Vec2, size: Vec2, options?: ShapeRenderOptions) {
    const opts = {
      color: "red",
      lineWidth: 1,
      ...options,
    }
    if (canvas) drawRect(canvas, pos, size, opts)
  }

  function drawDebugPoint(point: Vec2, radius: number, options?: ShapeRenderOptions) {
    const opts = {
      color: "red",
      lineWidth: 1,
      ...options,
    }
    if (canvas) drawCircle(canvas, point, radius, opts)
  }

  function drawDebugCapsule(start: Vec2, end: Vec2, radius: number, options?: ShapeRenderOptions) {
    const opts = {
      color: "red",
      lineWidth: 1,
      ...options,
    }
    if (canvas) drawCapsule(canvas, start, end, radius, opts)
  }
}

export default createDebugHelper()
