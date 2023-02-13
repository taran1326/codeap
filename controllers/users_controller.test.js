const request = require('supertest');
const express = require('express');
const userController = require('./users_controller');


describe('Sign Up Functionality', () => {
  let app;
  beforeEach(() => {
    app = express();
    
  });

  it('renders the sign up page if the user is not authenticated', async () => {
    const response = await request(app).get('/users/sign-up').expect(200);
    expect(response.text).toContain('Codeial | Sign Up');
  });
  

  it('redirects to the profile page if the user is already authenticated', async () => {
    const req = {
      isAuthenticated: () => true,
    };
    const res = {
      redirect: jest.fn(),
    };

        userController.signUp(req, res); 

    expect(res.redirect).toHaveBeenCalledWith('/users/profile');
  });
});
