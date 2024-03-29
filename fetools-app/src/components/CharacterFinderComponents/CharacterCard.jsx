import Bookmark from "../ToolsLayout/Bookmark";

const CharacterCard = ({
  char,
  name,
  unicode,
  htmlcode,
  htmlEntity,
  cssCode,
}) => {
  return (
    <div className="p-6">
      <p className="py-4 text-6xl font-bold text-left border-b-4 border-black">
        {char}
      </p>
      <div className="flex flex-wrap">
        <div className="w-full">
          <p className="pt-2 font-bold text-left uppercase text-s">{name}</p>
        </div>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/2">
            <p className="pt-2 text-xs text-left uppercase">
              unicode:{" "}
              <span className="block font-bold uppercase">
                {unicode || " -- "}
              </span>
            </p>
          </div>

          <div className="w-full lg:w-1/2">
            <p className="pt-2 text-xs text-left uppercase">
              html code:{" "}
              <span className="block font-bold normal-case break-all">
                {htmlcode || " -- "}
              </span>
            </p>
          </div>

          <div className="w-full lg:w-1/2">
            <p className="pt-2 text-xs text-left uppercase">
              html entity:
              <span className="block font-bold normal-case">
                {htmlEntity !== undefined && htmlEntity !== ""
                  ? htmlEntity
                  : " -- "}
              </span>
            </p>
          </div>
          <div className="w-full lg:w-1/2">
            <p className="pt-2 text-xs text-left uppercase">
              css code:{" "}
              <span className="block font-bold normal-case">
                {cssCode || " -- "}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
