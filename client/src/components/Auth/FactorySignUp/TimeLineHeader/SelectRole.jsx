import { checkedImg } from "constants/Images";
export default function SelectRole() {
  return (
    <div className=" text-check ">
      <div className="  timeline-reg d-flex">
        <div className="img-cont ms-5">
          <img src={checkedImg} alt="" />
        </div>

        <div className="w-100 vertical-line  mt-auto mb-auto"></div>
      </div>
      <p className="text-cont  ">Select Your Role</p>
    </div>
  );
}
