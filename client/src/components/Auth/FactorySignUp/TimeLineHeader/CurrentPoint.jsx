import { awaitImg } from "constants/Images";

export default function CurrentPoint({ title }) {
  return (
    <div className=" text-check ">
      <div className="  timeline-reg d-flex">
        <div className="w-100 vertical-line  mt-auto mb-auto"></div>
        <div className="img-cont">
          <img src={awaitImg} alt="" />
        </div>

        <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
      </div>
      <p className="text-cont text-center">{title}</p>
    </div>
  );
}
