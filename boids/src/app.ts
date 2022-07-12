import createTick from "./lib/tick"
import { createFlockHandler } from "./flockHandler"
import { pointQuadTree, QuadTreeNode } from "./lib/pointQuadTree.js"
import { drawQuadTree, scaleCanvasToPixelRatio } from "./lib/rendering"
import debugHelper from "./lib/debugHelper"
import { createBoidController } from "./boidController"
import { createScene } from "./scene.js"
import { Boid } from "./boid"

type BoidsApp = ReturnType<typeof createBoidsApp>

function createBoidsApp(canvas: HTMLCanvasElement) {
  debugHelper.init(canvas)

  scaleCanvasToPixelRatio(canvas)

  let quadTree: QuadTreeNode | null = null
  const scene = createScene(canvas)

  const manualBoidController = createBoidController(canvas)
  const flockHandler = createFlockHandler(scene.entities, scene.getSceneSize)
  const tick = createTick(update)

  const app = {
    flockHandler,
    tick,
    useQuadTree: false,
    bRenderQuadTree: false,
    isPaused: false,
  }

  tick.start()

  function update(deltatime: number) {
    clearCanvas()
    updateQuadTree()
    manualBoidController.update(scene.entities)
    scene.update(deltatime, quadTree, app.isPaused)
  }

  function clearCanvas() {
    const ctx = canvas.getContext("2d")
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  function updateQuadTree() {
    if (app.useQuadTree) {
      const sceneSize = scene.getSceneSize()
      const positions = Array.from(scene.entities).map((b: Boid) => b.position.toPoint())
      quadTree = pointQuadTree({ x: 0, y: 0, w: sceneSize.x, h: sceneSize.y }, 8, positions)
      if (app.bRenderQuadTree) drawQuadTree(quadTree, canvas)
    } else quadTree = null
  }

  return app
}

export default createBoidsApp
export type { BoidsApp }
