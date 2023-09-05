const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 4004

app.use(express.json())
app.use(cors())

const {getAllPosts, getCurrentUserPosts, addPost, editPost, deletePost} = require('./controllers/posts')
const {register, login} = require('./controllers/auth')
const isAuthenticated = require('./middleware/isAuthenticated')

app.post('/register', register)
app.post('/login', login)

app.get('/posts', getAllPosts)

app.get('/userposts/:userId', getCurrentUserPosts)
app.post('/posts', isAuthenticated, addPost)
app.put('/posts/:id', isAuthenticated, editPost)
app.delete('/posts/:id', isAuthenticated, deletePost)

app.listen(PORT, () => console.log(`Running on Port ${PORT}`))