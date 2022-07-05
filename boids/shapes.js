import vec2 from "./vec2"

const lineDefaultOpts = {
  color: "black",
  strokeWidth: "1px",
}
function line(start, end, options = {}, normalCW, polySegment = false, drawNormal = false) {
  const opts = {
    ...lineDefaultOpts,
    ...options,
  }

  function draw(canvas) {
    const ctx = canvas.getContext("2d")
    if (!polySegment) {
      ctx.beginPath()
      ctx.moveTo(start.x, start.y)
    } else {
      ctx.lineTo(start.x, start.y)
    }

    if (drawNormal) {
      const ab = end.sub(start)
      const lineDir = ab.norm()
      const normal = normalCW ? lineDir.perpCW() : lineDir.perpCCW()
      const normalLen = 5
      const normalStart = start.add(ab.scale(0.5))
      const normalEnd = normalStart.add(normal.scale(normalLen))

      const ctx = canvas.getContext("2d")
      ctx.lineTo(normalStart.x, normalStart.y)
      ctx.lineTo(normalEnd.x, normalEnd.y)
      ctx.lineTo(normalStart.x, normalStart.y)
    }

    ctx.lineTo(end.x, end.y)

    if (!polySegment) {
      ctx.strokeWidth = opts.strokeWidth
      ctx.strokeStype = opts.color
      ctx.stroke()
      ctx.closePath()
    }
  }

  return {
    start,
    end,
    normalCW,
    draw,
  }
}

const polygonDefaultOpts = {
  color: "black",
  strokeWidth: "1px",
  fill: false,
}
function polygon(pts, options = {}, normalCW = false, drawNormals = false) {
  const opts = {
    ...polygonDefaultOpts,
    ...options,
  }

  const lines = pts.map((pt, i, arr) => {
    const next = arr[i + 1 < arr.length ? i + 1 : 0]
    return line(pt, next, opts, normalCW, true, drawNormals)
  })

  function draw(canvas) {
    const ctx = canvas.getContext("2d")
    ctx.beginPath()
    lines.forEach((l) => l.draw(canvas))
    ctx.strokeWidth = opts.strokeWidth
    ctx.strokeStyle = opts.color
    ctx.stroke()
    if (opts.fill) {
      ctx.fillStyle = opts.color
      ctx.fill()
    }
    ctx.closePath()
  }

  return {
    lines,
    normalCW,
    draw,
  }
}

const boxDefaultOpts = {
  color: "black",
  strokeWidth: "1px",
  fill: false,
}
function box(pos, size, options = {}, normalCW = false, drawNormals = false) {
  const opts = {
    ...boxDefaultOpts,
    ...options,
  }
  const pts = [pos, pos.add(vec2(0, size.y)), pos.add(size), pos.add(vec2(size.x, 0))]

  return polygon(pts, opts, normalCW, drawNormals)
}

export { box, polygon }
