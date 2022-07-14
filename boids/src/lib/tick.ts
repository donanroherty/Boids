export type Tick = ReturnType<typeof createTick>

function createTick(tickFn: (dt: number) => void) {
  const targetFPS = 60
  let timeout: number
  let lastRealDelta: number

  function start() {
    doTick_R(performance.now())
  }

  function doTick_R(timestamp: number) {
    const now = performance.now()

    tickFn(1 / targetFPS)

    timeout = setTimeout(() => {
      doTick_R(now)
      lastRealDelta = now - timestamp
    }, 1000 / targetFPS)

    return timeout
  }

  return {
    start,
    targetFPS,
    getTimeout: () => timeout,
    getLastRealDelta: () => lastRealDelta,
  }
}

export default createTick
