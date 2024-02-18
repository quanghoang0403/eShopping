import { languageCode } from "../../../../../../constants/language.constants";
import ApplyOrderEN from "./apply-order-en.component";
import ApplyOrderVI from "./apply-order-vi.component";

function ApplyOrder(props) {
  const { language } = props;
  return <>{language === languageCode.en ? <ApplyOrderEN /> : <ApplyOrderVI />}</>;
}

export default ApplyOrder;
