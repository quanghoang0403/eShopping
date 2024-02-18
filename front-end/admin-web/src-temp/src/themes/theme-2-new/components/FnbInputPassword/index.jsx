import { Input } from "antd";
import { EyeCloseOutline, EyeOutline } from "../../assets/icons";
import "./FnbInputPassword.scss";

export function FnbInputPassword({
  id,
  defaultValue,
  value,
  allowClear,
  showCount,
  className,
  placeholder,
  maxLength,
  onChange,
  autoFocus,
  disabled = false,
  prefix,
  isCustomize = false,
  onBlur
}) {
  return (
    <Input.Password
      id={id}
      value={value}
      allowClear={allowClear}
      onChange={onChange}
      className={isCustomize ? `${className}` : `fnb-input-customize fnb-input-password ${className}`}
      showCount={showCount}
      placeholder={placeholder}
      maxLength={maxLength}
      defaultValue={defaultValue}
      autoFocus={autoFocus}
      disabled={disabled}
      prefix={prefix}
      onBlur={onBlur}
      iconRender={(visible) =>
        visible ? (
          <div className="pointer">
            <EyeCloseOutline />
          </div>
        ) : (
          <div className="pointer">
            <EyeOutline />
          </div>
        )
      }
    />
  );
}
