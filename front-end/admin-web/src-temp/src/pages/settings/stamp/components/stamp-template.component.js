import { StoreLogoDefault } from "constants/icons.constants";
import { StampType } from "constants/stamp-type.constants";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import { formatDate } from "utils/helpers";
import "./stamp-template.component.scss";

const { forwardRef, useImperativeHandle } = React;

/** Params for StampTemplateComponent
 * @warning IF YOU CHANGE THIS FILE, YOU MUST CHANGE IT IN **ORDER/COMPONENT/STAMP-TEMPLATE.COMPONENT.JS** POS PROJECT
 * @param { stampConfig, stampData } from props
 * stampConfig = { stampType, isShowLogo, isShowTime, isShowNumberOfItem, isShowNote };
 * stampData = { code, logo, createdTime, itemList };
 * itemList = [{ no, name, note, options, current }];
 * options = [{ name, value }];
 *
 * @exportFunctions
 * render(stampConfig, stampData), print()
 */
export const StampTemplateComponent = forwardRef((props, ref) => {
  const [stamp, setStamp] = useState(null);
  const [stampType, setStampType] = useState(1);
  const templateRef = useRef();
  const [t] = useTranslation();

  useImperativeHandle(ref, () => ({
    render(stampConfig, stampData) {
      renderStampTemplate(stampConfig, stampData);
    },
    print() {
      printTemplate();
    },
  }));

  const pageData = {
    titleNote: t("note.note", "Note"),
  };

  const renderStampTemplate = (stampConfig, stampData) => {
    const { stampType } = stampConfig;
    const stampTemplate = buildStampTemplate(stampConfig, stampData);
    const stamp = buildStampSize(stampType, stampTemplate);

    setStamp(stamp);
  };

  const printTemplate = useReactToPrint({
    content: () => templateRef.current,
    copyStyles: true,
  });

  const buildStampTemplate = (stampConfig, stampData) => {
    const { isShowLogo, isShowTime, isShowNumberOfItem, isShowNote, stampType } = stampConfig;
    const { code, logo, createdTime, note, itemList } = stampData;
    const time = formatDate(createdTime, "hh:mm A");
    const totalItem = itemList.length;
    const currentItem = itemList.find((item) => item.current === true);

    let logoWidth = 32;
    let logoHeight = 32;
    let codeSize = "12px";
    let lineHeight = "12px";
    let heightPercent = 20;

    switch (stampType) {
      case StampType.mm40x25:
        logoWidth = 22;
        logoHeight = 22;
        codeSize = "9px";
        lineHeight = "9px";
        break;
      case StampType.mm50x30:
        logoWidth = 28;
        logoHeight = 28;
        codeSize = "10px";
        lineHeight = "10px";
        break;
      case StampType.mm35x22:
        logoWidth = 15;
        logoHeight = 15;
        codeSize = "8px";
        lineHeight = "8px";
        heightPercent = 25;
        break;
      default:
        break;
    }

    const stampTemplate = (
      <>
        <tr
          className="header"
          style={{ fontSize: codeSize, lineHeight: lineHeight, height: heightPercent.toString() + "%" }}
        >
          <td>
            {isShowLogo && (
              <>
                <div className={"logoSession"}>
                  {logo ? (
                    <img src={logo} width={logoWidth} height={logoHeight} />
                  ) : (
                    <StoreLogoDefault width={logoWidth} height={logoHeight} />
                  )}
                </div>
              </>
            )}
          </td>

          <td className={"headerRight"}>
            <strong className={"code right"}>{code}</strong>
            <span className={"content"}>
              {isShowTime && (
                <>
                  <br />
                  <span>{time}</span>
                </>
              )}
            </span>
            {isShowNumberOfItem && (
              <>
                <br />
                <strong className={"content showNumber"}>
                  ({currentItem?.no}/{totalItem})
                </strong>
              </>
            )}
          </td>
        </tr>

        <tr style={{ fontSize: codeSize, lineHeight: lineHeight, height: (100 - heightPercent).toString() + "%" }}>
          {itemList
            ?.filter((i) => i.current === true)
            .map((item, index) => {
              const { name, note, options } = item;
              return (
                <>
                  <td key={index}>
                    <tr>
                      <td>
                        <strong className="titleName">{name}</strong>
                      </td>
                    </tr>
                    {options?.map((option, index) => {
                      const { name, value } = option;
                      return (
                        <tr className="contentOption" key={index}>
                          <td className="contentOption name">
                            <div>- {name}</div>
                          </td>
                          <td>
                            <div>:</div>
                          </td>
                          <td className="contentOption value">
                            <span>{value}</span>
                          </td>
                        </tr>
                      );
                    })}

                    {isShowNote && (
                      <>
                        <tr>
                          <td>
                            <strong className="titleName">{pageData.titleNote}:</strong>
                          </td>
                        </tr>
                        <tr>
                          <td className="content note">{note}</td>
                        </tr>
                      </>
                    )}
                  </td>
                </>
              );
            })}
        </tr>
      </>
    );

    return stampTemplate;
  };

  const buildStampSize = (stampType, stampTemplate) => {
    let template = <></>;
    setStampType(stampType);
    switch (stampType) {
      case StampType.mm40x25:
        template = (
          <table className="tableStamp" style={styles.mm40x25}>
            {stampTemplate}
          </table>
        );
        break;
      case StampType.mm50x30:
        template = (
          <table className="tableStamp" style={styles.mm50x30}>
            {stampTemplate}
          </table>
        );
        break;
      case StampType.mm35x22:
        template = (
          <table className="tableStamp" style={styles.mm35x22}>
            {stampTemplate}
          </table>
        );
        break;
      case StampType.mm50x40:
      default:
        template = (
          <table className="tableStamp" style={styles.mm50x40}>
            {stampTemplate}
          </table>
        );
        break;
    }

    return (
      <div>
        <div ref={templateRef} style={{ display: "flex", gap: "2px", width: "fit-content" }}>
          <div className="template-stamp">{template}</div>
          {stampType === StampType.mm35x22 && <div className="template-stamp">{template}</div>}
        </div>
      </div>
    );
  };

  return <>{stamp}</>;
});

const styles = {
  mm50x40: {
    width: "189px",
    overflow: "hidden",
    aspectRatio: "50 / 40",
  },
  mm50x30: {
    width: "189px",
    overflow: "hidden",
    aspectRatio: "50 / 30",
  },
  mm40x25: {
    width: "152px",
    aspectRatio: "40 / 25",
    overflow: "hidden",
  },
  mm35x22: {
    width: "133px",
    aspectRatio: "35 / 22",
    overflow: "hidden",
  },
};
