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

export { renderQuadTree }
