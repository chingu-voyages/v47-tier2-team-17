import CopyButton from "./CopyButton";

function CodeBlock({ toastState, title, code, lang = "css" }) {
  // Function to provide the code text to the CopyButton
  const getCode = () => code.toString();

  const renderCodeWithHighlight = () => {
    if (lang === "css") {
      // Split code by lines for multiline code handling (for "position" attribute code)
      return code.split("\n").map((line, index) => {
        // Check if the line contains a colon
        if (!line.includes(":")) {
          // Render these lines without splitting
          return (
            <div key={index}>
              <span className="text-purple-800">{line}</span>
            </div>
          );
        } else {
          const [property, value] = line.split(":");
          return (
            <div key={index}>
              <span className="text-purple-800">{property}:</span>
              <span className="text-black">{value}</span>
            </div>
          );
        }
      });
    }
    // Default or when lang is 'tailwind'
    return <span className="text-black">{code}</span>;
  };

  return (
    <div className="mb-4 relative group">
      <div className="mb-2 text-sm font-bold text-black">{title}</div>
      <div className="relative rounded overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1 bg-gray-600 z-10"></div>
        <div className="p-3 bg-neutral-100 rounded relative border border-gray-300">
          <pre className="whitespace-pre-wrap overflow-x-auto">
            <code>{renderCodeWithHighlight()}</code>
          </pre>
        </div>
      </div>
      <div className="absolute top-0 right-0 mb-2 hidden group-hover:flex">
        <CopyButton onCopy={getCode} toastState={toastState} />
      </div>
    </div>
  );
}

export default CodeBlock;
