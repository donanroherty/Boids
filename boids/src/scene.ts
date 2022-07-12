import { Boid, renderBoid, updateBoid, updateVisibleBoids } from "./boid.js"
import { boxCollider, Edge, polygonCollider, Shape } from "./lib/colliders"
import vec2, { Vec2 } from "./lib/vec2.js"
import * as geo from "../geo/scene-geo"
import { QuadTreeNode } from "./lib/pointQuadTree.js"

function createScene(canvas: HTMLCanvasElement) {
  let entities: Set<Boid> = new Set()
  let shapes: Set<Shape> = new Set()

  createShapes(shapes, getSceneSize())

  let collisionEdges = Array.from(shapes).reduce(
    (acc: Edge[], shape) => acc.concat(shape.edges),
    []
  )

  return {
    entities,
    shapes,
    getSceneSize,
    update,
  }

  function update(deltatime: number, quadTree: QuadTreeNode | null, isPaused: boolean) {
    entities.forEach((b) => updateVisibleBoids(b, entities, quadTree))

    entities.forEach((b) => updateBoid(b, deltatime, getSceneSize(), collisionEdges, isPaused))

    shapes.forEach((s) => s.draw(canvas))
    entities.forEach((b) => renderBoid(b, canvas))
  }

  function getSceneSize() {
    const pixelRatio = window.devicePixelRatio || 1
    return vec2(canvas.width / pixelRatio, canvas.height / pixelRatio)
  }
}

function createShapes(shapes: Set<Shape>, sceneSize: Vec2) {
  geo.positivesShapes.forEach((ps) => {
    const shape = polygonCollider(ps, { fill: false })
    shapes.add(shape)
  })

  const sceneBox = boxCollider(vec2(), sceneSize, { color: "purple", lineWidth: 1 }, true)
  shapes.add(sceneBox)
}

export { createScene }
