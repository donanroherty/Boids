import { drawLine, drawCircle, drawCapsule } from "./lib/rendering.js"
import vec2 from "./lib/vec2.js"

function createDebugHelper(canvas) {
  return { drawDebugLine, drawDebugPoint, drawDebugCapsule }

  function drawDebugLine(start, end, options = {}) {
    const opts = {
      color: "red",
      lineWidth: 1,
      ...options,
    }

    const line = {
      draw: (canvas) => drawLine(canvas, start, end, vec2(), opts, true, false),
    }
    line.draw(canvas)
  }

  function drawDebugPoint(point, radius, options = {}) {
    const opts = {
      color: "red",
      lineWidth: 1,
      ...options,
    }

    const pt = {
      draw: (canvas) => drawCircle(canvas, point, radius, opts),
    }
    pt.draw(canvas)
  }

  function drawDebugCapsule(start, end, radius, options) {
    const opts = {
      color: "red",
      lineWidth: 1,
      ...options,
    }

    const cap = {
      draw: (canvas) => drawCapsule(canvas, start, end, radius, opts),
    }
    cap.draw(canvas)
  }
}

export default createDebugHelper
