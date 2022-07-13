import { Boid, renderBoid, updateBoid, updateVisibleBoids } from "./boid.js"
import { boxCollider, Edge, polygonCollider, Shape } from "./lib/colliders"
import vec2, { Vec2 } from "./lib/vec2.js"
import * as geo from "../geo/scene-geo"
import { QuadTreeNode } from "./lib/pointQuadTree.js"

import { createSpatialIndex } from "./lib/spatialHash.js"

function createScene(canvas: HTMLCanvasElement) {
  let entities: Set<Boid> = new Set()
  let geometry: Set<Shape> = new Set()

  createShapes(geometry, getSceneSize())

  const geomHashTable = createSpatialIndex(20, getSceneSize())
  {
    const geomEdges = Array.from(geometry).reduce((acc: Edge[], geo) => acc.concat(geo.edges), []) // get all geometry edges
    geomEdges.forEach((edge) => geomHashTable.indexLineType(edge.start, edge.end, edge)) // add each edge to the hash table
  }

  return {
    entities,
    shapes: geometry,
    getSceneSize,
    update,
  }

  function update(deltatime: number, quadTree: QuadTreeNode | null, isPaused: boolean) {
    geomHashTable.draw(canvas)

    entities.forEach((b) => updateVisibleBoids(b, entities, quadTree))
    entities.forEach((b) => updateBoid(b, deltatime, getSceneSize(), geomHashTable, isPaused))
    geometry.forEach((s) => s.draw(canvas))
    entities.forEach((b) => renderBoid(b, canvas))
  }

  function getSceneSize() {
    const pixelRatio = window.devicePixelRatio || 1
    return vec2(canvas.width / pixelRatio, canvas.height / pixelRatio)
  }
}

function createShapes(shapes: Set<Shape>, sceneSize: Vec2) {
  geo.paths.forEach((ps) => {
    const shape = polygonCollider(ps, { fill: false, drawNormal: false })
    shapes.add(shape)
  })

  const padding = 1
  const sceneBox = boxCollider(
    vec2(padding, padding),
    sceneSize.sub(vec2(padding * 2, padding * 2)),
    { color: "purple", lineWidth: 1, drawNormal: true },
    true
  )
  shapes.add(sceneBox)
}

export { createScene }
