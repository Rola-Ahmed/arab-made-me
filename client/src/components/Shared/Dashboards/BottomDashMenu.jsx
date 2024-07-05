import { baseUrl_IMG } from "config.js";
import { handleImageError } from "utils/ImgNotFound";

export default function BottomDashMenu(props) {
  let { email, name, profile, logOuut } = props;
  return (
    <div className="profile-container justify-content-start align-items-center d-flex mt-5">
      <div className="profile-img">
        <img
          className="w-100 h-100"
          //  src={profile}
          // alt="profile "

          src={`${baseUrl_IMG}/${profile}`}
          alt="importer logo"
          onError={handleImageError}
        />
      </div>
      <div className="w size-profile ">
        <div>
          <p className="text-white name-text">{name}</p>
          <p className="text-white email-text w-100 title-text-handler">
            {email}
          </p>
        </div>
      </div>

      <i
        className="fa-solid fa-arrow-right-from-bracket cursor"
        onClick={() => logOuut()}
      ></i>
    </div>
  );
}
