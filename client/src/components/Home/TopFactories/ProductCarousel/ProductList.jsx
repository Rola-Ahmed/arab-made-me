import { handleProfileError } from "utils/ImgNotFound";
import { useNavigate } from "react-router-dom";
import { baseUrl_IMG } from "config.js";

export default function ProductList(props) {
  let { index, item } = props;
  let navigate = useNavigate();

  return (
    <div
      className="subProfileCont cursor rounded-5"
      onClick={() => {
        // ("ToProductPage", true);
        navigate(`/productPage/${item?.id}-${item?.name}`);
      }}
      key={index}
    >
      <img
        src={`${baseUrl_IMG}/${item?.coverImage}`}
        className="w-100 h-100 object-fit-contain"
        alt={`slide ${item?.coverImage} `}
        onError={handleProfileError}
      />
    </div>
  );
}
