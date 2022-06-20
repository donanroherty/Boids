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
    <div>
      <canvas ref={canvas} width={canvasSize().x} height={canvasSize().y}></canvas>
      <Controls boidsApp={boidsApp()} />
    </div>
  )
}

export default App
