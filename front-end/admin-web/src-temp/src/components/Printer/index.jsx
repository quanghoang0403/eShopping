import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
const { forwardRef, useImperativeHandle } = React;

export const Printer = forwardRef((props, ref) => {
  const { htmlContent, widthBill, paddingBottom } = props;
  const componentRef = useRef();
  useImperativeHandle(ref, () => ({
    printTemplate() {
      printTemplate();
    },
  }));

  const printTemplate = useReactToPrint({
    content: () => componentRef.current,
    copyStyles: true,
  });

  return (
    <div
      style={{ width: widthBill, paddingBottom: paddingBottom ?? 15 }}
      ref={componentRef}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    ></div>
  );
});
