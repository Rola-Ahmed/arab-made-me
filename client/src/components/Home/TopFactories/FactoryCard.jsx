import { handleImageError } from "utils/ImgNotFound";
import { baseUrl_IMG } from "config.js";

export default function FactoryCard(props) {
  let { factoryitem, DirectToFactoryPage } = props;
  return (
    <div
      onClick={() => DirectToFactoryPage(factoryitem?.id, factoryitem?.name)}
    >
      <div className="card-title d-flex w-100 cursorcursor">
        <div className="imgLogo">
          <img
            className={`m-0 p-0 w-100 h-100 borderContainer`}
            src={`${baseUrl_IMG}/${factoryitem?.coverImage}`}
            alt={`slide ${factoryitem?.coverImage} `}
            onError={handleImageError}
          />
        </div>
        <div className="title fac">
          <h2 className=" fac-title text-truncate cursor">
            {factoryitem?.name}
          </h2>
          <p className="cursor ">
            {/* city, country */}
            {factoryitem?.city && factoryitem?.city + ", "}
            {factoryitem?.country ?? ""}
          </p>
        </div>
      </div>
      <p className="text-expand w-100  fs-10 cursor">
        Export History:
        <span>
          {factoryitem?.importingCountries?.length > 0
            ? factoryitem?.importingCountries?.map((item) => ` ${item} ,`)
            : "All"}
        </span>
      </p>
    </div>
  );
}
