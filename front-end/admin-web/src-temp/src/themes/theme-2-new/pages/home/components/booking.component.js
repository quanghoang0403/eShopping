import { useEffect, useState } from "react";
import logoUrl from "../../../assets/images/logo.svg";
import "../../../assets/css/home-page.style.scss";
// import branchDataService from "../data-service/branch/branch-data.service";

export function Booking(props) {
  const [branchCount, setBranchCount] = useState(0);
  useEffect(() => {
    getBranches();
  }, []);

  const getBranches = async () => {
    // const branchesResponse = await branchDataService.getAllBranchsAsync();
    // setBranchCount(branchesResponse.branchs.length);
  };
  return (
    <>
      <section className="booking">
        <div className="page-container">
          <div className="booking-card">
            <div className="booking-card-left">
              <img className="booking-logo" alt="" src={logoUrl} />
              <div className="h4">
                <div>CHECK OUT OUR PLACE</div>
              </div>
              <div className="h1">
                <div>BOOK A TABLE</div>
              </div>
              <div className="booking-btn">
                <span>ĐẶT BÀN NGAY</span>
              </div>
            </div>
            <div className="booking-card-right">
              <div className="text-size-16px">
                <div>BOOKING REQUEST</div>
              </div>
              <div className="h1">
                <div>(028) 7303 0800</div>
              </div>
              <div className="location-text h4">
                <div>LOCATION</div>
              </div>
              <div className="body-text">
                <div>
                  123 Ho Van Hue, Tan Binh, Ho Chi
                  <br /> Minh, Viet Nam
                </div>
              </div>
              <div className="brand-text h4">
                <div>BRANCH</div>
              </div>
              <div className="system-brand-text body-text">
                <u>
                  <div>Hệ thống {branchCount} chi nhánh</div>
                </u>
              </div>
              <div className="booking-time">
                <div className="booking-time-left">
                  <div className="h4">
                    <div>LUNCH TIME</div>
                  </div>
                  <div className="body-text">
                    <div>
                      Monday to Sunday
                      <br />
                      10.30 am – 3.00 pm
                    </div>
                  </div>
                </div>
                <div className="booking-time-right">
                  <div className="h4">
                    <div>DINNER TIME</div>
                  </div>
                  <div className="body-text">
                    <div>
                      Monday to Sunday
                      <br />
                      5.30 am – 11.00 pm
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
