import createTick from "./tick.js"
import { createFlockHandler } from "./flockHandler.js"
import vec2 from "./vec2.js"
import { pointQuadTree, circleQuery } from "./pointQuadTree.js"
import { renderQuadTree } from "./rendering.js"
import { renderBoid, updateBoid, updateBoidsInRange } from "./boid.js"

function boidsApp(canvas) {
  canvas.style.transform = "scaleY(-1)" // flip y axis

  let entities = new Set()
  let quadTree
  let useQuadTree = true
  let bRenderQuadTree = false

  const flockHandler = createFlockHandler(entities, getSceneSize)
  const tick = createTick(update)
  tick.start()

  const app = {
    flockHandler,
    tick,
    getSceneSize,
    getBoidsInRange,
    useQuadTree,
    bRenderQuadTree,
  }

  function update(deltatime) {
    {
      // clear canvas
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    if (useQuadTree) {
      // update quadtree
      const sceneSize = getSceneSize()
      const positions = Array.from(entities).map((b) => b.position)
      quadTree = pointQuadTree({ x: 0, y: 0, w: sceneSize.x, h: sceneSize.y }, 8, positions)

      if (bRenderQuadTree) renderQuadTree(quadTree, canvas)
    }

    entities.forEach((b) => updateBoidsInRange(b, app))
    entities.forEach((b) => updateBoid(b, deltatime, getSceneSize()))
    entities.forEach((b) => renderBoid(b, canvas))
  }

  function getBoidsInRange(pos, range) {
    if (useQuadTree) {
      let positions = circleQuery(quadTree, pos, range)
      return Array.from(entities).filter(
        (b) => positions.find((p) => p.x === b.position.x && p.y === b.position.y) !== undefined
      )
    } else {
      return Array.from(entities).filter((b) => pos.sub(b.position).lenSq() < range * range)
    }
  }

  function getSceneSize() {
    return vec2(canvas.width, canvas.height)
  }

  return app
}

export default boidsApp
