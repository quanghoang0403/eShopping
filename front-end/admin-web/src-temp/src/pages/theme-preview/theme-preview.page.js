import { useParams } from "react-router-dom";
import React from "react";
import { useTranslation } from "react-i18next";
import themeDataService from "data-services/theme/theme-data.service";
import { useEffect } from "react";
import { setThemeCustomizeConfig } from "store/modules/session/session.actions";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { localStorageKeys, setStorage } from "utils/localStorage.helpers";
import themes from "pages/theme-customize/themes";
import "./theme-preview.page.scss";
export function ThemePreviewPage() {
  const allThemes = themes;
  const [t] = useTranslation();
  const param = useParams();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(null);

  const fetchData = async () => {
    const themeInfo = allThemes.find((theme) => theme.themeData.id.toLowerCase() === param?.themeId?.toLowerCase());
    const { themeData, defaultConfig } = themeInfo;
    const currentPage = themeData?.pages?.find((page) =>
      page?.path?.toLowerCase()?.includes(param?.path?.toLowerCase()),
    );
    setCurrentPage(currentPage);
    dispatch(setThemeCustomizeConfig(defaultConfig));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="theme-preview">
      {currentPage && <currentPage.component pageId={currentPage?.id} isDefault={true} />}
    </div>
  );
}
