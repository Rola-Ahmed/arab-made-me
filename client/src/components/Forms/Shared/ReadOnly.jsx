import React from "react";

export default function ReadOnly({ title, value }) {
  return (
    <div className="form-group">
      <label className="text-capitalize">{title}</label>
      {/* <input className="form-control" value={value || ""} readOnly /> */}
      <p className="form-control readOnly">{value}</p>
    </div>
  );
}
