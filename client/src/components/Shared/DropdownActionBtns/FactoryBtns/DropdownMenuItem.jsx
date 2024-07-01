import PropTypes from "prop-types";

const DropdownMenuItem = ({
  title,
  onClick,
  description,
  handleQuestionMarkClick,
}) => (
  <div className="d-flex align-items-center gap-2">
    <div className="text-container cursor" onClick={onClick}>
      <p className="cursor">{title}</p>
    </div>
    <button
      className="fa-solid fa-circle-question cursor bg-white border-0 p-0"
      title={description}
      onClick={() => handleQuestionMarkClick(description)}
    ></button>
  </div>
);

// Define PropTypes for DropdownMenuItem
DropdownMenuItem.propTypes = {
  title: PropTypes.string.isRequired, // title must be a string and is required
  onClick: PropTypes.func.isRequired, // onClick must be a function and is required
  description: PropTypes.string.isRequired, // description must be a string and is required
  handleQuestionMarkClick: PropTypes.func.isRequired, // handleQuestionMarkClick must be a function and is required
};

export default DropdownMenuItem;
