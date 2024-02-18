import { addFont, fonts, initFonts } from "./fontConfig";
import { useEffect } from "react";
import { SelectFont } from "./SelectFont";

function SelectFontFamily(props) {
  const { onChange, defaultValue, value } = props;
  useEffect(() => {
    initFonts();
  }, []);

  function handleChange(value) {
    const option = fonts.find((i) => i.path === value);
    if (option) {
      onChange && onChange(value, option);

      const { path } = option;
      addFont(path);
    }
  }

  return (
    <SelectFont
      value={value}
      isFontSelector
      option={fonts?.map((item) => ({
        id: item.path,
        name: item.name,
      }))}
      onChange={handleChange}
      defaultValue={defaultValue ?? fonts[0].path}
    />
  );
}

export default SelectFontFamily;
