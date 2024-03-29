import { ToolPreviewPane } from "../ToolsLayout/Sections";

function handlePaste(event) {
  //  Prevent the default paste action and get clipboard text
  event.preventDefault();
  const text = (event.clipboardData || window.clipboardData).getData("text");

  // Proceed only if there's a selection
  const selection = window.getSelection();
  if (!selection.rangeCount) return false;

  // Replace current selection with clipboard text
  selection.deleteFromDocument();
  const textNode = document.createTextNode(text);
  selection.getRangeAt(0).insertNode(textNode);
  selection.collapseToEnd();
}

export default function Preview({
  alertShown = false,
  gridBackgroundStyle,
  editableRef,
  cssSize,
  handleContentChange,
  isExpanded,
  toggleIsExpanded,
}) {
  return (
    <ToolPreviewPane
      isExpanded={isExpanded}
      toggleIsExpanded={toggleIsExpanded}
      expandedLayoutClasses={`h-[${cssSize}px] min-h-72`}
      columnLayoutClasses={`h-[${cssSize}px] min-h-72 lg:border-r rounded-bl-lg`}
    >
      {/* Inline Notification about Preview Limit */}

      {alertShown && (
        <div className="px-4 py-2 text-center text-yellow-800 bg-yellow-100 rounded-md">
          Preview is limited to 800px. Conversion will still be accurate above
          this value.
        </div>
      )}

      <div
        className="flex justify-center w-full h-full p-3 min-h-72 max-h-72 overflow-auto"
        style={gridBackgroundStyle}
      >
        <div
          contentEditable
          ref={editableRef}
          className="text-3xl font-bold leading-none break-words font-arial focus:outline-none max-w-full max-h-full"
          style={{
            fontSize: cssSize,
            margin: "auto",
          }}
          onInput={handleContentChange} // Update state on input
          onPaste={handlePaste}
        ></div>
      </div>
    </ToolPreviewPane>
  );
}
