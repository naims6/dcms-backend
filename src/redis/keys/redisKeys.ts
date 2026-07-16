export const RedisKeys = {
  otpEmail: (email: string) => `otp:email:${email}`,

  otpPhone: (phone: string) => `otp:phone:${phone}`,

  admissionDraft: (applicationId: string) => `admission:draft:${applicationId}`,
};
