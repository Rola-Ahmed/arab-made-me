import { baseUrl_IMG } from "config.js";
import { handleImageError } from "utils/ImgNotFound";

export default function ProfileCell(props) {
  let { profile, repEmail, name } = props;
  return (
    <div className="profile-container justify-content-start align-items-center d-flex">
      <div className="profile-img">
        <img
          className="w-100 h-100"
          src={`${baseUrl_IMG}/${profile}`}
          onError={handleImageError}
          alt={`${baseUrl_IMG}/${profile}`}
        />
      </div>
      <div>
        <p className=" name-text">{name}</p>
        <p className=" email-text">{repEmail}</p>
      </div>
    </div>
  );
}
