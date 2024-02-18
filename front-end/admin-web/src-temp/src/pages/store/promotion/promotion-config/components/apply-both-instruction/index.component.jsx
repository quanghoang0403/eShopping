import { languageCode } from "../../../../../../constants/language.constants";
import ApplyBothEN from "./apply-both-en.component";
import ApplyBothVI from "./apply-both-vi.component";

function ApplyBoth(props) {
  const { language } = props;
  return <>{language === languageCode.en ? <ApplyBothEN /> : <ApplyBothVI />}</>;
}

export default ApplyBoth;
