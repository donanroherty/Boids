export type Tick = ReturnType<typeof createTick>

function createTick() {
  const targetFPS = 60
  let timeout: number
  let lastRealDelta: number
  let tickFunctions: Array<(dt: number) => void> = []

  doTick_R(performance.now())

  function subscribe(fn: (dt: number) => void) {
    tickFunctions.push(fn)
  }

  function unsubscribe(fn: (dt: number) => void) {
    tickFunctions = tickFunctions.filter((tf) => tf !== fn)
  }

  function doTick_R(timestamp: number) {
    const now = performance.now()

    tickFunctions.forEach((tf) => tf(1 / targetFPS))

    timeout = window.setTimeout(() => {
      doTick_R(now)
      lastRealDelta = now - timestamp
    }, 1000 / targetFPS)

    return timeout
  }

  return {
    subscribe,
    unsubscribe,
    targetFPS,
    getTimeout: () => timeout,
    getLastRealDelta: () => lastRealDelta,
  }
}

export default createTick
