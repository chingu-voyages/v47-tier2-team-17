import { useEffect } from "react";
import { createAnalogous, createComplimentary, createMonochromatic, createTriadic, getColorString } from "./ColorPickerUtils";
import CopyButton from "../CopyButton";

export default function RelatedColors({ 
    colorData 
}){

    useEffect(()=>{
    }, [colorData])

  return(
  <>
    <h2 className="text-base pb-1">Tints & Shades (Monochromatic)</h2>
    <div id="monochromatic-colors" className="grid grid-cols-11 grid-rows-1 gap-x-[10px] pb-10">
        {monochromaticPreview()}
    </div>

    <div id="other-colors" className="grid grid-cols-3 grid-rows-1 gap-x-20">
        <div className="h-60">
            <h2 className="text-base pb-1">Analogic</h2>
            <div id="analogous-colors" className="grid grid-cols-2 grid-rows-2 gap-x-3 gap-y-3 h-full">
                {analogicPreview()}
            </div>
        </div>
        <div className="h-60">
            <h2 className="text-base pb-1">Complimentary</h2>
            <div id="analogous-colors" className="grid grid-cols-2 grid-rows-2 gap-x-3 gap-y-3 h-full">
                {complimentaryPreview()}
            </div>
        </div>
        <div className="h-60">
            <h2 className="text-base pb-1">Triadic</h2>
            <div id="analogous-colors" className="grid grid-cols-2 grid-rows-2 gap-x-3 gap-y-3 h-full">
                {traidicPreview()}
            </div>
        </div>
    </div>

  </>
  );

  function monochromaticPreview(){
    const colors = createMonochromatic(colorData.color)

    const previews = colors.map((color,idx)=>{
        return(
            <div key={`mono-${idx}`} style={{backgroundColor: color}} data-color={color}
            className={`
            relative h-24 
            ${idx===0?'lg:rounded-bl-lg':''}
            ${idx===10?'lg:rounded-r-lg':''}
            `}>
                <span id="hover-buttons" className="absolute right-2 top-1 text-white">
                    <CopyButton onCopy={()=>color}></CopyButton>
                </span>
            </div>
        )
    })

    return(<>{previews}</>)
  }

  function analogicPreview(){
    const colors = createAnalogous(colorData.color)

    const previews = colors.map((color,idx)=>{
        return(
            <div key={`analogic-${idx}`} style={{backgroundColor: color}} data-color={color}
            className={`${idx===0?'rounded-tr-lg':'rounded-br-lg'}`}>
            </div>
        )
    })

    return(<>
    <div style={{backgroundColor: getColorString(colorData.color, 'hex')}}
    className="row-span-2 rounded-bl-lg">
    </div>
    {previews}
    </>)

  }

  function complimentaryPreview(){
    const complimentaryColor = createComplimentary(colorData.color)

    return(<>
    <div style={{backgroundColor: getColorString(colorData.color, 'hex')}}
    className="row-span-2 rounded-bl-lg">
    </div>
    <div style={{backgroundColor: complimentaryColor}} data-color={complimentaryColor}
    className="row-span-2 rounded-r-lg">
    </div>
    </>)

  }

  function traidicPreview(){
    const colors = createTriadic(colorData.color)

    const previews = colors.map((color,idx)=>{
        return(
            <div key={`analogic-${idx}`} style={{backgroundColor: color}} data-color={color}
            className={`${idx===0?'rounded-tr-lg':'rounded-br-lg'}`}>
            </div>
        )
    })

    return(<>
    <div style={{backgroundColor: getColorString(colorData.color, 'hex')}}
    className="row-span-2 rounded-bl-lg">
    </div>
    {previews}
    </>)

  }
}