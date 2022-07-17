import Icons from "./Icons"
import Tab from "./Tab"

function TabBar() {
  return (
    <div className="flex items-center w-full gap-3">
      {/* Add tab */}
      <div className="flex items-center justify-center w-5 h-5 border-gray-300 border-[.06rem] rounded-[0.3rem] solid">
        <Icons type="add" />
      </div>

      {/* tabs */}
      <div className="flex">
        <Tab />
        <Tab />
        <Tab />
        <Tab />
      </div>
    </div>
  )
}

export default TabBar
