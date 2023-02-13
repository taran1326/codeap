
// // // const request = require('supertest');
// // // const Comment = require('../models/comment');
// // // const Post = require('../models/post');
// // // const app = require('../index');



// // // describe('Comment create', () => {
// // //   let postId;

// // //   beforeEach(async () => {
// // //     // create a mock post to use for testing
// // //     const post = await Post.create({
// // //       title: 'Test Post',
// // //       content: 'Test Content',
// // //     });
// // //     postId = post._id;
// // //   });

// // //   afterEach(async () => {
// // //     // clear the test data
// // //     await Comment.deleteMany({});
// // //     await Post.deleteMany({});
// // //   });

// // //   it('creates a comment', async () => {
// // //     const response = await request(app)
// // //       .post('/comments/create')
// // //       .send({
// // //         post: postId,
// // //         content: 'Test Comment',
// // //       });

// // //     expect(response.statusCode).toBe(302);
// // //     // expect(response.body.data.comment.content).toBe('Test Comment'); 
// // //   });
// // // });



// // // describe('Comment destroy', () => {
// // //   let commentId;
// // //   let postId;

// // //   beforeEach(async () => {
// // //     // create a mock post to use for testing
// // //     const post = await Post.create({
// // //       title: 'Test Post',
// // //       content: 'Test Content',
// // //     });
// // //     postId = post._id;

// // //     // create a mock comment to use for testing
// // //     const comment = await Comment.create({
// // //       content: 'Test Comment',
// // //       post: postId,
// // //       user: 'Test User',
// // //     });
// // //     commentId = comment._id;
// // //   });

// // //   afterEach(async () => {
// // //     // clear the test data
// // //     await Comment.deleteMany({});
// // //     await Post.deleteMany({});
// // //   });

// // //   it('deletes a comment', async () => {
// // //     const response = await request(app)
// // //       .delete(`/comments/destroy?id=${commentId}&post_user_id=${postId}`);

// // //     expect(response.statusCode).toBe(200);
// // //     expect(response.body.data.comment_id).toBe(commentId.toString());
// // //   });
// // // });







// // // describe('Comment model test', () => {
// // //   beforeAll(async () => {
// // //     await mongoose.connect(
// // //       process.env.MONGODB_URI || 'mongodb://localhost:27017/test',
// // //       {
// // //         useNewUrlParser: true,
// // //         useUnifiedTopology: true,
// // //         useCreateIndex: true,
// // //         useFindAndModify: false,
// // //       }
// // //     );
// // //   });

// // //   afterAll(async () => {
// // //     await mongoose.connection.close();
// // //   });

// // //   it('creates and saves a comment', async () => {
// // //     const comment = new Comment({
// // //       user: 'Test User',
// // //       content: 'Test Content',
// // //     });

// // //     const savedComment = await comment.save();
// // //     const expected = {
// // //       user: 'Test User',
// // //       content: 'Test Content',
// // //     };
// // //     expect(savedComment).toMatchObject(expected);
// // //   });
// // // });



// // const { createComment } = require("../controllers/comments_controller");
// // const Comment = require("../models/comment");
// // const Post = require("../models/post");

// // describe("createComment", () => {
// //   let postId;

// //   beforeEach(async () => {
// //     jest.setTimeout(12000);
// //     // create a mock post to use for testing
// //     const post = await Post.create({
// //       title: "Test Post",
// //       content: "Test Content",
// //     });
// //     postId = post._id;

  
// //   });

// //   it("creates a new comment", async () => {
// //     const commentData = {
// //       content: "Test Comment",
// //       user: "Test User",
// //       post: postId,
// //     };

// //     const result = await createComment(commentData);
// //     expect(result).toBeDefined();
// //     expect(result.content).toEqual("Test Comment");
// //     expect(result.user).toEqual("Test User");
// //     expect(result.post).toEqual(postId);

// //     const savedComment = await Comment.findOne({
// //       content: "Test Comment",
// //     });
// //     expect(savedComment).toBeDefined();
// //     expect(savedComment.content).toEqual("Test Comment");
// //     expect(savedComment.user).toEqual("Test User");
// //     expect(savedComment.post).toEqual(postId);
// //   });
// // });



// // decribe("Test post request satus code" ,()=>{
// //   beforeEach(() => {

// //   });
// //   test("Post request status code" , () => {
    
// //   })
// // })



// const Like = require("../models/like");
// const Post =  require("../models/post");
// const Comment = require('../models/comment');
// const toggleLike = require('../controllers/to'); 

// jest.mock('../models/like', () => {
//   return {
//     create: jest.fn().mockResolvedValue({ _id: 'like-id' }),
//     findOne: jest.fn().mockResolvedValue(null),
//     findById: jest.fn().mockResolvedValue({ remove: jest.fn() }),
//   };
// });

// jest.mock('../models/post', () => {
//   return {
//     findById: jest.fn().mockResolvedValue({
//       _id: 'post-id',
//       likes: [],
//       save: jest.fn(),
//     }),
//   };
// });

// jest.mock('../models/comment', () => {
//   return {
//     findById: jest.fn().mockResolvedValue({
//       _id: 'comment-id',
//       likes: [],
//       save: jest.fn(),
//     }),
//   };
// });

// describe('toggleLike', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('creates a like for a post', async () => {
//     const req = {
//       user: { _id: 'user-id' },
//       query: { id: 'post-id', type: 'Post' },
//     };
//     const res = {
//       json: jest.fn(),
//     };

//     await toggleLike(req, res);

//     expect(Like.create).toHaveBeenCalledWith({
//       user: 'user-id',
//       likeable: 'post-id',
//       onModel: 'Post',
//     });
//     expect(Post.findById).toHaveBeenCalledWith('post-id');
//     expect(res.json).toHaveBeenCalledWith(200, {
//       message: 'Request successful!',
//       data: { deleted: false },
//     });
//   });

//   it('deletes a like for a post', async () => {
//     Like.findOne.mockResolvedValue({ remove: jest.fn() });

//     const req = {
//       user: { _id: 'user-id' },
//       query: { id: 'post-id', type: 'Post' },
//     };
//     const res = {
//       json: jest.fn(),
//     };

//     await toggleLike(req, res);

//     expect(Like.findOne).toHaveBeenCalledWith({
//       likeable: 'post-id',
//       onModel: 'Post',
//       user: 'user-id',
//     });
//     expect(Post.findById).toHaveBeenCalledWith('post-id');
//     expect(res.json).toHaveBeenCalledWith(200, {
//       message: 'Request successful!',
//       data: { deleted: true },
//     });
//   });

//   it('creates a like for a comment' , async () => {
//     const req = {
//     user: { _id: 'user-id' },
//     query: { id: 'comment-id', type: 'Comment' },
//     };
//     const res = {
//     json: jest.fn(),
//     };
//     await toggleLike(req, res);

//   expect(Like.create).toHaveBeenCalledWith({
//     user: 'user-id',
//     likeable: 'comment-id',
//     onModel: 'Comment',
//   });
//   expect(Comment.findById).toHaveBeenCalledWith('comment-id');
//   expect(res.json).toHaveBeenCalledWith(200, {
//     message: 'Request successful!',
//     data: { deleted: false },
//   }); 
//   it('deletes a like for a comment', async () => {
//     Like.findOne.mockResolvedValue({ remove: jest.fn() });
//     const req = {
//       user: { _id: 'user-id' },
//       query: { id: 'comment-id', type: 'Comment' },
//     };
//     const res = {
//         json: jest.fn(),
//       };
      
//       await toggleLike(req, res);
      
//       expect(Like.findOne).toHaveBeenCalledWith({
//         likeable: 'comment-id',
//         onModel: 'Comment',
//         user: 'user-id',
//       });
//       expect(Comment.findById).toHaveBeenCalledWith('comment-id');
//       expect(res.json).toHaveBeenCalledWith(200, {
//         message: 'Request successful!',
//         data: { deleted: true },
//       });
//   })

  
  
// })

// });



const reqMock = require('mock-express-request');
const resMock = require('mock-express-response');
const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsController = require('../controllers/comments_controller');
const mongoose = require('mongoose');

jest.setTimeout(10000);

describe('Create comment', () => {
  let post;
  let comment;
  let reqMock;
  let resMock;

  beforeEach(async () => {
    post = await Post.create({
      title: 'Test post',
      content: 'Test content',
      user: mongoose.Types.ObjectId(req.user._id)
    });

    comment = {
      content: 'Test comment',
      post: post._id,
      user: mongoose.Types.ObjectId(req.user._id)
    };

    req = reqMock({
      body: {
        post: post._id,
        content: 'This is a comment'
      },
      user: {
        _id: mongoose.Types.ObjectId(req.user._id)
      }
    });
  });

  afterEach(async () => {
    await Comment.deleteMany({});
    await Post.deleteMany({});
  });

  it('creates a comment and updates the post', async () => {
    await commentsController.create(reqMock, resMock);

    const createdComment = await Comment.findOne({ content: 'Test comment' });
    const updatedPost = await Post.findById(post._id);

    expect(createdComment).not.toBeNull();
    expect(createdComment.content).toEqual('Test comment');
    expect(updatedPost.comments).toContain(createdComment._id);
  });

  it('sends a JSON response for XHR requests', async () => {
    reqMock.xhr(true);

    await commentsController.create(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(resMock.json).toHaveBeenCalledWith({
      data: {
        comment: expect.objectContaining({
          content: 'Test comment',
          post: post._id,
          user: mongoose.Types.ObjectId(req.user._id)
        }),
        post_user_id: mongoose.Types.ObjectId(req.user._id)
      },
      message: 'Post created!'
    });
  });

  it('redirects for non-XHR requests', async () => {
    await commentsController.create(reqMock, resMock);

    expect(resMock.redirect).toHaveBeenCalledWith('/');
  });
});
