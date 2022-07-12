import { drawLine, drawCircle, drawCapsule } from "./rendering.js"
import vec2, { Vec2 } from "./vec2.js"

function createDebugHelper() {
  let canvas: HTMLCanvasElement | undefined

  return { init, drawDebugLine, drawDebugPoint, drawDebugCapsule }

  function init(cvs: HTMLCanvasElement) {
    canvas = cvs
  }

  function drawDebugLine(start: Vec2, end: Vec2, options = {}) {
    const opts = {
      color: "red",
      lineWidth: 1,
      ...options,
    }
    if (canvas) drawLine(canvas, start, end, vec2(), opts, true)
  }

  function drawDebugPoint(point: Vec2, radius: number, options = {}) {
    const opts = {
      color: "red",
      lineWidth: 1,
      ...options,
    }
    if (canvas) drawCircle(canvas, point, radius, opts)
  }

  function drawDebugCapsule(start: Vec2, end: Vec2, radius: number, options = {}) {
    const opts = {
      color: "red",
      lineWidth: 1,
      ...options,
    }
    if (canvas) drawCapsule(canvas, start, end, radius, opts)
  }
}

export default createDebugHelper()
