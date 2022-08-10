import { Boid } from "./boid"
import debugHelper from "./lib/debugHelper"
import vec2, { Vec2 } from "./lib/vec2"

export type BoidController = ReturnType<typeof createBoidController>

function createBoidController(canvas: HTMLCanvasElement) {
  let pointerDown = false
  let mouseX = 0
  let mouseY = 0
  let dragging = false
  let draggingSelection = false
  let hoveredBoid: Boid | null = null
  let selected: Boid | null = null

  const inputHandler = {
    update,
  }

  canvas.addEventListener("pointerdown", onPointerDown)
  canvas.addEventListener("pointerup", onPointerUp)
  canvas.addEventListener("pointermove", onPointerMove)

  function update(entities: Set<Boid>) {
    const { drawDebugPoint } = debugHelper
    const pointerPos = vec2(mouseX - canvas.offsetLeft, mouseY - canvas.offsetTop)

    hoveredBoid = getEntityAtPosition(entities, pointerPos)

    if (selected) {
      // draw selection
      drawDebugPoint(selected.position, selected.config.size, {})

      // draw selection target
      const targetRadius = 2
      drawDebugPoint(
        selected.position.add(
          selected.direction.scale(selected.config.visionRange + 10 - targetRadius)
        ),
        targetRadius,
        {}
      )

      // begin dragging
      if (pointerDown && selected) {
        dragging = true
      }

      if (dragging) {
        if (draggingSelection) dragSelection(pointerPos)
        else if (selected) {
          aimSelected(pointerPos)
        }
      }
    }
  }

  function dragSelection(pointerPos: Vec2) {
    if (selected) selected.position = pointerPos
  }

  function aimSelected(pointerPos: Vec2) {
    if (!selected) return

    // drag boid target
    const vel = selected.velocity
    const speed = vel.len()
    const newDir = pointerPos.sub(selected.position).norm()
    const newVel = newDir.scale(speed)
    selected.velocity.set(newVel)
    selected.direction.set(newDir)
  }

  function startDrag() {
    selected = hoveredBoid
    draggingSelection = true
  }

  function endDrag() {
    dragging = false
    draggingSelection = false
  }

  function onPointerDown(_: PointerEvent) {
    pointerDown = true
    if (!dragging && hoveredBoid) {
      startDrag()
    }
  }

  function onPointerUp(_: PointerEvent) {
    pointerDown = false
    endDrag()
  }

  function getEntityAtPosition(entities: Set<Boid>, pos: Vec2): Boid | null {
    const boid = Array.from(entities).find((e) => {
      const rad = e.config.size
      const dist = vec2(e.position.x, e.position.y).sub(pos).lenSq()
      return dist < rad * rad
    })
    return boid || null
  }

  function onPointerMove(event: PointerEvent) {
    mouseX = event.pageX
    mouseY = event.pageY
  }

  return inputHandler
}

export { createBoidController }
