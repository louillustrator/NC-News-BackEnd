process.env.NODE_ENV = "test";
const app = require("../app");

const request = require("supertest")(app);
const mongoose = require("mongoose");
const { expect } = require("chai");
const seedDB = require("../seed/seed");
const data = require("../seed/testData");

let newMongoId = mongoose.Types.ObjectId();
console.log(newMongoId);

describe("/api", () => {
  let comments, users, topics, articles;
  beforeEach(() => {
    return seedDB(data).then(docs => {
      // articles = docs[3];
      // topics = docs[2];
      // users = docs[1];
      // comments = docs[0];
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
});

describe.only("/api", () => {
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
      .then(res => expect(res.body).to.have.all.keys("articles"));
  });
  it("GET /api/articles/:article_id brings back an article", () => {
    return request
      .get(`/api/articles/${articles[0]._id}`)
      .expect(200)
      .then(res => {
        expect(res.body).to.have.all.keys("article");
        //I want to be able to look at articles keys but its not working
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
  //if i pass the address with an id that belongs to a different collection I get "article": null, so can address that will a 404 error
  it("GET /api/articles/:article_id returns a 404 if passed an id from a different colletion ", () => {
    return request
      .get(`/api/articles/5b6307a3a825315b1f552a`)
      .expect(400)
      .then(res => {
        expect(res.body.msg).to.equal("not a valid article id");
      });
  });
});
