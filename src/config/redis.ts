import { createClient, RedisClientType } from "redis";
import config from "./env.js";
import AppError from "../utils/AppError.js";
import { StatusCodes } from "http-status-codes";

const redisUrl = config.redis_url;

if (!redisUrl) {
  throw new AppError(StatusCodes.BAD_REQUEST, "Redis url not found!");
}

const redis: RedisClientType = createClient({
  url: redisUrl,
});

redis.on("error", (err) => console.error("Redis Connection Error:", err));
redis.on("connect", () => console.log("Redis Connected Successfully"));

const connectRedis = async () => {
  try {
    if (!redis.isOpen) {
      await redis.connect();
    }
  } catch (err) {
    console.error("Redis Client Error", err);
  }
};

export { redis };
export default connectRedis;
