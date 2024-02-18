import { useTranslation } from "react-i18next";
import { HeartIcon } from "../../../../assets/icons.constants";
import { Button, Col, Row } from "antd";

export function AddToFavoritesButton() {
  const [t] = useTranslation();
  const translateData = {
    addToFavorites: t("storeWebPage.generalUse.addToFavorites", "addToFavorites"),
  };

  return (
    <Row>
      <Col xs={24}>
        <Button className="btn-product-detail btn-favorite-product">
          {translateData.addToFavorites} <HeartIcon className="icon-favorite" />
        </Button>
      </Col>
    </Row>
  );
}
