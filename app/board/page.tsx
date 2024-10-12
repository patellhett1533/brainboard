'use client'
import React, { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Colors } from '@/lib/constants/Color'

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
  const [result, setResult] = React.useState<GeneratedResult[]>([])
  const [dictOfVars, setDictOfVars] = React.useState<Record<string, string>>({})

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight - canvas.offsetTop
        ctx.lineCap = 'round'
        ctx.lineWidth = 1
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
        ctx.strokeStyle = color
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

      // const ctx = canvas.getContext('2d')
      // const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height)
      // let minX = canvas.width,
      //   minY = canvas.height,
      //   maxX = 0,
      //   maxY = 0

      // for (let y = 0; y < canvas.height; y++) {
      //   for (let x = 0; x < canvas.width; x++) {
      //     const index = (y * canvas.width + x) * 4
      //     if (imageData.data[index + 3] > 0) {
      //       if (x < minX) minX = x
      //       if (x > maxX) maxX = x
      //       if (y < minY) minY = y
      //       if (y > maxY) maxY = y
      //     }
      //   }
      // }

      // const centerX = (minX + maxX) / 2
      // const centerY = (minY + maxY) / 2

      setResult([
        ...result,
        {
          expression: data.data[0].expr,
          answer: data.data[0].result,
        },
      ])
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

  return (
    <>
      <div className="flex items-center justify-between gap-4 py-4 px-8">
        <Button
          onClick={() => resetCanvas()}
          className="rounded-lg select-none z-20 w-fit"
        >
          Clear
        </Button>
        <div className="z-20 flex items-center justify-center gap-4">
          {Colors.map((color) => (
            <div
              key={color}
              className="min-w-8 min-h-8 aspect-square rounded-full cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => setColor(color)}
            />
          ))}
        </div>
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
              {item.expression} = {item.answer}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
