import { Boid, renderBoid, updateBoid, updateVisibleBoids } from "./boid.js"
import { Edge, Shape } from "./lib/colliders"
import vec2 from "./lib/vec2.js"

import { drawQuadTree, pointQuadTree, QuadTreeNode } from "./lib/pointQuadTree.js"
import { createSpatialIndex } from "./lib/spatialHash.js"
import { BoidSearchOpt } from "./types.js"
import { BoidsApp } from "./app.js"

export type Scene = ReturnType<typeof createScene>

function createScene(canvas: HTMLCanvasElement, app: BoidsApp) {
  let entities: Set<Boid> = new Set()
  let geometry: Set<Shape> = new Set()
  let quadTree: QuadTreeNode | null = null
  const boidHashTable = createSpatialIndex(20, getSceneSize())
  const geomHashTable = createSpatialIndex(20, getSceneSize())

  const scene = {
    geomHashTable,
    boidHashTable,
    quadTree,
    entities,
    geometry,
    addGeometry,
    getSceneSize,
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
    entities.forEach((b) => updateBoid(b, deltatime, getSceneSize(), geomHashTable, isPaused))
    geometry.forEach((s) => s.draw(canvas))
    entities.forEach((b) => renderBoid(b, canvas))
  }

  function updateGeometryHashTable() {
    geomHashTable.clear()
    const geomEdges = Array.from(geometry).reduce((acc: Edge[], geo) => acc.concat(geo.edges), []) // get all geometry edges
    geomEdges.forEach((edge) => geomHashTable.indexLineType(edge.start, edge.end, edge)) // add each edge to the hash table
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

    const sceneSize = getSceneSize()
    const positions = Array.from(entities).map((b: Boid) => b.position.toPoint())
    quadTree = pointQuadTree({ x: 0, y: 0, w: sceneSize.x, h: sceneSize.y }, 8, positions)

    if (app.getDrawBoidSearchOptimization()) drawQuadTree(quadTree, canvas)
  }

  function addGeometry(shape: Shape) {
    geometry.add(shape)
    updateGeometryHashTable()
  }

  function getSceneSize() {
    const pixelRatio = window.devicePixelRatio || 1
    return vec2(canvas.width / pixelRatio, canvas.height / pixelRatio)
  }
}

export { createScene }
