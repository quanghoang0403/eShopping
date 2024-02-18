import TextArea from "antd/es/input/TextArea";
import React from "react";
import { useTranslation } from "react-i18next";
import { NoteBlurIcon, NoteIcon } from "../../assets/icons.constants";
import "./NoteTextAreaComponent.scss";

function NoteTextAreaComponent(props) {
  const { className = "", value, onChange, placeholder, maxLength = 100, autoSize = true, bordered = false } = props;
  const [t] = useTranslation();

  function handleChange(e) {
    if (onChange) {
      onChange(e);
    }
  }

  return (
    <div className={`note-text-area ${className}`}>
      {value ? <NoteIcon className="note-icon" /> : <NoteBlurIcon className="note-icon" />}
      <TextArea
        className={`text-area`}
        placeholder={placeholder ?? t("storeWebPage.editOrderItem.noteAMessageForTheStore")}
        onChange={(e) => handleChange(e)}
        value={value}
        maxLength={maxLength}
        autoSize={autoSize}
        bordered={bordered}
      />
    </div>
  );
}

export default NoteTextAreaComponent;
