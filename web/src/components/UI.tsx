import Button from "./Button"
import TabBar from "./TabBar"
import Tooltip from "./Tooltip"
import Sidebar from "./Sidebar"

function UI() {
  return (
    <div className="absolute grid h-full w-full grid-cols-1 grid-rows-[minmax(auto,1fr)] text-xs">
      <Sidebar />
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
