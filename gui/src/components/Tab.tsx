function Tab(props: {
  color: string
  active: boolean
  idx: number
  onTabClick: (idx: number) => void
  onTabClose: (idx: number) => void
}) {
  function handleClickTab(e: MouseEvent) {
    e.stopPropagation()
    props.onTabClick(props.idx)
  }

  function handleClickClose(e: MouseEvent) {
    e.stopPropagation()
    props.onTabClose(props.idx)
  }

  return (
    <div
      onClick={handleClickTab}
      class={`mt-auto flex w-20 select-none justify-between p-1 text-sm 
      ${props.active ? "bg-gray-100" : "bg-gray-200"} 
        rounded-tl-md rounded-tr-md rounded-bl-none rounded-br-none border-t-[1px] border-l-[1px] 
        border-r-[1px] border-b-0 border-solid border-gray-300
        `}
    >
      {/* color */}
      <div
        style={`background-color: ${props.color};`}
        class={`-left-6 my-auto h-2 w-2 rounded-sm`}
      ></div>

      {/* label */}
      <div>{props.idx + 1}</div>

      {/* close button */}
      <div
        onClick={handleClickClose}
        class={`flex h-3 w-3 items-center justify-center text-gray-300 hover:text-gray-500`}
      >
        <div class="-mt-1">x</div>
      </div>
    </div>
  )
}

export default Tab
