import { DoubleQuoteRightIcon } from "../../../../assets/icons.constants";
import defaultImg from "../../../../assets/images/default-image-blog.png";
import ImageWithFallback from "../../../../components/fnb-image-with-fallback/fnb-image-with-fallback.component";

export const renderBlogContentMockup = () => {
  return (
    <div className="custom-blog-content">
      <div>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
        standa industry. Lorem Ipsum has been the industry's standaindustry. Lorem Ipsum has been the industry's standa
      </div>
      <div className="mt-24">
        Uniquely pursue emerging experiences before emerging content. Efficiently underwhelm customer directed total
        linkage after B2C synergy. Dynamically simplify superior human capital whereas efficient infrastructures.
        Authoritatively generate e-business web-readiness after wireless outsourcing. Seamlessly evisculate visionary
        scenarios for resource maximizing mindshare.
      </div>
      <div className="custom-blog-quote mt-21">
        Continually whiteboard enterprise-wide vortals whereas world-class resources. Quickly brand team building
        services via functionalized users.
        <div className="mt-16 custom-line-box">
          <div className="line"></div>
          <div className="text">Di Di Cute</div>
        </div>
        <div className="icon-quote">
          <span>
            <DoubleQuoteRightIcon />
          </span>
        </div>
      </div>
      <div className="mt-32">
        Uniquely pursue emerging experiences before emerging content. Efficiently underwhelm customer directed total
        linkage after B2C synergy. Dynamically simplify superior human capital whereas efficient infrastructures.
        Authoritatively generate e-business web-readiness after wireless outsourcing. Seamlessly evisculate visionary
        scenarios for resource maximizing mindshare.
      </div>
      <div className="mt-24">
        Assertively recaptiualize interdependent alignments via backend leadership skills. Monotonectally formulate
        focused quality vectors whereas proactive infomediaries. Energistically utilize ethical initiatives without
        impactful applications. Authoritatively coordinate seamless e-services and user friendly information.
        Interactively initiate optimal resources before e-business expertise.
      </div>
      <div className="custom-title mt-32">Assertively recaptiualize interdependent</div>
      <div className="mt-32">
        Assertively recaptiualize interdependent alignments via backend leadership skills. Monotonectally formulate
        focused quality vectors whereas proactive infomediaries. Energistically utilize ethical initiatives without
        impactful applications. Authoritatively coordinate seamless e-services and user friendly information.
        Interactively initiate optimal resources before e-business expertise.
      </div>
      <div className="top-image mt-32">
        <ImageWithFallback src={defaultImg} alt="icon" fallbackSrc={defaultImg} />
      </div>
      <div className="mt-32">
        Uniquely pursue emerging experiences before emerging content. Efficiently underwhelm customer directed total
        linkage after B2C synergy. Dynamically simplify superior human capital whereas efficient infrastructures.
        Authoritatively generate e-business web-readiness after wireless outsourcing. Seamlessly evisculate visionary
        scenarios for resource maximizing mindshare.
      </div>
    </div>
  );
};
