import { useRef, useEffect } from "react"

type SliderProps = {
  title: string
  thumbSize?: number
  min?: number
  max?: number
  value?: number
  setValue?: (val: number) => void
  className?: string
}

function Slider(props: SliderProps) {
  const {
    title = "slider",
    min = 0,
    max = 100,
    value = 35,
    setValue = (val: number) => {},
    thumbSize = 12,
    className = "",
  } = props

  const track = useRef<HTMLDivElement>(null)
  const thumb = useRef<HTMLDivElement>(null)
  const pointerX = useRef(0)
  const pointerY = useRef(0)
  const pointerDown = useRef(false)

  useEffect(() => {
    document.addEventListener("pointermove", handlePointerMove)
    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("pointerup", handlePointerUp)
    return () => {
      document.removeEventListener("pointermove", handlePointerMove)
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("pointerup", handlePointerUp)
    }
  })

  function getThumbSize() {
    if (!thumb.current) return undefined
    const x = thumb.current.clientWidth
    const y = thumb.current.clientHeight
    return { x, y }
  }

  function getTrackWidth() {
    if (!track.current) return undefined
    return { w: track.current.clientWidth }
  }

  function handlePointerDown(event: PointerEvent) {}

  function handlePointerDownTrack(event: React.PointerEvent<HTMLDivElement>) {
    pointerDown.current = true
    if (!thumb.current || !track.current || event.target !== track.current) return

    const pos = mapPointerXToBounds(event.pageX, track.current, thumb.current)
    setThumbPosition(pos)
  }

  function handlePointerUp(event: PointerEvent) {
    pointerDown.current = false
  }

  function handlePointerMove(event: PointerEvent) {
    pointerX.current = event.x
    pointerY.current = event.y

    if (!pointerDown.current || !thumb.current || !track.current) return

    const alpha = mapPointerXToBounds(pointerX.current, track.current, thumb.current)
    setThumbPosition(alpha)
  }

  function mapPointerXToBounds(ptrX: number, track: HTMLElement, thumb: HTMLElement) {
    const trackBounds = track.getBoundingClientRect()
    const thumbBounds = thumb.getBoundingClientRect()
    const trackStart = trackBounds.x + thumbBounds.width * 0.5
    let clickLeft = ptrX - trackStart
    let perc = clickLeft / (trackBounds.width - thumbBounds.width)
    return Math.max(0, Math.min(1, perc))
  }

  function setThumbPosition(alpha: number) {
    if (!thumb.current || !track.current) return
    const trackBounds = track.current.getBoundingClientRect()
    const thumbBounds = thumb.current.getBoundingClientRect()
    const trackLen = trackBounds.width - thumbBounds.width
    const posX = trackLen * alpha
    thumb.current.style.left = `${posX}px`
  }

  return (
    <div className={`${className} flex w-36 items-center outline-dotted`}>
      {/* Track container */}
      <div
        ref={track}
        onPointerDown={handlePointerDownTrack}
        className="flex items-center w-full h-3 outline-dashed"
      >
        {/* Track visual */}
        <div className="pointer-events-none h-[1px] w-full rounded-sm bg-[#0C8CE9]"></div>
      </div>

      {/* Thumb */}
      <div
        ref={thumb}
        className="pointer-events-none absolute h-3 w-3 rounded-full border border-solid border-boids_btn border-[#0C8CE9] bg-[#2C2C2C]"
      ></div>
    </div>
  )
}

export default Slider
