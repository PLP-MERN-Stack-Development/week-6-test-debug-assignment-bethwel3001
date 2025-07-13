const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const User = require('../../src/models/User');

let mongoServer;
let testUser;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  
  // Create test user
  testUser = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const newUser = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'newpassword123'
    };
    
    const res = await request(app)
      .post('/api/auth/register')
      .send(newUser);
      
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.username).toBe(newUser.username);
    expect(res.body.user.email).toBe(newUser.email);
    expect(res.body.user.password).toBeUndefined();
  });
  
  it('should return 400 for invalid data', async () => {
    const invalidUser = {
      username: 'a', // too short
      email: 'invalid-email',
      password: '123' // too short
    };
    
    const res = await request(app)
      .post('/api/auth/register')
      .send(invalidUser);
      
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
  
  it('should return 409 for duplicate username or email', async () => {
    const duplicateUser = {
      username: 'testuser', // already exists
      email: 'test@example.com', // already exists
      password: 'password123'
    };
    
    const res = await request(app)
      .post('/api/auth/register')
      .send(duplicateUser);
      
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already exists/i);
  });
});

describe('POST /api/auth/login', () => {
  it('should login with correct credentials', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const res = await request(app)
      .post('/api/auth/login')
      .send(credentials);
      
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.username).toBe(testUser.username);
    expect(res.body.user.password).toBeUndefined();
  });
  
  it('should return 401 for incorrect password', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };
    
    const res = await request(app)
      .post('/api/auth/login')
      .send(credentials);
      
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid credentials/i);
  });
  
  it('should return 404 for non-existent email', async () => {
    const credentials = {
      email: 'nonexistent@example.com',
      password: 'password123'
    };
    
    const res = await request(app)
      .post('/api/auth/login')
      .send(credentials);
      
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/user not found/i);
  });
});