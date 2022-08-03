import createTick from "./tick"
import { createFlockHandler, FlockHandler } from "./flockHandler"
import { scaleCanvasToPixelRatio } from "./lib/rendering"
import debugHelper from "./lib/debugHelper"
import { BoidController, createBoidController } from "./boidController"
import { createScene, Scene } from "./scene.js"

import { BoidSearchOpt, ColliderSearchOpt } from "./types"

type BoidsApp = ReturnType<typeof createBoidsApp>

function createBoidsApp() {
  let canvas: HTMLCanvasElement

  let scene: Scene
  let boidController: BoidController
  let flockHandler: FlockHandler
  let tick = createTick()
  let isPaused: boolean
  let boidSearchOptimization: BoidSearchOpt = BoidSearchOpt.SpatialHash
  let drawBoidSearchOptimization = false
  let colliderSearchOptimization: ColliderSearchOpt = ColliderSearchOpt.SpatialHash
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

    tick.subscribe(update)
  }

  function update(deltatime: number) {
    clearCanvas()

    if (boidController) boidController.update(scene.entities)
    scene.update(deltatime, app.getPaused())
  }

  function clearCanvas() {
    const ctx = canvas.getContext("2d")
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
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
  function setBoidSearchOptimization(val: BoidSearchOpt) {
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
  function setColliderSearchOptimization(val: ColliderSearchOpt) {
    colliderSearchOptimization = val
  }
  function getDrawColliderSearchOptimization() {
    return drawColliderSearchOptimization
  }
  function setDrawColliderSearchOptimization(val: boolean) {
    drawColliderSearchOptimization = val
  }
}

export { createBoidsApp }
export type { BoidsApp }
