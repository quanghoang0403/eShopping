import { Input, Select, Space, Tag, Tooltip, message } from "antd";
import { CloseFill, PlusOrangeIcon } from "constants/icons.constants";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

const SelectBlogTagComponent = (props) => {
  const { tagDataTemp, tags, setTags, setTagError, setIsChangeForm } = props;
  const [t] = useTranslation();
  const pageData = {
    enterTag: t("form:SEOKeywordsPlaceholder"),
    maximumText: t("form:maximum255Characters"),
  };
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState({
    label: "",
    value: "",
  });
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef(null);
  const editInputRef = useRef(null);
  const [options, setOptions] = useState([]);

  const isMobile = useMediaQuery({ maxWidth: 576 });

  const maximumTags = 10;
  const maxLength = 255;
  const [inputLength, setInputLength] = useState(0);

  const MAX_TAG_WIDTH = isMobile ? 10 : 20;

  useEffect(() => {
    if (inputVisible) {
      inputRef?.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef?.current?.focus();
  }, [inputValue]);

  const handleClose = (removedTag) => {
    setIsChangeForm(true);
    const newTags = tags?.filter((tag) => tag.name !== removedTag);
    setTags(newTags);
    if (tags?.length - 1 <= maximumTags) {
      setTagError(false);
    }
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (label, values) => {
    setIsChangeForm(true);
    if (tags?.length >= maximumTags) {
      setTagError(true);
      setInputVisible(false);
      setInputValue({ label: "", value: "" });
    } else {
      if (values[0].length > maxLength) {
        message.warn(pageData.maximumText);
      } else {
        if (label === undefined) {
          const findIndexTagTemp = tagDataTemp?.findIndex((tag) => tag?.name === values[0]);
          if (values && findIndexTagTemp !== -1) {
            const indexTag = tags?.findIndex((tag) => tag?.name === values[0]);
            if (values && indexTag === -1) {
              const newTag = {
                name: tagDataTemp[findIndexTagTemp].name,
                id: tagDataTemp[findIndexTagTemp].id,
              };
              setTags([...tags, newTag]);
            }
          } else {
            const indexTag = tags?.findIndex((tag) => tag?.name === values[0]);
            if (values && indexTag === -1) {
              const newTag = {
                name: values[0],
                id: null,
              };
              setTags([...tags, newTag]);
            }
          }
        } else {
          const indexTag = tags?.findIndex((tag) => tag?.name === label);
          if (values && indexTag === -1) {
            const newTag = { name: label, id: values[0] };
            setTags([...tags, newTag]);
          }
        }
      }
      setInputVisible(false);
      setInputValue({ label: label, value: values });
    }
  };

  const handleInputConfirm = () => {
    setIsChangeForm(true);
    if (tags?.length >= maximumTags) {
      setTagError(true);
      setInputVisible(false);
      setInputValue({ label: "", value: "" });
    } else {
      if (inputValue && tags?.findIndex((tag) => tag?.name === inputValue) === -1) {
        if (inputValue.length > maxLength) {
          message.warn(pageData.maximumText);
        } else {
          const newTag = {
            name: inputValue?.label,
            id: inputValue?.value,
          };
          setTags([...tags, newTag]);
        }
        setInputVisible(false);
        setInputValue({ label: "", value: "" });
      }
    }
  };

  const handleEditInputChange = (e) => {
    setEditInputValue(e?.target?.value);
  };

  const handleEditInputConfirm = () => {
    if (tags?.length >= maximumTags) {
      setTagError(true);
      setInputVisible(false);
      setInputValue({ label: "", value: "" });
    } else {
      const newTags = [...tags];
      newTags[editInputIndex].name = editInputValue;
      setTags(newTags);
      setEditInputIndex(-1);
      setInputValue({ label: "", value: "" });
    }
  };

  const handleSelectKeyDown = (e) => {
    if (tags?.length < maximumTags) {
      const inputValue2 = e?.target.value;
      const findIndex = tags?.findIndex((tag) => tag?.name === inputValue2);
      const findIndexTagTemp = tagDataTemp?.findIndex((tag) => tag?.name === inputValue2);
      if (e?.key === "Tab") {
        if (inputValue2 && findIndex === -1 && inputValue2.length <= maxLength) {
          if (inputValue2 && findIndexTagTemp === -1) {
            const newTag = {
              name: inputValue2,
              id: null,
            };
            setTags([...tags, newTag]);
          } else {
            const newTag = {
              name: tagDataTemp[findIndexTagTemp].name,
              id: tagDataTemp[findIndexTagTemp].id,
            };
            setTags([...tags, newTag]);
          }
        }
        if (inputValue2.length > maxLength) {
          message.warn(pageData.maximumText);
        }
        setInputVisible(false);
        setInputValue({ label: "", value: "" });
      } else {
        // if (!allowedCharacters.test(e.key) && e.key.length === 1) {
        //   e.preventDefault();
        // }
      }
    }
  };

  useEffect(() => {
    if (tagDataTemp && tagDataTemp) {
      const newOptions = tagDataTemp?.map((tag) => ({
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

          const isLongTag = tag?.name?.length > MAX_TAG_WIDTH;

          const tagElem = (
            <Tag
              key={tag?.name}
              closable={true}
              style={{
                userSelect: "none",
              }}
              className="tag-customer-custom"
              onClose={() => handleClose(tag.name)}
              closeIcon={<CloseFill className="close-icon-customer-tag" />}
            >
              <span>{isLongTag ? `${tag?.name?.slice(0, MAX_TAG_WIDTH)}...` : tag?.name}</span>
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
        <>
          <div>
            <Select
              mode="tags"
              maxLength={maxLength}
              placeholder={pageData.enterTag}
              ref={inputRef}
              className="tag-customer-select-enter-tag"
              onChange={(values, option) => {
                // values is array
                setInputLength(0);
                if (values?.length > 0 && values[0]?.length > maxLength) {
                  values[0] = values[0].slice(0, maxLength);
                }
                const label = option[0]?.label;
                handleInputChange(label, values);
              }}
              onPressEnter={(e) => {
                handleInputConfirm(e);
              }}
              onKeyDown={(e) => {
                if (e.target.value.length > maxLength) {
                  e.target.value = e.target.value.substring(0, maxLength);
                  e.preventDefault();
                } else {
                  handleSelectKeyDown(e);
                }
              }}
              onKeyUp={(e) => {
                if (e.target.value.length > maxLength) {
                  e.target.value = e.target.value.substring(0, maxLength);
                  e.preventDefault();
                } else {
                  handleSelectKeyDown(e);
                }
                setInputLength(e.target.value.length);
              }}
              options={options}
              dropdownClassName="custom-select-dropdown"
            />
            <span class="input-blog-tag-custom">{`${inputLength} / ${maxLength}`}</span>
          </div>
        </>
      )}
      {!inputVisible &&
        (tags?.length === 0 ? (
          <Tag onClick={showInput} className="site-tag-plus-text blog-tag-plus-text">
            <PlusOrangeIcon className="icon-add-new-import-unit" />
            <span>{t("blog:AddSEOKeywords")}</span>
          </Tag>
        ) : (
          <Tag onClick={showInput} className="site-tag-plus">
            <PlusOrangeIcon className="icon-add-new-import-unit" />
          </Tag>
        ))}
    </Space>
  );
};

export default SelectBlogTagComponent;
