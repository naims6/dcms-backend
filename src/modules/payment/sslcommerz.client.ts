import config from "../../config/env.js";
import SSLCommerzPayment from "sslcommerz-lts";

export const sslcommerz = new SSLCommerzPayment(
  config.ssl_store_id,
  config.ssl_store_password,
  config.ssl_is_live,
);
