/**
 * @param {{ (dt: number): void }} tickFn
 */

function createTick(tickFn) {
  const targetFPS = 60
  let timeout
  let lastRealDelta

  doTick_R(performance.now())

  function doTick_R(timestamp) {
    const now = performance.now()

    tickFn(1 / targetFPS)

    timeout = setTimeout(() => {
      doTick_R(now)
      lastRealDelta = now - timestamp
    }, 1000 / targetFPS)

    return timeout
  }

  return {
    targetFPS,
    getTimeout: () => timeout,
    getLastRealDelta: () => lastRealDelta,
  }
}

export default createTick
