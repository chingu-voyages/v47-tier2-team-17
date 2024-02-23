
import { handleOptions, hanldeColorOptions } from "./TableGeneratorFN";
import { TableInputs } from "./TableInputs";
import { ToolPane } from "../ToolsLayout/Sections";
import ColorInput from "./../InputComponents/ColorInput";
import DropdownInput from "../InputComponents/DropdownInput";
import { useRef } from "react";
import SliderInput from "../InputComponents/SliderInput";
import TabsInput from "../InputComponents/TabsInput";


export const OptionsBoxTable = ({ tableConfig, setTableConfig }) => {
  const dropdownValueRef = useRef();
  const dropDownOptions = ['px', 'em', 'rem', '%'];
  const ranges = [
    {min:0 , max: 35},
    {min:0 , max: 35},
    {min:0 , max: 35},
    {min:0 , max: 100}
  ]

  return (
    <ToolPane title="Options" icon="tune" isPrimary={true}>
      <div className="flex flex-col gap-8 text-sm font-bold md:aspect-video lg:justify-evenly">
        <section className="layout flex flex-wrap justify-between gap-y-4 [&>*]:w-[48%]">
          <h3 className="border-b pb-1 border-[#D9D9D9] text-[18px] font-semibold min-w-full">
            Layout
          </h3>

          <TableInputs
            label="Rows"
            icon="table_rows"
            range={{ min: 2, max: 50 }}
            ShowUnits={false}
            tableConfig={tableConfig}
            setTableConfig={setTableConfig}
            prop="dimensions"
            delay={true}
          />

          <TableInputs
            label="Columns"
            icon="view_week"
            range={{ min: 1, max: 50 }}
            ShowUnits={false}
            tableConfig={tableConfig}
            setTableConfig={setTableConfig}
            prop="dimensions"
            delay={true}
           
          />
          <TableInputs
            label="Vertical Cell Padding"
            icon="padding"
            range={{ min: 0, max: 100 }}
            tableConfig={tableConfig}
            setTableConfig={setTableConfig}
            prop="verticalCellPading"
            delay={true}
            rotateIcon={true}
          />

          <TableInputs
            label="Horizontal Cell Padding"
            icon="padding"
            range={{ min: 0, max: 100 }}
            tableConfig={tableConfig}
            setTableConfig={setTableConfig}
            prop="horizontalCellPading"
            
          />
          <TableInputs
            label="Table Width"
            icon="width"
            range={{ min: 0, max: 1024 }}
            tableConfig={tableConfig}
            setTableConfig={setTableConfig}
            prop="tableWidth"
          />
         

         <TabsInput
            name={"text-align"}
            title={'Text Align'}
            defaultOption={1}
            optionSize={{width: 32, height: 32}}
            options={[
              {
                iconName: 'format_align_left',
                value: 'left',
                onClick: (e) =>
                handleOptions(
                  e.target.value,
                  "textAlign",
                  tableConfig,
                  setTableConfig
                )
              },
              {
                iconName: 'format_align_center',
                value: 'center',
                onClick: (e) =>
                handleOptions(
                  e.target.value,
                  "textAlign",
                  tableConfig,
                  setTableConfig
                )
              },
              {
                iconName: 'format_align_right',
                value: 'right',
                onClick: (e) =>
                handleOptions(
                  e.target.value,
                  "textAlign",
                  tableConfig,
                  setTableConfig
                )
              },
              {
                iconName: 'format_align_justify',
                value: 'justify',
                onClick: (e) =>
                handleOptions(
                  e.target.value,
                  "textAlign",
                  tableConfig,
                  setTableConfig
                )
              }
            ]}
            borderAroundOptions={false}
          />

          <label className="my-1 flex h-full max-h-[51px] w-full flex-col gap-1 text-sm font-semibold">
            Text Alignment
            <div className="flex gap-x-2  justify-around py-2 ">
             


            </div>
          </label>

          
        </section>

        <section className="borders flex flex-wrap justify-between [&>*]:w-[48%] gap-y-4">
          <h3 className="border-b border-[#D9D9D9] pb-1 text-[18px] font-semibold min-w-full">
            Borders
          </h3>
          <TableInputs
            label="Border Rounding"
            icon="line_curve"
            range={{ min: 0, max: 100 }}
            tableConfig={tableConfig}
            setTableConfig={setTableConfig}
            prop="borderRounding"
          />
          <TableInputs
            label="Border Width"
            icon="border_all"
            range={{ min: 0, max: 10 }}
            tableConfig={tableConfig}
            setTableConfig={setTableConfig}
            prop="borderWidth"
          />
          
          <SliderInput
          ref={dropdownValueRef}
          useEffectValue={tableConfig.borderRounding}
          sliderId={"border-rounding"}
          defaultValue={tableConfig.borderRounding}
          valueTypes={dropDownOptions}
          ranges={ranges}
          step={1}
          title={'Border Rounding'}
          iconName={'line_curve'}
          onChange={(e) => {
            console.log(e.target.value)
            setTableConfig({...tableConfig, borderStyle: parseInt(e.target.value)  })}}
          />

          <div className="flex justify-start items-center">
            <DropdownInput
              ref={dropdownValueRef}
              className="flex-row items-center gap-2"
              callbackFun={() => setTableConfig({...tableConfig, "borderStyle": dropdownValueRef.current  })}
              title="Border Style:"
              dropdownOptions={[
                "solid",
                "dotted",
                "dashed",
                "double",
                "none"
              ]}
            />
          </div>

          {/* collapse btn */}
          <div className="flex gap-2 items-center justify-end">
            <strong className>Collapse Border</strong>
            <input
              defaultChecked={true}
              type="checkbox"
              className="w-6 h-6 accent-accent"
              onChange={(e) => {
                handleOptions(
                  e.target.checked,
                  "collapse",
                  tableConfig,
                  setTableConfig
                );
              }}
            />
          </div>
        </section>
        <section className="colors flex flex-wrap justify-between [&>*]:w-[48%] gap-y-4">
          <h3 className="min-w-full border-b border-[#D9D9D9] pb-1 text-[18px] font-semibold">
            Colors
          </h3>
        

          <ColorInput
            title={"Text"}
            placeholder={tableConfig.textColor}
            id="table-text-color"
            onChange={(e) => {
              hanldeColorOptions(
                e.target.value,
                tableConfig,
                setTableConfig,
                "textColor"
              );
            }}
          />

          <ColorInput
            title={"Background"}
            placeholder={tableConfig.bgColor}
            id="table-background-color"
            onChange={(e) => {
              hanldeColorOptions(
                e.target.value,
                tableConfig,
                setTableConfig,
                "bgColor"
              );
            }}
          />

          <ColorInput
            title={"Border"}
            placeholder={tableConfig.borderColor}
            id="table-border-color"
            onChange={(e) => {
              hanldeColorOptions(
                e.target.value,
                tableConfig,
                setTableConfig,
                "borderColor"
              );
            }}
          />

          <ColorInput
            title={"Header Text"}
            placeholder={tableConfig.headerText}
            value={tableConfig.headerText}
            id="table-header-text-color"
            onChange={(e) => {
              hanldeColorOptions(
                e.target.value,
                tableConfig,
                setTableConfig,
                "headerText"
              );
            }}
          />

          <ColorInput
            title={"Header Background"}
            placeholder={tableConfig.headerBg}
            value={tableConfig.headerBg}
            id="table-header-background-color"
            onChange={(e) => {
              hanldeColorOptions(
                e.target.value,
                tableConfig,
                setTableConfig,
                "headerBg"
              );
            }}
          />
        </section>
      </div>
    </ToolPane>
  );

/* TabsInput
          <TabsInput
            name={"text-align"}
            options={[
              {
                iconName: 'format_align_left',
                value: 'left',
                onClick: (e) =>
                handleOptions(
                  e.target.value,
                  "textAlign",
                  tableConfig,
                  setTableConfig
                )
              },
              {
                iconName: 'format_align_left',
                value: 'left',
                onClick: (e) =>
                handleOptions(
                  e.target.value,
                  "textAlign",
                  tableConfig,
                  setTableConfig
                )
              },
              {
                iconName: 'format_align_left',
                value: 'left',
                onClick: (e) =>
                handleOptions(
                  e.target.value,
                  "textAlign",
                  tableConfig,
                  setTableConfig
                )
              },
              {
                iconName: 'format_align_left',
                value: 'left',
                onClick: (e) =>
                handleOptions(
                  e.target.value,
                  "textAlign",
                  tableConfig,
                  setTableConfig
                )
              }
            ]}
            borderAroundOptions={false}
          />
*/

};
