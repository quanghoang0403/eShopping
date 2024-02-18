import { useMemo } from "react";
import { useSelector } from "react-redux";
import { themeFontSelector } from "store/modules/session/session.reducers";

const ThemeCustomizeWrapper = (props) => {
  const { pageId, component: Component, pageDefaultData, clickToFocusCustomize } = props;
  const fontFamily = useSelector(themeFontSelector);
  const ComponentWithFontFamily = useMemo(() => {
    return (
      <div style={{ fontFamily: fontFamily }}>
        <Component
          fontFamily={fontFamily}
          pageId={pageId}
          pageDefaultData={pageDefaultData}
          clickToFocusCustomize={clickToFocusCustomize}
          isDefault={false}
          isCustomize={true}
        />
      </div>
    );
  }, [pageId, fontFamily, pageDefaultData, clickToFocusCustomize]);

  return <>{ComponentWithFontFamily}</>;
};

export default ThemeCustomizeWrapper;
