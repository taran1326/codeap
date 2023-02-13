const request = require('supertest');
const app = require('../index');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');
const User = require('../models/user');
jest.setTimeout(13000)

const ObjectId = require('mongoose').Types.ObjectId;

describe('Create and delete post', () => {
    const user = new User({
        email : 'test@gmail.com',
        password : 'Taranisgood' ,
        name:'TARAN'
    })

    it('Should create a post and return 200 with a JSON data and message if post creation is successful', async () => {
        const res = await request(app)
        .post('/posts/create')
        .send({ 
            content: 'Post content'
        })
        

        
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('post');
        expect(res.body.message).toBe("Post created!");
    });
    

    

    it('Should return 200 if post deletion is successful', async () => {
        const post = await Post.create({
            content: "Post content",
            user: user._id
        });

        console.log(post._id);

        const res = await request(app)
        .delete(`/posts/destroy/${post._id}`)
        .send({ user: user._id });
    
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Post deleted!");
    });
});
