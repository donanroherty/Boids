import BoidControl from "./BoidControl"
import PlayPauseButton from "./PlayPauseButton"
import TabBar from "./TabBar"
import Tooltip from "./Tooltip"

function UI() {
  return (
    <div className="absolute grid w-full h-full grid-cols-1 grid-rows-[minmax(auto,1fr)] text-xs">
      <div className="pt-5 pb-5 pl-5">
        <div className="flex flex-col h-full gap-6 bg-green-400 opacity-25 w-80">
          <div>
            Settings
            <div className="flex flex-col gap-2">
              <div>Icon</div>
              <BoidControl label="Optimization" />
            </div>
          </div>
          <div>
            Controls
            <div className="flex flex-col gap-2">
              <BoidControl label="Optimization" />
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
      <div className="flex p-5">
        <TabBar />
        <PlayPauseButton />
      </div>

      <Tooltip />
    </div>
  )
}

export default UI
