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