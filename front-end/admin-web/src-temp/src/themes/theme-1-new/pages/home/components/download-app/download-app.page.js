import Index from "../../../../index";
import "./download-app.scss";
import { useSelector } from "react-redux";
import appOnAppStore from "../../../../assets/images/app-on-app-store.png";
import appOnGooglePlay from "../../../../assets/images/app-on-google-play.png";
import QRCode from "react-qr-code";
import { Image, Row, Col } from "antd";
import { useEffect } from "react";
export default function DownLoadAppPage(props) {
  const themeConfig = useSelector((state) => state.session?.themeConfig);
  const configFooter = themeConfig?.general?.footer;
  const downloadApp = configFooter?.downloadApp;

  const userAgent = navigator.userAgent;

  useEffect(() => {
    const isAndroid = userAgent.match(/Android/i);
    const isIOS = userAgent.match(/iPhone|iPad|iPod/i);
    const isWindows = userAgent.match(/Windows/i);
    if (isAndroid) {
      window.location.href = downloadApp?.googlePlayLink;
    } else if (isIOS) {
      window.location.href = downloadApp?.appStoreLink;
    }
  }, [userAgent]);

  // format Route download App
  const currentURL = new URL(window.location.href)?.origin;
  const downloadAppLink = currentURL + "/download-app";
  
  return (
    <Index
      {...props}
      contentPage={(props) => {
        return (
          <>
            <div className="down-load-page">
              <div>
                <Row>
                  <span className="download-app-title">{downloadApp?.title}</span>
                </Row>
                <Row>
                  <Col>{downloadApp?.qrCode && <QRCode className="qr-code-custom" value={downloadAppLink} />}</Col>
                  <Col>
                    <Row>
                      {downloadApp?.appStore && (
                        <Image
                          preview={false}
                          onClick={() => {
                            window.open(downloadApp?.appStoreLink, "_blank");
                          }}
                          className="download-app-image"
                          src={appOnAppStore}
                        />
                      )}
                    </Row>
                    <Row>
                      {downloadApp?.googlePlay && (
                        <Image
                          preview={false}
                          onClick={() => {
                            window.open(downloadApp?.googlePlayLink, "_blank");
                          }}
                          className="download-app-image"
                          src={appOnGooglePlay}
                        />
                      )}
                    </Row>
                  </Col>
                </Row>
              </div>
            </div>
          </>
        );
      }}
    />
  );
}
