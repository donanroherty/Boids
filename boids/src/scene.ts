import { Boid, renderBoid, updateBoid, updateVisibleBoids } from "./boid.js"
import { boxCollider, Edge, polygonCollider, Shape } from "./lib/colliders"
import vec2, { Vec2 } from "./lib/vec2.js"
import { getGeometry } from "./scene-geo"
import { QuadTreeNode } from "./lib/pointQuadTree.js"
import { createSpatialIndex, SpatialIndexSystem } from "./lib/spatialHash.js"

export type Scene = ReturnType<typeof createScene>

function createScene(canvas: HTMLCanvasElement) {
  let entities: Set<Boid> = new Set()
  let geometry: Set<Shape> = new Set()

  createShapes(geometry, getSceneSize(canvas))

  const geomHashTable = createSpatialIndex(20, getSceneSize(canvas))
  {
    const geomEdges = Array.from(geometry).reduce((acc: Edge[], geo) => acc.concat(geo.edges), []) // get all geometry edges
    geomEdges.forEach((edge) => geomHashTable.indexLineType(edge.start, edge.end, edge)) // add each edge to the hash table
  }

  const boidHashTable = createSpatialIndex(20, getSceneSize(canvas))

  return {
    entities,
    shapes: geometry,
    getSceneSize: () => getSceneSize(canvas),
    update,
  }

  function update(deltatime: number, quadTree: QuadTreeNode | null, isPaused: boolean) {
    updateBoidHashTable(entities, boidHashTable)
    // boidHashTable.draw(canvas)
    // geomHashTable.draw(canvas)

    entities.forEach((b) => updateVisibleBoids(b, entities, quadTree, boidHashTable))
    entities.forEach((b) => updateBoid(b, deltatime, getSceneSize(canvas), geomHashTable, isPaused))
    geometry.forEach((s) => s.draw(canvas))
    entities.forEach((b) => renderBoid(b, canvas))
  }
}

function updateBoidHashTable(entities: Set<Boid>, boidHashTable: SpatialIndexSystem) {
  boidHashTable.clear()
  entities.forEach((ent) => {
    boidHashTable.insertPointType(ent.position, ent)
  })
}

function getSceneSize(canvas: HTMLCanvasElement) {
  const pixelRatio = window.devicePixelRatio || 1
  return vec2(canvas.width / pixelRatio, canvas.height / pixelRatio)
}

function createShapes(shapes: Set<Shape>, sceneSize: Vec2) {
  const geometry = getGeometry()
  geometry.reversePathPointOrder([0, 1, 2, 3, 4, 5])
  geometry.scale(vec2(3.3, 3.3))
  geometry.offset(vec2(135, 245))

  // create geometry in scene
  geometry.getPaths().forEach((ps) => {
    const shape = polygonCollider(ps, { fill: false, drawNormal: false })
    shapes.add(shape)
  })

  const padding = 2
  const sceneBox = boxCollider(
    vec2(padding, padding),
    sceneSize.sub(vec2(padding * 2, padding * 2)),
    { color: "purple", lineWidth: 1, drawNormal: true, visible: false },
    true
  )
  shapes.add(sceneBox)
}

export { createScene }
