import Icon from "../Icon";

export default function NewBookmark({
    className,
    isBookmarked,
    toggleBookmark,
    toolState
}) {
    console.log("NewBookmark", isBookmarked, toolState);
    return (
        <button
            onClick={() =>(toggleBookmark(isBookmarked, toolState))}
            className={`material-symbols-rounded text-2xl w-[1.625rem] cursor-pointer hover:text-[#7F40BF] select-none ${className}`}
        >
            <Icon name={isBookmarked ? "bookmark_remove" : "bookmark_add"} />
        </button>
    );
}
