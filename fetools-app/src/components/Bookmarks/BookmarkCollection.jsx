import { useState, useEffect } from "react";

import BookmarkCard from "./BookmarkCard";
import Icon from "../Icon";

export default function BookmarkCollection({
    bookmarks = [],
    removeBookmark = () => {},
    formatBookmarkCardStyle = () => {},
    formatBookmarkCardContents = () => {},
    formatHoverActions = () => {},
}) {
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        // Close edit mode on click out of section.
        const clickListener = (e) =>
            e.target.closest(".bookmark-collection") === null &&
            setEditMode(false);

        // Close edit mode on ESC keypress.
        const escListener = (e) => e.key === "Escape" && setEditMode(false);

        document.addEventListener("click", clickListener);
        document.addEventListener("keydown", escListener);

        return () => {
            document.removeEventListener("click", clickListener);
            document.removeEventListener("keydown", escListener);
        };
    }, []);

    return (
        <div className="bookmark-collection flex justify-end items-end flex-col">
            {bookmarks.length ? (
                <>
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="text-2xl"
                    >
                        {editMode ? (
                            <Icon name="check" />
                        ) : (
                            <Icon name="app_registration" />
                        )}
                    </button>
                    <div className="bookmark-cards-wrapper flex flex-wrap gap-4 w-full justify-start">
                        {bookmarks.map((item, idx) => {
                            if (!item) return;
                            return (
                                <BookmarkCard
                                    key={idx}
                                    idx={idx}
                                    style={formatBookmarkCardStyle(item)}
                                    removeBookmark={() =>
                                        removeBookmark(item, bookmarks)
                                    }
                                    editMode={editMode}
                                    hoverActions={formatHoverActions(item)}
                                >
                                    {formatBookmarkCardContents(item)}
                                </BookmarkCard>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className="flex justify-center w-full">
                    <p className="text-base italic">
                        Nothing to see here yet. Bookmark items above to start
                        collecting!
                    </p>
                </div>
            )}
        </div>
    );
}
