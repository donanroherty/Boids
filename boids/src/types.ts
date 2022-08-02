import { Edge } from "./lib/colliders"
import { Vec2 } from "./lib/vec2"

export type Hit = {
  location: Vec2
  hitLocation: Vec2
  hitNormal: Vec2
  colliderNormal: Vec2
  t: number
  other: Edge
}

export type RayHit = {
  location: Vec2
  normal: Vec2
  t: number
  other: Edge
}

export type Rect = {
  x: number
  y: number
  w: number
  h: number
}

export type Point = {
  x: number
  y: number
}

export type Line = {
  from: Point
  to: Point
}

export type BoidSearchOptimization = "Quad Tree" | "Spatial Index" | "None"
export type ColliderSearchOptimization = "Spatial Index" | "None"
