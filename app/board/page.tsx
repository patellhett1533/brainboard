'use client'
import React, { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Colors } from '@/lib/constants/Color'
import Image from 'next/image'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'
import PenTool from '../_components/PenTool'

interface Response {
  expr: string
  result: string
  assign: string
}

interface GeneratedResult {
  expression: string
  answer: string
}
export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [color, setColor] = React.useState<string>(Colors[0])
  const [isDrawing, setIsDrawing] = React.useState<Boolean>(false)
  const [penSize, setPenSize] = React.useState<number>(12)
  const [isEraser, setIsEraser] = React.useState<Boolean>(false)
  const [eraserSize, setEraserSize] = React.useState<number>(20)
  const [result, setResult] = React.useState<GeneratedResult[]>([])
  const [dictOfVars, setDictOfVars] = React.useState<Record<string, string>>({})
  const [scale, setScale] = React.useState(1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight - canvas.offsetTop
        ctx.lineCap = 'round'
        ctx.lineWidth = penSize
      }
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.style.cursor = '#28282B'
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.beginPath()
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        setIsDrawing(true)
      }
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        if (isEraser) {
          ctx.globalCompositeOperation = 'destination-out'
          ctx.lineWidth = eraserSize
        } else {
          ctx.globalCompositeOperation = 'source-over'
          ctx.strokeStyle = color
          ctx.lineWidth = penSize
        }

        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        ctx.stroke()
      }
    }
  }

  const sendData = async () => {
    const canvas = canvasRef.current
    if (canvas) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/calculate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: canvas.toDataURL('image/png'),
            dict_of_vars: dictOfVars,
          }),
        }
      )

      const data = await response.json()
      console.log(data.data)
      data.data.forEach((element: Response) => {
        if (element.assign === 'true')
          setDictOfVars({
            ...dictOfVars,
            [element.expr]: element.result,
          })
      })

      data.data.map((element: { expr: string; solution: string }) => {
        setResult([
          ...result,
          { expression: element.expr, answer: element.solution },
        ])
      })
      resetCanvas()
    }
  }

  const resetCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  // const handleZoom = (zoomFactor: number) => {
  //   console.log('===')
  //   const newScale = scale * zoomFactor
  //   setScale(newScale)

  //   const canvas = canvasRef.current
  //   const ctx = canvas?.getContext('2d')

  //   if (canvas && ctx) {
  //     ctx.clearRect(0, 0, canvas.width, canvas.height)
  //     ctx.setTransform(newScale, 0, 0, newScale, 0, 0)

  //     ctx.fillStyle = color
  //     ctx.fillRect(10, 10, 200, 100)
  //   }
  // }

  return (
    <>
      <div className="flex items-center justify-between gap-4 py-4 px-8">
        <Button
          onClick={() => resetCanvas()}
          className="rounded-lg select-none z-20 w-fit"
        >
          Clear
        </Button>
        <PenTool
          color={color}
          isEraser={isEraser}
          penSize={penSize}
          eraserSize={eraserSize}
          setColor={setColor}
          setIsEraser={setIsEraser}
          setPenSize={setPenSize}
          setEraserSize={setEraserSize}
        />
        <Button
          onClick={() => sendData()}
          className="rounded-lg select-none z-20 w-fit"
        >
          Generate
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        id="canvas"
        className="absolute top-0 left-0 w-full h-full"
        onMouseDown={startDrawing}
        onMouseOut={stopDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
      />
      {result && (
        <div>
          {result.map((item) => (
            <div key={item.expression}>
              Q) {item.expression}
              <div>
                Ans) <BlockMath math={item.answer}></BlockMath>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* <div className="relative mt-5 z-20 flex items-center gap-4">
        <button onClick={() => handleZoom(1.1)}>Zoom In</button>
        <button onClick={() => handleZoom(0.9)}>Zoom Out</button>
      </div> */}
    </>
  )
}
