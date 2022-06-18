function createBoid(pos, vel) {
  let position = pos
  let velocity = vel

  function update(dt, boids) {}

  function getPosition() {
    return position
  }

  function getVelocity() {
    return velocity
  }

  return {
    update,
    getPosition,
    getVelocity,
  }
}

export default createBoid
