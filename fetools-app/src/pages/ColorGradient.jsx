import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
    getRandomColor,
    getHexString,
    isValidHexColor,
    getRgb,
} from "../components/ColorGradient/ColorGradientUtils";

import useToastState from "../hooks/useToastState";
import useExpander from "../hooks/useExpander";
import useBookmarks from "../hooks/useBookmarks";

import ColorGradientSlider from "../components/ColorGradient/ColorGradientSlider";
import ToolHeading from "../components/ToolsLayout/ToolHeading";
import ColorGradientInterface from "../components/ColorGradient/ColorGradientInterface";
import CodeBlock from "../components/CodeBlock";
import GoDeeper from "../components/ToolsLayout/GoDeeper";
import Toast from "../components/Toast";
import {
    ToolPane,
    ToolPreviewPane,
    ToolSection,
    ToolSectionColumns,
} from "../components/ToolsLayout/Sections";

import ToolMain from "../components/ToolsLayout/ToolMain";
import TabSwitcher from "../components/TabSwitcher";
import { getColorString } from "../components/ColorPicker/ColorPickerUtils";
import ColorGradientBookmarks from "../components/ColorGradient/ColorGradientBookmarks";

export default function ColorGradient() {
    const containerRef = useRef();

    const [searchParams, setSearchParams] = useSearchParams();

    const searchParamsColors = searchParams.size !== 0 ? [] : false;

    searchParams.forEach((color) => {
        searchParamsColors.push(getRgb(color));
    });

    const [colorsArr, setColorsArr] = useState(
        searchParamsColors || [getRandomColor(), getRandomColor()]
    );

    console.log("colorsArr", colorsArr);

    const [gradientColors, setGradientColors] = useState(
        searchParams
            ? colorsArr.map((paramColor, idx) => ({
                  ...paramColor,
                  value:
                      idx === colorsArr.length - 1
                          ? 100
                          : (100 / (colorsArr.length - 1)) * idx,
              }))
            : colorsArr.map((color, idx) => ({
                  ...color,
                  value:
                      idx === colorsArr.length - 1
                          ? 100
                          : (100 / colorsArr.length - 1) * idx,
              }))
    );

    const [currentKnob, setCurrentKnob] = useState(false);

    const [inputValue, setInputValue] = useState({
        color: getHexString(gradientColors[0]?.colorStr),
        position: gradientColors[0].value,
        rotation: 25,
        type: "linear",
    });

    const [codeBlockRules, setCodeBlockRules] = useState({
        background: {
            css: `background: ${generateGradientRule(colorsArr)}`,
            tailwind: `bg-[${generateGradientRule(colorsArr)}]`,
        },
    });

    const [isExpanded, toggleIsExpanded] = useExpander();

    const toastState = useToastState();

    const [currentGradientObj, setCurrentGlobalObj] = useState({
        gradientColors: colorsArr,
        rotation: inputValue.rotation * 3.6,
        type: inputValue.type,
    });

    const [isBookmarked, bookmarks, toggleBookmark, removeBookmark] =
        useBookmarks(currentGradientObj, "gradients");

    useEffect(() => {
        if (!currentKnob) {
            setCurrentKnob(containerRef.current.querySelector(".isActive"));
        }
    }, [currentKnob]);

    useEffect(() => {
        const gradientRuleSlider = generateGradientRule(
            gradientColors,
            90,
            true
        );
        const gradientRule = generateGradientRule(gradientColors);

        updateCSSValues(".gradientSlider", "background", gradientRuleSlider);
        updateCSSValues(".gradient", "background", gradientRule);
        setCodeBlockRules({
            background: {
                css: `background: ${getCssCode()}`,
                tailwind: `bg-[${getCssCode()}]`,
            },
        });

        setCurrentGlobalObj({
            gradientColors: colorsArr,
            rotation: inputValue.rotation * 3.6,
            type: inputValue.type,
        });
    }, [inputValue, gradientColors]);

    useEffect(() => {
        handleQuery(colorsArr);

        if (currentKnob) {
            setInputValue({
                ...inputValue,
                color: getHexString(currentKnob.dataset.color),
            });
        }
    }, [colorsArr]);

    return (
        <>
            <ToolMain>
                TEST
                <ToolHeading
                    title="Gradient Maker"
                    tagline="Use this tool to create gradients for any project!"
                    icon="gradient"
                ></ToolHeading>
                <ToolSectionColumns
                    isExpanded={isExpanded}
                    reverse={false}
                    ref={containerRef}
                >
                    <ToolPreviewPane
                        isExpanded={isExpanded}
                        toggleIsExpanded={toggleIsExpanded}
                    >
                        <div
                            id="show-gradient"
                            className="gradient h-[360px] w-full min-h-64"
                        ></div>
                    </ToolPreviewPane>

                    <ToolPane
                        className="h-[360px]"
                        title="Options"
                        icon="gradient"
                        isPrimary={true}
                        isBookmarked={isBookmarked}
                        toggleBookmark={toggleBookmark}
                        toolState={currentGradientObj}
                        shareCallback={() => {}}
                    >
                        <ColorGradientSlider
                            colorsArr={colorsArr}
                            setColorsArr={setColorsArr}
                            inputValue={inputValue}
                            updateCSSValues={updateCSSValues}
                            handleColorChange={handleColorChange}
                            handleSetCurrentKnob={handleSetCurrentKnob}
                            handleSetInputValue={handleSetInputValue}
                            generateGradientRule={generateGradientRule}
                            gradientColors={gradientColors}
                            setGradientColors={setGradientColors}
                            onClickRandom={onClickRandom}
                        />
                        <ColorGradientInterface
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            handleColorInputChange={handleColorInputChange}
                            handlePositionInputChange={
                                handlePositionInputChange
                            }
                            handleRotationInputChange={
                                handleRotationInputChange
                            }
                            updateValuesOnBlur={updateValuesOnBlur}
                            gradientColors={gradientColors}
                            generateGradientRule={generateGradientRule}
                            updateCSSValues={updateCSSValues}
                            onClickRandom={onClickRandom}
                        />
                    </ToolPane>
                </ToolSectionColumns>
                <ToolSection
                    icon="integration_instructions"
                    title="Code Snippets"
                >
                    <TabSwitcher buttons={["CSS", "Tailwind"]}>
                        <CodeBlock
                            toastState={toastState}
                            title={"CSS"}
                            code={codeBlockRules.background.css}
                            lang="css"
                        />
                        <CodeBlock
                            toastState={toastState}
                            title={"Tailwind"}
                            code={codeBlockRules.background.tailwind}
                            lang="tailwind"
                        />
                    </TabSwitcher>
                </ToolSection>
                <ColorGradientBookmarks
                    bookmarks={bookmarks}
                    removeBookmark={removeBookmark}
                    setColorsArr={setColorsArr}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    setGradientColors={setGradientColors}
                    toastState={toastState}
                />
                <GoDeeper
                    linksData={[
                        {
                            url: "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient",
                            textValue: "MDN Web Docs: CSS Gradients",
                        },
                        {
                            url: "https://www.w3schools.com/css/css3_gradients.asp ",
                            textValue: "W3Schools: CSS Gradients",
                        },
                        {
                            url: "https://www.youtube.com/watch?v=4kWHW7da4U8",
                            textValue: "CSS Gradients and repeating gradients",
                        },
                    ]}
                />
                <Toast toastState={toastState} />
            </ToolMain>
        </>
    );

    function handleQuery(gradientColorsArr) {
        const colors = {};

        gradientColorsArr.forEach(({ colorStr }, idx) => {
            colors[`color${idx}`] = getColorString(colorStr, "hex").replace(
                "#",
                ""
            );
        });

        setSearchParams(colors);
    }

    function handleSetCurrentKnob(knob) {
        setCurrentKnob(knob);
    }

    function handleColorInputChange(evt) {
        const newColor = evt.target.value;

        setInputValue({ ...inputValue, color: newColor }); // Update input value

        if (isValidHexColor(newColor)) {
            handleColorChange(newColor); // Pass the new color to the parent component
        }
    }

    function handleColorChange(newColor) {
        // Assuming updatedColors is an array with two color values
        const newColorsArr = [...colorsArr];
        const newGradientColors = [...gradientColors];

        if (!currentKnob) {
            newColorsArr[0] = getRgb(newColor);
            newGradientColors[0] = { ...newColorsArr[0], value: 0 };

            setColorsArr(newColorsArr);
            setGradientColors(newGradientColors);
            return;
        }

        newColorsArr[currentKnob.id] = getRgb(newColor); // Update the color at the current knob index
        newGradientColors[currentKnob.id] = {
            ...newColorsArr[currentKnob.id],
            value: currentKnob.value,
        }; // Update the color at the current knob index
        setColorsArr(newColorsArr);
        setGradientColors(newGradientColors);
    }

    function handlePositionInputChange(evt) {
        const newValue = parseInt(evt.target.value);

        currentKnob.value = newValue;
        gradientColors[0].value = newValue;
        inputValue.position = newValue;

        setGradientColors([...gradientColors]);
    }

    function handleRotationInputChange(evt) {
        inputValue.rotation = parseInt(evt.target.value);

        setInputValue({ ...inputValue, rotation: parseInt(evt.target.value) });
    }

    function handleSetInputValue(newValues) {
        setInputValue({
            color: getHexString(newValues.color),
            position: newValues.position,
            rotation: newValues.rotation,
            type: newValues.type,
        });
    }

    function updateValuesOnBlur() {
        setInputValue({ ...inputValue });
    }

    function generateGradientRule(colorsArr, newRotation = null, isSlider) {
        const rotationValue =
            newRotation || parseInt(inputValue.rotation) * 3.6;
        const type = inputValue.type;

        const sortedColors = [...colorsArr];
        sortedColors.sort(
            ({ value: color1Value }, { value: color2Value }) =>
                color1Value - color2Value
        );

        const newColorObject = sortedColors.map(({ r, g, b, colorStr }) => ({
            r,
            g,
            b,
            colorStr,
        }));

        const isColorsArrSimilarToSorted = colorsArr.every(
            ({ colorStr }, idx) => colorStr === newColorObject[idx]?.colorStr
        );

        if (!isColorsArrSimilarToSorted) {
            setColorsArr(
                sortedColors.map(({ r, g, b, colorStr }) => ({
                    r,
                    g,
                    b,
                    colorStr,
                }))
            );
        }

        const colors = sortedColors.map(
            ({ colorStr, value }) => `${colorStr} ${value}%`
        );

        if (type === "radial" && !isSlider) {
            const gradientRule = `${type}-gradient(${colors.join(", ")})`;
            return gradientRule;
        }

        const gradientRule = `linear-gradient(${rotationValue}deg, ${colors.join(
            ", "
        )})`;

        return gradientRule;
    }

    function updateCSSValues(cssClassName, propertyName, newValue) {
        const element = containerRef.current.querySelector(cssClassName);

        element.style[propertyName] = newValue;
    }

    function onClickRandom() {
        const newColorArr = [getRandomColor(), getRandomColor()];
        setColorsArr(newColorArr);
        setGradientColors([
            {
                ...newColorArr[0],
                value: 0,
            },
            {
                ...newColorArr[1],
                value: 100,
            },
        ]);
    }

    function getCssCode() {
        const currentStyle =
            containerRef.current.querySelector(".gradient").style.background;

        return currentStyle;
    }
}
