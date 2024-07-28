import { useState, useContext } from "react";

import { UserToken } from "Context/userToken";
import WhiteLabelReqIndexList from "components/Factorydashboard/subComponets/WhiteLabel/Index/IndexList";
import useWhiteLabel from "./useWhiteLabel";

export default function WhiteLabeReqIndexContainer() {
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

  let {
    reqData,
    pagination,
    apiLoadingData,
    errorsMsg,
    setPagination,
  } = useWhiteLabel(isLogin, filter);

  return (
    <WhiteLabelReqIndexList
      reqData={reqData}
      pagination={pagination}
      setPagination={setPagination}
      filtterData={filtterData}
      filter={filter}
      apiLoadingData={apiLoadingData}
      errorsMsg={errorsMsg}
    />
  );
}
