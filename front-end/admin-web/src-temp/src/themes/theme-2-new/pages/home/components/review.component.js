import Slider from "react-slick";
import reviewAvaUrl1 from "../../../assets/images/review-ava-1.png";
import reviewAvaUrl2 from "../../../assets/images/review-ava-2.png";
import slideDotActive from "../../../assets/images/slide-dot-active.svg";
import slideDotUrl from "../../../assets/images/slide-dot.svg";
import "../../../assets/css/home-page.style.scss";

export function Review(props) {
  let settings = {};
  if (window.matchMedia("(max-width: 428px)").matches) {
    settings = {
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      variableWidth: true,
      dots: true,
      customPaging: function (i) {
        return (
          <a>
            <img className="slide-dot" src={slideDotUrl} />
            <img className="slide-dot-active" src={slideDotActive} />
          </a>
        );
      },
      prevArrow: false,
      nextArrow: false,
    };
  } else {
    settings = {
      infinite: true,
      slidesToShow: 2,
      slidesToScroll: 2,
      variableWidth: true,
      dots: true,
      customPaging: function (i) {
        return (
          <a>
            <img className="slide-dot" src={slideDotUrl} />
            <img className="slide-dot-active" src={slideDotActive} />
          </a>
        );
      },
      prevArrow: false,
      nextArrow: false,
    };
  }

  return (
    <>
      <section className="review">
        <div className="page-container">
          <div className="review-intro h3">ĐÁNH GIÁ</div>
          <div className="review-title">
            <div>Cảm nhận Khách hàng</div>
          </div>
          <div className="review-slide">
            <Slider {...settings}>
              <div className="review-slide-item">
                <div>
                  <img alt="" className="reviewer-img" src={reviewAvaUrl1} />
                </div>
                <div className="reviewer-name">ANNA HUYNH</div>
                <div className="reviewer-location">HO CHI MINH</div>
                <div className="review-rating">
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                </div>
                <div className="review-content">
                  <div>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh lacus mattis cras consequat
                    vel, viverra justo quam. Massa semper euismod aliquam ultricies morbi hac. Mattis ligula in
                    dignissim gravida lobortis. Mattis interdum curabitur egestas massa.
                  </div>
                </div>
              </div>
              <div className="review-slide-item">
                <img alt="" className="reviewer-img" src={reviewAvaUrl2} />
                <div className="reviewer-name">KHANH AN TRAN</div>
                <div className="reviewer-location">HA NOI</div>
                <div className="review-rating">
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                </div>
                <div className="review-content">
                  <div>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh lacus mattis cras consequat
                    vel, viverra justo quam. Massa semper euismod aliquam ultricies morbi hac. Mattis ligula in
                    dignissim gravida lobortis. Mattis interdum curabitur egestas massa.
                  </div>
                </div>
              </div>
              {/* <div className="review-slide-item">
                <img alt="" className="reviewer-img" src={reviewAvaUrl1} />
                <div className="reviewer-name">ANNA HUYNH</div>
                <div className="reviewer-location">HO CHI MINH</div>
                <div className="review-rating">
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                </div>
                <div className="review-content">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh lacus mattis cras consequat vel,
                  viverra justo quam. Massa semper euismod aliquam ultricies morbi hac. Mattis ligula in dignissim
                  gravida lobortis. Mattis interdum curabitur egestas massa.
                </div>
              </div>
              <div className="review-slide-item">
                <img alt="" className="reviewer-img" src={reviewAvaUrl2} />
                <div className="reviewer-name">ANNA HUYNH</div>
                <div className="reviewer-location">HO CHI MINH</div>
                <div className="review-rating">
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                </div>
                <div className="review-content">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh lacus mattis cras consequat vel,
                  viverra justo quam. Massa semper euismod aliquam ultricies morbi hac. Mattis ligula in dignissim
                  gravida lobortis. Mattis interdum curabitur egestas massa.
                </div>
              </div>
              <div className="review-slide-item">
                <img alt="" className="reviewer-img" src={reviewAvaUrl1} />
                <div className="reviewer-name">ANNA HUYNH</div>
                <div className="reviewer-location">HO CHI MINH</div>
                <div className="review-rating">
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                </div>
                <div className="review-content">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh lacus mattis cras consequat vel,
                  viverra justo quam. Massa semper euismod aliquam ultricies morbi hac. Mattis ligula in dignissim
                  gravida lobortis. Mattis interdum curabitur egestas massa.
                </div>
              </div>
              <div className="review-slide-item">
                <img alt="" className="reviewer-img" src={reviewAvaUrl2} />
                <div className="reviewer-name">ANNA HUYNH</div>
                <div className="reviewer-location">HO CHI MINH</div>
                <div className="review-rating">
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                  <div className="star-icon star-checked"></div>
                </div>
                <div className="review-content">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh lacus mattis cras consequat vel,
                  viverra justo quam. Massa semper euismod aliquam ultricies morbi hac. Mattis ligula in dignissim
                  gravida lobortis. Mattis interdum curabitur egestas massa.
                </div>
              </div> */}
            </Slider>
          </div>
        </div>
      </section>
    </>
  );
}
