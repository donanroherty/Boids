import styles from "./App.module.css"
import createBoidsApp from "../../../boids/app"

import { onMount, createSignal } from "solid-js"

function App() {
  let canvas

  const [boidsApp, setBoidsApp] = createSignal()
  const [canvasSize, setCanvasSize] = createSignal({ x: 640, y: 480 })

  onMount(() => {
    setBoidsApp(createBoidsApp(canvas))
  })

  return (
    <div class={styles.App}>
      <canvas
        ref={canvas}
        class={styles.canvas}
        width={canvasSize().x}
        height={canvasSize().y}
      ></canvas>
    </div>
  )
}

export default App
