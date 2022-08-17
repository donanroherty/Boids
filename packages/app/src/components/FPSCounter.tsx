import React, { useEffect, useRef, useState } from "react"
import { Tick } from "@boids/lib/src/tick"

type FPSCounterProps = {
  tick: Tick
}

function FPSCounter(props: FPSCounterProps) {
  const lastLoggedTime = useRef(0)
  const [fps, setFps] = useState(0)

  // tick subscription
  {
    props.tick.subscribe(onTick)

    useEffect(() => {
      props.tick.unsubscribe(onTick)
    })
  }

  function onTick(dt: number) {
    const updateIntervalMS = 200 // ms
    const now = performance.now()
    const diff = now - lastLoggedTime.current
    if (diff > updateIntervalMS) {
      lastLoggedTime.current = now
      setFps(Math.floor(1000 / props.tick.getLastRealDelta()))
    }
  }

  return <div className="absolute top-0 right-0 p-2 text-xs text-gray-600">{fps} fps</div>
}

export default FPSCounter
