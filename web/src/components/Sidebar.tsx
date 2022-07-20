import Combo from "./Combo"
import Icon from "./Icon"
import SettingExpander from "./SettingExpander"
import SettingsList from "./SettingsList"
import Slider from "./Slider"

function Sidebar() {
  return (
    <div className="inline-block pt-5 pb-5 pl-5">
      <div className="inline-block">
        <SettingsList icon="settings">
          <SettingExpander
            title="Optimization"
            render={(title, hovered) => {
              return (
                <div>
                  <Combo
                    defaultSelectionIdx={0}
                    options={["Spatial Hashing", "Quad Tree", "None"]}
                    hidden={hovered}
                    className="w-36"
                  />
                </div>
              )
            }}
          />
        </SettingsList>

        <div className="mt-4">
          <SettingsList icon="controller">
            <SettingExpander
              title="Num Boids"
              render={(title) => <Slider title={title} min={0} max={300} step={1} />}
            />
            <SettingExpander
              title="Vision Range"
              render={(title) => <Slider title={title} min={0} max={300} step={1} />}
            />
            <SettingExpander
              title="FOV"
              render={(title) => <Slider title={title} min={0} max={360} step={1} />}
            />
            <SettingExpander
              title="Cohesion"
              render={(title) => <Slider title={title} min={0} max={0.5} step={0.001} />}
            />
            <SettingExpander
              title="Alignment"
              render={(title) => <Slider title={title} min={0} max={2} step={0.01} />}
            />
            <SettingExpander
              title="Seperation"
              render={(title) => <Slider title={title} min={0} max={20} step={0.1} />}
            />
            <SettingExpander
              title="Seperation Dist"
              render={(title) => <Slider title={title} min={0} max={50} step={0.1} />}
            />
            <SettingExpander
              title="Predator Attack"
              render={(title) => <Slider title={title} min={0} max={1.5} step={0.1} />}
            />
            <SettingExpander
              title="Predator Avoid"
              render={(title) => <Slider title={title} min={0} max={150} step={0.1} />}
            />
            <SettingExpander
              title="Drag"
              render={(title) => <Slider title={title} min={0} max={0.2} step={0.001} />}
            />
            <SettingExpander
              title="Min Speed"
              render={(title) => <Slider title={title} min={0} max={500} step={1} />}
            />
            <SettingExpander
              title="Max Speed"
              render={(title) => <Slider title={title} min={0} max={500} step={1} />}
            />
            <SettingExpander
              title="Obstacle Avoid"
              render={(title) => <Slider title={title} min={0} max={5} step={0.01} />}
            />
            <SettingExpander
              title="Size"
              render={(title) => <Slider title={title} min={0} max={15} step={0.1} />}
            />
            <SettingExpander
              title="Flock Interactions"
              render={(title) => <Slider title={title} />}
            />
            <SettingExpander title="Debug" render={(title) => <Slider title={title} />} />
            <div className="group flex gap-2 py-0.5 text-neutral-600 hover:text-neutral-300">
              <Icon type="reset" color="boids_btn" hoverColor="boids_btn_hover" />
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
