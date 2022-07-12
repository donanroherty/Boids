import { Edge } from "./lib/colliders"
import { Vec2 } from "./lib/vec2"

type Hit = {
  location: Vec2
  hitLocation: Vec2
  hitNormal: Vec2
  colliderNormal: Vec2
  t: number
  other: Edge
}

type RayHit = {
  location: Vec2
  normal: Vec2
  t: number
  other: Edge
}

export type { Hit, RayHit }
