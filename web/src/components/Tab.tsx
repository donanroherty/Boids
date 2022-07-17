import Icons from "./Icons"

type TabProps = {
  colorClass: string
  selected?: boolean
}

function Tab(props: TabProps) {
  const { colorClass, selected } = props

  return (
    <div
      className={`flex items-center h-5 gap-2 p-1 border rounded 
      ${selected ? "border-gray-300" : "border-transparent"}`}
    >
      {/* Color label */}
      <div className={`w-20 h-3 rounded ${colorClass}`}></div>

      {/* Close button */}
      <div className="flex items-center justify-center w-2 h-full p-1">
        <Icons type="subtract" />
      </div>
    </div>
  )
}

export default Tab
