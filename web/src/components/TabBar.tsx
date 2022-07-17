import Tab from "./Tab"

function TabBar() {
  return (
    <div className="flex items-center w-full gap-3 bg-blue-300 opacity-25">
      {/* Add tab */}
      <div className="flex items-center justify-center w-5 h-5 bg-purple-600">
        <div>+</div>
      </div>

      {/* tabs */}
      <div className="flex">
        <Tab />
        <Tab />
        <Tab />
      </div>
    </div>
  )
}

export default TabBar
