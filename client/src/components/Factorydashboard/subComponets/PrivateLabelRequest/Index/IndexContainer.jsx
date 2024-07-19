import { useState, useContext } from "react";

import { UserToken } from "Context/userToken";
import PrivateLabelReqIndexList from "components/Factorydashboard/subComponets/PrivateLabelRequest/Index/IndexList";
import usePrivateLabel from "./usePrivateLabel";

export default function PrivateLabeReqIndexContainer() {
  let { isLogin } = useContext(UserToken);
  const [filter, setFilter] = useState({
    formsFilter: "",
    sort: "date-DESC",
    sort_name: "",
  });
  function filtterData(value, keyword, name) {
    setFilter((prevValue) => ({
      ...prevValue,
      [keyword]: value,
      ...(name && { sort_name: name }),
    }));
  }

  let { reqData, pagination, apiLoadingData, errorsMsg, setPagination } =
    usePrivateLabel(isLogin, filter);

  return (
    <PrivateLabelReqIndexList
      allprivateLabelData={reqData}
      pagination={pagination}
      setPagination={setPagination}
      filtterData={filtterData}
      filter={filter}
      apiLoadingData={apiLoadingData}
      errorsMsg={errorsMsg}
    />
  );
}
