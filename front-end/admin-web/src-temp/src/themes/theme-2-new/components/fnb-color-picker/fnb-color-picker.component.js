import { useEffect, useState, useRef } from "react";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";
import useOnclickOutside from "react-cool-onclickoutside";

export const FnbColorPicker = (props) => {
  const { className, onChange, boxColorStyle, classPopover, value } = props;
  const defaultColor = {
    r: "80",
    g: "66",
    b: "155",
    a: "1",
  };

  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [colorSelected, setColorSelected] = useState(value ?? defaultColor);

  useEffect(() => {
    const color = convertToColorFormatDefault(value);
    setColorSelected(color);
  }, []);

  useEffect(() => {
    setColorSelected(convertToColorFormatDefault(value));
  }, [value]);
  const coverRef = useRef(null);
  const onOpenColorPicker = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const onCloseColorPicker = () => {
    setDisplayColorPicker(false);
  };

  const onChangeColor = (color) => {
    const rgbColor = getRgbaColor(color.rgb);
    setColorSelected(rgbColor);
    if (onChange) {
      onChange(rgbColor);
    }
  };

  const convertToColorFormatDefault = (color) => {
    if (isHexColor(value)) {
      const rgba = hexToRgb(value);
      const rgbColor = getRgbaColor(rgba);
      return rgbColor;
    }

    return value;
  };

  const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          a: 1,
        }
      : null;
  };

  const isHexColor = (value) => {
    const reg = /^#([0-9a-f]{3}){1,2}$/i;
    return reg.test(value);
  };

  const getRgbaColor = (color) => {
    try {
      const { r, g, b, a } = color;
      return `rgba(${r},${g},${b},${a})`;
    } catch {
      return color;
    }
  };

  let styles = reactCSS({
    default: {
      color: {
        width: `${boxColorStyle?.width ?? "60px"}`,
        height: `${boxColorStyle?.height ?? "36px"}`,
        borderRadius: `${boxColorStyle?.borderRadius ?? "2px"}`,
        background: colorSelected,
      },
      swatch: {
        background: "#fff",
        borderRadius: `${boxColorStyle?.borderRadius ?? "1px"}`,
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        display: "inline-block",
        cursor: "pointer",
      },
      popover: {
        position: "absolute",
        zIndex: "2",
      },
      cover: {
        position: "fixed",
        overflow: "auto",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
  });
  const refClickOutside = useOnclickOutside(() => {
    onCloseColorPicker();
  });
  return (
    <>
      <div className={className}>
        <div
          className="fnb-color-picker"
          style={styles.swatch}
          onClick={onOpenColorPicker}
          
        >
          <div style={styles.color} />
        </div>
        {displayColorPicker ? (
          <div style={styles.popover} ref={refClickOutside} className={classPopover}>
            {/* <div style={styles.cover} onClick={onCloseColorPicker} ></div> */}
            <SketchPicker color={colorSelected} onChange={onChangeColor} />
          </div>
        ) : null}
      </div>
    </>
  );
};
