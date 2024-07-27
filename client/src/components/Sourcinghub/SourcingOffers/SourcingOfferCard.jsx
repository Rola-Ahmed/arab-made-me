import { baseUrl_IMG } from "config.js";
import { handleImageError } from "utils/ImgNotFound";
import { getMonthName as getDate } from "utils/getMonthName";

export default function SourcingOfferCard({ item }) {
  let getMonthName = getDate;
  return (
    <tr className="cursor">
      <th className="  " scope="row">
        <div className="d-flex flag-container align-items-center">
          <img
            className="flag-img"
            src={`${baseUrl_IMG}/${item?.docs}`}
            onError={handleImageError}
            alt={`${baseUrl_IMG}/${item?.docs}`}
          />
          <p className="title">{item?.productName}</p>
        </div>
      </th>
      <td className="">
        <div className="d-flex  align-items-center ">
          <p className="title-2">{item?.quantity}</p>
        </div>
      </td>
      <td className="">
        <div className="d-flex  align-items-center ">
          <p className="title-2">
            {item?.preferredCountries?.length !== 0
              ? item?.preferredCountries?.join(", ")
              : "All"}
          </p>
        </div>
      </td>

      <td className="">
        <div className="d-flex  align-items-center ">
          <p className="title-2">{item?.productDescription}</p>
        </div>
      </td>
      <td className="">
        <p className="title">
          {getMonthName(item?.createdAt?.split("T")?.[0])}
        </p>
      </td>
    </tr>
  );
}
