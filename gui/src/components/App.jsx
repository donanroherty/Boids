import createBoidsApp from "../../../boids/app"
import { onMount, createSignal } from "solid-js"
import Controls from "./Controls"

function App() {
  let canvas

  const [boidsApp, setBoidsApp] = createSignal()
  const [canvasSize, setCanvasSize] = createSignal({ x: 640, y: 480 })

  onMount(() => {
    setBoidsApp(createBoidsApp(canvas))
  })

  return (
    <div class="w-[640px] shadow-sm">
      <canvas
        ref={canvas}
        class="w-full border-[1px] border-black border-solid rounded-bl-md rounded-br-md"
        width={canvasSize().x}
        height={canvasSize().y}
      ></canvas>
      <Controls boidsApp={boidsApp()} />
    </div>
  )
}

export default App
