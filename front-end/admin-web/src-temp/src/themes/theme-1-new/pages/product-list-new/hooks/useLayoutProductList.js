import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export default function useLayoutProductList() {
  const isDesktop = useMediaQuery({ minWidth: 1281 });
  const isMaxWidth1280 = useMediaQuery({ minWidth: 741, maxWidth: 1280 });
  const isMaxWidth740 = useMediaQuery({ minWidth: 576, maxWidth: 740 });
  const isMobile = useMediaQuery({ maxWidth: 575 });

  const [paddingTopProductList, setPaddingTopProductList] = useState(0);

  useEffect(() => {
    if (isDesktop) setPaddingTopProductList(115);
    else if (isMaxWidth1280) setPaddingTopProductList(35);
    else if (isMaxWidth740) setPaddingTopProductList(125);
    else if (isMobile) setPaddingTopProductList(22);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { paddingTopProductList };
}
