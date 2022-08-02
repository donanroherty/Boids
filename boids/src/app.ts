import createTick, { Tick } from "./lib/tick"
import { createFlockHandler, FlockHandler } from "./flockHandler"
import { pointQuadTree, QuadTreeNode } from "./lib/pointQuadTree.js"
import { drawQuadTree, scaleCanvasToPixelRatio } from "./lib/rendering"
import debugHelper from "./lib/debugHelper"
import { BoidController, createBoidController } from "./boidController"
import { createScene, Scene } from "./scene.js"
import { Boid } from "./boid"
import { BoidSearchOptimization, ColliderSearchOptimization } from "./types"

type BoidsApp = ReturnType<typeof createBoidsApp>

function createBoidsApp() {
  let canvas: HTMLCanvasElement
  let quadTree: QuadTreeNode | null = null
  let scene: Scene
  let boidController: BoidController
  let flockHandler: FlockHandler
  let tick: Tick | undefined
  let isPaused: boolean
  let boidSearchOptimization: BoidSearchOptimization = "Spatial Index"
  let drawBoidSearchOptimization = false
  let colliderSearchOptimization: ColliderSearchOptimization = "Spatial Index"
  let drawColliderSearchOptimization = false

  const app = {
    init,
    getFlockhandler,
    getTick,
    getPaused,
    setPaused,
    getBoidSearchOptimization,
    setBoidSearchOptimization,
    getDrawBoidSearchOptimization,
    setDrawBoidSearchOptimization,
    getColliderSearchOptimization,
    setColliderSearchOptimization,
    getDrawColliderSearchOptimization,
    setDrawColliderSearchOptimization,
  }

  return app

  function init(cvs: HTMLCanvasElement, canvasResolution: { x: number; y: number }) {
    canvas = cvs
    debugHelper.init(canvas)

    scaleCanvasToPixelRatio(canvas, canvasResolution)

    scene = createScene(canvas, app)
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
    if (boidSearchOptimization === "Quad Tree") {
      const sceneSize = scene.getSceneSize()
      const positions = Array.from(scene.entities).map((b: Boid) => b.position.toPoint())
      quadTree = pointQuadTree({ x: 0, y: 0, w: sceneSize.x, h: sceneSize.y }, 8, positions)
      if (drawBoidSearchOptimization) {
        drawQuadTree(quadTree, canvas)
      }
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

  // Boid search optimization
  function getBoidSearchOptimization() {
    return boidSearchOptimization
  }
  function setBoidSearchOptimization(val: BoidSearchOptimization) {
    boidSearchOptimization = val
  }
  function getDrawBoidSearchOptimization() {
    return drawBoidSearchOptimization
  }
  function setDrawBoidSearchOptimization(val: boolean) {
    drawBoidSearchOptimization = val
  }

  // Collider search optimization
  function getColliderSearchOptimization() {
    return colliderSearchOptimization
  }
  function setColliderSearchOptimization(val: ColliderSearchOptimization) {
    colliderSearchOptimization = val
  }
  function getDrawColliderSearchOptimization() {
    return drawColliderSearchOptimization
  }
  function setDrawColliderSearchOptimization(val: boolean) {
    drawColliderSearchOptimization = val
  }
}

export default createBoidsApp
export type { BoidsApp }
