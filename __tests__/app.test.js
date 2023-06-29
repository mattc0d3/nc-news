const request = require("supertest")
const app = require(`${__dirname}/../api/app`)
const db = require(`${__dirname}/../db/connection`)
const seed = require(`${__dirname}/../db/seeds/seed`)
const testData = require(`${__dirname}/../db/data/test-data/index`)

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end()
})

describe("ALL non-existent path", () => {
    test("responds with a 404 custom error message when bad endpoint is requested", () => {
        return request(app)
            .get("/api/abcd123")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found")
            })
    })
})

describe("GET /api", () => {
    test("responds with JSON object containing endpoints key", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .then(({ body }) => {
                expect(body.hasOwnProperty("endpoints")).toBe(true)
            })
    })
    test("endpoints object contains keys of endpoints and object values that describe attributes", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                expect(Object.keys(body.endpoints).forEach(key => expect.any(String)))
                expect(Object.values(body.endpoints).forEach(value => {
                    if (value !== body.endpoints["GET /api"]) {
                        expect(value).toMatchObject({
                            description: expect.any(String),
                            queries: expect.any(Array),
                            exampleResponse: expect.any(Object)
                        })
                    }
                }))
            })
    })
})

describe("GET /api/topics", () => {
    test("responds with an object containing topics key", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                expect(body.hasOwnProperty("topics")).toBe(true)
            })
    })
    test("topics object contains array of objects with correct keys and value types", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                expect(body.topics).toBeInstanceOf(Array)
                expect(body.topics.length).toBe(3)
                body.topics.forEach(topic => {
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                })
            })
    })
})

describe("GET /api/articles", () => {
    test("articles object contains array of all articles with correct keys and value types", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeInstanceOf(Array)
                expect(body.articles.length).toBe(13)
                body.articles.forEach(article => {
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    })
                    expect(article.hasOwnProperty("body")).toBe(false)
                })
            })
    })
    test("articles array is sorted by date in descending order", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy("created_at", { descending: true })
            })
    })
    test("articles array contains comment_count property", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeInstanceOf(Array)
                expect(body.articles.length > 0).toBe(true)
                body.articles.forEach(article => {
                    expect(article.hasOwnProperty("comment_count")).toBe(true)
                    expect(typeof article.comment_count).toBe("string")
                })
            })
    })
})

describe("POST /api/articles", () => {
    test("responds with a newly added article object, containing all correct properties", () => {
        return request(app)
            .post("/api/articles")
            .send({
                author: "butter_bridge",
                title: "test_title",
                body: "test_body",
                topic: "cats",
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            })
            .expect(201)
            .then(({ body }) => {
                expect(body.postedArticle).toMatchObject({
                    author: "butter_bridge",
                    title: "test_title",
                    body: "test_body",
                    topic: "cats",
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    article_id: expect.any(Number),
                    votes: 0,
                    created_at: expect.any(String),
                    comment_count: "0"
                })
            })
    })
    test("endpoint ignores unnecessary properties on request body", () => {
        return request(app)
            .post("/api/articles")
            .send({
                author: "icellusedkars",
                title: "test_title",
                body: "test_body",
                topic: "paper",
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                extra: "extra_data"
            })
            .expect(201)
    })
    test("sets article_img_url to default value if not provided in request", () => {
        return request(app)
            .post("/api/articles")
            .send({
                author: "lurker",
                title: "test_title",
                body: "test_body",
                topic: "mitch"
            })
            .expect(201)
            .then(({ body }) => {
            expect(body.postedArticle.article_img_url).toBe('https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700')
            })
    })
    test("returns 404 not found error when username does not exist", () => {
        return request(app)
            .post("/api/articles")
            .send({
                author: "test_user",
                title: "test_title",
                body: "test_body",
                topic: "cats",
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found")
            })
    })
    test("returns 404 not found error when topic does not exists", () => {
        return request(app)
            .post("/api/articles")
            .send({
                author: "butter_bridge",
                title: "test_title",
                body: "test_body",
                topic: "test_topic",
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found")
            })
    })
    test("returns 400 bad request error when post info is incomplete", () => {
        return request(app)
            .post("/api/articles")
            .send({ author: "rogersop", topic: "paper" })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
})

describe("GET /api/articles/:article_id", () => {
    test("article object contains all correct properties and has specified ID", () => {
        return request(app)
            .get("/api/articles/9")
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toMatchObject({
                    article_id: 9,
                    author: expect.any(String),
                    title: expect.any(String),
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String)
                })
            })
    })
    test("responds with 404 status and article not found error when id does not exist", () => {
        return request(app)
            .get("/api/articles/999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found")
            })
    })
    test("responds with 400 status and bad request error when id not found", () => {
        return request(app)
            .get("/api/articles/eight")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
})

describe("GET /api/articles/:article_id/comments", () => {
    test("response contains array of comments object with matching IDs and correct properties", () => {
        return request(app)
            .get("/api/articles/3/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toBeInstanceOf(Array)
                expect(body.comments.length > 0).toBe(true)
                body.comments.forEach(comment => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: 3
                    })
                })
            })
    })
    test("returns 200 status code and empty object if no comments match valid article ID", () => {
        return request(app)
            .get("/api/articles/4/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toEqual([])
            })
    })
    test("comments array is sorted by most recent first", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toBeSortedBy("created_at", { descending: true })
            })
    })
    test("returns 404 error when article ID not found", () => {
        return request(app)
            .get("/api/articles/-2/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found")
            })
    })
    test("returns 400 error when request contains bad ID data", () => {
        return request(app)
            .get("/api/articles/[2]/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
})

describe("POST /api/articles/:article_id/comments", () => {
    test("returns object containing the posted comment", () => {
        return request(app)
            .post("/api/articles/2/comments")
            .send({ username: "lurker", body: "test_body"})
            .expect(201)
            .then(({ body }) => {
                expect(body.comment).toMatchObject({
                    comment_id: expect.any(Number),
                    author: "lurker",
                    body: "test_body",
                    article_id: 2,
                    votes: 0,
                    created_at: expect.any(String)
                })
            })
    })
    test("endpoint ignores unnecessary properties on request body", () => {
        return request(app)
        .post("/api/articles/12/comments")
        .send({ username: "icellusedkars", extraData1: "test", body: "test_body", extraData2: "test"})
        .expect(201)
    })
    test("returns 404 not found error when username does not exist", () => {
        return request(app)
            .post("/api/articles/7/comments")
            .send({ username: "test_user", body: "test_body"})
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found")
            })
    })
    test("returns 404 not found error when article_id does not exists", () => {
        return request(app)
            .post("/api/articles/0/comments")
            .send({ username: "lurker", body: "test_body"})
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found")
            })
    })
    test("returns 400 bad request error when ID parameter contains bad data", () => {
        return request(app)
        .post("/api/articles/notanid/comments")
        .send({ username: "butter_bridge", body: "test_body" })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        })
    })
    test("returns 400 bad request error when post info is incomplete", () => {
        return request(app)
            .post("/api/articles/9/comments")
            .send({ username: "rogersop" })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
})

describe("PATCH /api/articles/:article_id", () => {
    test("responds with article containing updated vote count", () => {
        return request(app)
            .patch("/api/articles/5")
            .send({ inc_votes: 3 })
            .expect(201)
            .then(({ body }) => {
                expect(body.article.votes).toBe(3)
            })
    })
    test("handles negative vote update", () => {
        return request(app)
            .patch("/api/articles/9")
            .send({ inc_votes: -8 })
            .expect(201)
            .then(({ body }) => {
                expect(body.article.votes).toBe(-8)
            })
    })
    test("ignores additional properties on patch request body", () => {
        return request(app)
            .patch("/api/articles/12")
            .send({ inc_votes: 10, extra: "test_data" })
            .expect(201)
            .then(({ body }) => {
                expect(body.article.votes).toBe(10)
            })
    })
    test("returns 404 error when article ID does not exist", () => {
        return request(app)
            .patch("/api/articles/123")
            .send({ inc_votes: 5 })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found")
            })
    })
    test("returns 400 error when request body has missing data", () => {
        return request(app)
            .patch("/api/articles/5")
            .send({ key: "value" })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
    test("returns 400 error when ID parameter contains bad data", () => {
        return request(app)
            .patch("/api/articles/number")
            .send({ inc_votes: 5 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
})

describe("PATCH /api/comments/:comment_id", () => {
    test("responds with updated comment object containing updated vote count", () => {
        return request(app)
            .patch("/api/comments/8")
            .send({ inc_votes: 1 })
            .expect(201)
            .then(({ body }) => {
                expect(body.updatedComment.votes).toBe(1)
            })
    })
    test("handles negative vote update", () => {
        return request(app)
            .patch("/api/comments/5")
            .send({ inc_votes: -8 })
            .expect(201)
            .then(({ body }) => {
                expect(body.updatedComment.votes).toBe(-8)
            })
    })
    test("ignores additional properties on patch request body", () => {
        return request(app)
            .patch("/api/comments/12")
            .send({ inc_votes: 10, extra: "test_data" })
            .expect(201)
            .then(({ body }) => {
                expect(body.updatedComment.votes).toBe(10)
            })
    })
    test("returns 404 error when comment ID does not exist", () => {
        return request(app)
            .patch("/api/comments/123")
            .send({ inc_votes: 5 })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found")
            })
    })
    test("returns 400 error when request body has missing data", () => {
        return request(app)
            .patch("/api/comments/5")
            .send({ key: "value" })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
    test("returns 400 error when ID parameter contains bad data", () => {
        return request(app)
            .patch("/api/comments/number")
            .send({ inc_votes: 5 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
})
    
describe("DELETE /api/comments/:comment_id", () => {
    test("responds with 204 status and no content on response body", () => {
        return request(app)
            .delete("/api/comments/4")
            .expect(204)
    })
    test("returns 404 error when comment ID not found", () => {
        return request(app)
            .delete("/api/comments/100")
            .expect(404)
            .then(({ body }) => expect(body.msg).toEqual("Not Found"))
    })
    test("returns 400 error when request contains bad ID data", () => {
        return request(app)
            .delete("/api/comments/£!>")
            .expect(400)
            .then(({ body }) => expect(body.msg).toEqual("Bad Request"))
    })
})

describe("GET /api/users", () => {
    test("responds with an array of all users with correct properties", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
                expect(body.users).toBeInstanceOf(Array)
                expect(body.users.length > 0).toBe(true)
                body.users.forEach(user => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            })
    })
})

describe("GET /api/users/:username", () => {
    test("responds with a user object containing matching username and other properties", () => {
        return request(app)
            .get("/api/users/lurker")
            .expect(200)
            .then(({ body }) => {
                expect(body.user).toMatchObject({
                    username: 'lurker',
                    name: 'do_nothing',
                    avatar_url:
                      'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
                  })
            })
    })
    test("responds with 404 status and not found error when username does not exist", () => {
        return request(app)
            .get("/api/users/not_a_user")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found")
            })
    })
})

describe("GET /api/articles (queries)", () => {
    test("response filters articles by topic when query included in request", () => {
        return request(app)
            .get("/api/articles?topic=cats")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeInstanceOf(Array)
                expect(body.articles.length > 0).toBe(true)
                body.articles.forEach(article => expect(article.topic).toBe("cats"))
            })
    })
    test("response sorts articles by column specified in query", () => {
        return request(app)
            .get("/api/articles?sort_by=author")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy("author", { descending: true })
            })
    })
    test("response orders articles by ascending or descending as specified", () => {
        return request(app)
            .get("/api/articles?order=asc")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy("created_at")
            })
    })
    test("response accepts and formats articles for multiple queries", () => {
        return request(app)
            .get("/api/articles?sort_by=title&topic=mitch&order=desc")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.length > 0).toBe(true)
                expect(body.articles).toBeSortedBy("title", { descending: true })
                body.articles.forEach(article => expect(article.topic).toBe("mitch"))
            })
    })
    test("ignores invalid queries and extracts valid ones", () => {
        return request(app)
            .get("/api/articles?topics=cats&order=asc")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.length).toBe(13)
                expect(body.articles).toBeSortedBy("created_at")
            })
    })
    test("responds with 200 status code and empty object when valid topic exists but has no articles", () => {
        return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
    })
    test("returns 400 bad request error for invalid topic query", () => {
        return request(app)
            .get("/api/articles?topic=dogs")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
    test("returns 400 bad request error for invalid sort_by query", () => {
        return request(app)
            .get("/api/articles?sort_by=invalid")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
    test("returns 400 bad request error for invalid order query", () => {
        return request(app)
            .get("/api/articles?order=backwards")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })

})