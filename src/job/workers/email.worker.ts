import { Job, Worker } from "bullmq";
import { sendVerificationEmail } from "../../utils/sendVerificationEmail.js";
import config from "../../config/env.js";

const emailWorker = new Worker(
  "email-queue",
  async (job: Job) => {
    const { name, email, otp } = job.data;
    await sendVerificationEmail(name, email, otp);
  },
  {
    connection: { url: config.redis_url },
    concurrency: 3,
  },
);

emailWorker.on("completed", (job) => console.log(`Job ${job.id} completed!`));
emailWorker.on("failed", (job) => console.log(`Job ${job?.id} failed!`));

export default emailWorker;
