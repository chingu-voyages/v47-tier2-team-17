import ToolHeading from "../components/ToolsLayout/ToolHeading";
import GoDeeper from "../components/ToolsLayout/GoDeeper";
import { OptionsBoxTable } from "../components/TableGeneratorComponents/OptionsBoxTable";
import { TableGenerator } from "../components/TableGeneratorComponents/TableGenerator";
import { useState } from "react";
import useExpander from "../hooks/useExpander";
import {
  generateMultidimensionalArray,
  generateTableCode,
} from "../components/TableGeneratorComponents/TableGeneratorFN";
import {
  ToolPreviewPane,
  ToolSection,
  ToolSectionColumns,
} from "../components/ToolsLayout/Sections";
import ToolMain from "../components/ToolsLayout/ToolMain";
import Toast from "../components/Toast";
import useToastState from "../hooks/useToastState";
import TabSwitcher from "../components/TabSwitcher";
import CodeBlock from "../components/CodeBlock";

const Table = () => {
  const [tableConfig, setTableConfig] = useState({
    dimensions: generateMultidimensionalArray(16, 3),
    verticalCellPading: 4,
    horizontalCellPading: 0,
    tableWidth: "420",
    textAlign: "center",
    borderRounding: 25,
    borderWidth: 1,
    borderStyle: "solid",
    collapse: true,
    textColor: "#000000",
    bgColor: "#F1F1F1",
    borderColor: "#000000",
    headerText: "#ffffff",
    headerBg: "#663399",
    units: {
      verticalCellPading: "px",
      horizontalCellPading: "px",
      tableWidth: "px",
      borderRounding: "px",
      borderWidth: "px",
    },
  });
  const [isExpanded, toggleIsExpanded] = useExpander();
  const toastState = useToastState();

  return (
    <ToolMain>
      <ToolHeading
        title="Table Generator"
        tagline="Output any number of rows and columns, with placeholder content and styling."
        icon="table"
      ></ToolHeading>

      <ToolSectionColumns isExpanded={isExpanded}>
        <OptionsBoxTable
          tableConfig={tableConfig}
          setTableConfig={setTableConfig}
        />

        <ToolPreviewPane toggleIsExpanded={toggleIsExpanded}>
          <div className="px-8 py-12 h-[40rem]">
            <div className="w-full h-full max-h-full overflow-auto flex items-start justify-start">
              <TableGenerator
                tableConfig={tableConfig}
                setTableConfig={setTableConfig}
              />
            </div>
          </div>
          <p className="text-center">Click on any cell’s contents to edit.</p>
        </ToolPreviewPane>
      </ToolSectionColumns>
      <ToolSection
        className=""
        title="Code Snippets"
        icon="integration_instructions"
      >
        <TabSwitcher buttons={["HTML & CSS", "Tailwind"]}>
          <CodeBlock
            title="HTML & CSS"
            toastState={toastState}
            code={generateTableCode(tableConfig)}
            lang="html"
          />

          <CodeBlock
            title="HTML & Tailwind Classes"
            toastState={toastState}
            code={generateTableCode(tableConfig, true)}
            lang="html"
          />
        </TabSwitcher>
      </ToolSection>

      <GoDeeper
        linksData={[
          {
            url: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics",
            textValue: "HTML Table Basics with MDN",
          },
          {
            url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Styling_tables",
            textValue: "Styling Tables with MDN",
          },
          {
            url: "https://www.youtube.com/watch?v=IGBRYTpgyg4",
            textValue: "HTML Tables Crash Course",
          },
        ]}
      />
      <Toast toastState={toastState} />
    </ToolMain>
  );
};

export default Table;
