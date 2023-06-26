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
    test("returns 404 error status if bad endpoint requested", () => {
        return request(app)
            .get("/aip")
            .expect(404)
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
    test("returns 404 error status if bad endpoint requested", () => {
        return request(app)
            .get("/api/tocips")
            .expect(404)
    })
})