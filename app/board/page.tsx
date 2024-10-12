'use client'
import { Button } from '@/components/ui/button'
import React, { useEffect, useRef } from 'react'

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
  const [isDrawing, setIsDrawing] = React.useState<Boolean>(false)
  const [reset, setReset] = React.useState<Boolean>(false)
  const [result, setResult] = React.useState<GeneratedResult>()
  const [dictOfVars, setDictOfVars] = React.useState<Record<string, string>>({})

  useEffect(() => {
    if (reset) {
      resetCanvas()
      setReset(false)
    }
  }, [reset])

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
        ctx.strokeStyle = '#ffffff'
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        ctx.stroke()
      }
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
      <div className="w-full h-dvh flex justify-end items-end p-8">
        <Button
          onClick={() => resetCanvas()}
          className="rounded-lg select-none"
        >
          Clear
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        id="canvas"
        className="absolute top-0 left-0 w-full h-dvh"
        onMouseDown={startDrawing}
        onMouseOut={stopDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
      />
    </>
  )
}
