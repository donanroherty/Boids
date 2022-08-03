import vec2, { Vec2 } from "./lib/vec2"
import { Rect } from "./types"

const boidsSVG = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 119 31" version="1.1" 
  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
    xml:space="preserve" xmlns:serif="http://www.serif.com/" 
    style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
<path d="M19.247,22.009l-2.998,5.991l-6.539,2.587l-5.227,-1.477l0.53,0.947l-4.735,0l-0,-8.048l3.674,0l0,2.139l5.683,2.916l2.925,-0.844l2.868,-4.211l3.819,0Z" style="fill-rule:nonzero;"/>
<path d="M0.278,16.526l-0,-16.054l3.674,0.265l0,9.811l6.213,-2.652l6.733,2.609l1.773,2.817l0.762,3.204l-3.691,-0l-0.895,-2.53l-4.834,-2.804l-6.061,3.902l0,1.432l-3.674,-0Z" style="fill-rule:nonzero;"/>
<path d="M93.927,22.009l0,6.726l0.272,1.247l-4.465,0l-0.012,-0.947l-5.227,1.477l-6.539,-2.587l-2.99,-5.916l3.84,0l0.688,1.82l5.076,3.16l5.683,-2.916l-0,-2.064l3.674,0Z" style="fill-rule:nonzero;"/>
<path d="M93.927,16.526l-3.674,-0l-0,-1.507l-6.061,-3.902l-4.834,2.804l-0.902,2.605l-3.689,-0l2.54,-6.096l6.733,-2.609l6.213,2.652l-0,-9.811l3.674,-0.265l0,16.129Z" style="fill-rule:nonzero;"/>
<path d="M44.276,22.009l-1.428,4.112l-8.325,4.466l-7.466,-3.298l-2.22,-5.102l-0.015,-0.178l4.136,0l1.441,3.455l4.237,1.941l4.173,-1.983l1.361,-3.413l4.106,0Z" style="fill-rule:nonzero;"/>
<path d="M24.841,16.526l2.279,-5.325l7.327,-3.305l7.319,3.145l2.451,5.485l-4.089,-0l-1.573,-3.701l-3.994,-1.822l-3.42,1.215l-2.168,4.308l-4.132,-0Z" style="fill-rule:nonzero;"/>
<path d="M61.419,22.009l-3.561,0l-0,4.942l-6.592,-0l0,3.106l16.668,0l-0.303,-3.106l-6.212,-0l-0,-4.942Z" style="fill-rule:nonzero;"/><path d="M61.419,16.526l-0,-8.061l-7.88,-0l0,2.841l4.319,0.265l-0,4.955l3.561,-0Z" style="fill-rule:nonzero;"/>
<path d="M56.683,2.669l2.576,2.576l2.538,-2.576l-2.538,-2.538l-2.576,2.538Z" style="fill-rule:nonzero;"/>
<path d="M118.109,22.009l-4.438,0l1.388,1.608l-1.118,2.241l-3.996,1.434l-4.813,-1.942l-1.968,-1.998l-2.424,2.538l3.735,3.395l5.432,1.302l5.487,-1.402l3.15,-5.606l-0.435,-1.57Z" style="fill-rule:nonzero;"/>
<path d="M102.222,16.526l5.23,-0l-2.28,-2.303l5.19,-2.955l3.853,1.092l1.829,1.597l2.311,-2.348l-2.363,-2.21l-5.858,-1.503l-7.792,3.756l-0.655,2.76l0.535,2.114Z" style="fill-rule:nonzero;"/></svg>
`

function buildGeometryFromSVG(svg: string) {
  const paths = boidsSVG.split("<").reduce((acc: Vec2[][], line) => {
    const l = line.trim()
    if (!l.startsWith("path d=")) return acc

    const path = l.slice(l.indexOf('d="') + 4, l.indexOf('Z" '))
    const coords = path.split("l")

    const pts: Vec2[] = []
    const bounds: Rect = { x: 0, y: 0, w: 0, h: 0 }
    for (let i = 0; i < coords.length; i++) {
      let pt = parseToVec(coords[i])

      if (i > 0) pt = pt.add(pts[i - 1]) // relative to previous point
      pts.push(pt)

      bounds.x = Math.min(bounds.x, pt.x)
      bounds.y = Math.min(bounds.y, pt.y)
      bounds.w = Math.max(bounds.x, pt.x)
      bounds.h = Math.max(bounds.y, pt.y)
    }

    acc.push(pts)
    return acc

    function parseToVec(s: string) {
      const vals = s.split(",").map((v) => parseFloat(v))
      let v = vec2(vals[0], vals[1])
      return v
    }
  }, [])

  const bounds: Rect = { x: 0, y: 0, w: 0, h: 0 }
  paths.forEach((path) => {
    path.forEach((pt) => {
      bounds.x = Math.min(bounds.x, pt.x)
      bounds.y = Math.min(bounds.y, pt.y)
      bounds.w = Math.max(bounds.x, pt.x)
      bounds.h = Math.max(bounds.y, pt.y)
    })
  })

  function scale(v: Vec2) {
    bounds.w *= v.x
    bounds.h *= v.y
    paths.forEach((path) => {
      path.forEach((pt) => {
        pt.x *= v.x
        pt.y *= v.y
      })
    })
  }

  function offset(v: Vec2) {
    bounds.x *= v.x
    bounds.y *= v.y
    paths.forEach((path) => {
      path.forEach((pt) => {
        pt.x += v.x
        pt.y += v.y
      })
    })
  }

  function getBounds() {
    return bounds
  }

  function getPaths() {
    return paths
  }

  function reversePathPointOrder(pathIndices: number[]) {
    pathIndices.forEach((i) => {
      const p = paths[i]
      if (p) {
        p.reverse()
      }
    })
  }

  return {
    getBounds,
    getPaths,
    scale,
    offset,
    reversePathPointOrder,
  }
}

function getGeometry() {
  return buildGeometryFromSVG(boidsSVG)
}

export { getGeometry }
