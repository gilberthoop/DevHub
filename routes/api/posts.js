const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Post model
const Post = require("../../models/Post");
// Profile model
const Profile = require("../../models/Profile");
// Validation
const validatePostInput = require("../../validation/post");

// @route   GET api/posts/test
// @desc     Test posts route
// @access  Public
router.get("/test", (req, res) =>
  res.json({ message: "Hello world from Posts API" })
);

// @route   GET api/posts
// @desc     Get posts
// @access  Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostfound: "No posts found" }));
});

// @route   GET api/posts/:id
// @desc     Get a post by id
// @access  Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopostfound: "Post does not exist" }));
});

// @route   POST api/posts
// @desc     Create posts
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //Check validation
    if (!isValid) {
      // if any errors, send 400 status err object
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route   DELETE api/posts/:id
// @desc     Delete a post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check if the owner of the post is the logged in user
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ forbidden: "User not authorized." });
          }

          // Delete the post
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err =>
          res.status(404).json({ postnotfound: "Post does not exist" })
        );
    });
  }
);

// @route   POST api/posts/like/:id
// @desc    Like or unlike a post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // If the user has not liked the post, like the post
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            // Add the user id to the likes array
            post.likes.unshift({ user: req.user.id });
          }
          // Else unlike the post
          else {
            // Get the remove index
            const removeIndex = post.likes
              .map(item => item.user.toString())
              .indexOf(req.user.id);

            // Splice the like from array
            post.likes.splice(removeIndex, 1);
          }

          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ postnotfound: "Post does not exist" })
        );
    });
  }
);

module.exports = router;
