import React from "react"
import { useState } from "react"

type TooltipProps = {
  title?: string
  content?: string
}

function Tooltip(props: TooltipProps) {
  const {
    title = "Title",
    content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut porttitor nisi, et porttitor libero.",
  } = props

  const [visible, setVisible] = useState(false)

  return (
    <>
      {visible && (
        <div className="absolute flex justify-center w-full pointer-events-none bottom-20 text-[#D9D9D9]">
          {/* Content */}
          <div className="flex flex-col h-auto p-1 w-72 bg-[#444444] border-[1px] border-[#545353] rounded-md opacity-70">
            <div className="w-full font-bold text-center">{title}</div>
            <div className="w-full">{content}</div>
          </div>
        </div>
      )}
    </>
  )
}

export default Tooltip
