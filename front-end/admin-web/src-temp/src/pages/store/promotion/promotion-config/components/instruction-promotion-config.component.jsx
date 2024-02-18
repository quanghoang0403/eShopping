import { useState, useEffect } from "react";
import "./instruction-promotion-config.style.scss";
import { languageCodeLocalStorageKey } from "../../../../../constants/language.constants";

import ApplyProduct from "./apply-product-instruction/index.component";
import ApplyOrder from "./apply-order-instruction/index.component";
import ApplyBoth from "./apply-both-instruction/index.component";

function InstructionPromotionConfig(props) {
  const { isApplyProduct, isApplyOrder } = props;
  const [language, setLanguage] = useState(localStorage.getItem(languageCodeLocalStorageKey));

  useEffect(() => {
    const newLanguage = localStorage.getItem(languageCodeLocalStorageKey);
    if (newLanguage !== language) setLanguage(newLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem(languageCodeLocalStorageKey)]);

  return (
    <div className="intruction-promotion-config">
      {isApplyProduct && isApplyOrder ? <ApplyBoth language={language} /> : <></>}
      {isApplyProduct && !isApplyOrder ? <ApplyProduct language={language} /> : <></>}
      {!isApplyProduct && isApplyOrder ? <ApplyOrder language={language} /> : <></>}
    </div>
  );
}

export default InstructionPromotionConfig;
