import Icon from "./Icon"
import SettingExpander from "./SettingExpander"
import SettingsList from "./SettingsList"
import { boidProperties, SettingType, appProperties } from "../settings"

const AppSettings: Function = (props: { properties: SettingType[] }): JSX.Element[] => {
  return props.properties.map((p) => <SettingExpander key={p.title} property={p} />)
}
const FlockSettings: Function = (props: { properties: SettingType[] }): JSX.Element[] => {
  return props.properties.map((p) => <SettingExpander key={p.title} property={p} />)
}

function Sidebar() {
  return (
    <div className="inline-block pt-5 pb-5 pl-5">
      <div className="inline-block">
        <SettingsList icon="settings">{AppSettings({ properties: appProperties })}</SettingsList>

        <div className="mt-4">
          <SettingsList icon="controller">
            {FlockSettings({ properties: boidProperties })}

            {/* reset button */}
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
