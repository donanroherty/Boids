function Tooltip() {
  return (
    <div className="absolute flex justify-center w-full pointer-events-none bottom-20">
      {/* Content */}
      <div className="h-auto p-1 w-72 bg-fuchsia-300 opacity-70">
        <div>Title</div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut porttitor nisi, et
          porttitor libero.
        </div>
      </div>
    </div>
  )
}

export default Tooltip
