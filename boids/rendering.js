function drawCircle(loc, rad, canvas, color, alpha = 1) {
  const ctx = canvas.getContext("2d")
  ctx.globalAlpha = alpha
  ctx.beginPath()
  ctx.arc(loc.x, loc.y, rad, 0, 2 * Math.PI)
  ctx.strokeStyle = color
  ctx.stroke()
  ctx.globalAlpha = 1
}

function drawArcCone(canvas, pos, dir, fov, radius, color, alpha = 0.05) {
  const ctx = canvas.getContext("2d")
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
    ctx.stroke()
  }

  ctx.globalAlpha = 1
  ctx.restore()
}

function renderQuadTree(quadTree, canvas) {
  const ctx = canvas.getContext("2d")
  ctx.beginPath()
  ctx.rect(quadTree.bounds.x, quadTree.bounds.y, quadTree.bounds.w, quadTree.bounds.h)
  ctx.strokeStyle = "blue"
  ctx.lineWidth = 1
  ctx.stroke()

  const subdivs = quadTree.subdivisions
  if (subdivs) {
    const { bottomLeft, topLeft, topRight, bottomRight } = subdivs

    renderQuadTree(bottomLeft, canvas)
    renderQuadTree(topLeft, canvas)
    renderQuadTree(topRight, canvas)
    renderQuadTree(bottomRight, canvas)
  }
}

export { drawCircle, renderQuadTree, drawArcCone }
