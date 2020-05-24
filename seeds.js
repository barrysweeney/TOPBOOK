const faker = require("faker");
const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");

const seedDb = (req, res, next) => {
  for (let i = 0; i < 200; i++) {
    new User({
      name: faker.name.findName(),
      photoURL: faker.image.imageUrl(),
      githubId: faker.random.number(),
    }).save((err, user) => {
      if (err) {
        return next(err);
      }
      new Post({
        user: user.id,
        content: faker.lorem.paragraph(),
      }).save((err, post) => {
        if (err) {
          return next(err);
        }
        new Comment({
          post: post.id,
          content: faker.lorem.paragraph(),
          user: user.id,
        }).save((err, comment) => {
          if (err) {
            return next(err);
          }
        });
      });
    });
  }
};

module.exports = seedDb;
