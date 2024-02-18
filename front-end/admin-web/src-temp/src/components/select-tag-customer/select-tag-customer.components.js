import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Space, Input, Tag, Tooltip, Select, message } from "antd";
import { useTranslation } from "react-i18next";
import "./select-tag-customer.scss";
import { PlusOrangeIcon, CloseFill } from "constants/icons.constants";

const SelectCustomerTagComponent = (props) => {
  const { tagDataTemp, tags, setTags, setTagError, setIsChangeForm } = props;
  const [t] = useTranslation();
  const pageData = {
    enterTag: t("customer.enterTag"),
    limitTagMessage: t("customer.limitTagMessage"),
    maximumText: t("text.addNewAddressForm.maximum100Characters"),
  };
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState({
    label: "",
    value: "",
    color: "",
  });
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef(null);
  const editInputRef = useRef(null);
  const [options, setOptions] = useState([]);
  const maximumTags = 99;
  const maxLength = 100;
  const allowedCharacters = /^[a-zA-Z0-9\s]*$/;
  useEffect(() => {
    if (inputVisible) {
      inputRef?.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef?.current?.focus();
  }, [inputValue]);

  const handleClose = (removedTag) => {
    const newTags = tags?.filter((tag) => tag.name !== removedTag);
    setTags(newTags);
    setIsChangeForm(true);
    if (tags?.length - 1 <= maximumTags) {
      setTagError(false);
    }
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (label, value, color) => {
    if (handleVerifyMaximumTagInStore(label)) {
      setTagError(true);
      setInputVisible(false);
      setInputValue({ label: "", value: "", color: "" });
      return;
    }
    if (tags?.length >= maximumTags) {
      setTagError(true);
      setInputVisible(false);
      setInputValue({ label: "", value: "", color: "" });
    } else {
      if (value[0].length > maxLength) {
        message.warn(pageData.maximumText);
      } else {
        if (label === undefined && color === undefined) {
          const findIndexTagTemp = tagDataTemp?.findIndex(
            (tag) => tag?.name === value[0]
          );
          if (value && findIndexTagTemp != -1) {
            const indexTag = tags?.findIndex((tag) => tag?.name === value[0]);
            if (value && indexTag === -1) {
              const newTag = {
                name: tagDataTemp[findIndexTagTemp].name,
                id: tagDataTemp[findIndexTagTemp].id,
                color: tagDataTemp[findIndexTagTemp].color,
              };
              setIsChangeForm(true);
              setTags([...tags, newTag]);
            }
          } else {
            const indexTag = tags?.findIndex((tag) => tag?.name === value[0]);
            if (value && indexTag === -1) {
              const newTag = {
                name: value[0],
                id: null,
                color: generateRandomColor(),
              };
              setIsChangeForm(true);
              setTags([...tags, newTag]);
            }
          }
        } else {
          const indexTag = tags?.findIndex((tag) => tag?.name === label);
          if (value && indexTag === -1) {
            const newTag = { name: label, id: value[0], color: color };
            setIsChangeForm(true);
            setTags([...tags, newTag]);
          }
        }
      }
      setInputVisible(false);
      setInputValue({ label, value, color });
    }
  };

  const handleInputConfirm = () => {
    if (handleVerifyMaximumTagInStore()) {
    setTagError(true);
    setInputVisible(false);
    setInputValue({ label: "", value: "", color: "" });
    return;
    }
    if (tags?.length >= maximumTags) {
      setTagError(true);
      setInputVisible(false);
      setInputValue({ label: "", value: "", color: "" });
    } else {
      if (
        inputValue &&
        tags?.findIndex((tag) => tag?.name === inputValue) === -1
      ) {
        if (inputValue.length > maxLength) {
          message.warn(pageData.maximumText);
        } else {
          const newTag = {
            name: inputValue?.label,
            id: inputValue?.value,
            color: inputValue?.color,
          };
          setIsChangeForm(true);
          setTags([...tags, newTag]);
        }
        setInputVisible(false);
        setInputValue({ label: "", value: "", color: "" });
      }
    }
  };

  const handleEditInputChange = (e) => {
    setEditInputValue(e?.target?.value);
  };

  const handleEditInputConfirm = () => {
    if (handleVerifyMaximumTagInStore()) {
      setTagError(true);
      setInputVisible(false);
      setInputValue({ label: "", value: "", color: "" });
      return;
    }
    if (tags?.length >= maximumTags) {
      setTagError(true);
      setInputVisible(false);
      setInputValue({ label: "", value: "", color: "" });
    } else {
      const newTags = [...tags];
      newTags[editInputIndex].name = editInputValue;
      setIsChangeForm(true);
      setTags(newTags);
      setEditInputIndex(-1);
      setInputValue({ label: "", value: "", color: "" });
    }
  };
  const handleVerifyMaximumTagInStore = (value) => {
    const nullIdTags = tags.filter((tag) => tag.id === null);
    const countNullIdTags = nullIdTags.length;
    const totalTags = tagDataTemp.length + countNullIdTags;
    if (totalTags >= maximumTags && value === undefined) {
      return true;
    }
    setTagError(false);
    return false;
  };

  const handleSelectKeyDown = (e) => {
    if (
      e?.target.value?.length >= maxLength &&
      e.key != "Delete" &&
      e.key != "Backspace"
    ) {
      e.preventDefault();
    }
    if (tags?.length < maximumTags) {
      const inputValue2 = e?.target.value;
      const findIndex = tags?.findIndex((tag) => tag?.name === inputValue2);
      const findIndexTagTemp = tagDataTemp?.findIndex(
        (tag) => tag?.name === inputValue2
      );
      if (e?.key === "Tab") {
        if (handleVerifyMaximumTagInStore()) {
          setTagError(true);
          setInputVisible(false);
          setInputValue({ label: "", value: "", color: "" });
          return;
        }
        if (
          inputValue2 &&
          findIndex === -1 &&
          inputValue2.length <= maxLength
        ) {
          if (inputValue2 && findIndexTagTemp === -1) {
            const newTag = {
              name: inputValue2,
              id: null,
              color: generateRandomColor(),
            };
            setIsChangeForm(true);
            setTags([...tags, newTag]);
          } else {
            const newTag = {
              name: tagDataTemp[findIndexTagTemp].name,
              id: tagDataTemp[findIndexTagTemp].id,
              color: tagDataTemp[findIndexTagTemp].color,
            };
            setIsChangeForm(true);
            setTags([...tags, newTag]);
          }
        }
        if (inputValue2.length > maxLength) {
          message.warn(pageData.maximumText);
        }
        setInputVisible(false);
        setInputValue({ label: "", value: "", color: "" });
      } else {
        if (!allowedCharacters.test(e.key) && e.key.length === 1) {
          e.preventDefault();
        }
      }
    }
  };

  const generateRandomColor = () => {
    const minBrightness = 150;
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 3; i++) {
      const brightness = Math.floor(
        Math.random() * (255 - minBrightness) + minBrightness
      );
      color += letters[Math.floor(brightness / 16)];
      color += letters[brightness % 16];
    }
    return color;
  };

  useEffect(() => {
    if (tagDataTemp && tagDataTemp) {
      const newOptions = tagDataTemp?.map((tag) => ({
        color: tag?.color,
        value: tag?.id,
        label: tag?.name,
      }));
      setOptions(newOptions);
    }
  }, [tagDataTemp]);

  return (
    <Space size={[0, 8]} wrap>
      <Space size={[0, 8]} wrap>
        {tags?.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Input
                ref={editInputRef}
                key={tag?.name}
                size="small"
                style={{ width: 78, verticalAlign: "top" }}
                value={editInputValue}
                onChange={handleEditInputChange}
                onBlur={handleEditInputConfirm}
                onPressEnter={handleEditInputConfirm}
              />
            );
          }

          const isLongTag = tag?.name?.length > maxLength;
          const tagElem = (
            <Tag
              key={tag?.name}
              closable={true}
              style={{
                userSelect: "none",
                backgroundColor: tag?.color,
              }}
              className="tag-customer-custom"
              onClose={() => handleClose(tag.name)}
              closeIcon={<CloseFill className="close-icon-customer-tag" />}
            >
              <span>
                {isLongTag ? `${tag?.name?.slice(0, 20)}...` : tag?.name}
              </span>
            </Tag>
          );

          return isLongTag ? (
            <Tooltip title={tag?.name} key={tag?.name}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
      </Space>

      {inputVisible && (
        <Select
          mode="tags"
          maxLength={maxLength}
          placeholder={pageData.enterTag}
          ref={inputRef}
          className="tag-customer-select-enter-tag"
          onChange={(value, option) => {
            const label = option[0]?.label;
            const color = option[0]?.color;
            handleInputChange(label, value, color);
          }}
          onPaste={(e) => {
            e.preventDefault();
          }}
          onPressEnter={(e) => {
            handleInputConfirm(e);
          }}
          onKeyDown={(e) => {
            handleSelectKeyDown(e);
          }}
          tokenSeparators={[","]}
          options={options}
          dropdownClassName="custom-select-dropdown"
        />
      )}
      {!inputVisible &&
        (tags?.length == 0 ? (
          <Tag onClick={showInput} className="site-tag-plus-text">
            <PlusOrangeIcon className="icon-add-new-import-unit" />
            <span>Add tag</span>
          </Tag>
        ) : (
          <Tag onClick={showInput} className="site-tag-plus">
            <PlusOrangeIcon className="icon-add-new-import-unit" />
          </Tag>
        ))}
    </Space>
  );
};

export default SelectCustomerTagComponent;
