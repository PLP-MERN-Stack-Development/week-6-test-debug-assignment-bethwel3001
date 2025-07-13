const { generateToken, verifyToken } = require('../../../src/utils/auth');
const jwt = require('jsonwebtoken');

describe('Auth Utilities', () => {
  const testUser = { id: '123', username: 'testuser' };
  
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(testUser);
      expect(token).toBeDefined();
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(testUser.id);
      expect(decoded.username).toBe(testUser.username);
    });
  });
  
  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = jwt.sign(testUser, process.env.JWT_SECRET);
      const decoded = verifyToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(testUser.id);
    });
    
    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      expect(() => verifyToken(invalidToken)).toThrow();
    });
    
    it('should throw error for expired token', () => {
      const expiredToken = jwt.sign(testUser, process.env.JWT_SECRET, { expiresIn: '-1s' });
      expect(() => verifyToken(expiredToken)).toThrow('jwt expired');
    });
  });
});