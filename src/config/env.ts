import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  node_env: process.env.NODE_ENV as string,
  port: process.env.PORT as string,
  database_url: process.env.DATABASE_URL as string,
  jwt_secret: process.env.JWT_SECRET as string,
  refresh_jwt_secret: process.env.REFRESH_JWT_SECRET as string,
  smtp_user: process.env.SMTP_USER as string,
  smtp_pass: process.env.SMTP_PASS as string,
  redis_url: process.env.REDIS_URL as string,
  // sslcommerz
  ssl_store_id: process.env.SSL_STORE_ID as string,
  ssl_store_password: process.env.SSL_STORE_PASSWORD as string,
  ssl_is_live: process.env.SSL_IS_LIVE as string,
  ssl_success_url: process.env.SSL_SUCCESS_URL as string,
  ssl_fail_url: process.env.SSL_FAIL_URL as string,
  ssl_cancel_url: process.env.SSL_CANCEL_URL as string,
  ssl_ipn_url: process.env.SSL_IPN_URL as string,
  frontend_url: process.env.FRONTEND_URL as string,
  backend_url: process.env.BACKEND_URL as string,
};

export default config;
