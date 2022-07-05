import createTick from "./tick.js"
import { createFlockHandler } from "./flockHandler.js"
import vec2 from "./vec2.js"
import { pointQuadTree, circleQuery } from "./pointQuadTree.js"
import { drawQuadTree } from "./rendering.js"
import { renderBoid, updateBoid, updateVisibleBoids } from "./boid.js"
import { box, polygon } from "./shapes.js"

function boidsApp(canvas) {
  canvas.style.transform = "scaleY(-1)" // flip y axis

  let entities = new Set()
  let shapes = new Set()
  let quadTree

  const flockHandler = createFlockHandler(entities, getSceneSize)
  const tick = createTick(update)

  const app = {
    entities,
    flockHandler,
    tick,
    getSceneSize,
    useQuadTree: true,
    bRenderQuadTree: false,
  }

  tick.start()
  createShapes()

  function update(deltatime) {
    {
      // clear canvas
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    if (app.useQuadTree) {
      // update quadtree
      const sceneSize = getSceneSize()
      const positions = Array.from(entities).map((b) => b.position)
      quadTree = pointQuadTree({ x: 0, y: 0, w: sceneSize.x, h: sceneSize.y }, 8, positions)
      if (app.bRenderQuadTree) drawQuadTree(quadTree, canvas)
    }

    entities.forEach((b) => {
      updateVisibleBoids(b, app)
    })
    entities.forEach((b) => {
      updateBoid(b, deltatime, getSceneSize())
    })
    entities.forEach((b) => {
      renderBoid(b, canvas)
    })
    shapes.forEach((s) => {
      s.draw(canvas)
    })
  }

  function createShapes() {
    const b = box(vec2(150, 100), vec2(100, 150), {}, false, true)
    shapes.add(b)

    const pts = [
      vec2(350, 50),
      vec2(330, 130),
      vec2(300, 230),
      vec2(350, 230),
      vec2(350, 150),
      vec2(400, 230),
      vec2(450, 150),
      vec2(350, 130),
      vec2(450, 120),
      vec2(450, 80),
      vec2(450, 30),
      vec2(400, 110),
    ]
    const p = polygon(pts, {}, false, true)
    shapes.add(p)
  }

  function getSceneSize() {
    return vec2(canvas.width, canvas.height)
  }

  return app
}

export default boidsApp
