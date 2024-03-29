import { useEffect, useRef, useState } from "react"

import { getHexString } from "../ColorGradient/ColorGradientUtils";
import { createColorObj, getColorString, HexToHsl } from "./ColorPickerUtils";
import switchSamplerIcon from "../../assets/switch-sampler-icon.svg"
import PickerHandles from "./PickerHandles";

export default function CustomPicker({
  colorData,
  handleColorChange,
  handleQuery,
  inputOnFocus,
  setInputOnFocus
}){

  const canvasContainerRef = useRef();
  const canvasRef = useRef();
  const markerRef = useRef();
  const intervalMouseMoveRef = useRef(null);
  const intervalMouseClickRef = useRef(null);

  const [imgFile, setImgFile] = useState(null)
  const [isColorPicker, setIsColorPicker] = useState(true)
  const [mouseCoor, setMouseCoor] = useState({x:0,y:0})
  const [currentColor, setCurrentColor] = useState(getColorString(colorData.color, 'hex'))

  useEffect(()=>{
    markerRef.current.children[0].style.background = getColorString(colorData.color,'hsl')
    canvasRef.current.currentColor = currentColor

    return ()=>{
      stopInterval(intervalMouseMoveRef)
    }
  },[mouseCoor])

  useEffect(()=>{
    
    markerRef.current.children[0].style.background = getColorString(colorData.color,'hsl')

    resizeCanvas()

    if(isColorPicker){
      createCanvasGradients()
    } else{
      createImagePicker()
    }

    if(inputOnFocus){
      calculateMarkerPositionOnColor()
    }

  },[colorData, isColorPicker, imgFile])

  useEffect(()=>{
    canvasContainerRef.current.parentElement.parentElement.parentElement.classList.remove('overflow-auto')
  },[])

  return(
    <>
    <div>
      <div ref={canvasContainerRef} className="relative">
        <canvas 
        ref={canvasRef} 
        id="color-picker"
        onDragOver={(e)=>isColorPicker?"":e.preventDefault()}
        onDrop={handleOnDrop}
        onMouseMove={(e)=>startInterval(e,handleOnMouseMove,intervalMouseMoveRef)}
        onClick={(e)=>handleClick(e,true)}
        onTouchStart={(e)=>(
          handleOnTouchMove(e,false), 
          startInterval(e,handleClick,intervalMouseClickRef))}
        onTouchMove={(e)=>(startInterval(e,handleOnTouchMove,intervalMouseMoveRef))}
        onTouchEnd={()=>(
          stopInterval(intervalMouseClickRef), 
          stopInterval(intervalMouseMoveRef), 
          handleQuery(currentColor))}
        onMouseDown={(e)=>startInterval(e,handleClick,intervalMouseClickRef)}
        onMouseUp={()=>(
          stopInterval(intervalMouseClickRef), 
          stopInterval(intervalMouseMoveRef), 
          handleQuery(currentColor))}
        className="relative z-0 w-full h-48 rounded-b-2xl touch-none"></canvas>
        <div ref={markerRef} 
        className={`
        marker z-10 absolute leading-none rounded-full border-4 outline outline-1 outline-slate-600  w-5 h-5 mt-[-11px] ml-[-8px] pointer-events-none`}>
          {createPickerMarker()}
        </div>

      </div>
    </div>
    <div className="flex self-center justify-center my-3">
      <button 
      onClick={()=>setIsColorPicker(!isColorPicker)}
      className="flex items-center content-center"><img src={switchSamplerIcon}></img><span className="block font-bold text-sm leading-0">{isColorPicker?'Sample From an Image':'Sample From Color'}</span></button>
    </div>
    <PickerHandles
    colorData={colorData}
    handleColorChange={handleColorChange}
    calculateMarkerPositionOnColor={calculateMarkerPositionOnColor}
    currentColor={currentColor}
    setCurrentColor={setCurrentColor}
    handleQuery={handleQuery}
    />
    </>
  )

  function resizeCanvas(){
    const WIDTH = canvasContainerRef.current.offsetWidth
    const HEIGHT = canvasContainerRef.current.offsetHeight

    canvasRef.current.width = WIDTH
    canvasRef.current.height = HEIGHT
  }

  function createCanvasGradients(){
    canvasRef.current.style.background = 'none'

    const colorCtx = canvasRef.current.getContext('2d');  // This create a 2D context for the canvas

    const hue = getColorString(colorData.hue, 'hsl');
    //Make HueGradient
    const gradientH = colorCtx.createLinearGradient(0, 0, colorCtx.canvas.width, 0);
    gradientH.addColorStop(0, '#fff');
    gradientH.addColorStop(1, hue);
    colorCtx.fillStyle = gradientH;
    colorCtx.fillRect(0, 0, colorCtx.canvas.width, colorCtx.canvas.height);

    // Create a Vertical Gradient(transparent to black)
    const gradientV = colorCtx.createLinearGradient(0, 0, 0, colorCtx.canvas.height);
    gradientV.addColorStop(0, 'rgba(0,0,0,0)');
    gradientV.addColorStop(1, '#000');
    colorCtx .fillStyle = gradientV;
    colorCtx .fillRect(0, 0, colorCtx.canvas.width, 
    colorCtx .canvas.height); 

  }

  function createImagePicker(){

    canvasRef.current.style.background = '#cdcdcd'
    const colorCtx = canvasRef.current.getContext('2d');

    if(!imgFile){
      
      colorCtx.font = '30pt Calibri';
      colorCtx.textAlign = 'center';
      colorCtx.fillStyle = 'blue';
      colorCtx.fillText('Drop Image Here!', colorCtx.canvas.width/2, colorCtx.canvas.height/2);
      
      return;
    }
    
    const imgWidth = imgFile.naturalWidth
    const imgHeight = imgFile.naturalHeight

    colorCtx.drawImage(imgFile, 
      imgWidth<=(colorCtx.canvas.width*.8)?
      colorCtx.canvas.width/4:0, 
      imgHeight>(colorCtx.canvas.height*1.5)?
      -colorCtx.canvas.height/3:0, 
      imgWidth>=colorCtx.canvas.width?
      colorCtx.canvas.width:imgWidth, 
      imgFile.naturalHeight
    )

  }

  function handleOnDrop(e){
    
    if(isColorPicker){
      return
    }

    e.stopPropagation()
    e.preventDefault();

    if(imgFile){
      URL.revokeObjectURL(imgFile.src)
    }

    const colorCtx = canvasRef.current.getContext('2d');
    const droppedImage = e.dataTransfer.files[0]

    if (typeof(droppedImage) === 'undefined'){
      return;
    } else if(droppedImage.type && !droppedImage.type.startsWith('image/')){
      return;
    }

    const url = URL.createObjectURL(droppedImage)
    const img = new Image()

    img.src = url
    
    img.onload = function(){
      const imgWidth = this.naturalWidth
      const imgHeight = this.naturalHeight

      colorCtx.drawImage(this, 
        imgWidth<=(colorCtx.canvas.width*.8)?
        colorCtx.canvas.width/4:0, 
        imgHeight>(colorCtx.canvas.height*1.5)?
        -colorCtx.canvas.height/3:0, 
        imgWidth>=colorCtx.canvas.width?
        colorCtx.canvas.width:imgWidth, 
        this.naturalHeight
      );
    }

    setImgFile(img)

  }

  function createPickerMarker(){
    return(
      <div className={`rounded-full border border-slate-300 w-full h-full`}></div>
    )
  }

  function handleClick(e, firstClick){

    if(!isColorPicker){
      const newColorObj = createColorObj(canvasRef.current.currentColor)

      handleColorChange(newColorObj)
      calculateMarkerPositionOnMouse()

      if(!firstClick){
        setInputOnFocus(false)
        canvasRef.current.click()
      }

      return;
    } else{
      colorData.color = HexToHsl(canvasRef.current.currentColor)

      calculateMarkerPositionOnMouse()
      handleColorChange({...colorData})
      if(!firstClick){
        setInputOnFocus(false)
        canvasRef.current.click()
      }
    }
   
  }

  function startInterval(e, func, ref){
    if (ref.current) return;
    ref.current = setInterval(() => {
      func(e)
    }, 15);
  }

  function stopInterval(ref){
    if (ref.current) {
      clearInterval(ref.current);
      ref.current = null;
    }
  }

  function handleOnMouseMove(e){

    trackColorOnMouse()
    setMouseCoor({x: e.clientX, y: e.clientY})

    function trackColorOnMouse(){
      const ColorCtx = canvasRef.current.getContext('2d')
      const canvasRect = canvasRef.current.getBoundingClientRect()

      const x = mouseCoor.x - canvasRect.left;
      const y = mouseCoor.y - canvasRect.top;

      const pixel = ColorCtx.getImageData(x,y,1,1)['data'];   // Read pixel Color
      const rgb = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
      

      setCurrentColor(getHexString(rgb))
    }
  }

  function handleOnTouchMove(e){
    setMouseCoor({x: e.changedTouches['0'].clientX, y: e.changedTouches['0'].clientY})
    trackColorOnMouse()

    function trackColorOnMouse(){
      const ColorCtx = canvasRef.current.getContext('2d')
      const canvasRect = canvasRef.current.getBoundingClientRect()

      const x = mouseCoor.x - canvasRect.left;
      const y = mouseCoor.y - canvasRect.top;

      const pixel = ColorCtx.getImageData(x,y,1,1)['data'];   // Read pixel Color
      const rgb = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
      

      setCurrentColor(getHexString(rgb))
    }
  }

  function calculateMarkerPositionOnColor(){

    let satValue = parseInt((colorData.color.s)*100)
    let lightValue = parseInt((colorData.color.l)*100)

    let x = 0
    let y = 0

    if(satValue < 50 && lightValue >= 0){
      x = satValue
      y = 100 - (lightValue)
    }else if(lightValue>=50){
      y = 0
      x = satValue
    } else if(lightValue<50){
      x = satValue
      y = 100 - (lightValue*2)
    }

    markerRef.current.style.top = `${y}%`
    markerRef.current.style.left = `${x}%`

  }

  function calculateMarkerPositionOnMouse(){
    const canvasRect = canvasRef.current.getBoundingClientRect()

    let x = parseInt(((mouseCoor.x - canvasRect.left)/canvasRef.current.offsetWidth)*100)
    let y =  parseInt(((mouseCoor.y - canvasRect.top)/canvasRef.current.offsetHeight)*100)

    if(x < 0 ){
      x=0
    }

    if(x > 100){
      x=100
    }

    if(y < 0 ){
      y=0
    }

    if(y > 100){
      y=100
    }

    markerRef.current.style.top = `${y}%`
    markerRef.current.style.left = `${x}%`
  }

}