import createTick, { Tick } from "./lib/tick"
import { createFlockHandler, FlockHandler } from "./flockHandler"
import { pointQuadTree, QuadTreeNode } from "./lib/pointQuadTree.js"
import { drawQuadTree, scaleCanvasToPixelRatio } from "./lib/rendering"
import debugHelper from "./lib/debugHelper"
import { BoidController, createBoidController } from "./boidController"
import { createScene, Scene } from "./scene.js"
import { Boid } from "./boid"
import { Vec2 } from "./lib/vec2"

type BoidsApp = ReturnType<typeof createBoidsApp>

function createBoidsApp() {
  let canvas: HTMLCanvasElement
  let quadTree: QuadTreeNode | null = null
  let scene: Scene
  let boidController: BoidController | undefined = undefined
  let flockHandler: FlockHandler | undefined = undefined
  let tick: Tick | undefined

  const app = {
    init,
    flockHandler,
    tick,
    useQuadTree: false,
    bRenderQuadTree: false,
    isPaused: false,
  }

  return app

  function init(cvs: HTMLCanvasElement, canvasResolution: { x: number; y: number }) {
    canvas = cvs
    debugHelper.init(canvas)

    scaleCanvasToPixelRatio(canvas, canvasResolution)

    scene = createScene(canvas)

    boidController = createBoidController(canvas)
    flockHandler = createFlockHandler(scene.entities, scene.getSceneSize)

    tick = createTick(update)
    tick.start()
  }

  function update(deltatime: number) {
    clearCanvas()
    updateQuadTree()
    if (boidController) boidController.update(scene.entities)
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
}

export default createBoidsApp
export type { BoidsApp }
