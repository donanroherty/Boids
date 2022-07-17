import Icons from "./Icons"
import Tab from "./Tab"

function TabBar() {
  return (
    <div className="flex items-center w-full gap-3">
      {/* Add tab */}
      <div className="flex items-center justify-center w-5 h-5 border border-gray-300 rounded solid">
        <Icons type="add" />
      </div>

      {/* tabs */}
      <div className="flex">
        <Tab colorClass="bg-boids_blue" selected />
        <Tab colorClass="bg-boids_red" />
        <Tab colorClass="bg-boids_green" />
        <Tab colorClass="bg-boids_yellow" />
      </div>
    </div>
  )
}

export default TabBar
