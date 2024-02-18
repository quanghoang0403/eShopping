import { Form } from "antd";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { store } from "store";
import { setRequestRenderThemeCustomize, setThemeCustomizeConfig } from "store/modules/session/session.actions";
import { randomGuid } from "utils/helpers";
import ColorGroup from "./color-group.component";

export default function GeneralColor(props) {
  const { initialData, form, updateFormValues, setColorGroups, themeId, colorGroupDefault } = props;
  const { getFieldsValue } = form;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const pageData = {
    addNewColorGroupButton: t("storeWebPage.color.addNewColorGroupButton"),
    confirmDialogTitle: t("storeWebPage.color.confirmDialogTitle"),
    confirmDialogContent: t("storeWebPage.color.confirmDialogContent"),
    confirmDialogCancelText: t("storeWebPage.color.confirmDialogCancelText"),
    confirmDialogOkText: t("storeWebPage.color.confirmDialogOkText"),
    colorGroupTitle: t("storeWebPage.color.colorGroupTitle"),
  };

  const MAXIMUM_GROUP_NUMBER = 5;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deletedColorGroup, setDeletedColorGroup] = useState();
  const [newColorGroupDefault, setNewColorGroupDefault] = useState({});

  useEffect(() => {
    if (updateFormValues) {
      updateFormValues();
    }
    onSetNewColorGroupDefault();
  }, []);

  const onDelete = (index) => {
    setDeletedColorGroup(getFieldsValue()?.general?.color?.colorGroups[index]);
    setShowConfirmDialog(true);
  };

  const onConfirmedDelete = () => {
    const { general } = form.getFieldsValue();
    const themeConfig = store.getState()?.session?.themeConfig;
    let colorGroupCopy = [];
    if (general && general?.color && general?.color?.colorGroups) {
      colorGroupCopy = [...general?.color?.colorGroups];
    }
    let colorIndex = colorGroupCopy.findIndex((x) => x.id === deletedColorGroup?.id);
    if (colorIndex) {
      colorGroupCopy.splice(colorIndex, 1);
      general?.color?.colorGroups?.splice(colorIndex, 1);
    }
    let themeConfigNew = {
      ...themeConfig,
      general: {
        ...general,
        color: {
          colorGroups: colorGroupCopy,
        },
      },
    };
    setColorGroups(colorGroupCopy);
    setShowConfirmDialog(false);
    form.setFieldsValue({
      ...form.getFieldsValue(),
      general: general,
    });

    setColorGroups(getFieldsValue()?.general?.color?.colorGroups);
    dispatch(setThemeCustomizeConfig(themeConfigNew));
  };

  const onSetNewColorGroupDefault = () => {
    let newColorGroupItem = {
      ...colorGroupDefault,
      id: randomGuid(),
      name: `${pageData.colorGroupTitle} ${getFieldsValue()?.general?.color?.colorGroups?.length + 1}`,
    };

    setNewColorGroupDefault(newColorGroupItem);
  };

  const addNewColorGroup = () => {
    const themeConfig = store.getState().session?.themeConfig;
    let themeColorGroups = themeConfig.general.color.colorGroups ?? [];
    themeColorGroups.push(newColorGroupDefault);
    let themeConfigNew = {
      ...themeConfig,
      general: {
        ...themeConfig.general,
        color: {
          colorGroups: themeColorGroups,
        },
      },
    };
    setColorGroups(themeConfigNew?.general?.color?.colorGroups);
    dispatch(setThemeCustomizeConfig(themeConfigNew));
    dispatch(setRequestRenderThemeCustomize());
  };

  return (
    <>
      {
        <Form.List name={["general", "color", "colorGroups"]}>
          {(fields, { add, remove }, { errors }) => {
            return (
              <>
                {fields.map((field, index) => {
                  return (
                    <ColorGroup
                      key={index}
                      index={index}
                      initialData={initialData}
                      colorGroupDefault={colorGroupDefault}
                      onDelete={(e) => {
                        onDelete(e);
                      }}
                    />
                  );
                })}

                <FnbAddNewButton
                  disabled={initialData?.color?.colorGroups?.length >= MAXIMUM_GROUP_NUMBER}
                  onClick={() => {
                    addNewColorGroup(newColorGroupDefault);
                  }}
                  text={pageData.addNewColorGroupButton}
                />
              </>
            );
          }}
        </Form.List>
      }
      <DeleteConfirmComponent
        title={pageData.confirmDialogTitle}
        content={t(pageData.confirmDialogContent, {
          name: deletedColorGroup?.name,
        })}
        visible={showConfirmDialog}
        skipPermission={true}
        cancelText={pageData.confirmDialogCancelText}
        okText={pageData.confirmDialogOkText}
        onCancel={() => {
          setShowConfirmDialog(false);
        }}
        onOk={onConfirmedDelete}
      />
    </>
  );
}
