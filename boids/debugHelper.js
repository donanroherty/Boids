import { drawLine, drawCircle, drawCapsule } from "./lib/rendering.js"
import vec2 from "./lib/vec2.js"

function createDebugHelper() {
  let helpers = []

  return { draw, drawDebugLine, drawDebugPoint, drawDebugCapsule }

  function draw(canvas) {
    helpers.forEach((h) => h.draw(canvas))
    helpers = []
  }

  function drawDebugLine(start, end, options = {}) {
    const opts = {
      color: "red",
      lineWidth: 1,
      ...options,
    }

    const line = {
      draw: (canvas) => drawLine(canvas, start, end, vec2(), opts, true, false),
    }

    helpers.push(line)
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

    helpers.push(pt)
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

    helpers.push(cap)
  }
}

export default createDebugHelper
