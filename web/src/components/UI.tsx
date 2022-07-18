import BoidControl from "./BoidControl"
import Button from "./Button"
import TabBar from "./TabBar"
import Tooltip from "./Tooltip"

function UI() {
  return (
    <div className="absolute grid w-full h-full grid-cols-1 grid-rows-[minmax(auto,1fr)] text-xs">
      <div className="pt-5 pb-5 pl-5">
        <div className="flex flex-col h-full gap-6 w-80">
          {/* App settings */}
          <div>
            <Button icon="settings" className="w-6 h-6" />

            <div className="flex flex-col gap-2">
              <BoidControl label="Optimization" />
            </div>
          </div>

          {/* Boid configuration */}
          <div>
            <Button icon="controller" className="w-6 h-6" />

            <div className="flex flex-col gap-2">
              <BoidControl label="Num Boids" />
              <BoidControl label="Vision Range" />
              <BoidControl label="FOV" />
              <BoidControl label="Cohesion" />
              <BoidControl label="Alignment" />
              <BoidControl label="Seperation" />
              <BoidControl label="Seperation Dist" />
              <BoidControl label="Predator Attack" />
              <BoidControl label="Predator Avoid" />
              <BoidControl label="Drag" />
              <BoidControl label="Min Speed" />
              <BoidControl label="Max Speed" />
              <BoidControl label="Obstacle Avoid" />
              <BoidControl label="Size" />
              <BoidControl label="Flock Interactions" />
              <BoidControl label="Reset" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex p-5">
        <TabBar />

        {/* Play/Pause button */}
        <Button icon="play" altIcon="pause" useAltIcon />
      </div>

      <Tooltip />
    </div>
  )
}

export default UI
