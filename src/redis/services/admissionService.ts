import { redis } from "../../config/redis.js";
import { RedisKeys } from "../keys/redisKeys.js";
import { RedisTTL } from "../ttl/ttl.js";

const saveAdmissionDraft = async (applicationId: string, data: string) => {
  return await redis.set(RedisKeys.admissionDraft(applicationId), data, {
    EX: RedisTTL.ADMISSION_DRAFT,
  });
};

const getAdmissionDraft = async (applicationId: string) => {
  return await redis.get(RedisKeys.admissionDraft(applicationId));
};

const deleteAdmissionDraft = async (applicationId: string) => {
  return await redis.del(RedisKeys.admissionDraft(applicationId));
};

export const AdmissionServices = {
  saveAdmissionDraft,
  getAdmissionDraft,
  deleteAdmissionDraft,
};
