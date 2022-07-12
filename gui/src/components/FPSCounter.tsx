import { createSignal } from "solid-js"

function FPSCounter(props: any) {
  const [fps, setFPS] = createSignal(0)

  setInterval(() => {
    const dt = props.valueGetter()
    setFPS(Math.floor(1000 / dt))
  }, 1000 / 5)

  return <div class="text-xs text-gray-400">{fps()} fps</div>
}

export default FPSCounter
