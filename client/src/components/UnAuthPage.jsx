import React from "react";
import Errorpage from "./Errorpage";

export default function UnAuthPage() {
  return <Errorpage code="403" msg="Unauthorized Access Page (403 Error)" />;
}
