import { CouldUploadIcon, CvsFileIcon } from "constants/icons.constants";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatBytes } from "utils/helpers";
import "./file-upload-drag-drop.component.scss";

const { forwardRef, useImperativeHandle } = React;
export const FileUploadDragDropComponent = forwardRef((props, ref) => {
  const { onChange, fileSizeLimit } = props;
  const [t] = useTranslation();
  const inputRef = React.useRef();
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [key, setKey] = useState(Date.now());

  useImperativeHandle(ref, () => ({
    reset() {
      resetInput();
    },
  }));

  /** This function is used to handle drag events when the user drags the file into the box.
   * @param  {event} e The react event.
   */
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
  };

  /** This function is used to handle the file when the file is dropped into the box.
   * @param  {event} e The react event.
   */
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onSelectFile({
        target: {
          files: e.dataTransfer.files,
        },
      });
    }
  };

  /** This function is used to open the File Dialog when the box is clicked.
   */
  const openFileDialog = () => {
    inputRef?.current?.click();
  };

  const resetInput = () => {
    if (inputRef.current) {
      inputRef.current.value = null;
    }
    setFileName("");
    setFileSize("");
    setKey(Date.now());
    onChange("");
  };

  const onSelectFile = (e) => {
    const file = e.target.files[0];
    setFileName(file?.name);
    const fileSize = formatBytes(file?.size ?? 0);
    setFileSize(fileSize);
    onChange(file);
  };

  const clearFile=()=>{
    if (inputRef.current) {
      inputRef.current.value = null;
    }
    setFileName("");
    setFileSize("");
    onChange("");
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={openFileDialog}
      className="drag-drop-box"
    >
      <input key={key} ref={inputRef} id="file-upload" type="file" accept=".xlsx" onChange={onSelectFile} onClick={clearFile}/>
      <div className="icon-box">
        {fileName && fileName?.length > 0 ? <CvsFileIcon /> : <CouldUploadIcon className="cloud-icon" />}
      </div>
      {fileName && fileName?.length > 0 ? (
        <>
          <div className="second-text">{fileName}</div>
          <div className="third-text">{fileSize}</div>
        </>
      ) : (
        <>
          <div className="second-text">{t("material.import.dragAndDropOrSelectFile")}</div>
          {fileSizeLimit && (
            <div className="third-text">{t("material.import.maximumFileSize", { fileSizeLimit: fileSizeLimit })}</div>
          )}
        </>
      )}
    </div>
  );
});
