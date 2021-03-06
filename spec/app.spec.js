process.env.NODE_ENV = "test";

const app = require("../app");
const { expect } = require("chai");
const request = require("supertest")(app);
const mongoose = require("mongoose");
const seedDB = require("../seed/seed.js");
const data = require("../seed/testData");

describe("/api", function() {
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
      it("GET responds with status 404 and msg 'Page not found'", () => {
        return request
          .get("/api/invalid_topic/articles")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Page not found");
          });
      });
    });
    it("POST responds with status 201 and an object containing the new document", () => {
      const newArticle = {
        title: "how to add a new document to mongo",
        created_by: `${userDocs[0]._id}`,
        body: "like this, yo"
      };
      return request
        .post(`/api/topics/${topicDocs[0].slug}/articles`)
        .send(newArticle)
        .expect(201)
        .then(({ body }) => {
          expect(body).to.contain.keys(
            "title",
            "belongs_to",
            "created_by",
            "body",
            "votes",
            "created_at",
            "comment_count"
          );
          expect(body.title).to.equal(newArticle.title);
          expect(body.comment_count).to.equal(0);
        });
    });
    it('POST responds with status 400 when given an invalid JSON article object', () => {
      const newArticle  ={ beep: "boop"}
      return request.post(`/api/topics/${topicDocs[0].slug}/articles`)
      .send(newArticle)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).to.equal('Bad request');
      })
    })
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
              "created_by",
              "comment_count"
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
      it("PATCH to an invalid article id responds with 400 and message 'Bad request", () => {
        return request
          .patch(`/api/articles/beep?vote=up`)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("PATCH with an article id that cannot be found responds with 404 and message 'Page not found'", () => {
        return request
          .patch(`/api/articles/${commentDocs[0]._id}?vote=up`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Page not found");
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
    it("POST responds with status 201 and an object containing the new comment", () => {
      const newComment = {
        body: "enough about this, let's talk about goldfish",
        created_by: `${userDocs[0]._id}`
      };
      return request
        .post(`/api/articles/${articleDocs[0]._id}/comments`)
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.created_by._id).to.equal(`${userDocs[0]._id}`);
          expect(body.belongs_to._id).to.equal(`${articleDocs[0]._id}`);
        });
    });

    it("POST responds with status 400 when given an invalid JSON comment object", () => {
      const newComment = {beep: "boop"}
      return request
      .post(`/api/articles/${articleDocs[0]._id}/comments`)
      .send(newComment)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).to.equal("Bad request")
      })
    })
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
    describe("/comments/:comment_id", () => {
      it("PATCH responds with status 200 and an object containing the updated document when voted up", () => {
        return request
          .patch(`/api/comments/${commentDocs[0]._id}?vote=up`)
          .expect(200)
          .then(({ body }) => {
            expect(body.votes).to.equal(commentDocs[0].votes + 1);
          });
      });
      it("PATCH responds with status 200 and an object containing the updated document when voted down", () => {
        return request
          .patch(`/api/comments/${commentDocs[0]._id}?vote=down`)
          .expect(200)
          .then(({ body }) => {
            expect(body.votes).to.equal(commentDocs[0].votes - 1);
          });
      });
    });
    it("DELETE responds with status 200, and an object containing the removed comment", () => {
      return request
        .delete(`/api/comments/${commentDocs[0]._id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body._id).to.equal(`${commentDocs[0]._id}`);
        })
        .then(() => {
          return request
            .get(`/api/comments/${commentDocs[0]._id}`)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Page not found");
            });
        });
    });
  });
});
