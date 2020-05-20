const faker = require("faker");
const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");
const Friendship = require("./models/friendship");
const async = require("async");

const seedDb = () => {
  for (let i = 0; i < 100; i++) {
    const name = faker.name.findName();
    const password = "password";
    const user = new User({
      name: name,
      password: password,
    }).save((err) => {
      return err;
    });
  }

  for (let j = 0; j < 100; j++) {
    const user = User.findOne({}).exec((err, user) => {
      if (err) {
        return err;
      }
      const content = faker.lorem.paragraph();
      const post = new Post({
        content: content,
        user: user.id,
      }).save((err) => {
        return err;
      });
    });
  }

  for (let k = 0; k < 100; k++) {
    async.parallel(
      {
        user: (callback) => User.findOne({}).exec(callback),
        post: (callback) => Post.findOne({}).exec(callback),
      },
      (err, results) => {
        if (err) {
          return err;
        }
        if (results.user === null || results.post === null) {
          const err = new Error("User or post not found");
          err.status = 404;
          return err;
        }
        const content = faker.lorem.paragraph();
        const comment = new Comment({
          content: content,
          user: results.user.id,
          post: results.post.id,
        }).save((err) => {
          return err;
        });
      }
    );
  }

  for (let m = 0; m < 100; m++) {
    // https://stackoverflow.com/a/56972304
    async.parallel(
      {
        user1: (callback) =>
          User.aggregate([{ $sample: { size: 1 } }]).exec(callback),
        user2: (callback) =>
          User.aggregate([{ $sample: { size: 1 } }]).exec(callback),
      },
      function (err, results) {
        if (err) {
          return err;
        }

        const friendship = new Friendship({
          user1: results.user1[0]._id,
          user2: results.user2[0]._id,
        }).save((err) => {
          return err;
        });
      }
    );
  }
};

module.exports = seedDb;
