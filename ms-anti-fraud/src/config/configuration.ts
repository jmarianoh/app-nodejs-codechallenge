import * as dotenv from 'dotenv';

dotenv.config();
export default () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3001,
});
