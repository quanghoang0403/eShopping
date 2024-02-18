import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { handleHyperlinkValue } from "../../../utils/helpers";
import "../../assets/css/home-page.style.scss";
import { IconSeeMoreCustomizeColor } from "../../assets/icons/IconSeeMoreCustomizeColor";
import introductionSection3 from "../../assets/images/chef.png";
import introductionSection2 from "../../assets/images/fast-time.png";
import introductionSection1 from "../../assets/images/salad.png";
import introductionDefault from "../../assets/images/top-view-3.png";
import introductionSection4 from "../../assets/images/tray.png";
import { theme2ElementRightId } from "../../constants/store-web-page.constants";
import ImageWithFallback from "../fnb-image-with-fallback/fnb-image-with-fallback.component";
export default function Introduction(props) {
  const { config, general, fontFamily, isCustomize } = props;
  const generalCustomization = config?.introduction?.generalCustomization;
  const introductionCustomization = config?.introduction?.introductionCustomization;
  const visible = config?.introduction?.visible;
  const colorConfig = general?.color?.colorGroups?.find((c) => c.id === generalCustomization?.colorGroupId);
  const introductionSections = [introductionSection1, introductionSection2, introductionSection3, introductionSection4];
  const [showButton, setShowButton] = useState(true);
  useEffect(() => {
    if (
      !introductionCustomization?.header &&
      !introductionCustomization?.title &&
      !introductionCustomization?.description &&
      !introductionCustomization?.buttonLabel
    ) {
      setShowButton(false);
    } else {
      setShowButton(true);
    }
  }, [introductionCustomization]);

  useEffect(() => {
    const moveImgToTop = () => {
      const topViewContents = document.querySelectorAll(".top-view-content");
      if (!topViewContents) return;
      topViewContents?.forEach((topViewContent) => {
        const bulletPoint = topViewContent.querySelector(".bullet-point");
        if (bulletPoint) {
          const imgElement = bulletPoint?.querySelector("img");
          if (imgElement) {
            topViewContent.parentNode.insertBefore(imgElement, topViewContent);
          }
        }
      });
    };
    moveImgToTop();
  }, [introductionCustomization]);

  const StyledIntroduction = styled.div`
    .introduction-wrapper {
      display: ${visible ? "block" : "none"};
    }
    .top-view-post {
      .top-view-intro {
        color: ${colorConfig?.textColor};
      }
      .top-view-title {
        color: ${colorConfig?.titleColor};
      }
    }
    .mid-view {
      .mid-view-content {
        .mid-view-title {
          color: ${colorConfig?.titleColor};
        }
      }
    }
    .top-view-more-btn {
      .button-label {
        color: ${colorConfig?.buttonTextColor};
      }
    }
  `;

  return (
    <StyledIntroduction>
      <div
        id={theme2ElementRightId.Introduction}
        className="introduction-wrapper"
        style={{
          background:
            generalCustomization?.backgroundType === 1
              ? generalCustomization?.backgroundColor
              : "url(" +
                (generalCustomization?.backgroundImage ? generalCustomization?.backgroundImage : "") +
                ") no-repeat",
          backgroundSize: "cover",
          backgroundPosition: `center`,
        }}
      >
        <div className="introduction-container" id={theme2ElementRightId.Introduction}>
          <div className="top-view-info">
            <div>
              <ImageWithFallback
                src={introductionCustomization?.image}
                alt="img"
                fallbackSrc={introductionDefault}
                style={{ maxWidth: "582px", maxHeight: "455px" }}
              />
            </div>
            <div className="top-view-post">
              <div className="top-view-intro">{introductionCustomization?.header}</div>
              <div className="top-view-title">
                <div>{introductionCustomization?.title}</div>
              </div>
              <div className="top-view-text">
                <div dangerouslySetInnerHTML={{ __html: `${introductionCustomization?.description}` }}></div>
              </div>
              {showButton && (
                <a
                  className="button-introduction"
                  href={handleHyperlinkValue(introductionCustomization?.hyperlink, introductionCustomization?.url)}
                  rel="noreferrer"
                >
                  <div className="top-view-more-btn">
                    <IconSeeMoreCustomizeColor fill={colorConfig?.buttonBackgroundColor} />
                    <span className="button-label" style={{ bottom: isCustomize ? "80%" : "75%" }}>
                      {introductionCustomization?.buttonLabel}
                    </span>
                  </div>
                </a>
              )}
            </div>
          </div>
          <div className="mid-view">
            {introductionCustomization?.sections?.map((section, index) => {
              return (
                <div className="mid-view-content" key={index}>
                  <a
                    style={{ textDecoration: "none" }}
                    href={handleHyperlinkValue(section?.hyperlink, section?.url)}
                    rel="noreferrer"
                  >
                    <ImageWithFallback
                      src={section?.icon}
                      alt="icon"
                      fallbackSrc={introductionSections[index % introductionSections.length]}
                      style={{ maxWidth: "60px", maxHeight: "60px" }}
                    />
                  </a>
                  <Tooltip title={section?.header} overlayInnerStyle={{ fontFamily }}>
                    <div className="mid-view-title" title={section?.header}>
                      <span>{section?.header}</span>
                    </div>
                  </Tooltip>
                  <Tooltip title={section?.content} overlayInnerStyle={{ fontFamily }}>
                    <div className="mid-view-text">
                      <span>{section?.content}</span>
                    </div>
                  </Tooltip>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </StyledIntroduction>
  );
}
