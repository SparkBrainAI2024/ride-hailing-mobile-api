export const initialWalletBalance = 0;
export const passwordRegex = /(?=.*[A-Z]).*$/;
export const phoneRegex = /^(?:\+977)?9[78]\d{8}$/;
export const passwordSalt = 12;
export const userOtpSalt = 5;
export const userOtpExpiredTime = 300; // in seconds

export const tokenTypes = {
  refreshToken: "refresh_token",
  accessToken: "access_token",
  resetPasswordToken: "reset_password_token",
  changeEmailToken: "change_email_token",
  setPasswordToken: "set_password_token",
};
export const allowedFileExtensions = ["jpg", "jpeg", "png", "webp"];
