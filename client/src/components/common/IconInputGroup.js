import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const IconInputGroup = ({
  name,
  placeholder,
  value,
  error,
  type,
  onChange,
  icon
}) => {
  return (
    <div className="input-group mb-3">
      <div className="input-group-prepend">
        <span className="input-group-text">
          <i className={icon} />
        </span>
      </div>
      <input
        className={classnames("form-control form-control-lg", {
          "is-invalid": error
        })}
        placeholder={placeholder}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

IconInputGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

IconInputGroup.defaultProps = {
  type: "text"
};

export default IconInputGroup;
