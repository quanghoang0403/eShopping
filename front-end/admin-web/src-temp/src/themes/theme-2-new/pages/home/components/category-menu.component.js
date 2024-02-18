import Slider from "react-slick";
import ourMenuUrl1 from "../../../assets/images/our-menu-1.png";
import ourMenuUrl2 from "../../../assets/images/our-menu-2.png";
import ourMenuUrl3 from "../../../assets/images/our-menu-3.png";
import ourMenuUrl4 from "../../../assets/images/our-menu-4.png";
import "../../../assets/css/home-page.style.scss";

export function CategoryMenu(props) {
  let settings = {};
  if (window.matchMedia("(max-width: 428px)").matches) {
    settings = {
      infinite: false,
      slidesToShow: 2,
      slidesToScroll: 2,
      variableWidth: true,
      prevArrow: false,
      nextArrow: false,
      rows: 2,
    };
  } else {
    settings = {
      infinite: false,
      slidesToShow: 4,
      slidesToScroll: 4,
      variableWidth: true,
      prevArrow: false,
      nextArrow: false,
    };
  }

  return (
    <>
      <section className="our-menu-banner page-container">
        <div className="our-menu-banner-intro h3">OUR MENU</div>
        <div className="our-menu-banner-title">View our menu</div>
        <div className="our-menu-slide">
          <Slider {...settings}>
            <img alt="" className="our-menu-img" src={ourMenuUrl1} />
            <img alt="" className="our-menu-img" src={ourMenuUrl2} />
            <img alt="" className="our-menu-img" src={ourMenuUrl3} />
            <img alt="" className="our-menu-img" src={ourMenuUrl4} />
            {/* <img alt="" className="our-menu-img" src={ourMenuUrl2} />
            <img alt="" className="our-menu-img" src={ourMenuUrl3} />
            <img alt="" className="our-menu-img" src={ourMenuUrl1} />
            <img alt="" className="our-menu-img" src={ourMenuUrl4} /> */}
          </Slider>
        </div>
      </section>
    </>
  );
}
