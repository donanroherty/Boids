function Checkbox(props) {
  function handleClick() {
    props.setValue(!props.value)
  }

  return (
    <div class="flex">
      <div class="text-xs">{props.label}</div>

      <div
        onClick={handleClick}
        class="ml-2 flex h-4 w-4 cursor-pointer rounded-sm border-[1px] border-solid border-gray-500 bg-gray-50"
      >
        {props.value === true && (
          <div class="m-auto h-2 w-2 select-none rounded-sm border-[1px] border-gray-500 bg-gray-400"></div>
        )}
      </div>
    </div>
  )
}

export default Checkbox
