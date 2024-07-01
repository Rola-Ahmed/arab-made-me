import { handleImageError } from "utils/ImgNotFound";
import { baseUrl_IMG } from "config.js";
import { useNavigate } from "react-router-dom";

export default function FactoryInfo(props) {
  let { factoryProfile, setIsLogin } = props;
  const navigate = useNavigate();

  // Logout
  const logOut = () => {
    setIsLogin("");
    localStorage.clear();
    localStorage.setItem("ToHomePage", "true");
    navigate("/");
  };

  return (
    <div className="profile-container justify-content-start align-items-center d-flex">
      <div className="profile-img">
        <img
          className="w-100 h-100"
          src={`${baseUrl_IMG}/${factoryProfile?.coverImage}`}
          alt="factory logo"
          onError={handleImageError}
        />
      </div>
      <div className="w size-profile ">
        <p className="text-white name-text">{factoryProfile?.name}</p>
        <p className="text-white email-text  w-100 title-text-handler">
          {factoryProfile?.repEmail}
         
        </p>
      </div>

      <i
        className="fa-solid fa-arrow-right-from-bracket cursor"
        onClick={() => logOut()}
      ></i>
    </div>
  );
}
