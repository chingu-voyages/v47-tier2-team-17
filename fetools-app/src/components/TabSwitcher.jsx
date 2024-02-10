import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function TabSwitcher({ buttons = [], children, title }) {
  const [selectedButton, setSelectedButton] = useState(buttons[0]);
  const [displayedContent, setDisplayedContent] = useState(0);

  const radioButtons = (array) =>
    array.map((btn, idx) => (
      <label
        key={`radioBtn-${idx}`}
        id={btn}
        name="tab-switcher-buttons"
        className="font-bold text-sm leading-none"
      >
        <input
          type="radio"
          value={btn}
          checked={selectedButton === btn}
          onChange={(evt) => (
            handleOptionChange(evt), setDisplayedContent(idx)
          )}
          className="inline-block align-middle mr-1"
        />
        <p className="inline-block leading-none">{btn}</p>
      </label>
    ));

  return (
    <div id="tab-switcher" className="flex flex-col flex-1 p-3 mb-2">
      <div
        id="tab-switcher-sm"
        className={buttons.length === 0 ? "" : "max-[420px]:hidden"}
      >
        <div className="flex flex-1 justify-between ">
          <fieldset className="flex flex-wrap items-center gap-x-8 mb-3">
            {radioButtons(buttons)}
          </fieldset>
        </div>

        <div className="flex-1 flex-col">
          {children[displayedContent] || children}
        </div>
      </div>

      <div
        id="tab-switcher-mobile"
        className={buttons.length === 0 ? "hidden" : "min-[420px]:hidden"}
      >
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-bold text-3xl leading-none">
              {title}
            </AccordionTrigger>
            <AccordionContent>
              <fieldset className="flex flex-wrap items-center gap-x-8">
                {radioButtons(buttons)}
              </fieldset>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex-1 flex-col mt-3">
          {children[displayedContent] || children}
        </div>
      </div>
    </div>
  );

  function handleOptionChange(evt) {
    setSelectedButton(evt.target.value);
  }
}
