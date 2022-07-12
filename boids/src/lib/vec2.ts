type Vec2 = ReturnType<typeof vec2>

function vec2(inX = 0, inY = 0) {
  const self = {
    x: inX,
    y: inY,
    toPoint,
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

  function toPoint() {
    return { x: self.x, y: self.y }
  }

  function set(b: Vec2) {
    self.x = b.x
    self.y = b.y
  }

  function clone() {
    return vec2(self.x, self.y)
  }

  function scale(s: number) {
    return vec2(self.x * s, self.y * s)
  }

  function add(b: Vec2) {
    return vec2(self.x + b.x, self.y + b.y)
  }

  function sub(b: Vec2) {
    return vec2(self.x - b.x, self.y - b.y)
  }

  function mul(b: Vec2) {
    return vec2(self.x * b.x, self.y * b.y)
  }

  function div(b: Vec2) {
    return vec2(self.x / b.x, self.y / b.y)
  }

  function isEqual(b: Vec2, tol = 0.000001) {
    return Math.abs(self.x - b.x) < tol && Math.abs(self.y - b.y) < tol
  }

  function dot(v: Vec2) {
    return self.x * v.x + self.y * v.y
  }

  function cross(b: Vec2) {
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

  function clampedLen(min: number, max: number) {
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

  function reflect(refN: Vec2) {
    return self.sub(refN.scale(refN.dot(self) * 2))
  }

  function lerp(to: Vec2, t: number) {
    const diff = to.sub(self)
    return self.add(diff.scale(t))
  }

  return self
}

export default vec2
export type { Vec2 }
