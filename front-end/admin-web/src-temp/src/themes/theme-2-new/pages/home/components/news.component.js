import postUrl1 from "../../../assets/images/post-1.png";
import postUrl2 from "../../../assets/images/post-2.png";
import postUrl3 from "../../../assets/images/post-3.png";
import "../../../assets/css/home-page.style.scss";

export function News(props) {
  return (
    <>
      <section className="promotion-news page-container">
        <div className="promotion-news-title h3">TIN TỨC & KHUYẾN MÃI</div>
        <div className="post-title">
          <div>Bài viết nổi bật</div>
        </div>
        <div className="post-item">
          <div>
            <img alt="" className="post-img" src={postUrl1} />
            <div className="post-item-title">
              <div>MAKE IT SIMPLE</div>
            </div>
            <div className="post-item-date">By Admin, 01/10/2022</div>
            <div className="post-item-describe">
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sapien rhoncus vitae turpis pellentesque neque
                elit hendrerit.
              </div>
            </div>
            <div className="read-more">{`READ MORE >>`}</div>
          </div>
          <div>
            <img alt="" className="post-img" src={postUrl2} />
            <div className="post-item-title">
              <div>MAKE IT SIMPLE</div>
            </div>
            <div className="post-item-date">By Admin, 01/10/2022</div>
            <div className="post-item-describe">
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sapien rhoncus vitae turpis pellentesque neque
                elit hendrerit.
              </div>
            </div>
            <div className="read-more">{`READ MORE >>`}</div>
          </div>
          <div>
            <img alt="" className="post-img" src={postUrl3} />
            <div className="post-item-title">
              <div>MAKE IT SIMPLE</div>
            </div>
            <div className="post-item-date">By Admin, 01/10/2022</div>
            <div className="post-item-describe">
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sapien rhoncus vitae turpis pellentesque neque
                elit hendrerit.
              </div>
            </div>
            <div className="read-more">{`READ MORE >>`}</div>
          </div>
        </div>
        <div className="btn-read-more">
          <span>XEM THÊM</span>
        </div>
      </section>
    </>
  );
}
