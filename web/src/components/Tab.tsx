import Button from "./Button"

type TabProps = {
  colorClass: string
  selected?: boolean
}

function Tab(props: TabProps) {
  const { colorClass, selected } = props

  return (
    <div
      className={`flex items-center pl-1 h-5 gap  border rounded 
      ${selected ? "border-boids_btn" : "border-transparent"}`}
    >
      {/* Color label */}
      <div className={`w-20 h-3 rounded ${colorClass}`}></div>

      {/* Close button */}
      <Button icon="subtract" className="w-5 h-5" />
    </div>
  )
}

export default Tab
