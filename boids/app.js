import createTick from "./tick.js"
import createFlock from "./flock.js"
import vec2 from "./vec2.js"
import { pointQuadTree } from "./pointQuadTree.js"
import { sphericalRegionQuery } from "./sphericalRegionQuery.js"
import { renderQuadTree } from "./rendering.js"
import { renderBoid, updateBoid, updateBoidsInRange } from "./boid.js"

function boidsApp(canvas) {
  canvas.style.transform = "scaleY(-1)" // flip y axis
  let lastFlockID = 0
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
      const boidPositions = boids.map((b) => b.position)
      quadTree = pointQuadTree({ x: 0, y: 0, w: sceneSize.x, h: sceneSize.y }, 20, boidPositions)

      if (bRenderQuadTree) renderQuadTree(quadTree, canvas)
    }

    const boids = getAllBoids()
    boids.forEach((b) => updateBoidsInRange(b, app))
    boids.forEach((b) => updateBoid(b, deltatime, getSceneSize()))
    boids.forEach((b) => renderBoid(b, canvas))
  }

  function getAllBoids() {
    return flocks.reduce((acc, f) => acc.concat(f.getBoids()), [])
  }

  function getBoidsInRange(pos, range) {
    if (bUseQuadTree) {
      let positions = sphericalRegionQuery(quadTree, pos, range)
      return getAllBoids().filter((b) => positions.find((p) => p.isEqual(b.position)) !== undefined)
    } else {
      return getAllBoids().filter((b) => pos.sub(b.position).lenSq() < range * range)
    }
  }

  function addFlock(cfg) {
    const f = createFlock(app, cfg, ++lastFlockID)
    flocks.push(f)
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

  function getUseQuadTree() {
    return bUseQuadTree
  }

  function toggleUseQuadTree() {
    bUseQuadTree = !bUseQuadTree
    return bUseQuadTree
  }

  function getRenderQuadTree() {
    return bRenderQuadTree
  }

  function toggleRenderQuadTree(val) {
    bRenderQuadTree = !bRenderQuadTree
    return bRenderQuadTree
  }

  return app
}

export default boidsApp
