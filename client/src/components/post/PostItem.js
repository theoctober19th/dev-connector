import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { Link } from "react-router-dom";
import {
  deletePost,
  likePost,
  unlikePost
} from "../../redux/actions/postActions";

class PostItem extends Component {
  constructor(props) {
    super(props);
    const likes = this.props.post.likes;
    this.state = {
      hasLiked:
        likes.filter(like => like.user === this.props.auth.user._doc._id)
          .length > 0,
      likeCount: likes.length
    };
  }
  onDeleteClick(id) {
    this.props.deletePost(id);
  }
  onThumbsClikced(id) {
    if (this.state.hasLiked) {
      //User has liked. Now unlike it.
      this.props.unlikePost(id);
      this.setState({
        likeCount: this.state.likeCount - 1
      });
    } else {
      //User has not liked, like it.
      this.props.likePost(id);
      this.setState({
        likeCount: this.state.likeCount + 1
      });
    }
    this.setState({
      hasLiked: !this.state.hasLiked
    });
  }

  render() {
    const { post, auth, showActions } = this.props;

    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href="profile.html">
              <img
                className="rounded-circle d-none d-md-block"
                src={post.avatar}
                alt=""
              />
            </a>
            <br />
            <p className="text-center">{post.name}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{post.text}</p>
            {showActions ? (
              <div>
                <button
                  onClick={this.onThumbsClikced.bind(this, post._id)}
                  type="button"
                  className="btn btn-light mr-1"
                >
                  <i
                    className={classnames("fas fa-thumbs-up", {
                      "text-info": this.state.hasLiked
                    })}
                  ></i>
                  <span className="badge badge-light">
                    {this.state.likeCount}
                  </span>
                </button>
                <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
                  Comments
                </Link>
                {post.user === auth.user._doc._id ? (
                  <button
                    className="btn btn-danger mr-1"
                    type="button"
                    onClick={this.onDeleteClick.bind(this, post._id)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deletePost, likePost, unlikePost })(
  PostItem
);
