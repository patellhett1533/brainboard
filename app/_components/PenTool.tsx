import React from 'react'
import { Colors } from '@/lib/constants/Color'
import Image from 'next/image'

type Props = {
  color: string
  isEraser: Boolean
  penSize: number
  setColor: (color: string) => void
  setIsEraser: (isEraser: Boolean) => void
  setPenSize: (penSize: number) => void
}

const PenTool = (props: Props) => {
  const [isPenActive, setIsPenActive] = React.useState(false)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10)
    props.setPenSize(newSize)
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-center gap-4">
        <div
          className={`min-w-8 max-w-8 min-h-8 max-w-8 aspect-square rounded-full cursor-pointer bg-white flex items-end justify-center z-20`}
          onClick={() => setIsPenActive(!isPenActive)}
        >
          <Image
            src="/images/pencil.svg"
            width={24}
            height={24}
            alt="eraser"
            className="w-11/12 h-11/12 object-contain"
          />
        </div>
        <div
          className={`min-w-8 max-w-8 min-h-8 max-w-8 aspect-square rounded-full cursor-pointer bg-white z-20`}
          onClick={() => props.setIsEraser(!props.isEraser)}
        >
          <Image
            src="/images/eraser.svg"
            width={24}
            height={24}
            alt="eraser"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      {isPenActive && (
        <div className="absolute left-1/2 -translate-x-1/2 z-20 translate-y-5 bg-[#FAF9F6] px-8 py-4 rounded-2xl">
          <div className="z-20 grid grid-cols-3 gap-4 w-36">
            {Colors.map((isColor, index) => (
              <div
                key={index}
                className={`w-8 h-8 p-0.5 flex items-center justify-center rounded-full ${isColor === props.color ? 'border-2' : ''}`}
                style={{ borderColor: isColor }}
              >
                <div
                  className={`aspect-square rounded-full cursor-pointer`}
                  style={{
                    backgroundColor: isColor,
                    width:
                      isColor === props.color
                        ? props.penSize * 4 + '%'
                        : '24px',
                    height:
                      isColor === props.color
                        ? props.penSize * 4 + '%'
                        : '24px',
                  }}
                  onClick={() => {
                    props.setColor(isColor)
                    props.setIsEraser(false)
                    setIsPenActive(false)
                  }}
                />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <input
              type="range"
              min="1"
              max="25"
              value={props.penSize}
              onChange={handleSliderChange}
              style={{
                WebkitAppearance: 'none',
                width: '100%',
                height: '5px',
                background: '#2C2C2C',
                borderRadius: '5px',
                outline: 'none',
                opacity: 0.7,
                transition: 'opacity 0.2s',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default PenTool
