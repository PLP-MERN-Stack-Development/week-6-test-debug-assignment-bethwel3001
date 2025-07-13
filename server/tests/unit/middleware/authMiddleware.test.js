const { authenticate } = require('../../../src/middleware/authMiddleware');
const { generateToken } = require('../../../src/utils/auth');
const httpMocks = require('node-mocks-http');

describe('Authentication Middleware', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });
  
  it('should call next() for valid token', () => {
    const testUser = { id: '123', username: 'testuser' };
    const token = generateToken(testUser);
    
    req.headers = { authorization: `Bearer ${token}` };
    
    authenticate(req, res, next);
    
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(testUser.id);
  });
  
  it('should return 401 for missing token', () => {
    authenticate(req, res, next);
    
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ error: 'No token provided' });
  });
  
  it('should return 401 for invalid token', () => {
    req.headers = { authorization: 'Bearer invalid.token.here' };
    
    authenticate(req, res, next);
    
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ error: 'Invalid token' });
  });
});