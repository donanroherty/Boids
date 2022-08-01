import { FlockSetting, AppSetting } from "@boids/boids"

export type SettingType = {
  title: string
  description: string
  controls: Control[]
}

export type Control = {
  id: FlockSetting | AppSetting
  label?: string
  type: "slider" | "checkbox" | "combo"
  properties: SliderProperties | CheckboxProperties | ComboProperties
  className?: string
}

export type SliderProperties = {
  default: number
  min: number
  max: number
  step: number
}

export type CheckboxProperties = {
  default: boolean
}

export type ComboProperties = {
  options: string[]
  optionDescriptions: string[]
  default: number
}

const appProperties: SettingType[] = [
  {
    title: "Boid Search Optimization",
    description: "",
    controls: [
      {
        id: AppSetting.BoidSearchOptimization,
        type: "combo",
        properties: {
          options: ["Spatial Hash", "Quad Tree", "None"],
          optionDescriptions: ["", "", ""],
          default: 1,
        },
      },
    ],
  },
  {
    title: "Collider Optimization",
    description: "",
    controls: [
      {
        id: AppSetting.ColliderSearchOptimization,
        type: "combo",
        properties: {
          options: ["Spatial Hash", "None"],
          optionDescriptions: ["", ""],
          default: 1,
        },
      },
    ],
  },
]

const boidProperties: SettingType[] = [
  {
    title: "Num Boids",
    description: "",
    controls: [
      {
        id: FlockSetting.NumBoids,
        type: "slider",
        properties: {
          default: 50,
          min: 0,
          max: 300,
          step: 1,
        } as SliderProperties,
      },
    ],
  },
  {
    title: "Vision Range",
    description: "",
    controls: [
      {
        id: FlockSetting.VisionRange,
        type: "slider",
        properties: {
          default: 50,
          min: 0,
          max: 300,
          step: 1,
        } as SliderProperties,
      },
    ],
  },
  {
    title: "Field Of View",
    description: "",
    controls: [
      {
        id: FlockSetting.FOV,
        type: "slider",
        properties: {
          default: 340,
          min: 0,
          max: 360,
          step: 1,
        } as SliderProperties,
      },
    ],
  },
  {
    title: "Cohesion",
    description: "",
    controls: [
      {
        id: FlockSetting.Cohesion,
        type: "slider",
        properties: {
          default: 0.2,
          min: 0,
          max: 0.5,
          step: 0.001,
        } as SliderProperties,
      },
    ],
  },
  {
    title: "Alignment",
    description: "",
    controls: [
      {
        id: FlockSetting.Alignment,
        type: "slider",
        properties: {
          default: 0.3,
          min: 0,
          max: 2,
          step: 0.01,
        } as SliderProperties,
      },
    ],
  },
  {
    title: "Seperation",
    description: "",
    controls: [
      {
        id: FlockSetting.Seperation,
        type: "slider",
        properties: {
          default: 10,
          min: 0,
          max: 20,
          step: 0.1,
        } as SliderProperties,
      },
      {
        label: "Range",
        id: FlockSetting.SeperationRange,
        type: "slider",
        properties: {
          default: 30,
          min: 0,
          max: 50,
          step: 0.1,
        } as SliderProperties,
        className: "w-20",
      },
    ],
  },
  {
    title: "Predator Attack",
    description: "",
    controls: [
      {
        id: FlockSetting.PredatorAttack,
        type: "slider",
        properties: {
          default: 0.9,
          min: 0,
          max: 2,
          step: 0.1,
        } as SliderProperties,
      },
    ],
  },
  {
    title: "Predator Avoid",
    description: "",
    controls: [
      {
        id: FlockSetting.PredatorAvoid,
        type: "slider",
        properties: {
          default: 40,
          min: 0,
          max: 150,
          step: 1,
        } as SliderProperties,
      },
    ],
  },
  {
    title: "Drag",
    description: "",
    controls: [
      {
        id: FlockSetting.Drag,
        type: "slider",
        properties: {
          default: 0.01,
          min: 0,
          max: 0.2,
          step: 0.001,
        } as SliderProperties,
      },
    ],
  },
  {
    title: "Min Speed",
    description: "",
    controls: [
      {
        id: FlockSetting.MinSpeed,
        type: "slider",
        properties: {
          default: 50,
          min: 0,
          max: 500,
          step: 1,
        } as SliderProperties,
      },
    ],
  },
  {
    title: "Max Speed",
    description: "",
    controls: [
      {
        id: FlockSetting.MaxSpeed,
        type: "slider",
        properties: {
          default: 150,
          min: 0,
          max: 500,
          step: 1,
        } as SliderProperties,
      },
    ],
  },
  {
    title: "Obstacle Avoid",
    description: "",
    controls: [
      {
        id: FlockSetting.ObstacleAvoid,
        type: "slider",
        properties: {
          default: 5,
          min: 0,
          max: 5,
          step: 0.01,
        } as SliderProperties,
      },
    ],
  },
  {
    title: "Size",
    description: "",
    controls: [
      {
        id: FlockSetting.Size,
        type: "slider",
        properties: {
          default: 5,
          min: 0,
          max: 15,
          step: 0.1,
        } as SliderProperties,
      },
    ],
  },
  {
    title: "Flock Interactions",
    description: "",
    controls: [
      {
        id: FlockSetting.PredatorInteraction,
        type: "checkbox",
        label: "Predator",
        properties: {
          default: false,
        } as CheckboxProperties,
      },
      {
        id: FlockSetting.CohesionInteraction,
        type: "checkbox",
        label: "Cohesion",
        properties: {
          default: false,
        } as CheckboxProperties,
      },
      {
        id: FlockSetting.AlignmentInteraction,
        type: "checkbox",
        label: "Alignment",
        properties: {
          default: false,
        } as CheckboxProperties,
      },
      {
        id: FlockSetting.SeperationInteraction,
        type: "checkbox",
        label: "Seperation",
        properties: {
          default: true,
        } as CheckboxProperties,
      },
    ],
  },
]

export { appProperties, boidProperties }
