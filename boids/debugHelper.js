import { drawLine, drawCircle, drawCapsule } from "./lib/rendering.js"
import vec2 from "./lib/vec2.js"

function createDebugHelper() {
  let canvas

  return { init, drawDebugLine, drawDebugPoint, drawDebugCapsule }

  function init(cvs) {
    canvas = cvs
  }

  function drawDebugLine(start, end, options = {}) {
    const opts = {
      color: "red",
      lineWidth: 1,
      ...options,
    }

    drawLine(canvas, start, end, vec2(), opts, true, false)
  }

  function drawDebugPoint(point, radius, options = {}) {
    const opts = {
      color: "red",
      lineWidth: 1,
      ...options,
    }

    drawCircle(canvas, point, radius, opts)
  }

  function drawDebugCapsule(start, end, radius, options) {
    const opts = {
      color: "red",
      lineWidth: 1,
      ...options,
    }

    drawCapsule(canvas, start, end, radius, opts)
  }
}

export default createDebugHelper()
