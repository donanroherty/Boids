function Tab() {
  return (
    <div className="flex items-center h-5 gap-1 p-1 outline">
      {/* Color label */}
      <div className="w-20 h-3 bg-red-500"></div>
      {/* Close button */}
      <div className="flex items-center justify-center w-2 h-full p-2 bg-blue-700">
        <div>&#65293;</div>
      </div>
    </div>
  )
}

export default Tab
