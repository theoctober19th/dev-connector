import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";
import { deleteEducation } from "../../redux/actions/profileActions";

class EducationTable extends Component {
  onDelete(edu_id) {
    this.props.deleteEducation(edu_id);
  }
  render() {
    const educationRows = this.props.educations.map(education => (
      <tr key={education._id}>
        <td>{education.school}</td>
        <td>{education.degree}</td>
        <td>
          <Moment format="MMM YYYY">{education.from}</Moment> -{" "}
          {education.to === null ? (
            "Now"
          ) : (
            <Moment format="MMM YYYY">{education.to}</Moment>
          )}
        </td>
        <td>
          <button
            onClick={this.onDelete.bind(this, education._id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Education Credentials</h4>
        <table className="table">
          <thead>
            <th>School</th>
            <th>Degree</th>
            <th>Years</th>
            <th>Actions</th>
          </thead>
          <tbody>{educationRows}</tbody>
        </table>
      </div>
    );
  }
}

EducationTable.propTypes = {
  deleteEducation: PropTypes.func.isRequired,
  educations: PropTypes.array.isRequired
};

export default connect(null, { deleteEducation })(EducationTable);
