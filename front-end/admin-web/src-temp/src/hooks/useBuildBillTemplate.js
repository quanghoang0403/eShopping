import { useState } from "react";
const useBuildBillTemplate = (jsStringBuildTemplateFunc) => {
  const [value, setValue] = useState(jsStringBuildTemplateFunc);

  const executeFunction = (jsFunction, template, listItem, templateSettings) => {
    var wrap = (s) => "{ return " + jsFunction + " };"; //return the block having function expression
    // eslint-disable-next-line no-new-func
    var func = new Function(wrap(jsFunction));
    //func.call(null).call(null, 1, 3); //invoke the function using arguments
    return func.call(null).call(null, template, listItem, templateSettings); //invoke the function using arguments
  };

  const get = (template, listItem, templateSettings) => {
    return executeFunction(value, template, listItem, templateSettings);
  };

  const set = (newValue) => {
    setValue(newValue);
  };

  return [get, set];
};

export default useBuildBillTemplate;
