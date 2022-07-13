import { Rect } from "../types"
import debugHelper from "./debugHelper"
import { lineLineIntersection, rectContainsPoint } from "./math"
import { drawRect } from "./rendering"
import vec2, { Vec2 } from "./vec2"

export type Cell = {
  rect: Rect
  items: any[]
}

export type Grid = Map<string, Cell>
export type SpatialIndexSystem = ReturnType<typeof createSpatialIndex>

function createSpatialIndex(cellSize: number, gridSize: Vec2) {
  const grid: Grid = new Map<string, Cell>()

  return {
    grid,
    gridSize,
    cellSize,
    clear: () => clear(grid),
    insertPointType: (pt: Vec2, value: any) => insertPointType(pt, value, grid, cellSize),
    indexLineType: (from: Vec2, to: Vec2, value: any) =>
      insertLineType(from, to, value, grid, cellSize, gridSize),
    boxQuery: (pt: Vec2, boxSize: number, drawDebug: boolean = false) =>
      boxQuery(pt, boxSize, drawDebug, cellSize, gridSize, grid),
    draw: (canvas: HTMLCanvasElement) => drawGrid(canvas, grid),
  }
}

function insertPointType(pt: Vec2, value: any, grid: Grid, cellSize: number) {
  const x = Math.floor(pt.x / cellSize)
  const y = Math.floor(pt.y / cellSize)

  const hash = `${x} ${y}`

  if (!grid.has(hash)) {
    const c: Cell = {
      rect: { x: x * cellSize, y: y * cellSize, w: cellSize, h: cellSize },
      items: [],
    }
    grid.set(hash, c)
  }

  const cell = grid.get(hash)!
  cell.items.push(value)
}

function insertLineType(
  from: Vec2,
  to: Vec2,
  value: any,
  grid: Grid,
  cellSize: number,
  gridSize: Vec2
) {
  let rects: Rect[] = []

  const numRows = gridSize.y / cellSize
  const numCols = gridSize.x / cellSize

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      rects.push({ x: col * cellSize, y: row * cellSize, w: cellSize, h: cellSize })
    }
  }

  // test interesection or containment in each grid cell
  rects.forEach((rect) => {
    let contains =
      rectContainsPoint(from, rect) || // test start point containment
      rectContainsPoint(to, rect) || // test end point containment
      lineIntersectsRect(from, to, rect) // test line intersection with each edge of the rect

    if (contains) {
      const hash = `${rect.x / cellSize} ${rect.y / cellSize}`

      if (!grid.has(hash)) {
        const c: Cell = {
          rect,
          items: [],
        }
        grid.set(hash, c)
      }

      const cell = grid.get(hash)!
      cell.items.push(value)
    }
  })
}

function boxQuery(
  pt: Vec2,
  boxSize: number,
  drawDebug: boolean = false,
  cellSize: number,
  gridSize: Vec2,
  grid: Grid
): any[] {
  const cellsX = Math.floor(gridSize.x / cellSize) + 1
  const cellsY = Math.floor(gridSize.y / cellSize) + 1

  const selection: Cell[] = []

  const lookupDist = Math.ceil((boxSize * 0.5) / cellSize)
  const col = Math.floor(pt.x / cellSize)
  const row = Math.floor(pt.y / cellSize)

  const xMin = Math.max(0, col - lookupDist + 1)
  const xMax = Math.min(cellsX, col + lookupDist)
  const yMin = Math.max(0, row - lookupDist + 1)
  const yMax = Math.min(cellsY, row + lookupDist)

  for (let x = xMin; x < xMax; x++) {
    for (let y = yMin; y < yMax; y++) {
      const hash = `${x} ${y}`
      if (grid.has(hash)) {
        const cell = grid.get(hash)!
        selection.push(cell!)
      }
    }
  }
  if (drawDebug) {
    selection.forEach((cell) => {
      debugHelper.drawDebugRect(vec2(cell.rect.x, cell.rect.y), vec2(cell.rect.w, cell.rect.h))
    })
  }

  const out = selection.reduce((acc: any[], cell) => {
    cell.items.forEach((item) => {
      if (!acc.includes(item)) acc.push(item)
    })

    return acc
  }, [])

  return out
}

function clear(grid: Grid) {
  grid.forEach((_, key) => grid.delete(key))
}

function drawGrid(canvas: HTMLCanvasElement, grid: Grid) {
  grid.forEach((cell) => {
    drawRect(canvas, vec2(cell.rect.x, cell.rect.y), vec2(cell.rect.w, cell.rect.h), {
      color: "lightblue",
    })
  })
}

function lineIntersectsRect(l1: Vec2, l2: Vec2, rect: Rect) {
  const rectEdges = getRectEdges(rect)
  for (let i = 0; i < rectEdges.length; i++) {
    const re = rectEdges[i]
    const intersect = lineLineIntersection(l1, l2, re.start, re.end, false)
    if (intersect) return true
  }

  return false
}

function getRectEdges(rect: Rect) {
  const { x, y, w, h } = rect

  const p1 = vec2(x, y)
  const p2 = p1.add(vec2(w, 0))
  const p3 = p1.add(vec2(w, h))
  const p4 = p1.add(vec2(0, h))

  const top = { start: p1, end: p2 }
  const right = { start: p2, end: p3 }
  const bottom = { start: p3, end: p4 }
  const left = { start: p4, end: p1 }
  return [top, right, bottom, left]
}

export { createSpatialIndex }
