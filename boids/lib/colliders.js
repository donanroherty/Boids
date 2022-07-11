import { drawLine, drawPolygon } from "./rendering"
import vec2 from "./vec2"

function edgeCollider(start, end, options = {}) {
  const opts = {
    color: "black",
    lineWidth: 1,
    drawNormal: false,
    openClosePath: false,
    ...options,
  }

  const v = end.sub(start)
  const normal = v.norm().perpCCW()

  return {
    type: "edge",
    start,
    end,
    normal: normal,
    draw: (canvas) => drawLine(canvas, start, end, normal, opts, true),
  }
}

function polygonCollider(pts, options = {}) {
  const opts = {
    color: "black",
    lineWidth: 1,
    fill: false,
    drawNormal: true,
    openClosePath: false,
    ...options,
  }

  const edges = pts.map((pt, i, arr) => {
    const next = arr[i + 1 < arr.length ? i + 1 : 0]

    const v = next.sub(pt)
    const normal = v.norm().perpCCW()

    return {
      type: "polygon",
      start: pt,
      end: next,
      normal,
      draw: (canvas) => drawLine(canvas, pt, next, normal, opts, false),
    }
  })

  return {
    edges,
    draw: (canvas) => drawPolygon(canvas, edges, opts),
  }
}

function boxCollider(pos, size, options = {}, normalCW = false) {
  const opts = {
    color: "black",
    lineWidth: 1,
    fill: false,
    drawNormal: false,
    ...options,
  }
  let pts = [pos, pos.add(vec2(0, size.y)), pos.add(size), pos.add(vec2(size.x, 0))]
  if (normalCW) pts.reverse()

  return { ...polygonCollider(pts, opts), type: "box" }
}

export { boxCollider, polygonCollider, edgeCollider }
