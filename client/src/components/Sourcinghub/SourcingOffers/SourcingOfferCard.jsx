import { baseUrl_IMG } from "config.js";
import { handleProfileError } from "utils/ImgNotFound";
import { getMonthName as getDate } from "utils/getMonthName";

export default function SourcingOfferCard({ item, assessFormOPAuth }) {
  let getMonthName = getDate;
  return (
    <tr
      className="cursor"
      onClick={() => {
        assessFormOPAuth(
          `sourcingOffer/${item?.id}?factoryOffersId=${item?.id}&productName=${item?.productName}&factoryId=${item?.factoryId}`
        );
      }}
    >
      <th className="  " scope="row">
        <div className="d-flex gap-12 align-items-center">
          <img
            className="flag-img"
            src={`${baseUrl_IMG}/${item?.docs}`}
            onError={handleProfileError}
            alt={`${baseUrl_IMG}/${item?.docs}`}
          />
          <p className="fs-14 fw-600">{item?.productName}</p>
        </div>
      </th>
      <td className="">
        <div className="d-flex  align-items-center ">
          <p className="fs-14 fw-normal">{item?.quantity}</p>
        </div>
      </td>
      <td className="">
        <div className="d-flex  align-items-center ">
          <p className="fs-14">
            {item?.preferredCountries?.length !== 0
              ? item?.preferredCountries?.join(", ")
              : "All"}
          </p>
        </div>
      </td>

      <td className="">
        <div className="d-flex  align-items-center ">
          <p className="fs-14">{item?.productDescription}</p>
        </div>
      </td>
      <td className="">
        <p className="fs-14 ">
          {getMonthName(item?.createdAt?.split("T")?.[0])}
        </p>
      </td>
    </tr>
  );
}
