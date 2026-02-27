require('dotenv-flow').config();
const app = require('./app');
const { connectDB } = require('./config/database');
const logger = require('../src/utils/logger');

(async () => {
  await connectDB();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    logger.info(`🚀 ${process.env.NODE_ENV} server running on ${PORT}`);
  });
})();
