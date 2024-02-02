import { useEffect, useRef, useState } from "react"
import { getHexString } from "../ColorGradientComponents/ColorGradientUtils";

export default function CustomPicker({
  colorData,
  handleColorChange
}){

  const canvasRef = useRef();
  const intervalMouseMoveRef = useRef(null);
  const intervalMouseClickRef = useRef(null);

  const [mouseCoor, setMouseCoor] = useState({x:0,y:0})
  const [currentColor, setCurrentColor] = useState(getHexString(colorData.color))

  useEffect(()=>{
    createGradient()
    console.log(mouseCoor)

    return ()=>{
      stopInterval(intervalMouseMoveRef);
      stopInterval(intervalMouseClickRef);
    }
  },[mouseCoor])

  return(
    <>
    <div>
      <canvas 
      ref={canvasRef} 
      id="color-picker"
      onMouseMove={(e)=>startInterval(e,handleOnMouseMove,intervalMouseMoveRef)}
      onMouseDown={handleClick}
      onMouseUp={()=>stopInterval(intervalMouseClickRef)}
      onMouseLeave={()=>stopInterval(intervalMouseClickRef)}
      className="relative">
      </canvas>
    </div>  
    </>
  )

    function createGradient(){
      const ColorCtx = canvasRef.current.getContext('2d');  // This create a 2D context for the canvas

      const hue = colorData.hue;
      //Make HueGradient
      const gradientH = ColorCtx.createLinearGradient(0, 0, ColorCtx.canvas.width, 0);
      gradientH.addColorStop(0, '#fff');
      gradientH.addColorStop(1, hue);
      ColorCtx.fillStyle = gradientH;
      ColorCtx.fillRect(0, 0, ColorCtx.canvas.width, ColorCtx.canvas.height);

      // Create a Vertical Gradient(white to black)
      const gradientV = ColorCtx.createLinearGradient(0, 0, 0, ColorCtx.canvas.height);
      gradientV.addColorStop(0, 'rgba(0,0,0,0)');
      gradientV.addColorStop(1, '#000');
      ColorCtx .fillStyle = gradientV;
      ColorCtx .fillRect(0, 0, ColorCtx.canvas.width, 
      ColorCtx .canvas.height); 

    }

    function createMarker(){
    }

    function handleClick(){

      const ColorCtx = canvasRef.current.getContext('2d')
      const canvasRect = canvasRef.current.getBoundingClientRect()

      const x = mouseCoor.x - canvasRect.left;
      const y = mouseCoor.y - canvasRect.top;

      const pixel = ColorCtx.getImageData(x,y,1,1)['data'];   // Read pixel Color
      const rgb = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
      
      console.log(ColorCtx)
      console.log(x, y)
      console.log(pixel)

      colorData.color = rgb
      handleColorChange({...colorData})
    }

    function startInterval(e, func, ref){
      if (ref.current) return;
      ref.current = setInterval(() => {
        func(e)
      }, 100);
    }

    function stopInterval(ref){
      if (ref.current) {
        clearInterval(ref.current);
        ref.current = null;
      }
    }

    function handleOnMouseMove(e){
      setMouseCoor({x: e.clientX, y: e.clientY})
    }

  }