import Button from "./Button"
import Tab from "./Tab"

function TabBar() {
  return (
    <div className="flex items-center w-full gap-3">
      {/* Add tab */}

      {/* <Icons type="plus" color="stroke-boids_muted" /> */}
      <Button icon="plus" border className="w-5 h-5" />

      {/* tabs */}
      <div className="flex gap-1">
        <Tab colorClass="bg-boids_blue" selected />
        <Tab colorClass="bg-boids_red" />
        <Tab colorClass="bg-boids_green" />
        <Tab colorClass="bg-boids_yellow" />
      </div>
    </div>
  )
}

export default TabBar
