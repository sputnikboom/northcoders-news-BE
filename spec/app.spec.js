// this gotta go at the top so ur env is set before anything else!!!!!
process.env.NODE_ENV = "test";
//
const app = require("../app");
const { expect } = require("chai");
const request = require("supertest")(app);
const mongoose = require("mongoose");
const seedDB = require("../seed/seed.js");
const data = require("../seed/testData");

describe("/api", () => {
  beforeEach(() => {
    console.log("reseeding the database.....");
    return seedDB(data)
    .then(allDocs => {
      [topicDocs, userDocs, articleDocs, commentDocs] = allDocs;
      return
    });
  });

  after(() => mongoose.disconnect());

  describe("/topics", () => {
    it("GET responds with status 200 and a JSON object containing all topics", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics).to.be.an("array");
          expect(res.body.topics.length).to.equal(2);
          expect(res.body.topics[0]).to.have.all.keys(
            "title",
            "slug",
            "__v",
            "_id"
          );
          expect(res.body.topics[0].slug).to.equal("mitch");
        });
    });

    it("GET responds with status 200 and an object containing articles for a given topic", () => {
      return request
        .get(`/api/topics/${articleDocs[0].belongs_to}/articles`)
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(2);
          expect(res.body.articles[0].belongs_to).to.equal(
            articleDocs[0].belongs_to
          );
        });
    });
  });

  describe("/articles", () => {
    it("GET responds with status 200 and an object containing all articles", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("array");
          expect(res.body.articles.length).to.equal(4);
          expect(res.body.articles[0]).to.have.all.keys(
            "title",
            "body",
            "votes",
            "created_at",
            "belongs_to",
            "created_by",
            "_id",
            "__v"
          );
          expect(res.body.articles[0].body).to.equal(
            "I find this existence challenging"
          );
        });
    });
    it("GET responds with status 200 and an object containing a specific article", () => {
      return request
        .get(`/api/articles/${articleDocs[0]._id}`)
        .expect(200)
        .then(res => {
        expect(res.body.article.title).to.equal(articleDocs[0].title);
        expect(res.body.article.body).to.equal(articleDocs[0].body);
        });
    });
    it("GET responds with status 200 and all the the comments for a given article", () => {
      return request
        .get(`/api/articles/${articleDocs[0]._id}/comments`)
        .expect(200)
        .then(res => {
            expect(res.body.comments.length).to.equal(2);
            expect(res.body.comments[0].body).to.equal(commentDocs[0].body);
        });
    });
  });
});
