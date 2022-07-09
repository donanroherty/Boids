import { renderBoid, updateBoid, updateVisibleBoids } from "./boid"
import { boxCollider, polygonCollider } from "./lib/shapes"
import vec2 from "./lib/vec2"

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
  const sceneBox = boxCollider(vec2(), sceneSize, { color: "purple", lineWidth: 1 }, true, true)
  shapes.add(sceneBox)

  const b = boxCollider(vec2(150, 100), vec2(100, 150), {}, false, true)
  shapes.add(b)

  const pts = [
    vec2(350, 50),
    vec2(330, 130),
    vec2(300, 230),
    vec2(350, 230),
    vec2(350, 150),
    vec2(400, 230),
    vec2(450, 150),
    vec2(350, 130),
    vec2(450, 120),
    vec2(450, 80),
    vec2(450, 30),
    vec2(400, 110),
  ]
  const p = polygonCollider(pts, {}, true)
  shapes.add(p)
}

export { createScene }
