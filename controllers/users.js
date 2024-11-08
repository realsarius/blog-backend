const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../model/user");
const {tokenExtractor} = require("../utils/middleware")

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate("blogs", {url: 1, title: 1, author: 1})

    response.json(users)
})

usersRouter.get("/:id", async (request, response) => {
    const fetchedUser = await User.findById(request.params.id);

    if (fetchedUser) {
        return response.status(200).json({message: "User successfully found.", user: fetchedUser});
    } else {
        return response.status(404).json({error: 'User not found.', errorCode: "404"})
    }
})

usersRouter.post("/", async (req, res) => {
    const {username, name, password} = req.body;

    if (username.length < 3) {
        return res.status(401).json({error: "Username must be at least 3 characters long"})
    }

    if (password.length < 3) {
        return res.status(401).json({error: "Password must be at least 3 characters long"})
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save();

    return res.status(201).json(savedUser);
})

usersRouter.delete("/:id", tokenExtractor, async (request, response) => {
    const deletedUser = await User.findByIdAndDelete(request.params.id)

    if (deletedUser) {
        return response.status(200).json({message: "User deleted successfully", user: deletedUser});
    } else {
        return response.status(404).json({error: "User not found"})
    }
})

module.exports = usersRouter