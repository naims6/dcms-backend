import { Queue } from "bullmq";
import config from "../../config/env.js";

export const emailQueue = new Queue("email-queue", {
  connection: {
    url: config.redis_url,
  },
});
