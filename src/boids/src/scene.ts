import { Boid, renderBoid, updateBoid, updateVisibleBoids } from "./boid.js"
import { boxCollider, Edge, polygonCollider, Shape } from "./lib/colliders"
import vec2, { Vec2 } from "./lib/vec2.js"
import { getGeometry } from "./scene-geo"
import { drawQuadTree, pointQuadTree, QuadTreeNode } from "./lib/pointQuadTree.js"
import { createSpatialIndex } from "./lib/spatialHash.js"
import { BoidSearchOpt } from "./types.js"
import { BoidsApp } from "./app.js"

export type Scene = ReturnType<typeof createScene>

function createScene(canvas: HTMLCanvasElement, app: BoidsApp) {
  let entities: Set<Boid> = new Set()
  let geometry: Set<Shape> = new Set()

  let quadTree: QuadTreeNode | null = null
  const boidHashTable = createSpatialIndex(20, getSceneSize(canvas))

  createShapes(geometry, getSceneSize(canvas))

  const geomHashTable = createSpatialIndex(20, getSceneSize(canvas))
  {
    const geomEdges = Array.from(geometry).reduce((acc: Edge[], geo) => acc.concat(geo.edges), []) // get all geometry edges
    geomEdges.forEach((edge) => geomHashTable.indexLineType(edge.start, edge.end, edge)) // add each edge to the hash table
  }

  const scene = {
    geomHashTable,
    quadTree,
    boidHashTable,
    entities,
    geometry,
    getSceneSize: () => getSceneSize(canvas),
    update,
  }

  return scene

  function update(deltatime: number, isPaused: boolean) {
    updateBoidHashTable()
    updateQuadTree()

    if (app.getDrawColliderSearchOptimization()) geomHashTable.draw(canvas)

    entities.forEach((b) =>
      updateVisibleBoids(b, entities, app.getBoidSearchOptimization(), quadTree, boidHashTable)
    )
    entities.forEach((b) => updateBoid(b, deltatime, getSceneSize(canvas), geomHashTable, isPaused))
    geometry.forEach((s) => s.draw(canvas))
    entities.forEach((b) => renderBoid(b, canvas))
  }

  function updateBoidHashTable() {
    if (app.getBoidSearchOptimization() !== BoidSearchOpt.SpatialHash) return

    boidHashTable.clear()
    entities.forEach((ent) => {
      boidHashTable.insertPointType(ent.position, ent)
    })

    if (app.getDrawBoidSearchOptimization()) boidHashTable.draw(canvas)
  }

  function updateQuadTree() {
    if (app.getBoidSearchOptimization() !== BoidSearchOpt.QuadTree) return

    const sceneSize = getSceneSize(canvas)
    const positions = Array.from(entities).map((b: Boid) => b.position.toPoint())
    quadTree = pointQuadTree({ x: 0, y: 0, w: sceneSize.x, h: sceneSize.y }, 8, positions)

    if (app.getDrawBoidSearchOptimization()) drawQuadTree(quadTree, canvas)
  }
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
    const shape = polygonCollider(ps, { fill: false, drawNormal: false, color: "rgb(160,160,160)" })
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
