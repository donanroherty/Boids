import createTick, { Tick } from "./lib/tick"
import { createFlockHandler, FlockHandler } from "./flockHandler"
import { pointQuadTree, QuadTreeNode } from "./lib/pointQuadTree.js"
import { drawQuadTree, scaleCanvasToPixelRatio } from "./lib/rendering"
import debugHelper from "./lib/debugHelper"
import { BoidController, createBoidController } from "./boidController"
import { createScene, Scene } from "./scene.js"
import { Boid } from "./boid"

type BoidsApp = ReturnType<typeof createBoidsApp>
type Optimization = "QuadTree" | "SpatialIndex" | "None"

function createBoidsApp() {
  let canvas: HTMLCanvasElement
  let quadTree: QuadTreeNode | null = null
  let scene: Scene
  let boidController: BoidController
  let flockHandler: FlockHandler
  let tick: Tick | undefined
  let isPaused: boolean
  let optimization: Optimization = "None"
  let drawOptimization = false

  const app = {
    init,
    getFlockhandler,
    getTick,
    getPaused,
    setPaused,
    useQuadTree: false,
    getOptimization,
    setOptimization,
    getDrawOptimization,
    setDrawOptimization,
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
    scene.update(deltatime, quadTree, app.getPaused())
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
      if (app.getDrawOptimization()) drawQuadTree(quadTree, canvas)
    } else quadTree = null
  }

  function getFlockhandler(): FlockHandler {
    return flockHandler
  }

  function getTick() {
    return tick
  }

  function getPaused() {
    return isPaused
  }

  function setPaused(val: boolean) {
    isPaused = val
  }

  function getOptimization() {
    return optimization
  }

  function setOptimization(val: Optimization) {
    optimization = val
  }

  function getDrawOptimization() {
    return drawOptimization
  }

  function setDrawOptimization(val: boolean) {
    drawOptimization = val
  }
}

export default createBoidsApp
export type { BoidsApp }
