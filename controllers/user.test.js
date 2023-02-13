const mongoose = require('mongoose');
const mockgoose = require('mockgoose');
const User = require('../models/user');



describe('User creation', () => {
  // beforeEach(async () => {
  //   await mongoose.connect('mongodb://localhost:27017/codeial_development', { useNewUrlParser: true });
  // });

  before(function (done) {
    mockgoose.prepareStorage().then(function () {
      mongoose.connect('mongodb://localhost:27017/codeial_development', function (err) {
        done(err);
      });
    });
  });
  
  afterEach(function (done) {
    mockgoose.reset().then(function () {
      done();
    });
  });

  // afterEach(async () => {
  //   await mongoose.connection.dropDatabase();
  //   await mongoose.connection.close();
  // });
  
  it('creates a new user', async () => {
    const user = new User({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123'
    });
    
    await user.save();
    
    const savedUser = await User.findOne({ email: 'johndoe@example.com' });
    expect(savedUser).toMatchObject({
      name: 'John Doe',
      email: 'johndoe@example.com'
    });
  });
});


describe('User deletion', () => {
    beforeAll(async () => {
      await mongoose.connect('mongodb://localhost:27017/codeial_development', { useNewUrlParser: true, useUnifiedTopology: true });
    });
  
    afterAll(async () => {
      await mongoose.disconnect();
    });
  
    it('deletes a user', async () => {
      const user = new User({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123'
      });
  
      await user.save();
  
      await user.remove();
  
      const deletedUser = await User.findOne({ email: 'testuser@example.com' });
      expect(deletedUser).toBeNull();
    });
});
  
  
  
  