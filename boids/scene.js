import { renderBoid, updateBoid, updateVisibleBoids } from "./boid"
import { boxCollider, polygonCollider } from "./lib/shapes"
import vec2 from "./lib/vec2"
import * as geo from "./geo/scene-geo.js"

function createScene(canvas) {
  let entities = new Set()
  let shapes = new Set()

  createShapes(shapes, getSceneSize())

  let collisionEdges = Array.from(shapes).reduce((acc, collider) => acc.concat(collider.edges), [])

  return {
    entities,
    shapes,
    getSceneSize,
    update,
  }

  function update(deltatime, quadTree, debugHelper, isPaused) {
    // debugHelper.draw(canvas)
    entities.forEach((b) => updateVisibleBoids(b, entities, quadTree ? quadTree : null))

    entities.forEach((b) =>
      updateBoid(b, deltatime, getSceneSize(), collisionEdges, debugHelper, isPaused)
    )

    shapes.forEach((s) => s.draw(canvas))
    entities.forEach((b) => renderBoid(b, canvas, debugHelper))
  }

  function getSceneSize() {
    const pixelRatio = window.devicePixelRatio || 1
    return vec2(canvas.width / pixelRatio, canvas.height / pixelRatio)
  }
}

function createShapes(shapes, sceneSize) {
  geo.positivesShapes.forEach((ps) => {
    const shape = polygonCollider(ps, { fill: true })
    shapes.add(shape)
  })

  const sceneBox = boxCollider(vec2(), sceneSize, { color: "purple", lineWidth: 1 }, true)
  shapes.add(sceneBox)
}

export { createScene }
