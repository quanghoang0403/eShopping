import React, { useEffect } from "react";
import Index from "../../index";
import "../../assets/css/about-us.styles.scss";
import { useTranslation } from "react-i18next";

export default function AboutUsPage(props) {
  const [t] = useTranslation();
  const translateData = {
    aboutUs: t("storeWebPage.aboutUs")
  }
  useEffect(() => {
    document.title = translateData.aboutUs;
  }, [])
  
  const renderPreviewContent = () => {
    return (
      <div className="about-us-wrapper">
        <div className="about-us-section container-fluid about-us-header">
          <h1>GIỚI THIỆU</h1>
        </div>
        <div className="about-us-section container-fluid about-us-intro">
          <div className="about-us-intro-wrapper">
            <div className="intro-thumbnail">
              <img className="section-1-thumbnail-img" alt="japanese-man-making-coffee-restaurant" />
            </div>
            <div className="intro-content">
              <h2>Tận hưởng một hành trình đặc biệt của hương vị</h2>
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste quis error quae explicabo laudantium
                perferendis ad corrupti facere, dolorem itaque aperiam illum animi deleniti ex libero expedita rem
                inventore earum? Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos numquam omnis voluptatem
                labore reprehenderit? Incidunt at quasi repellat amet! Aperiam tempore aliquam alias eum. Pariatur
                tempora voluptate possimus nostrum sit. Lorem ipsum dolor sit amet.
              </div>
            </div>
          </div>
        </div>
        <div className="about-us-section container-fluid about-us-description">
          <div className="about-us-description-wrapper">
            <div className="description-content">
              <h3>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores dolorum, quos vero dignissimos
                laboriosam error ab deleniti ipsam, obcaecati incidunt earum sequi dolor rem possimus esse doloremque.
                Amet, neque quisquam?
              </h3>
            </div>
            <div className="description-signature">
              <h2>Duy Huynh</h2>
            </div>
          </div>
        </div>
        <div className="about-us-section container-fluid about-us-highlight">
          <div className="about-us-highlight-wrapper">
            <div className="highlight-section">
              <a>
                <img id="highlight-1" src="/assets/images/ico/salad.png" />
                <h3>BEST QUALITY</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              </a>
            </div>
            <div className="highlight-section">
              <a>
                <img id="highlight-2" src="/assets/images/ico/fast-time.png" />
                <h3>ON TIME</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              </a>
            </div>
            <div className="highlight-section">
              <a>
                <img id="highlight-3" src="/assets/images/ico/chef.png" />
                <h3>MASTERCHEFS</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              </a>
            </div>
            <div className="highlight-section">
              <a>
                <img id="highlight-4" src="/assets/images/ico/tray.png" />
                <h3>TASTE FOOD</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              </a>
            </div>
          </div>
        </div>
        <div className="about-us-section container-fluid about-us-video">
          <div className="about-us-video-wrapper">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/Z8f15a5IpBk"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    );
  };
  return (
    <Index
      {...props}
      contentPage={(props) => {
        return renderPreviewContent();
      }}
    />
  );
}
