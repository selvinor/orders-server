'use strict';
//mongoimport -h ds151602.mlab.com:51602 -d testdb10 -c orders  -u dev -p breaktheinternet1  --file orders.json
//mongoimport -h ds151602.mlab.com:51602 -d testdb10 -c users  -u dev -p breaktheinternet1  --file users.json
module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  DATABASE_URL:
        process.env.DATABASE_URL || 'mongodb://dev:thinkful1@ds143573.mlab.com:43573/blooms',
  MONGODB_URI: 
  process.env.DATABASE_URL || 'mongodb://dev:thinkful1@ds143573.mlab.com:43573/blooms',
  TEST_DATABASE_URL:
        process.env.TEST_DATABASE_URL ||
        'mongodb://localhost/thinkful-backend-test',
  JWT_SECRET : process.env.JWT_SECRET,
  JWT_EXPIRY : process.env.JWT_EXPIRY || '15m'
};
