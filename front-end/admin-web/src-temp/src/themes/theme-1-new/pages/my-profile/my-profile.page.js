import Index from "../../index";
import { ProfilePage } from "./components/profile.page";
import "./my-profile.page.scss";

export default function MyProfilePage(props) {
  return (
    <Index
      {...props}
      contentPage={(props) => {
        return <ProfilePage {...props} />;
      }}
    />
  );
}
