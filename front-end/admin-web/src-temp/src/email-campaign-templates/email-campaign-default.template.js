import { env } from "env";

const rootUrl = env.REACT_APP_URL;
export const emailCampaignDefaultTemplate = {
  primaryColor: ".primary-color",
  secondaryColor: ".secondary-color",
  border: {
    title: "#title",
    logo: "#sLogo",
    mainProduct: "#sMainProduct",
    firstSubProduct: "#sFirstSubProduct",
    secondSubProduct: "#sSecondSubProduct",
    footer: "#footer",
  },
  session: {
    header: "#header",
    logo: "#logo",
    title: "#title",
    body: "#body",
    imageMain: "#imageMain",
    mainProductImage: "#mainProductImage",
    mainProductTitle: "#mainProductTitle",
    mainProductDescription: "#mainProductDescription",
    mainProductButton: "#mainProductButton",
    mainProductUrl: "#mainProductUrl",
    firstSubProductImage: "#firstSubProductImage",
    firstSubProductTitle: "#firstSubProductTitle",
    firstSubProductDescription: "#firstSubProductDescription",
    firstSubProductButton: "#firstSubProductButton",
    firstSubProductUrl: "#firstSubProductUrl",
    secondSubProductImage: "#secondSubProductImage",
    secondSubProductTitle: "#secondSubProductTitle",
    secondSubProductDescription: "#secondSubProductDescription",
    secondSubProductButton: "#secondSubProductButton",
    secondSubProductUrl: "#secondSubProductUrl",
    footer: "#footer",
    facebook: "#facebook",
    instagram: "#instagram",
    tiktok: "#tiktok",
    twitter: "#twitter",
    youtube: "#youtube",
    footerContent: "#footerContent",
  },
  template: `
      <div style="font-family: arial">
    <table class="secondary-color" id="header" style="width: 700px; height: 200px; display: flex" align="center">
      <tbody style="width: 100%; display: inline-table">
        <tr id="sLogo" style="height: 120px;" >
          <td>
            <img
              id="logo"
              src=""
              style="display: block; margin: auto; border-radius: 12px; object-fit: cover;"
              width="248"
              height="56"
            />
          </td>
        </tr>
        <tr style="height: 80px;">
          <td align="center">
            <div
              style="
                align-items: center;
                justify-content: center;
                font-style: normal;
                font-weight: 700;
                font-size: 32px;
                line-height: 34px;
                display: flex;    
                color: #50429B;
              "
            >
             <div id="title" 
              style="
              overflow: hidden;
              display: block !important;
              display: -webkit-box !important;
              -webkit-line-clamp: 2 !important;
              -webkit-box-orient: vertical !important;
              height: 64px;
              text-overflow: ellipsis;    margin: auto;
              " 
              > Email Title</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <table id="body" style="background-color: #FFFFFF; width: 700px; display: flex" align="center">
      <tbody style="width: 100%; display: inline-table">
        <tr id="sMainProduct">
          <td>
              <div style="padding-top: 20px">
                  <img
                      id="mainProductImage"
                      src=""
                      style="display: block; margin: auto; object-fit: cover;"
                      width="600"
                      height="320"
                  />
              </div>
            <div style="padding-left: 50px; padding-right: 50px">
              <h2
                id="mainProductTitle"
                style="
                  padding: 0;
                  margin: 0;
                  margin-top: 15px;
                  font-style: normal;
                  font-weight: 700;
                  font-size: 24px;
                  line-height: 34px;
                  letter-spacing: 0.3px;
                  color: #282828;
                  overflow: hidden;
                  display: block !important;
                  display: -webkit-box !important;
                  -webkit-line-clamp: 1 !important;
                  -webkit-box-orient: vertical !important;
                  height: 36px;
                  text-overflow: ellipsis;
                "
              >
                Euismod purus sem ullamcorper nunc neque.
              </h2>
              <div
                id="mainProductDescription"
                style="
                  margin: 0;
                  padding-top: 10px;
                  font-style: normal;
                  font-weight: 400;
                  font-size: 14px;
                  line-height: 21px;
                  letter-spacing: 0.3px;
                  color: #282828;
                  overflow: hidden;
                  display: block !important;
                  display: -webkit-box !important;
                  -webkit-line-clamp: 4 !important;
                  -webkit-box-orient: vertical !important;
                  height: 88px;
                  text-overflow: ellipsis;
                "
              >
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor consectetur turpis fermentum convallis
                vitae hac nibh non. Senectus nullam quam viverra sit. Quis porta a.
                </p>
              </div>
            </div>
  
            <div style="padding-top: 20px; padding-bottom: 10px;">
            <a
                id="mainProductUrl"
                href="javascript:void()"
                target="_blank"
                rel="noopener noreferrer"
                style="
                  margin: auto;
                  color: #ffffff;
                  font-style: normal;
                  font-weight: 700;
                  font-size: 18px;
                  line-height: 21px;
                  letter-spacing: 0.3px;
                  text-decoration: none;
                "
                >
            <div
              class="primary-color"
              style=" 
                  justify-content: center !important; 
                  align-items: center !important;
                  background: #50429b; 
                  border-radius: 16px; 
                  width: 233px; 
                  height: 60px; 
                  display: flex !important; 
                  margin: auto;
                ">
              <span 
                  id="mainProductButton" 
                  style="
                    overflow: hidden;
                    display: -webkit-box !important;
                    -webkit-line-clamp: 1 !important;
                    -webkit-box-orient: vertical !important;
                    height: 18px;
                    text-overflow: ellipsis;
                    padding-left: 10px;
                    align-items: center;    margin: auto;
                  "
                >BOOK NOW</span>
              
            </div>
            </a>
          </div>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 10px; padding-bottom: 10px; padding-left: 30px; padding-right: 30px; display: flex">
          <div id="sFirstSubProduct" style="
          border: 4px solid transparent;
          padding-top: 10px;
          padding-bottom: 10px;
          padding-left: 10px; 
          padding-right: 10px;
          margin: auto; 
          "
          >
              <div  style="
              width: 288px;
              ">
              <div>
              <img
                  id="firstSubProductImage"
                  src=""
                  alt
                  style="display: block; border: 0; outline: none; text-decoration: none; object-fit: cover;"
                  width="288"
                  height="288"
              />
              </div>
              <div style="padding-bottom: 5px; padding-top: 10px">
              <h2
                  id="firstSubProductTitle"
                  class="name"
                  style="
                  margin: 0;
                  font-style: normal;
                  font-weight: 700;
                  font-size: 18px;
                  line-height: 21px;
                  letter-spacing: 0.3px;
                  color: #282828;
                  overflow: hidden;
                  display: block !important;
                  display: -webkit-box !important;
                  -webkit-line-clamp: 2 !important;
                  -webkit-box-orient: vertical !important;
                  height: 38px;
                  text-overflow: ellipsis;
                  "
              >
                  Cafe Culture in Kabul Shows How Afghanistan Is Transforming
              </h2>
              </div>
              <div style="padding-top: 5px; padding-right: 5px; padding-bottom: 20px">
              <div
                  id="firstSubProductDescription"
                  style="
                  margin: 0;
                  font-style: normal;
                  font-weight: 400;
                  font-size: 14px;
                  line-height: 21px;
                  letter-spacing: 0.3px;
                  color: #282828;
                  overflow: hidden;
                  display: block !important;
                  display: -webkit-box !important;
                  -webkit-line-clamp: 3 !important;
                  -webkit-box-orient: vertical !important;
                  min-height: 62px;
                  text-overflow: ellipsis;
                  height: max-content;
                  "
              >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor consectetur turpis fermentum
                  convallis vitae hac nibh non.
              </div>
              </div>
              <div style="text-align: center">
              <a
              id="firstSubProductUrl"
              target="_blank"
              rel="noopener noreferrer"
              style="margin: auto; text-decoration: none; display: inline-block"
              href="javascript:void()"
              >
              <div
                  class="primary-color"
                  style="
                  margin: 0;
                  color: #333333;
                  font-size: 16px;
                  height: 48px;
                  width: 177px;
                  background: #50429b;
                  border-radius: 16px;
                  color: #ffffff;
                  display: flex;
                  "
              >
                  <span
                    id="firstSubProductButton"
                    style="
                      font-style: normal;
                      font-weight: 400;
                      font-size: 16px;
                      line-height: 21px;
                      align-items: center;
                      letter-spacing: 0.3px;
                      color: #ffffff;
                      margin: auto;
                      overflow: hidden;
                      display: block !important;
                      display: -webkit-box !important;
                      -webkit-line-clamp: 1 !important;
                      -webkit-box-orient: vertical !important;
                      height: 18px;
                      text-overflow: ellipsis;
                  "
                  >EXPLORE NOW</span
                  >
              </div>
              </a>
              </div>
          </div>
          </div>
          <div id="sSecondSubProduct" style="
          border: 4px solid transparent;
          padding-top: 10px;
          padding-bottom: 10px;
          padding-left: 10px;
          padding-right: 10px;
          margin: auto; 
          "
          >
            <div style="width: 288px;">
              <div>
                <img
                    id="secondSubProductImage"
                    src=""
                    alt
                    style="display: block; border: 0; outline: none; text-decoration: none; object-fit: cover;"
                    width="288"
                    height="288"
                />
              </div>
              <div style="padding-bottom: 5px; padding-top: 10px">
                <h2
                  id="secondSubProductTitle"
                  class="name"
                  style="
                    margin: 0;
                    font-style: normal;
                    font-weight: 700;
                    font-size: 18px;
                    line-height: 21px;
                    letter-spacing: 0.3px;
                    color: #282828;
                    overflow: hidden;
                    display: block !important;
                    display: -webkit-box !important;
                    -webkit-line-clamp: 2 !important;
                    -webkit-box-orient: vertical !important;
                    height: 38px;
                    text-overflow: ellipsis;
                  "
                >
                  Cafe Culture in Kabul Shows How Afghanistan Is Transforming
                </h2>
              </div>
              <div style="padding-top: 5px; padding-right: 5px; padding-bottom: 20px">
                <div
                  id="secondSubProductDescription"
                  style="
                    margin: 0;
                    font-style: normal;
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 21px;
                    letter-spacing: 0.3px;
                    color: #282828;
                    overflow: hidden;
                    display: block !important;
                    display: -webkit-box !important;
                    -webkit-line-clamp: 3 !important;
                    -webkit-box-orient: vertical !important;
                    min-height: 62px;
                    text-overflow: ellipsis;
                    height: max-content;
                  "
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor consectetur turpis fermentum
                  convallis vitae hac nibh non.
                </div>
              </div>
  
              <div style="text-align: center">
                <a
                  id="secondSubProductUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="margin: auto; text-decoration: none; display: inline-block"
                  href="javascript:void()"
                >
                  <div
                    class="primary-color"
                    style="
                      margin: 0;
                      color: #333333;
                      font-size: 16px;
                      height: 48px;
                      width: 177px;
                      background: #50429b;
                      border-radius: 16px;
                      color: #ffffff;
                      display: flex;
                    "
                  >
                    <span
                      id="secondSubProductButton"
                      style="
                          font-style: normal;
                          font-weight: 400;
                          font-size: 16px;
                          line-height: 21px;
                          align-items: center;
                          letter-spacing: 0.3px;
                          color: #ffffff;
                          margin: auto;
                          overflow: hidden;
                          display: block !important;
                          display: -webkit-box !important;
                          -webkit-line-clamp: 1 !important;
                          -webkit-box-orient: vertical !important;
                          height: 18px;
                          text-overflow: ellipsis;
                      "
                      >EXPLORE NOW</span
                    >
                  </div>
                </a>
              </div>
            </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  
    <table id="footer" style="width: 700px; background: #EBE8FE" align="center">
      <tbody style="width: 100%" class="secondary-color">
        <tr style="display: flex; margin-top: 25px; margin-bottom: 20px; margin-left: 50px; margin-right: 50px">
          <td style="display: flex; justify-content: center; align-items: center; gap: 24px; margin: auto">
            <a id="facebook">
              <img src="${rootUrl}/images/facebook.png" alt="facebook"/>
            </a>
            <a id="instagram">
                <img src="${rootUrl}/images/instagram.png" alt="instagram"/>
            </a>
            <a id="tiktok">
                <img src="${rootUrl}/images/tiktok.png" alt="tiktok"/>
            </a>
            <a id="twitter">
                <img src="${rootUrl}/images/twitter.png" alt="twitter"/>
            </a>
            <a id="youtube">
                <img src="${rootUrl}/images/youtube.png" alt="youtube"/>
            </a>
          </td>
        </tr>
        <tr>
          <td style="display: flex">
              <div style="height: 1px; width: 600px; margin: auto; background:#CDC6FF"></div>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 20px; color: #282828">
            <div id="footerContent" style="width: 90%; margin: auto; text-align: center">
              <p>Copyright 2010-2022 StoreName, all rights reserved.</p>
              <p>60A Trường Sơn, Phường 2, Quận Tân Bình, Hồ Chí Minh, Việt Nam</p>
              <p>(+84) 989 38 74 94 | youremail@gmail.com</p>
              <p>Privacy Policy | Unsubscribe</p>
              <p>
                Bạn nhận được tin này vì bạn đã đăng ký hoặc chấp nhận lời mời của chúng tôi để nhận email từ GoF&B hoặc
                bạn đã mua hàng từ GoF&B
              </p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 25px"></td>
        </tr>
      </tbody>
    </table>
  </div>
      `,
};
