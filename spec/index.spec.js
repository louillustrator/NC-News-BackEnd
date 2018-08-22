process.env.NODE_ENV = "test";
const app = require("../app");

const request = require("supertest")(app);
const mongoose = require("mongoose");
const { expect } = require("chai");
const seedDB = require("../seed/seed");
const data = require("../seed/testData");

let newMongoId = mongoose.Types.ObjectId();

describe("/api/topics", () => {
  let comments, users, topics, articles;
  beforeEach(() => {
    return seedDB(data).then(docs => {
      [comments, users, topics, articles] = docs;
    });
  });
  after(() => {
    mongoose.disconnect();
  });
  it("GET /api/topics brings back all topic types", () => {
    return request
      .get("/api/topics")
      .expect(200)
      .then(res => expect(res.body).to.have.all.keys("topics"));
  });
  it("GET /api/topics/:topic_slug/articles brings back all the articles for a certain topic", () => {
    return request
      .get("/api/topics/cats/articles")
      .expect(200)
      .then(res => {
        expect(res.body).to.have.all.keys("article");
        expect(res.body.article.length).to.equal(2);
      });
  });
  it("GET /api/topics gives a 400 error with an invalid topic", () => {
    return request
      .get("/api/topics/banannas/articles")
      .expect(400)
      .then(res => {
        expect(res.body.msg).to.equal("topic not found");
      });
  });
  it("POST /api/topics/:topic_slug/articles, posts a new article related to a topic", () => {
    const newArticle = {
      title: "Lou's article",
      body:
        "this is going to be a long article all about ants and their love of tea",
      belongs_to: topics[0].slug,
      created_by: users[0]._id
    };
    return request
      .post(`/api/topics/${newArticle.belongs_to}/articles`)
      .send(newArticle)
      .expect(201)
      .then(res => {
        expect(res.body).to.have.all.keys("message", "article");
        expect(res.body.article).to.be.an("object");
        expect(res.body.article.title).to.equal(newArticle.title);
      });
  });
  it("POST /api/topics/:topic_slug/articles returns a 400 if the body is wrong", () => {
    const newArticle = {
      body:
        "this is going to be a long article all about ants and their love of tea",
      belongs_to: topics[0].slug,
      created_by: users[0]._id
    };
    return request
      .post(`/api/topics/${newArticle.belongs_to}/articles`)
      .send(newArticle)
      .expect(400)
      .then(res => {
        expect(res.body.msg).to.equal("please check body for correct input");
      });
  });
  it("POST /api/topics/:topic_slug/articles returns a 404 if the topic id is invalid", () => {
    const newArticle = {
      title: "I'm a title!",
      body:
        "this is going to be a long article all about ants and their love of tea",
      belongs_to: "tea",
      created_by: users[0]._id
    };
    return request
      .post(`/api/topics/${newArticle.belongs_to}/articles`)
      .send(newArticle)
      .expect(404)
      .then(res => {
        expect(res.body.msg).to.equal("that topic doesn't exist!");
      });
  });

  describe("/api/articles", () => {
    let comments, users, topics, articles;
    beforeEach(() => {
      return seedDB(data).then(docs => {
        [comments, users, topics, articles] = docs;
      });
    });
    after(() => {
      mongoose.disconnect();
    });
    it("GET /api/articles brings back all articles", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => expect(res.body).to.have.all.keys("articlesCounted"));
    });
    it("GET /api/articles/:article_id brings back a single article", () => {
      return request
        .get(`/api/articles/${articles[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys("article");
          expect(res.body.article).to.have.all.keys(
            "votes",
            "_id",
            "title",
            "created_by",
            "body",
            "created_at",
            "belongs_to",
            "__v",
            "comment_count"
          );
          expect(res.body.article).to.be.an("object");
        });
    });
    it("GET /api/articles/:article_id returns a 400 if passed an incorrect id ", () => {
      return request
        .get(`/api/articles/5b6307a3a825315b1f552a`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("not a valid article id");
        });
    });
    it("GET /api/articles/:article_id returns a 404 if passed a valid id from a different colletion ", () => {
      return request
        .get(`/api/articles/${users[0]._id}`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal(
            "that is not an article id, please try again"
          );
        });
    });
    it("GET /api/articles/:article_id/comments returns all the comments for an individual article", () => {
      return request
        .get(`/api/articles/${articles[0]._id}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys("comments");
        });
    });
    it("GET /api/articles/:article_id/comments returns a 400 error if passed an invalid id", () => {
      return request
        .get(`/api/articles/8r67585769869898798/comments`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("not a valid article id");
        });
    });
    it("GET /api/articles/:article_id/comments returns a 404 error if passed a valid id but from a different colection", () => {
      return request
        .get(`/api/articles/${users[0]._id}/comments`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("that article does not exist! ");
        });
    });
    it("POST /api/articles/:article_id/comments adds a new comment to an article", () => {
      const newComment = {
        body: "this comment is pretty pointless tbh",
        belongs_to: articles[0]._id,
        created_by: users[0]._id
      };
      return request
        .post(`/api/articles/${newComment.belongs_to}/comments`)
        .send(newComment)
        .expect(201)
        .then(res => {
          expect(res.body).to.have.all.keys("comment");
        });
    });
    it("POST /api/articles/:article_id/comments returns a 400 error if the article id is not a valid id", () => {
      const newComment = {
        body: "this comment is pretty pointless tbh",
        belongs_to: articles[0]._id,
        created_by: users[0]._id
      };
      return request
        .post(`/api/articles/octopi/comments`)
        .send(newComment)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("not a valid article id");
        });
    });
    it("POST /api/articles/:article_id/comments returns a 404 error if the id passed is not an article id but still valid", () => {
      const newComment = {
        body: "this comment is pretty pointless tbh",
        belongs_to: articles[0]._id,
        created_by: users[0]._id
      };
      return request
        .post(`/api/articles/${topics[0].id}/comments`)
        .send(newComment)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("that article does not exist!");
        });
    });
    it("POST /api/articles/:article_id/comments returns a 400 error if any required information is missed", () => {
      const newComment = {
        belongs_to: articles[0]._id,
        created_by: users[0]._id
      };
      return request
        .post(`/api/articles/${newComment.belongs_to}/comments`)
        .send(newComment)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Plese check required fields");
        });
    });
    it("PUT /api/articles/:article_id?vote=up the query increases the vote up by one each time", () => {
      return request
        .put(`/api/articles/${articles[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(articles[0].votes + 1);
        });
    });
    it("PUT /api/articles/:article_id?vote=down the query decreases the vote down by one each time", () => {
      return request
        .put(`/api/articles/${articles[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(articles[0].votes - 1);
        });
    });

    //write a test for short numbers
    it("PUT /api/articles/:article_id?vote=down if passed an invalid id it will return a 404", () => {
      return request
        .put(`/api/articles/5b6307a3a825315b1f552a90?vote=down`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("that is not a valid article id");
        });
    });

    describe("/api/comments", () => {
      let comments, users, topics, articles;
      beforeEach(() => {
        return seedDB(data).then(docs => {
          [comments, users, topics, articles] = docs;
        });
      });
      after(() => {
        mongoose.disconnect();
      });

      it("PUT /api/comments/:comment_id?vote=up the query increases the vote up by one each time", () => {
        return request
          .put(`/api/comments/${comments[0].id}?vote=up`)
          .expect(200)
          .then(res => {
            expect(res.body.comment.votes).to.equal(comments[0].votes + 1);
          });
      });

      it("PUT /api/comments/:comment_id?vote=down the query decreases the vote down by one each time", () => {
        return request
          .put(`/api/comments/${comments[0]._id}?vote=down`)
          .expect(200)
          .then(res => {
            expect(res.body.comment.votes).to.equal(comments[0].votes - 1);
          });
      });

      it("PUT /api/comments/:comment_id?vote=down if passed an invalid id it will return a 404", () => {
        return request
          .put(`/api/comments/5b6307a3a825315b1f552a90?vote=down`)
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("that is not a valid comment id");
          });
      });

      it("DELETE /api/comments/:comment_id", () => {
        return request
          .delete(`/api/comments/${comments[0]._id}`)
          .expect(200)
          .then(res => {
            expect(res.body).to.have.all.keys("msg");
            //now to check if it's gone
            return request
              .delete(`/api/comments/${comments[0]._id}`)
              .expect(400)
              .then(res => {
                expect(res.body.msg).to.equal("this comment doesn't exist!");
              });
          });
      });

      describe("/api/users", () => {
        let comments, users, topics, articles;
        beforeEach(() => {
          return seedDB(data).then(docs => {
            [comments, users, topics, articles] = docs;
          });
        });
        after(() => {
          mongoose.disconnect();
        });
        it("GET /api/users returns all users", () => {
          return request
            .get("/api/users")
            .expect(200)
            .then(res => expect(res.body).to.have.all.keys("users"));
        });
        it("GET api/users/:username brings back a single users information", () => {
          return request
            .get(`/api/users/${users[0].username}`)
            .expect(200)
            .then(res => {
              expect(res.body.user).to.have.all.keys(
                "__v",
                "_id",
                "username",
                "name",
                "avatar_url"
              );
            });
        });
        it("GET api/users/:username returns a 404 if passed an ivalid username", () => {
          return request
            .get("/api/users/hinkeydinkey")
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal(
                "that is not a username please try again"
              );
            });
        });
      });
    });
  });
});
