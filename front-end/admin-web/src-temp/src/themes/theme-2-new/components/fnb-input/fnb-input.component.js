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
  disabled = false,
  prefix,
  onInput,
  ...props
}) {
  return (
    <Input
      {...props}
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
      prefix={prefix}
      onInput={onInput}
    />
  );
}
