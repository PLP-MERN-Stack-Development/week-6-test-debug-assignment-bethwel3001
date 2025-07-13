const logger = require('../utils/logger');

const performanceMonitor = (req, res, next) => {
  const start = process.hrtime();
  const startMemory = process.memoryUsage().rss;
  
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const responseTime = diff[0] * 1e3 + diff[1] * 1e-6; // in milliseconds
    const endMemory = process.memoryUsage().rss;
    const memoryUsed = (endMemory - startMemory) / (1024 * 1024); // in MB
    
    logger.info(
      `Performance - ${req.method} ${req.originalUrl} - ` +
      `Response Time: ${responseTime.toFixed(2)}ms - ` +
      `Memory Used: ${memoryUsed.toFixed(2)}MB`
    );
    
    // You could also store these metrics in a monitoring system
  });
  
  next();
};

module.exports = performanceMonitor;