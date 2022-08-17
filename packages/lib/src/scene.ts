import { Boid, renderBoid, updateBoid, updateVisibleBoids } from "./boid"
import { Edge, Shape } from "./lib/colliders"
import vec2, { Vec2 } from "./lib/vec2"

import { circleQuery, drawQuadTree, pointQuadTree, QuadTreeNode } from "./lib/pointQuadTree"
import { createSpatialIndex } from "./lib/spatialHash"
import { BoidSearchOpt } from "./types"
import { BoidsApp } from "./app"
import debugHelper from "./lib/debugHelper"

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
    getBoidsInRange,
    getCollisionGeometryInRange,
    update,
  }

  return scene

  function update(deltatime: number, isPaused: boolean) {
    updateBoidHashTable()
    updateQuadTree()

    if (app.getDrawColliderSearchOptimization()) geomHashTable.draw(canvas)

    entities.forEach((b) => updateVisibleBoids(b))
    entities.forEach((b) => updateBoid(b, deltatime, getSceneSize(), isPaused))
    geometry.forEach((s) => s.draw(canvas))
    entities.forEach((b) => renderBoid(b, canvas))
  }

  function updateQuadTree() {
    if (app.getBoidSearchOptimization() !== BoidSearchOpt.QuadTree) return

    const sceneSize = getSceneSize()
    const positions = Array.from(entities).map((b: Boid) => b.position.toPoint())
    quadTree = pointQuadTree({ x: 0, y: 0, w: sceneSize.x, h: sceneSize.y }, 8, positions)

    if (app.getDrawBoidSearchOptimization()) drawQuadTree(quadTree, canvas)
  }

  function updateBoidHashTable() {
    if (app.getBoidSearchOptimization() !== BoidSearchOpt.SpatialHash) return

    boidHashTable.clear()
    entities.forEach((ent) => {
      boidHashTable.insertPointType(ent.position, ent)
    })

    if (app.getDrawBoidSearchOptimization()) boidHashTable.draw(canvas)
  }

  function updateGeometryHashTable() {
    geomHashTable.clear()
    const geomEdges = Array.from(geometry).reduce((acc: Edge[], geo) => acc.concat(geo.edges), []) // get all geometry edges
    geomEdges.forEach((edge) => geomHashTable.indexLineType(edge.start, edge.end, edge)) // add each edge to the hash table
  }

  function addGeometry(shape: Shape) {
    geometry.add(shape)
    updateGeometryHashTable()
  }

  function getCollisionGeometryInRange(
    pos: Vec2,
    radius: number,
    drawDebug = false,
    debugColor = "red"
  ) {
    const edges = geomHashTable
      .boxQuery(pos, radius * 2, drawDebug && app.getDrawColliderSearchOptimization(), debugColor)
      .filter((edge) => {
        // boid is on the colliding side of the edge
        const ptToBoid = pos.sub(edge.start).norm()
        if (ptToBoid.dot(edge.normal) < 0) return false

        return true
      })

    if (drawDebug && app.getDrawColliderSearchOptimization()) {
      edges.forEach((edge) => {
        debugHelper.drawDebugLine(edge.start, edge.end, { lineWidth: 3, color: debugColor })
        debugHelper.drawDebugPoint(edge.start, 2, { color: debugColor })
      })
    }

    return edges
  }

  function getBoidsInRange(pos: Vec2, range: number, drawDebug = false, debugColor = "red") {
    if (app.getBoidSearchOptimization() === BoidSearchOpt.SpatialHash) {
      return boidHashTable.boxQuery(
        pos,
        range * 2,
        drawDebug && app.getDrawBoidSearchOptimization(),
        debugColor
      )
    } else if (app.getBoidSearchOptimization() === BoidSearchOpt.QuadTree && quadTree) {
      let positions = circleQuery(quadTree, pos, range)
      return Array.from(entities).filter(
        (o) => positions.find((p) => p.x === o.position.x && p.y === o.position.y) !== undefined
      )
    } else {
      // brute force
      return Array.from(entities).filter(
        (o) => vec2(o.position.x, o.position.y).sub(pos).lenSq() < range * range
      )
    }
  }

  function getSceneSize() {
    const pixelRatio = window.devicePixelRatio || 1
    return vec2(canvas.width / pixelRatio, canvas.height / pixelRatio)
  }
}

export { createScene }
