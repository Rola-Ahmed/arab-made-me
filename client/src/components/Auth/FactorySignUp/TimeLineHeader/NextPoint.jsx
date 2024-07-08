import { nextImg } from "constants/Images";
import PropTypes from "prop-types";

export default function Nextpoint({title}) {
  return (
    <div className=" text-check ">
      <div className="  timeline-reg d-flex">
        <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
        <div className="img-cont">
          <img src={nextImg} alt="" />
        </div>

        <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
      </div>
      <p className="text-cont text-center">{title}</p>
    </div>
  );
}

Nextpoint.propTypes = {
  title: PropTypes.string,
};

Nextpoint.defaultProps = {
  title: "",
};
