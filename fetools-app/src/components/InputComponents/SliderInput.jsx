import { forwardRef, useEffect, useState} from "react";
import Icon from "../Icon";

const SliderInput = forwardRef(function SliderInput(props, ref) {
  const {
    sliderId,
    defaultValue,
    valueTypes,
    ranges,
    step,
    className,
    title,
    titleClassName,
    iconName,
    onChange,
    onClickFn = null,
    customPreviewValue
  } = props;


  
  const [activeIndex, setActiveIndex] = useState(0)
  const [openMenu, setOpenMenu] = useState(false)
 
  useEffect(()=>{
    const inputElement = document.querySelector(`#${sliderId}-input #custom-slider-input`)

    inputElement.value = defaultValue
  },[defaultValue])

  useEffect(()=>{
    if(ref){
      ref.current = valueTypes[activeIndex]
      
    }
  },[activeIndex])

  return (
    <div
    id={`${sliderId}-input`}
    className={
      className
        ? `flex pointer-events-none z-0 justify-center text-sm ${className}`
        : `flex pointer-events-none flex-col z-0 justify-center text-sm`
    }
    >
      {title
      ?
      <h2 className={`relative  w-fit font-bold text-sm${titleClassName || ''}`}>
        {title}
      </h2>
      :null}
      <div className="relative flex w-full h-10 items-center">
        <Icon name={iconName} className="block "/>
        <span className="block text-right font-bold min-w-12">
          <span className={`${valueTypes.length===1?'':'pr-3'}`}>{customPreviewValue||defaultValue}</span>
          <span className={`pl-1 ${valueTypes.length===1?'':'hidden'}`}>{valueTypes[activeIndex]}</span>
        </span>
        <label id={`slider-${sliderId}`} className="w-full pl-1">
        <input
            id="custom-slider-input"
            min={ranges[activeIndex].min}
            max={ranges[activeIndex].max}
            step={Array.isArray(step)?step[activeIndex]:step}
            defaultValue={defaultValue}
            onChange={onChange}
            type="range"
            className="pointer-events-auto block w-full accent-[#222222]"
          />
        </label>
        <span className={
        `relative cursor-pointer z-10 flex min-w-12 items-center pointer-events-auto ${valueTypes.length===1?'hidden':''}`
        }
        onClick={()=> setOpenMenu(!openMenu)}
        onMouseLeave={()=>setOpenMenu(false)}>
            <span className="block min-w-7 text-center font-bold">{valueTypes[activeIndex]}</span>
            <span
            className="flex w-full overflow-hidden">
              <Icon name={`keyboard_arrow_${!openMenu?'down':'up'}`} size="24" 
              className="block font-bold self-end cursor-pointer text-black" 
              ></Icon>
              <ul id="value-types-menu" className={`absolute pointer-events-auto z-40 left-1 top-[100%] border-black  border-t-2 w-12 bg-white ${!openMenu?'hidden':''}`}>
                {getValueTypesList()}
              </ul>
            </span>
        </span>
      </div>
    </div>
  );

  function getValueTypesList(){
    const types = valueTypes.map((type,idx)=>{
      if(idx===activeIndex){return}
      return <li key={`type-${idx}`} onClick={(e)=> {setActiveIndex(idx), onClickFn(e) ;} } 
      className={`font-bold border-b-2 border-black cursor-pointer hover:text-[#7F40BF]`}>{type}</li>
    })
    return(<>{types}</>)
  }
});

export default SliderInput;
