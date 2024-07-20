import { handleImageError } from "utils/ImgNotFound";
import { useNavigate } from "react-router-dom";
import { baseUrl_IMG } from "config.js";

export default function ProductList(props) {
  let { index, item } = props;
  let navigate = useNavigate();

  return (
    <div
      className="subProfileCont cursor"
      onClick={() => {
        localStorage.setItem("ToProductPage", true);
        navigate(`/productPage/${item?.id}-${item?.name}`);
      }}
      key={index}
    >
      <img
        src={`${baseUrl_IMG}/${item?.coverImage}`}
        className="w-100 h-100"
        alt={`slide ${item?.coverImage} `}
        onError={handleImageError}
      />
    </div>
  );
}
