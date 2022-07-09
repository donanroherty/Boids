/**
 * Vec2 type
 * @typedef { typeof vec2 extends (...args: any[]) => infer U ? U : any } Vec2
 */

/**
 * Creates a vector 2 object with utility functions
 * @param {number} inX
 * @param {number} inY
 * @returns Vec2
 */
function vec2(inX = 0, inY = 0) {
  const self = {
    x: inX,
    y: inY,
    set,
    clone,
    add,
    scale,
    mul,
    div,
    isEqual,
    sub,
    dot,
    cross,
    perpCW,
    perpCCW,
    len,
    clampedLen,
    lenSq,
    norm,
    angle,
    reflect,
    lerp,
  }

  function set(b) {
    self.x = b.x
    self.y = b.y
  }

  function clone() {
    return vec2(self.x, self.y)
  }

  /**
   * @param {number} s
   */
  function scale(s) {
    return vec2(self.x * s, self.y * s)
  }

  /**
   * @param {Vec2} b
   */
  function add(b) {
    return vec2(self.x + b.x, self.y + b.y)
  }

  /**
   * @param {Vec2} b
   */
  function sub(b) {
    return vec2(self.x - b.x, self.y - b.y)
  }

  /**
   * @param {Vec2} b
   */
  function mul(b) {
    return vec2(self.x * b.x, self.y * b.y)
  }

  /**
   * @param {Vec2} b
   */
  function div(b) {
    return vec2(self.x / b.x, self.y / b.y)
  }

  /**
   * @param {Vec2} b
   * @param {number} tol
   */
  function isEqual(b, tol = 0.000001) {
    return Math.abs(self.x - b.x) < tol && Math.abs(self.y - b.y) < tol
  }

  /**
   * @param {Vec2} v
   */
  function dot(v) {
    return self.x * v.x + self.y * v.y
  }

  /**
   * @param {Vec2} b
   */
  function cross(b) {
    return self.x * b.y - self.y * b.x
  }

  function perpCW() {
    return vec2(self.y, -self.x)
  }

  function perpCCW() {
    return vec2(-self.y, self.x)
  }

  function lenSq() {
    return self.x * self.x + self.y * self.y
  }

  function len() {
    return Math.sqrt(lenSq())
  }

  /**
   * @param {number} min
   * @param {number} max
   */
  function clampedLen(min, max) {
    const length = self.len()
    return length < min
      ? self.norm().scale(min)
      : length > max
      ? self.norm().scale(max)
      : vec2(self.x, self.y)
  }

  function norm(tol = 1e-8) {
    const l = self.len()
    if (l > tol) {
      return vec2(self.x / l, self.y / l)
    }
    return vec2()
  }

  function angle() {
    const dir = self.norm()
    const ang = Math.atan2(dir.x, dir.y)
    const adj = ang < 0 ? ang + Math.PI * 2 : ang
    return adj
  }

  /**
   * @param {Vec2} refN
   */
  function reflect(refN) {
    return self.sub(refN.scale(refN.dot(self) * 2))
  }

  /**
   * @param {Vec2} to
   * @param {any} t
   */
  function lerp(to, t) {
    const diff = to.sub(self)
    return self.add(diff.scale(t))
  }

  return self
}

export default vec2
