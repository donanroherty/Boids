function Checkbox(props) {
  function handleClick() {
    if (props.disabled) return
    props.setValue(!props.value)
  }

  return (
    <div class="flex items-center ">
      <div class={`text-xs ${props.disabled && "text-gray-400"}`}>{props.label}</div>

      <div
        onClick={handleClick}
        class={`ml-2 box-border flex h-3 w-3 cursor-pointer rounded-sm border-[1px] border-solid border-gray-500 p-[0.08rem]
        ${props.disabled ? "bg-gray-200" : "bg-gray-50"}`}
      >
        {props.value === true && (
          <div class="m-auto h-full w-full select-none rounded-sm border-[1px] border-gray-500 bg-gray-400"></div>
        )}
      </div>
    </div>
  )
}

export default Checkbox
