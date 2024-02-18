import { languageCode } from "../../../../../../constants/language.constants";
import ApplyProductEN from "./apply-product-en.component";
import ApplyProductVI from "./apply-product-vi.component";

function ApplyProduct(props) {
  const { language } = props;
  return <>{language === languageCode.en ? <ApplyProductEN /> : <ApplyProductVI />}</>;
}

export default ApplyProduct;
