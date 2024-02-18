import { Input } from "antd";
import "./fnb-input.component.scss";

export function FnbInput({
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
  type = "default",
  disabled = false,
  suffix,
}) {
  switch (type) {
    case "password":
      return (
        <Input.Password
          id={id}
          value={value}
          allowClear={allowClear}
          onChange={onChange}
          className={`fnb-input-customize ${className}`}
          showCount={showCount}
          placeholder={placeholder}
          maxLength={maxLength}
          defaultValue={defaultValue}
          autoFocus={autoFocus}
          disabled={disabled}
        />
      );
    default:
      return (
        <Input
          id={id}
          value={value}
          allowClear={allowClear}
          onChange={onChange}
          className={`fnb-input-customize ${className}`}
          showCount={showCount}
          placeholder={placeholder}
          maxLength={maxLength}
          defaultValue={defaultValue}
          autoFocus={autoFocus}
          disabled={disabled}
          suffix={suffix}
        />
      );
  }
}
