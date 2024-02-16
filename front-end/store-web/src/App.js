import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { FontFamilyStoreApp } from "./constants/font-family.constants";
import storeDataService from "./data-services/store-data.service";
import { setCartItems, setStoreConfig, setThemeCustomizeConfig } from "./modules/session/session.actions";
import { setThemeConfig } from "./modules/theme-customize/theme-customize.actions";
import AppProvider from "./providers/app.provider";
import themeConfigService, { addFont } from "./services/theme-config.services";
import { defaultRouters } from "./theme/app/router";
import { themeData, themeToken } from "./theme/theme.data";
import { getStorage, localStorageKeys, setStorage } from "./utils/localStorage.helpers";

function App(props) {
  const dispatch = useDispatch();
  const [currentThemeConfig, setCurrentThemeConfig] = useState(null);
  const themeConfig = useSelector((state) => state.session?.themeConfig);
  const [fontFamily, setFontFamily] = useState(themeToken.fontFamily);
  const initTempData = () => {
    let jsonCartItems = localStorage.getItem(localStorageKeys.STORE_CART);
    if (jsonCartItems === null || jsonCartItems === "undefined") {
      jsonCartItems = "[]";
      localStorage.setItem(localStorageKeys.STORE_CART, jsonCartItems);
    }
    const cartItems = JSON.parse(jsonCartItems);
    dispatch(setCartItems(cartItems));
  };
  useEffect(() => {
    initTempData();
    readConfigFromConfigFile();
    handleFavicon();
    getStoreConfig();
  }, []);

  const getStoreConfig = async () => {
    //Fetch Data Store Config
    try {
      if (themeConfig?.storeId) {
        const resStoreConfig = await storeDataService.getStoreConfig(themeConfig?.storeId);
        if (resStoreConfig) {
          dispatch(setStoreConfig(resStoreConfig?.data?.storeConfig));
        }
      }
    } catch {}
  };

  const handleFavicon = () => {
    const config = getStorage(localStorageKeys.STORE_CONFIG);
    const jsonData = JSON.parse(config);
    const faviconUrl = jsonData?.general?.favicon;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.getElementsByTagName("head")[0].appendChild(link);
    }
    link.href = faviconUrl;
  };
  const readConfigFromConfigFile = () => {
    fetch(`${process.env.PUBLIC_URL}/store.config.json`)
      .then((response) => {
        return response.json();
      })
      .then(async (data) => {
        const jsonData = JSON.stringify(data);
        const version = data?.lastUpdateDate ?? "1.0.0";
        const oldVersion = getStorage(localStorageKeys.VERSION);
        if (oldVersion !== version) {
          // Remove old value if new version updated
          localStorage.removeItem(localStorageKeys.STORE_CART);
        }
        setStorage(localStorageKeys.VERSION, version);
        setStorage(localStorageKeys.STORE_CONFIG, jsonData);
        setCurrentThemeConfig(data);
        dispatch(setThemeCustomizeConfig(data));

        if (Boolean(window.isStoreAppWebView)) {
          addFont(FontFamilyStoreApp.path);
          setFontFamily(FontFamilyStoreApp.name);
        } else {
          const font = themeConfigService.getConfigsByKey(["general", "font"]);
          if (font) {
            addFont(font.path);
            setFontFamily(font.name);
          }
        }

        // REFACTOR
        dispatch(setThemeConfig(data)); // storage theme json config on initial state
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  const routers = useMemo(() => {
    let routes = themeData.pages?.map((p) => {
      return {
        id: p.id,
        name: p.name,
        component: p.component,
        path: p?.path,
      };
    });

    // add default route
    routes.push({
      ...themeData.pages[0],
      path: "/",
    });
    routes = routes.concat(defaultRouters);
    return routes;
  }, []);

  if (!currentThemeConfig) return null;

  return (
    <AppProvider fontFamily={fontFamily}>
      <Router>
        <Switch>
          {routers.map((route) => {
            const { component: Component, id, path, ...rest } = route;
            return (
              <Route
                {...rest}
                key={id}
                path={path}
                render={(props) => <Component {...props} pageId={id} fontFamily={fontFamily} />}
                exact={true}
              />
            );
          })}
        </Switch>
      </Router>
    </AppProvider>
  );
}

export default App;
