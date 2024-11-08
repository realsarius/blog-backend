const {test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../model/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test.only("notes are returned as json", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect('Content-Type', /application\/json/)
});

test.only("there are 6 blogs", async () => {
    const response = await api.get("/api/blogs")

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test("a valid blog can be added", async () => {
    const newBlog = {
        title: "New Blog Title",
        author: "John Chapman",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 5,
    }

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('New Blog Title'))
})

test("if likes property is missing, default likes is 0", async () => {
    const newBlogWithoutLikes = {
        title: "New Blog Title Without Likes",
        author: "Without Likes",
        url: "https://www.google.com"
    }

    await api
        .post("/api/blogs")
        .send(newBlogWithoutLikes)
        .expect(201)
        .expect("Content-Type", /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
})

test("should return 400 if title or url properties are missing", async () => {
    const newBlogWithoutTitleOrUrl = {
        author: "Author Name",
        likes: 9
    }

    await api
        .post("/api/blogs")
        .send(newBlogWithoutTitleOrUrl)
        .expect(400)
})

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('notes are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('a specific blog is within the returned notes', async () => {
        const response = await api.get('/api/blogs')

        const contents = response.body.map(r => r.title)
        assert(contents.includes('Go To Statement Considered Harmful'))
    })

    describe('viewing a specific blog', () => {

        test('succeeds with a valid id', async () => {
            const blogsAtStart = await helper.blogsInDb()

            const blogToView = blogsAtStart[0]

            const resultNote = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.deepStrictEqual(resultNote.body, blogToView)
        })

        test('fails with statuscode 404 if blog does not exist', async () => {
            const validNonexistingId = await helper.nonExistingId()

            await api
                .get(`/api/blogs/${validNonexistingId}`)
                .expect(404)
        })

        test('fails with statuscode 400 id is invalid', async () => {
            const invalidId = '5a3d5da59070081a82a3445'

            await api
                .get(`/api/blogs/${invalidId}`)
                .expect(400)
        })
    })

    describe('addition of a new note', () => {
        test('succeeds with valid data', async () => {
            const newBlog = {
                title: 'New succeeds with valid data Blog',
                author: "John Chapman",
                url: "http://www.newblog.com",
                likes: 5
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

            const contents = blogsAtEnd.map(n => n.title)
            assert(contents.includes('New succeeds with valid data Blog'))
        })

        test('fails with status code 400 if data invalid', async () => {
            const newBlog = {
                likes: 5
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
    })

    describe('deletion of a blog', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[1]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

            const contents = blogsAtEnd.map(r => r.title)
            assert(!contents.includes(blogToDelete.title))
        })
    })
})


after(async () => {
    await mongoose.connection.close()
})