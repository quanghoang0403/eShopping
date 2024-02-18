import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";

export const FnbColorPicker = (props) => {
  const {
    className,
    onChange,
    boxColorStyle,
    classPopover,
    value,
    showColorPicker = false,
    setIsVisibleSelectColor,
  } = props;
  const defaultColor = {
    r: "80",
    g: "66",
    b: "155",
    a: "1",
  };

  const [displayColorPicker, setDisplayColorPicker] = useState(showColorPicker);
  const [colorSelected, setColorSelected] = useState(value ?? defaultColor);

  useEffect(() => {
    const color = convertToColorFormatDefault(value);
    setColorSelected(color);
  }, []);

  useEffect(() => {
    setColorSelected(convertToColorFormatDefault(value));
  }, [value]);

  const onOpenColorPicker = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const onCloseColorPicker = () => {
    setDisplayColorPicker(false);
    if (setIsVisibleSelectColor) {
      setIsVisibleSelectColor(false);
    }
  };

  const onChangeColor = (color) => {
    const rgbColor = getRgbaColor(color.rgb);
    setColorSelected(rgbColor);
    if (onChange) {
      onChange(rgbColor);
    }
  };

  const convertToColorFormatDefault = (color) => {
    if (isHexColor(color)) {
      const rgba = hexToRgb(color);
      const rgbColor = getRgbaColor(rgba);
      return rgbColor;
    }

    return color;
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
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    },
  });

  return (
    <>
      <div className={className}>
        <div className="fnb-color-picker" style={styles.swatch} onClick={onOpenColorPicker}>
          <div style={styles.color} />
        </div>
        {displayColorPicker ? (
          <div style={styles.popover} className={classPopover}>
            <div style={styles.cover} onClick={onCloseColorPicker} />
            <SketchPicker color={colorSelected} onChange={onChangeColor} />
          </div>
        ) : null}
      </div>
    </>
  );
};
