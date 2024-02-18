import { handleHyperlinkValue } from "../../../utils/helpers";
import "../../assets/css/home-page.style.scss";
import advertisement1 from "../../assets/images/advertisement1.png";
import advertisement2 from "../../assets/images/advertisement2.png";
import {
  backgroundTypeEnum,
  theme2ElementCustomize,
  theme2ElementRightId,
} from "../../constants/store-web-page.constants";
import ImageWithFallback from "../fnb-image-with-fallback/fnb-image-with-fallback.component";

export default function Advertisement(props) {
  const { clickToFocusCustomize } = props;
  const advertisement = props?.config?.advertisement;
  const advertisementUrl = [advertisement1, advertisement2];
  const generalCustomization = advertisement?.generalCustomization;
  let styleBackground = {};
  if (generalCustomization?.backgroundType === backgroundTypeEnum.Color) {
    styleBackground = {
      backgroundColor: generalCustomization?.backgroundColor,
    };
  } else if (generalCustomization?.backgroundType === backgroundTypeEnum.Image) {
    styleBackground = {
      backgroundImage: `url(${generalCustomization?.backgroundImage})`,
      backgroundAttachment: "initial",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  const renderAdvertisementItem = (advertisementItem, index) => {
    const styleAdvertisementItem = {
      objectFit: "cover",
      objectPosition: "center",
      height: "100%",
      width: "100%",
      borderRadius: "20px",
    };
    return (
      <a
        href={handleHyperlinkValue(advertisementItem?.hyperlinkType, advertisementItem?.hyperlinkValue)}
        rel="noreferrer"
        key={index}
      >
        <div className="advertisement-item">
          <ImageWithFallback
            src={advertisementItem?.imageUrl}
            alt="img"
            fallbackSrc={advertisementUrl[index]}
            style={styleAdvertisementItem}
          />
        </div>
      </a>
    );
  };

  return (
    <div id={theme2ElementRightId.Advertisement} hidden={!advertisement?.visible}>
      <div
        className="w-100"
        onClick={() => {
          if (clickToFocusCustomize) clickToFocusCustomize(theme2ElementCustomize.Advertisement);
        }}
        style={styleBackground}
      >
        <section className="advertisement-custom-container">
          <div className="advertisement-custom-content">
            {advertisement?.advertisementItems?.map((advertisementItem, index) => {
              return renderAdvertisementItem(advertisementItem, index);
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
