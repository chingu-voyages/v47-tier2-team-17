import { BookmarkCollection, BookmarkHoverActions } from "../Bookmarks/index";
import EyeDropButton from "../buttons/EyeDropButton";
import CopyButton from "../CopyButton";
import { ToolSection } from "../ToolsLayout/Sections";

export default function ColorGradientBookmarks({
    bookmarks,
    removeBookmark,
    toastState,
    setColorsArr,
    setInputValue,
    setGradientColors,
    inputValue,
}) {
    return (
        <ToolSection title="Your Collection" icon="bookmarks">
            <BookmarkCollection
                bookmarks={bookmarks}
                removeBookmark={removeBookmark}
                formatBookmarkCardStyle={(item) => {
                    console.log("item", item);
                    if (!item) {
                        return;
                    }
                    return {
                        background: `
                            ${item?.type}-gradient(
                            ${
                                item?.type === "radial"
                                    ? ""
                                    : `${item?.rotation}deg,`
                            } 
                            ${item?.gradientColors
                                .map((color) => color?.colorStr)
                                .join(", ")})`,
                        padding: "1rem",
                    };
                }}
                formatHoverActions={(item) => {
                    if (!item) {
                        return;
                    }
                    const newGradientCode = `
                    ${item?.type}-gradient(
                    ${item?.type === "radial" ? "" : `${item?.rotation}deg,`} 
                    ${item?.gradientColors
                        .map((color) => color?.colorStr)
                        .join(", ")})`;
                    const EyeDropAction = (
                        <EyeDropButton
                            key="EyeDropButton"
                            title={"New Gradient Set"}
                            setState={() => {
                                setColorsArr(item.gradientColors);
                                setInputValue({
                                    ...inputValue,
                                    rotation: item.rotation / 3.6,
                                    type: item.type,
                                });
                                setGradientColors(
                                    item.gradientColors.map(
                                        (paramColor, idx) => ({
                                            ...paramColor,
                                            value:
                                                idx ===
                                                item.gradientColors.length - 1
                                                    ? 100
                                                    : (100 /
                                                          (item.gradientColors
                                                              .length -
                                                              1)) *
                                                      idx,
                                        })
                                    )
                                );
                            }}
                            newValue={newGradientCode}
                            toastState={toastState}
                        />
                    );
                    const CopyAction = (
                        <CopyButton
                            key="CopyButton"
                            onCopy={() => newGradientCode}
                            toastState={toastState}
                        />
                    );
                    return (
                        <BookmarkHoverActions
                            actions={[EyeDropAction, CopyAction]}
                        ></BookmarkHoverActions>
                    );
                }}
            />
        </ToolSection>
    );
}
