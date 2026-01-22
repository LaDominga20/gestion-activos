"use client";
import { useRef, useEffect } from 'react';

interface SignatureCanvasProps {
  onSave: (dataUrl: string) => void;
  disabled?: boolean;
}

export default function SignatureCanvas({ onSave, disabled }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let isDrawing = false;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
  }, []);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if(disabled) return;
    isDrawing = true;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const rect = canvas?.getBoundingClientRect();
    if(ctx && rect) {
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const rect = canvas?.getBoundingClientRect();
    if(ctx && rect) {
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const stopDraw = () => isDrawing = false;

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    ctx?.clearRect(0, 0, canvas!.width, canvas!.height);
  };

  const save = () => {
    const canvas = canvasRef.current;
    if(canvas) onSave(canvas.toDataURL());
  };

  return (
    <div className="flex flex-col gap-2">
      <canvas 
        ref={canvasRef} 
        width={550} 
        height={150} 
        className="border-2 border-dashed border-gray-300 rounded bg-white cursor-crosshair w-full"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseOut={stopDraw}
      />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={clear} className="px-3 py-1 text-sm bg-gray-200 rounded">Borrar</button>
        <button type="button" onClick={save} className="px-3 py-1 text-sm bg-blue-600 text-white rounded">Capturar Firma</button>
      </div>
    </div>
  );
}
