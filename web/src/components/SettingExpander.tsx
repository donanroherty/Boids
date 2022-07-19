type SettingExpanderProps = {
  title: string
  render?: (title: string) => JSX.Element | JSX.Element[]
}

function SettingExpander(props: SettingExpanderProps) {
  const { title, render } = props

  return (
    <div
      className={`group flex gap-0 rounded-md py-0.5 font-light text-neutral-600 outline-1 outline-neutral-700
      hover:gap-1 hover:bg-neutral-800/80 hover:px-2 hover:font-bold hover:text-neutral-300 hover:outline 
      hover:backdrop-blur-[2px]`}
    >
      <div className="overflow-hidden transition-all duration-300 ease-in transit max-w-0 hover:overflow-auto group-hover:max-w-md">
        {render && render(title)}
      </div>

      <div className="overflow-hidden font-sans">
        <span className="relative transition-all -left-2 group-hover:left-0">:&nbsp;&nbsp;</span>
        <span className="relative transition-all -left-2 group-hover:left-0">{title}</span>
      </div>
    </div>
  )
}

export default SettingExpander
