import Icon from "./Icon"
import SettingExpander from "./SettingExpander"
import SettingsList from "./SettingsList"
import Slider from "./Slider"
import Checkbox from "./Checkbox"
import Combo from "./Combo"
import useFlockConfig from "../hooks/flockConfig"
import useAppConfig from "../hooks/appConfig"
import { BoidsApp } from "@boids/lib/src/app"
import { BoidSearchOpt } from "@boids/lib/src/types"

type SidebarProps = {
  selectedFlock: number
  boidsApp: BoidsApp
}

function Sidebar(props: SidebarProps) {
  const { selectedFlock, boidsApp } = props

  const appCfg = useAppConfig(boidsApp)
  const flockCfg = useFlockConfig(boidsApp, selectedFlock)

  return (
    <div className="inline-block pt-5 pb-5 pl-5">
      <div className="inline-block">
        <SettingsList icon="settings">
          <SettingExpander
            title="Boid Search Optimization"
            content={(hovered, unhover) => {
              return (
                <>
                  <Combo
                    options={["Spatial Hash", "Quad Tree", "None"]}
                    hidden={!hovered}
                    onSelection={unhover}
                    value={appCfg.boidSearchOptimization}
                    setValue={(val: string) =>
                      appCfg.setBoidSearchOptimization(val as BoidSearchOpt)
                    }
                  />
                  Draw
                  <Checkbox
                    checked={appCfg.drawBoidSearchOptimization}
                    setChecked={appCfg.setDrawBoidSearchOptimization}
                  />
                </>
              )
            }}
          />

          <SettingExpander
            title="Collider Optimization"
            content={(hovered, unhover) => {
              return (
                <>
                  Draw
                  <Checkbox
                    checked={appCfg.drawColliderSearchOptimization}
                    setChecked={appCfg.setDrawColliderOptimization}
                  />
                </>
              )
            }}
          />
        </SettingsList>

        <div className="mt-4">
          <SettingsList icon="controller">
            <SettingExpander
              title="Num Boids"
              content={() => {
                return (
                  <Slider
                    min={0}
                    max={300}
                    step={1}
                    value={flockCfg.numBoids}
                    setValue={flockCfg.setNumBoids}
                  />
                )
              }}
            />

            <SettingExpander
              title="Vision Range"
              content={() => {
                return (
                  <>
                    <Slider
                      min={0}
                      max={300}
                      step={1}
                      value={flockCfg.visionRange}
                      setValue={flockCfg.setVisionRange}
                    />
                    Draw
                    <Checkbox checked={flockCfg.drawDebug} setChecked={flockCfg.setDrawDebug} />
                  </>
                )
              }}
            />

            <SettingExpander
              title="Field Of View"
              content={() => {
                return (
                  <>
                    <Slider
                      min={0}
                      max={360}
                      step={1}
                      value={flockCfg.fov}
                      setValue={flockCfg.setFOV}
                    />
                    Draw
                    <Checkbox checked={flockCfg.drawDebug} setChecked={flockCfg.setDrawDebug} />
                  </>
                )
              }}
            />

            <SettingExpander
              title="Cohesion"
              content={() => {
                return (
                  <Slider
                    min={0}
                    max={0.5}
                    step={0.001}
                    value={flockCfg.cohesion}
                    setValue={flockCfg.setCohesion}
                  />
                )
              }}
            />

            <SettingExpander
              title="Alignment"
              content={() => {
                return (
                  <Slider
                    min={0}
                    max={2}
                    step={0.01}
                    value={flockCfg.alignment}
                    setValue={flockCfg.setAlignment}
                  />
                )
              }}
            />

            <SettingExpander
              title="Separation"
              content={() => {
                return (
                  <>
                    Force
                    <Slider
                      min={0}
                      max={20}
                      step={0.1}
                      value={flockCfg.separation}
                      setValue={flockCfg.setSeparation}
                    />
                    Range
                    <Slider
                      min={0}
                      max={50}
                      step={0.1}
                      value={flockCfg.separationRange}
                      setValue={flockCfg.setSeparationRange}
                    />
                  </>
                )
              }}
            />

            <SettingExpander
              title="Predator Attack"
              content={() => {
                return (
                  <Slider
                    min={0}
                    max={2}
                    step={0.1}
                    value={flockCfg.predatorAttack}
                    setValue={flockCfg.setPredatorAttack}
                  />
                )
              }}
            />

            <SettingExpander
              title="Predator Avoidancs"
              content={() => {
                return (
                  <Slider
                    min={0}
                    max={150}
                    step={0.1}
                    value={flockCfg.predatorAvoid}
                    setValue={flockCfg.setPredatorAvoid}
                  />
                )
              }}
            />

            <SettingExpander
              title="Drag"
              content={() => {
                return (
                  <Slider
                    min={0}
                    max={0.2}
                    step={0.001}
                    value={flockCfg.drag}
                    setValue={flockCfg.setDrag}
                  />
                )
              }}
            />

            <SettingExpander
              title="Min Speed"
              content={() => {
                return (
                  <Slider
                    min={0}
                    max={500}
                    step={1}
                    value={flockCfg.minSpeed}
                    setValue={flockCfg.setMinSpeed}
                  />
                )
              }}
            />

            <SettingExpander
              title="Max Speed"
              content={() => {
                return (
                  <Slider
                    min={0}
                    max={500}
                    step={1}
                    value={flockCfg.maxSpeed}
                    setValue={flockCfg.setMaxSpeed}
                  />
                )
              }}
            />

            <SettingExpander
              title="Obstacle Avoidance"
              content={() => {
                return (
                  <Slider
                    min={0}
                    max={5}
                    step={0.1}
                    value={flockCfg.obstacleAvoid}
                    setValue={flockCfg.setObstacleAvoid}
                  />
                )
              }}
            />

            <SettingExpander
              title="Size"
              content={() => {
                return (
                  <Slider
                    min={0}
                    max={15}
                    step={0.1}
                    value={flockCfg.size}
                    setValue={flockCfg.setSize}
                  />
                )
              }}
            />

            <SettingExpander
              title="Flock Interactions"
              content={() => {
                return (
                  <>
                    Predator
                    <Checkbox checked={flockCfg.isPredator} setChecked={flockCfg.setIsPredator} />
                    Cohesion
                    <Checkbox
                      checked={flockCfg.cohesionInteraction}
                      setChecked={flockCfg.setCohesionInteraction}
                    />
                    Alignment
                    <Checkbox
                      checked={flockCfg.alignmentInteraction}
                      setChecked={flockCfg.setAlignmentInteraction}
                    />
                    Separation
                    <Checkbox
                      checked={flockCfg.separationInteraction}
                      setChecked={flockCfg.setSeparationInteraction}
                    />
                  </>
                )
              }}
            />

            {/* reset button */}
            <div
              className="group flex gap-2 py-0.5 text-neutral-600 hover:text-neutral-300"
              onClick={flockCfg.reset}
            >
              <Icon
                type="reset"
                color="boids_btn"
                hoverColor="boids_btn_hover"
                className="w-4 h-4"
              />

              <div className="text-neutral-600 group-hover:text-neutral-300">
                <div className="font-sans">Reset</div>
              </div>
            </div>
          </SettingsList>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
