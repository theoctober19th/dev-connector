import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";
import { deleteExperience } from "../../redux/actions/profileActions";

class ExperienceTable extends Component {
  onDelete(exp_id) {
    this.props.deleteExperience(exp_id);
  }
  render() {
    const experienceRows = this.props.experiences.map(experience => (
      <tr key={experience._id}>
        <td>{experience.company}</td>
        <td>{experience.title}</td>
        <td>
          <Moment format="MMM YYYY">{experience.from}</Moment> -{" "}
          {experience.to === null ? (
            "Now"
          ) : (
            <Moment format="MMM YYYY">{experience.to}</Moment>
          )}
        </td>
        <td>
          <button
            onClick={this.onDelete.bind(this, experience._id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Experience Credentials</h4>
        <table className="table">
          <thead>
            <th>Company</th>
            <th>Title</th>
            <th>Years</th>
            <th>Actions</th>
          </thead>
          <tbody>{experienceRows}</tbody>
        </table>
      </div>
    );
  }
}

ExperienceTable.propTypes = {
  deleteExperience: PropTypes.func.isRequired,
  experiences: PropTypes.array.isRequired
};

export default connect(null, { deleteExperience })(ExperienceTable);
