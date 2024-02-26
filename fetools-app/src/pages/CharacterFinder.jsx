import "../index.css";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import SearchField from "../components/SearchField";
import ToolHeading from "../components/ToolsLayout/ToolHeading";
import CharacterCategoryTab from "../components/CharacterFinderComponents/CharacterCategoryTab";
import htmlCharacters from "../components/CharacterFinderComponents/htmlCharacters.json";
import GoDeeper from "../components/ToolsLayout/GoDeeper";
import CharacterCard from "../components/CharacterFinderComponents/CharacterCard";

import ToolMain from "../components/ToolsLayout/ToolMain";
import { ToolSection } from "../components/ToolsLayout/Sections";

function CharacterFinder() {
  const [selectedCategory, setSelectedCategory] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(16);
  const [clearInput, setClearInput] = useState(false);


  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const displayCharacters = (category) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setSearchResults([]);
    setCurrentPage(0);
    setClearInput(true);
  };

  useEffect(() => {
    if (clearInput) {
      const timer = setTimeout(() => {
        setClearInput(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [clearInput]);

  const removeLetterVariations = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const handleSearchChange = (query) => {
    query = query.toLowerCase();

    if (query.startsWith("-")) {
      setSearchQuery(query);
      setCurrentPage(0);
      const actualHyphenSearch = Object.values(htmlCharacters).flatMap(
        (category) =>
          category.filter((character) =>
            character.name.toLowerCase().includes("hyphen")
          )
      );

      setSearchResults(actualHyphenSearch);
      return;
    }

    setSearchQuery((query = query.replace(/-/g, " ")));
    setCurrentPage(0);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    updateSearchResults(query);
  };

  const updateSearchResults = (query) => {
    const replaceDash = (character) => ({
      ...character,
      name: character.name.replace(/-/g, " "),
    });

    const allCharacterArrays = [
      ...htmlCharacters.letters.map(replaceDash),
      ...htmlCharacters.punctuation.map(replaceDash),
      ...htmlCharacters.numbers.map(replaceDash),
      ...htmlCharacters.math.map(replaceDash),
      ...htmlCharacters.currency.map(replaceDash),
      ...htmlCharacters.arrows.map(replaceDash),
      ...htmlCharacters.symbols.map(replaceDash),
      ...htmlCharacters.emojis.map((character) => ({
        ...replaceDash(character),
        unicode:
          character.unicode && character.unicode.startsWith("U+")
            ? character.unicode
            : "U+" + character.unicode,
      })),
    ];

    let filteredResults;

    if (query.length === 1) {
      filteredResults = allCharacterArrays.filter(
        (character) =>
          character.character.toLowerCase() === query ||
          removeLetterVariations(character.character.toLowerCase()) ===
            removeLetterVariations(query) ||
          character.entity?.toLowerCase() === query ||
          character.hex?.toLowerCase() === query ||
          character.unicode?.toLowerCase() === query ||
          character.css?.toLowerCase() === query ||
          character.css?.toLowerCase() === "\\" + query
      );

      if (filteredResults.length === 0) {
        filteredResults = allCharacterArrays.filter((character) => {
          const name = character.name.toLowerCase();
          return name.includes(` ${query}`) || name.startsWith(`${query} `);
        });
      }
    } else {
      filteredResults = allCharacterArrays.filter(
        (character) =>
          character.name.toLowerCase().includes(query) ||
          removeLetterVariations(character.name.toLowerCase()).includes(
            removeLetterVariations(query)
          ) ||
          character.entity?.toLowerCase().includes(query) ||
          character.hex?.toLowerCase().includes(query) ||
          character.unicode?.toLowerCase().includes(query) ||
          character.css?.toLowerCase().includes(query)
      );
    }

    setSearchResults(filteredResults);
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const categoryData = searchQuery
    ? searchResults
    : selectedCategory === "collection"
    ? getBookmarkCollection()?getBookmarkCollection():[] // TODO - Read out collection from local storage.
    : htmlCharacters[selectedCategory];

  const currentCategoryData = categoryData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const categories = [
    {
      name: "popular",
      displayName: "Popular",
      icon: "star",
      iconType: "material",
    },
    { name: "letters", displayName: "Letters", icon: "Ü" },
    { name: "punctuation", displayName: "Punctuation", icon: "%" },
    { name: "numbers", displayName: "Numbers", icon: "①" },
    { name: "math", displayName: "Math", icon: "÷" },
    { name: "currency", displayName: "Currency", icon: "€" },
    { name: "arrows", displayName: "Arrows", icon: "→" },
    { name: "symbols", displayName: "Symbols", icon: "§" },
    {
      name: "emojis",
      displayName: "Emoji",
      icon: "mood",
      iconType: "material",
    },
    { name: "collection", displayName: "Collection", icon: "☲" },
  ];

  const selectedCategoryObj = categories.find(
    (category) => category.name === selectedCategory
  );

  const categoryTabs = categories.map((category) => (
    <CharacterCategoryTab
      key={category.name}
      category={category.name}
      categoryDisplayName={category.displayName}
      icon={category.icon}
      iconType={category.iconType ? category.iconType : "char"}
      selectCategory={displayCharacters}
      active={!searchQuery && category.name === selectedCategory}
    />
  ));

  return (
    <ToolMain>
      <ToolHeading
        title="Character Finder"
        tagline="Look up characters, symbols, HTML entities, and CSS codes."
        icon="Ampersand"
        iconType="svg"
      />
      <div className="container">
        <SearchField
          placeholderText={"Search"}
          search={handleSearchChange}
          clearInput={clearInput}
        />
      </div>

      <div className="container flex flex-wrap justify-between px-5 sm:px-8 gap-y-3">
        {categoryTabs}
      </div>

      <ToolSection
        title={searchQuery ? searchQuery : selectedCategoryObj.displayName}
        icon={searchQuery ? "search" : selectedCategoryObj.icon}
        iconType={
          searchQuery
            ? "material"
            : selectedCategoryObj.iconType
            ? selectedCategoryObj.iconType
            : "char"
        }
      >
        {}

        <div className="grid w-full grid-cols-4">
          {currentCategoryData.map((character, index) => (
            <CharacterCard
              key={index}
              character={character}
              char={character.character}
              name={character.name}
              unicode={
                character.unicode.startsWith("U+")
                  ? character.unicode
                  : "U+" + character.unicode
              }
              htmlcode={character.hex}
              htmlEntity={character.entity}
              cssCode={character.css}
            />
          ))}

        </div>
        <div className="flex justify-center p-6">
          <ReactPaginate
            pageCount={Math.ceil(categoryData.length / itemsPerPage)}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            previousLabel={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            }
            nextLabel={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            }
            breakLabel={"..."}
            onPageChange={handlePageClick}
            containerClassName={"pagination flex"}
            activeClassName={"bg-gray-200"}
            previousClassName={"mr-2 px-4 py-2"}
            nextClassName={"ml-2 px-4 py-2"}
            pageClassName={"mr-2 px-4 py-2"}
            breakClassName={"mr-2 px-4 py-2"}
            forcePage={currentPage}
          />
        </div>
      </ToolSection>

      <GoDeeper
        linksData={[
          {
            url: "https://developer.mozilla.org/en-US/docs/Glossary/Entity",
            textValue: "All about entities at MDN",
          },
          {
            url: "https://deliciousbrains.com/how-unicode-works/",
            textValue: "How Unicode works at Delicious Brain",
          },
          {
            url: "https://daily-dev-tips.com/posts/tailwind-css-pseudo-elements/",
            textValue:
              "Seeing special characters in pseudo-elements with Tailwind CSS",
          },
        ]}
      />
    </ToolMain>
  );

  function getBookmarkCollection(){
    console.log(JSON.parse(localStorage.getItem(`characters-bookmarks`)))
    return JSON.parse(localStorage.getItem(`characters-bookmarks`))
  }
}

export default CharacterFinder;
