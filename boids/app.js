import createTick from "./tick.js"
import flock from "./flock.js"
import vec2 from "./vec2.js"
import { pointQuadTree } from "./pointQuadTree.js"
import { sphericalRegionQuery } from "./sphericalRegionQuery.js"
import { renderQuadTree } from "./rendering.js"

function boidsApp(canvas) {
  canvas.style.transform = "scaleY(-1)" // flip y axis

  let flocks = []
  let quadTree
  let bUseQuadTree = true
  let bRenderQuadTree = false

  const tick = createTick(update)
  tick.start()

  const app = {
    getCanvas,
    getFlocks,
    addFlock,
    removeFlock,
    tick,
    getSceneSize,
    getBoidsInRange,
    getUseQuadTree,
    toggleUseQuadTree,
    getRenderQuadTree,
    toggleRenderQuadTree,
  }

  function update(deltatime) {
    {
      // clear canvas
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    if (bUseQuadTree) {
      // update quadtree
      const sceneSize = getSceneSize()
      const boids = getAllBoids()
      const boidPositions = boids.map((b) => b.getPosition())
      quadTree = pointQuadTree({ x: 0, y: 0, w: sceneSize.x, h: sceneSize.y }, 20, boidPositions)

      if (bRenderQuadTree) renderQuadTree(quadTree, canvas)
    }

    getAllBoids().forEach((b) => b.updateBoidsInRange()) // range check before boids update position

    // update simulation and render
    flocks.forEach((flock) => {
      flock.update(deltatime)
      flock.draw(canvas)
    })
  }

  function getAllBoids() {
    return flocks.reduce((acc, f) => acc.concat(f.getBoids()), [])
  }

  function getBoidsInRange(pos, range) {
    if (bUseQuadTree) {
      let positions = sphericalRegionQuery(quadTree, pos, range)
      return getAllBoids().filter((b) => positions.find((p) => p === b.getPosition()) !== undefined)
    } else {
      return getAllBoids().filter((b) => pos.sub(b.getPosition()).lenSq() < range * range)
    }
  }

  function addFlock(cfg) {
    const f = flock(app, cfg)
    flocks = [...flocks, f]
    return f
  }

  function removeFlock(flock) {
    flocks = flocks.filter((f) => f !== flock)
  }

  function getFlocks() {
    return flocks
  }

  function getSceneSize() {
    return vec2(canvas.width, canvas.height)
  }

  function getCanvas() {
    return canvas
  }
  return app
}

export default boidsApp
