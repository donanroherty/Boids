import vec2 from "./lib/vec2"

function createManualBoidController() {
  let pointerDown = false
  let mouseX = 0
  let mouseY = 0
  let dragging = false
  let draggingSelection = false
  let hoveredBoid
  let selected

  const inputHandler = {
    update,
  }

  window.addEventListener("pointerdown", onPointerDown)
  window.addEventListener("pointerup", onPointerUp)
  window.addEventListener("pointermove", onPointerMove)

  function update(canvas, entities, debugHelper, isPaused) {
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
          selected.direction.scale(selected.config.detectionRange + 10 - targetRadius)
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

  function dragSelection(pointerPos) {
    selected.position = pointerPos
  }

  function aimSelected(pointerPos) {
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

  function onPointerDown(event) {
    pointerDown = true
    if (!dragging && hoveredBoid) {
      startDrag()
    }
  }

  function onPointerUp(event) {
    pointerDown = false
    endDrag()
  }

  function getEntityAtPosition(entities, pos) {
    return Array.from(entities).find((e) => {
      const rad = e.config.size
      const dist = vec2(e.position.x, e.position.y).sub(pos).lenSq()
      return dist < rad * rad
    })
  }

  function onPointerMove(event) {
    mouseX = event.pageX
    mouseY = event.pageY
  }

  return inputHandler
}

export { createManualBoidController }
