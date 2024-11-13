const blogsRouter = require('express').Router();
const Blog = require('../model/blog');
const User = require('../model/user');
const { tokenExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 });

    response.status(200).json(blogs);
});


blogsRouter.get('/my', tokenExtractor, async (request, response) => {
    if (!request.user.id) {
        return response.status(401).json({ error: 'Token invalid' });
    }

    const blogs = await Blog.find({ user: request.user.id }).populate('user', { username: 1, name: 1, id: 1 });

    response.status(200).json(blogs);
});


blogsRouter.get('/:id', async (request, response) => {
    const theBlog = await Blog.findById(request.params.id);

    if (theBlog) {
        response.status(200).json(theBlog);
    } else {
        response.status(404).json({ error: 'Blog not found' });
    }

});

blogsRouter.delete('/:id', tokenExtractor, async (request, response) => {
    try {
        const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1, id: 1 });

        if (!blog) {
            return response.status(404).json({
                code: '404',
                error: `Blog with the ID ${request.params.id} not found`,
            });
        }

        if (blog.user.id !== request.user.id) {
            return response.status(403).json({
                code: '403',
                error: 'Only the creator can delete this blog',
            });
        }

        await Blog.findByIdAndDelete(request.params.id);

        response.status(204).json({
            code: '204',
            message: 'Blog successfully deleted',
            blog,
        });

    } catch (error) {
        console.error('Error deleting blog:', error);
        // Could be if blog doesn't have a User associated
        response.status(500).json({
            code: '500',
            error: 'An error occurred while deleting the blog',
        });
    }
});


blogsRouter.post('/', tokenExtractor, async (request, response) => {
    const body = request.body;

    if (!request.user || !request.user.id) {
        return response.status(401).json({ error: 'Token invalid or missing user information' });
    }

    const user = await User.findById(request.user.id);

    const blog = new Blog({
        title: body.title,
        author: user.name,
        url: body.url,
        likes: body.likes,
        user: user.id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
});


blogsRouter.put('/:id', tokenExtractor, async (request, response) => {
    const body = request.body;

    if (!request.user || !request.user.id) {
        return response.status(401).json({ error: 'Invalid or missing user information' });
    }

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
    response.json(updatedBlog);
});


module.exports = blogsRouter;