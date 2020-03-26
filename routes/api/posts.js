const express = require("express");
const router = express.Router();
const passport = require("passport");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

const validatePostInput = require("../../validators/posts");

// @route   POST api/posts/
// @desc    Create new post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    const { errors, isValid } = validatePostInput(request.body);
    if (!isValid) {
      response.status(400).json(errors);
    }
    const post = new Post({
      text: request.body.text,
      name: request.body.name,
      avatar: request.body.avatar,
      user: request.user._id
    });
    post
      .save()
      .then(post => response.json(post))
      .catch(error => response.status(400).json(error));
  }
);

// @route   GET api/posts/<id>
// @desc    get post by id
// @access  Public
router.get("/:id", (request, response) => {
  Post.findById(request.params.id)
    .then(post => response.json(post))
    .catch(error =>
      response.status(404).json({ post: "No post with the id found." })
    );
});

// @route   GET api/posts/
// @desc    get all posts
// @access  Public
router.get("/", (request, response) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => response.json(posts))
    .catch(error =>
      response.status(404).json({ posts: "Could not fetch posts." })
    );
});

// @route   DELETE api/posts/:id
// @desc    delete a post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    Profile.findOne({ user: request.user._id })
      .then(profile => {
        Post.findById(request.params.id)
          .then(post => {
            if (post.user.toString() !== request.user._id.toString()) {
              return response.status(401).json({
                authorization: "User is not authorized to delete this post."
              });
            } else {
              post.remove().then(() => {
                response.json({ success: true });
              });
            }
          })
          .catch(error => {
            response.status(404).json({ post: "Post not found" });
          });
      })
      .catch(error => {
        response
          .status(404)
          .json({ user: "User not found with these credentials." });
      });
  }
);

// @route   POST api/posts/like/:id
// @desc    Like Post
// @access  Private
router.post(
  "/like/:postid",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    Profile.findOne({ user: request.user._id }).then(profile => {
      Post.findById(request.params.postid)
        .then(post => {
          if (
            post.likes.filter(
              like => like.user.toString() === request.user._id.toString()
            ).length > 0
          ) {
            return response
              .status(400)
              .json({ alreadyliked: "User already liked this post" });
          } else {
            post.likes.unshift({ user: request.user._id });
            post.save().then(post => {
              response.json(post);
            });
          }
        })
        .catch(error => response.status(404).json({ post: "Post not found." }));
    });
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike Post
// @access  Private
router.post(
  "/unlike/:postid",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    Profile.findOne({ user: request.user._id }).then(profile => {
      Post.findById(request.params.postid)
        .then(post => {
          if (
            post.likes.filter(
              like => like.user.toString() === request.user._id.toString()
            ).length === 0
          ) {
            return response
              .status(400)
              .json({ notliked: "You have not liked this post yet." });
          } else {
            const removeindex = post.likes
              .map(items => items.user._id.toString())
              .indexOf(request.user._id);
            post.likes.splice(removeindex, 1);
            post.save().then(post => {
              response.json(post);
            });
          }
        })
        .catch(error => response.status(404).json({ post: "Post not found." }));
    });
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to Post
// @access  Private
router.post(
  "/comment/:postid",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    Post.findById(request.params.postid)
      .then(post => {
        const { errors, isValid } = validatePostInput(request.body);
        if (!isValid) {
          response.status(400).json(errors);
        }
        const comment = {
          text: request.body.text,
          name: request.body.name,
          avatar: request.body.avatar,
          user: request.user._id
        };
        post.comments.unshift(comment);
        post
          .save()
          .then(post => response.json(post))
          .catch(error =>
            response
              .status(400)
              .json({ error: "Cannot add comment to this post." })
          );
      })
      .catch(error =>
        response.status(404).json({ post: "Post not found with given ID" })
      );
  }
);

// @route   DELETE api/posts/comment/:postid/:commentid
// @desc    Delete a comment from the Post
// @access  Private
router.delete(
  "/comment/:postid/:commentid",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    Post.findById(request.params.postid)
      .then(post => {
        if (
          post.comments.filter(
            comment => comment._id.toString() === request.params.commentid
          ).length === 0
        ) {
          return response.status(404).json({ error: "Comment does not exist" });
        } else {
          const removeindex = post.comments
            .map(item => item._id.toString())
            .indexOf(request.params.commentid.toString());
          post.comments.splice(removeindex, 1);
          post.save().then(post => {
            response.json(post);
          });
        }
      })
      .catch(error =>
        response.status(404).json({ post: "Post not found with given ID" })
      );
  }
);

module.exports = router;
