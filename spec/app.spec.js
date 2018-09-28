// this gotta go at the top so ur env is set before anything else!!!!!
process.env.NODE_ENV = "test";

const app = require("../app");
const { expect } = require("chai");
const request = require("supertest")(app);
const mongoose = require("mongoose");
const seedDB = require("../seed/seed.js");
const data = require("../seed/testData");

describe("/api", function() {
  /*
  * this.timeout(5000);
  * if we use this, can't then use arrow functions
  * we gotta use a ye olde function
  */

  this.timeout(6000);

  let topicDocs, userDocs, articleDocs, commentDocs;

  beforeEach(() => {
    console.log("reseeding the database.....");
    return seedDB(data).then(allDocs => {
      [topicDocs, userDocs, articleDocs, commentDocs] = allDocs;
      return;
    });
  });

  after(() => mongoose.disconnect());

  describe("/topics", () => {
    describe("/", () => {
      it("GET responds with status 200 and a JSON object containing all topics", () => {
        return request
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).to.be.an("array");
            expect(topics[0]).to.contain.keys("title", "slug");
            expect(topics[0].slug).to.equal(topicDocs[0].slug);
            expect(topics[0]._id).to.equal(`${topicDocs[0]._id}`);
          });
      });
    });
    describe("/:topic_slug/articles", () => {
      it("GET responds with status 200 and an object containing articles for a given topic", () => {
        return request
          .get(`/api/topics/${articleDocs[0].belongs_to}/articles`)
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0]._id).to.equal(`${articleDocs[0]._id}`);
            expect(articles[0].belongs_to).to.equal(articleDocs[0].belongs_to);
          });
      });
    });
    it("GET responds with status 404 and msg 'Page not found'", () => {
      return request
        .get("/api/invalid_topic/articles")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Page not found");
        });
    });
  });

  describe("/articles", () => {
    describe("/", () => {
      it("GET responds with status 200 and an object containing all articles", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
            expect(articles[0]).to.contain.keys(
              "title",
              "body",
              "votes",
              "created_at",
              "belongs_to",
              "created_by"
            );
            expect(articles[0].body).to.equal(articleDocs[0].body);
          });
      });
    });

    describe("/:article_id", () => {
      it("GET responds with status 200 and an object containing a specific article", () => {
        return request
          .get(`/api/articles/${articleDocs[0]._id}`)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.be.an("object");
            expect(article._id).to.equal(`${articleDocs[0]._id}`);
          });
      });
      it("GET responds with status 404 and a msg 'Page not found' when ID is valid but not found", () => {
        return request
          .get(`/api/articles/${userDocs[0]._id}`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Page not found");
          });
      });
      it("GET responds with status 400 and msg 'Bad Request' when given an invalid ID", () => {
        return request
          .get("/api/articles/blinky")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("PATCH with query up responds with status 200, and an object containing the update article", () => {
        return request
          .patch(`/api/articles/${articleDocs[0]._id}?vote=up`)
          .expect(200)
          .then(({ body }) => {
            expect(body.votes).to.equal(articleDocs[0].votes + 1);
          });
      });
      it("PATCH with query down responds with status 200 and the updated article", () => {
        return request
          .patch(`/api/articles/${articleDocs[0]._id}?vote=down`)
          .expect(200)
          .then(({ body }) => {
            expect(body.votes).to.equal(articleDocs[0].votes - 1);
          });
      });
    });

    describe("/:article_id/comments", () => {
      it("GET responds with status 200 and all the the comments for a given article", () => {
        return request
          .get(`/api/articles/${articleDocs[0]._id}/comments`)
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.an("array");
            expect(comments[0]._id).to.equal(`${commentDocs[0]._id}`);
          });
      });
      it("GET responds with status 404 and message 'Page not found' when the article id doesn't exist", () => {
        return request
          .get(`/api/articles/${commentDocs[0]._id}/comments`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Page not found");
          });
      });
    });
    it("GET responds with status 400 and message 'Bad Request' when the article id is not valid", () => {
      return request
        .get("/api/articles/blinky/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad request");
        });
    });
  });

  describe("/users", () => {
    describe("/", () => {
      it("GET responds with a specific user's profile data", () => {
        return request
          .get(`/api/users/${userDocs[0].username}`)
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.contain.keys(["username", "name", "avatar_url"]);
            expect(user).to.be.an("object");
          });
      });
      it("GET responds with status 404 and msg 'page not found' when given a non-existent username", () => {
        return request
          .get("/api/users/blinky")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Page not found");
          });
      });
    });
  });
  describe("/comments", () => {
    describe.only("/comments/:comment_id", () => {
      it("PATCH responds with status 200 and an object containing the updated document when voted up", () => {
        return request
          .patch(`/api/comments/${commentDocs[0]._id}?vote=up`)
          .expect(200)
          .then(({body}) => {
            expect(body.votes).to.equal(commentDocs[0].votes + 1);
          });
      });
      it("PATCH responds with status 200 and an object containing the updated document when voted down", () => {
        return request
          .patch(`/api/comments/${commentDocs[0]._id}?vote=down`)
          .expect(200)
          .then(({body}) => {
            expect(body.votes).to.equal(commentDocs[0].votes - 1);
          });
      });
    });
  });
});
