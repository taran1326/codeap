const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');

jest.mock('../models/post');
jest.mock('../models/comment');
jest.mock('../mailers/comments_mailer');
jest.mock('../config/kue');
jest.mock('../workers/comment_email_worker');
jest.mock('../models/like');


const commentsController = require('./comments_controller');

describe('create', () => {
  let req;
  let res;
  
  beforeEach(() => {
    req = {
      body: {
        content: 'Test comment',
        post: '123456',
      },
      user: {
        _id: '654321',
      },
      xhr: true,
    };
    res = {
      status: jest.fn().mockReturnValue({
        json: jest.fn(),
      }),
      redirect: jest.fn(),
    };
  });
  
  it('creates a comment and adds it to the post', async () => {
    await commentsController.create(req, res);
    
    expect(Post.findById).toHaveBeenCalledWith(req.body.post);
    expect(commentsController.create).toHaveBeenCalledWith({
      
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status().json).toHaveBeenCalledWith({
      data: {
        comment: expect.any(Object),
        post_user_id: expect.any(String),
      },
      message: 'Post created!',
    });
  });
  
//   it('enqueues an email worker', async () => {
//     await commentsController.create(req, res);
    
//     expect(queue.create).toHaveBeenCalledWith('emails', expect.any(Object));
//   });
  
  it('handles errors correctly', async () => {
    Comment.create.mockRejectedValue(new Error('Test error'));
    
    await commentsController.create(req, res);
    
    expect(res.status).not.toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
  });
});
