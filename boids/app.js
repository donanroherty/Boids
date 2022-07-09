import createTick from "./lib/tick.js"
import { createFlockHandler } from "./flockHandler.js"
import { pointQuadTree } from "./lib/pointQuadTree.js"
import { drawQuadTree } from "./lib/rendering.js"
import createDebugHelper from "./debugHelper.js"
import { createManualBoidController } from "./manualBoidController.js"
import { createScene } from "./scene.js"

function boidsApp(canvas) {
  // canvas.style.transform = "scaleY(-1)" // flip y axis
  scaleCanvasToPixelRatio(canvas)

  let quadTree = null
  const scene = createScene(canvas)
  const debugHelper = createDebugHelper(canvas)
  const manualBoidController = createManualBoidController()
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

  function update(deltatime) {
    clearCanvas()
    updateQuadTree()
    manualBoidController.update(canvas, scene.entities, debugHelper, app.isPaused)
    scene.update(deltatime, quadTree, debugHelper, app.isPaused)
  }

  function clearCanvas() {
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  function updateQuadTree() {
    if (app.useQuadTree) {
      const sceneSize = scene.getSceneSize()
      const positions = Array.from(scene.entities).map((b) => b.position)
      quadTree = pointQuadTree({ x: 0, y: 0, w: sceneSize.x, h: sceneSize.y }, 8, positions)
      if (app.bRenderQuadTree) drawQuadTree(quadTree, canvas)
    } else quadTree = null
  }

  function scaleCanvasToPixelRatio(canvas) {
    const pixelRatio = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = Math.round(pixelRatio * rect.right) - Math.round(pixelRatio * rect.left)
    canvas.height = Math.round(pixelRatio * rect.bottom) - Math.round(pixelRatio * rect.top)
    const ctx = canvas.getContext("2d")
    ctx.scale(pixelRatio, pixelRatio)
  }

  return app
}

export default boidsApp
