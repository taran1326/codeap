const User = require('../models/user');
const Friendship = require('../models/friendship');

jest.mock('../models/user', () => ({
  findById: jest.fn(),
  uploadedAvatar : jest.fn()
}));

jest.mock('../models/friendship', () => ({
  find: jest.fn()
}));

// const uploadedAvatar = jest.fn();

describe('Profile function', () => {
  const profile = require('./users_controller').profile;
  const req = {
    params: {
      id: 'userId'
    },
    user: {
      id: 'currentUserId',
      friendships: ['friendshipId1']
    }
  };
  const res = {
    render: jest.fn()
  };

  beforeEach(() => {
    User.findById.mockClear();
    Friendship.find.mockClear();
    res.render.mockClear();
  });

  it('should call User.findById with correct parameters', async () => {
    await profile(req, res);
    expect(User.findById).toHaveBeenCalledWith('userId');
  });

  it('should call Friendship.find with correct parameters', async () => {
    await profile(req, res);
    expect(Friendship.find).toHaveBeenCalledWith({
      _id: {
        $in: ['friendshipId1']
      }
    });
  });

  it('should call res.render with correct parameters when they are friends', async () => {
    User.findById.mockReturnValue({ name: 'Profile User' });
    Friendship.find.mockReturnValue([{
      from_user: 'currentUserId',
      to_user: 'userId'
    }]);
    await profile(req, res);
    expect(res.render).toHaveBeenCalledWith('user_profile', {
      title: 'User Profile',
      profile_user: { name: 'Profile User' },
      friendship: {
        from_user: 'currentUserId',
        to_user: 'userId'
      }
    });
  });

  it('should call res.render with correct parameters when they are not friends', async () => {
    User.findById.mockReturnValue({ name: 'Profile User' });
    Friendship.find.mockReturnValue([]);
    await profile(req, res);
    expect(res.render).toHaveBeenCalledWith('user_profile', {
      title: 'User Profile',
      profile_user: { name: 'Profile User' },
      friendship: undefined
    });
  });
});



// const fs = require('fs');
// const path = require('path');
// // const User = require('../models/user');
// // const Friendship = require('../models/friendship');
// const userController = require('./users_controller');

// jest.mock('../models/user');
// jest.mock('../models/friendship');
// jest.mock('fs');
// jest.mock('path');

// describe('update function', () => {
//   let req, res;

//   beforeEach(() => {
//     req = {
//       user: {
//         id: '1'
//       },
//       params: {
//         id: '1'
//       },
//       body: {
//         name: 'test',
//         email: 'test@example.com'
//       },
//       file: {
//         filename: 'test.jpg'
//       },
//       flash: jest.fn()
//     };

//     res = {
//       redirect: jest.fn(),
//       status: jest.fn(() => ({
//         send: jest.fn()
//       }))
//     };
//   });

//   it('should update the user if the user is authorized', async () => {
//     User.findById.mockResolvedValue({
//       save: jest.fn()
//     });

//     await userController.update(req, res);

//     expect(User.findById).toHaveBeenCalledWith('1');
//     expect(fs.unlinkSync).not.toHaveBeenCalled();
//     expect(req.flash).toHaveBeenCalledWith('success', 'Updated!');
//     expect(res.redirect).toHaveBeenCalledWith('back');
//   });

//   it('should delete the previous avatar if it exists', async () => {
//     User.findById.mockResolvedValue({
//       avatar: 'path/to/avatar.jpg',
//       save: jest.fn()
//     });

//     await userController.update(req, res);

//     expect(fs.unlinkSync).toHaveBeenCalledWith(path.join(__dirname, '..', user.avatar));
//     expect(req.flash).toHaveBeenCalledWith('success', 'Updated!');
//     expect(res.redirect).toHaveBeenCalledWith('back');
//   });

//   it('should return unauthorized if the user is not authorized', async () => {
//     req.params.id = '2';

//     await userController.update(req, res);

//     expect(req.flash).toHaveBeenCalledWith('error', 'Unauthorized!');
//     expect(res.status).toHaveBeenCalledWith(401);
//     expect(res.status().send).toHaveBeenCalledWith('Unauthorized');
//   });

//   it('should handle errors', async () => {
//     User.findById.mockRejectedValue('Error');

//     await userController.update(req, res);

//     expect(req.flash).toHaveBeenCalledWith('error', 'Error');
//     expect(res.redirect).toHaveBeenCalledWith('back');
//   });
// });

//////////////////////////////////////////////////



const destroySession = require('./users_controller').destroySession;

describe('destroySession', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      logout: jest.fn(),
      flash: jest.fn(),
      session: {
        destroy: jest.fn()
      }
    };

    res = {
      redirect: jest.fn()
    };
  });

  it('should call logout and flash with the correct arguments', () => {
    destroySession(req, res);

    expect(req.logout).toHaveBeenCalled();
    expect(req.flash).toHaveBeenCalledWith('success', 'You have logged out!');
  });

  it('should call session.destroy and redirect with the correct arguments', () => {
    destroySession(req, res);

    expect(req.session.destroy).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/');
  });
});





//////////////////////////////////////////////
const update = require('./users_controller').update;

const fs = require('fs');
const path = require('path');

jest.mock('../models/user');
jest.mock('fs');
jest.mock('path');



describe('update', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: {
        id: 1
      },
      params: {
        id: 1
      },
      body: {
        name: 'John Doe',
        email: 'johndoe@example.com'
      },
      file: {
        filename: 'avatar.jpg'
      },
      flash: jest.fn()
    };

    res = {
      redirect: jest.fn(),
      status: jest.fn().mockReturnValue({
        send: jest.fn()
      })
    };
  });

  it('should find the user and update their information', async () => {
    User.findById.mockResolvedValue({
      name: 'John Doe',
      email: 'johndoe@example.com',
      save: jest.fn()
    });
    User.uploadedAvatar((req, res, callback) => {
      callback(null);
    });
    path.join.mockReturnValue('/path/to/avatar.jpg');
    fs.unlinkSync.mockReturnValue();

    await update(req, res);

    expect(User.findById).toHaveBeenCalledWith(1);
    expect(User.uploadedAvatar).toHaveBeenCalledWith(req, res, expect.any(Function));
    expect(path.join).toHaveBeenCalledWith(__dirname, '..', '/public/uploads/avatars/avatar-1615922426755');
    expect(fs.unlinkSync).toHaveBeenCalledWith('/path/to/avatar.jpg');
    expect(req.flash).toHaveBeenCalledWith('success', 'Updated!');
    expect(res.redirect).toHaveBeenCalledWith('back');
  });

  it('should handle an error if one occurs during user search', async () => {
    User.findById.mockRejectedValue('Error');

    await update(req, res);

    expect(User.findById).toHaveBeenCalledWith(1);
    expect(req.flash).toHaveBeenCalledWith('error', 'Error');
    expect(res.redirect).toHaveBeenCalledWith('back');
  });

  it('should handle an error if one occurs during file upload', async () => {
    User.findById.mockResolvedValue({
      name: 'John Doe',
      email: 'johndoe@example.com',
      save: jest.fn()
    });
    User.uploadedAvatar((req, res, callback) => {
      callback('Error');
    });

    await update(req, res);

    expect(User.findById).toHaveBeenCalledWith(1);
    expect(User.uploadedAvatar).toHaveBeenCalledWith(req, res, expect.any(Function));
    expect(req.flash).toHaveBeenCalledWith('error', 'Error');
    expect(res.redirect).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.status().send).toHaveBeenCalledWith('Unauthorized');
  });
});
