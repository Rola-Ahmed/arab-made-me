import { handleImageError } from "utils/ImgNotFound";
import { useNavigate } from "react-router-dom";
import { baseUrl_IMG } from "config.js";

export default function ProductList(props) {
  let { factoryitem, index, item } = props;
  let navigate = useNavigate();

  return (
    <div
      className="subProfileCont cursor"
      onClick={() => {
        localStorage.setItem("ToProductPage", true);
        navigate(
          `/productPage/${factoryitem?.productId?.[0]}-${factoryitem?.productName?.[0]}`
        );
      }}
      key={index}
    >
      <img
        src={`${baseUrl_IMG}/${item}`}
        className="w-100 h-100"
        alt={`slide ${item} `}
        onError={handleImageError}
      />
    </div>
  );
}
