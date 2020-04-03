import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "../../config/keys";

export class ProfileGithub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      count: 5,
      sort: "created: asc",
      repos: []
    };
  }

  componentDidMount() {
    const { githubUsername } = this.props;
    const { count, sort, clientId, clientSecret } = this.state;

    fetch(
      `https://api.github.com/users/${githubUsername}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`
    )
      .then(response => response.json())
      .then(data => {
        this.setState({
          repos: data
        });
      })
      .catch(error => console.log(error));
  }

  render() {
    const { repos } = this.state;

    const repoItems = repos.map(repo => (
      <div className="card card-body mb-2" key={repo.id}>
        <div className="row">
          <div className="col-md-6">
            <h4>
              <a href={repo.html_url} className="text-info" target="_blank">
                {repo.name}
              </a>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-6">
            <span className="badge badge-info mr-1">
              Stars: {repo.stargazers_count}
            </span>
            <span className="badge badge-secondary mr-1">
              Watchers: {repo.watchers_count}
            </span>
            <span className="badge badge-succss">
              Forks: {repo.forks_count}
            </span>
          </div>
        </div>
      </div>
    ));
    return (
      <div>
        <hr />
        <h3 className="mb-4">Latest Github Repos</h3>
        {repoItems}
      </div>
    );
  }
}

ProfileGithub.propTypes = {
  githubUsername: PropTypes.string.isRequired
};

export default ProfileGithub;
