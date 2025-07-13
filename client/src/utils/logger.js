const logger = {
  log: (message, ...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(message, ...args);
    }
    // Could also send to a logging service
  },
  
  info: (message, ...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`ℹ️ INFO: ${message}`, ...args);
    }
  },
  
  warn: (message, ...args) => {
    console.warn(`⚠️ WARN: ${message}`, ...args);
    // Could also send to a logging service
  },
  
  error: (message, ...args) => {
    console.error(`❌ ERROR: ${message}`, ...args);
    // Could also send to a logging service like Sentry
  }
};

export default logger;