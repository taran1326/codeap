
const Like = require("../models/like");
const Post =  require("../models/post");
const Comment = require('../models/comment');
const toggleFriendship = require('../controllers/friendship_controller'); 

jest.mock('../models/like', () => {
  return {
    create: jest.fn().mockResolvedValue({ _id: 'like-id' }),
    findOne: jest.fn().mockResolvedValue(null),
    findById: jest.fn().mockResolvedValue({ remove: jest.fn() }),
  };
});

jest.mock('../models/post', () => {
  return {
    findById: jest.fn().mockResolvedValue({
      _id: 'post-id',
      likes: [],
      save: jest.fn(),
    }),
  };
});

jest.mock('../models/comment', () => {
  return {
    findById: jest.fn().mockResolvedValue({
      _id: 'comment-id',
      likes: [],
      save: jest.fn(),
    }),
  };
});

describe('toggleFriendship', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a like for a post', async () => {
    const req = {
      user: { _id: 'user-id' },
      query: { id: 'post-id', type: 'Post' },
    };
    const res = {
      json: jest.fn(),
    };

    await toggleFriendship(req, res);

    expect(Like.create).toHaveBeenCalledWith({
      user: 'user-id',
      likeable: 'post-id',
      onModel: 'Post',
    });
    expect(Post.findById).toHaveBeenCalledWith('post-id');
    expect(res.json).toHaveBeenCalledWith(200, {
      message: 'Request successful!',
      data: { deleted: false },
    });
  });

  it('deletes a like for a post', async () => {
    Like.findOne.mockResolvedValue({ remove: jest.fn() });

    const req = {
      user: { _id: 'user-id' },
      query: { id: 'post-id', type: 'Post' },
    };
    const res = {
      json: jest.fn(),
    };

    await toggleFriendship(req, res);

    expect(Like.findOne).toHaveBeenCalledWith({
      likeable: 'post-id',
      onModel: 'Post',
      user: 'user-id',
    });
    expect(Post.findById).toHaveBeenCalledWith('post-id');
    expect(res.json).toHaveBeenCalledWith(200, {
      message: 'Request successful!',
      data: { deleted: true },
    });
  });

  it('creates a like for a comment' , async () => {
    const req = {
    user: { _id: 'user-id' },
    query: { id: 'comment-id', type: 'Comment' },
    };
    const res = {
    json: jest.fn(),
    };
    await toggleFriendship(req, res);

  expect(Like.create).toHaveBeenCalledWith({
    user: 'user-id',
    likeable: 'comment-id',
    onModel: 'Comment',
  });
  expect(Comment.findById).toHaveBeenCalledWith('comment-id');
  expect(res.json).toHaveBeenCalledWith(200, {
    message: 'Request successful!',
    data: { deleted: false },
  }); 
  it('deletes a like for a comment', async () => {
    Like.findOne.mockResolvedValue({ remove: jest.fn() });
    const req = {
      user: { _id: 'user-id' },
      query: { id: 'comment-id', type: 'Comment' },
    };
    const res = {
        json: jest.fn(),
      };
      
      await toggleFriendship(req, res);
      
      expect(Like.findOne).toHaveBeenCalledWith({
        likeable: 'comment-id',
        onModel: 'Comment',
        user: 'user-id',
      });
      expect(Comment.findById).toHaveBeenCalledWith('comment-id');
      expect(res.json).toHaveBeenCalledWith(200, {
        message: 'Request successful!',
        data: { deleted: true },
      });
  })

  
  
})

});