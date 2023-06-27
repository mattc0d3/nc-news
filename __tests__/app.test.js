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
                        votes: expect.any(Number),
                        comment_count: expect.any(String)
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
})

describe("GET /api/articles/:article_id", () => {
    test("article object contains all correct properties and has specified ID", () => {
        return request(app)
            .get("/api/articles/7")
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toMatchObject({
                    article_id: 7,
                    author: expect.any(String),
                    title: expect.any(String),
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
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

describe("DELETE /api/comments/:comment_id", () => {
    test("responds with 204 status and no content on response body", () => {
        return request(app)
            .delete("/api/comments/4")
            .expect(204)
            .then(({ body }) => expect(body).toEqual({}))
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