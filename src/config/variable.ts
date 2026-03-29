export const initialWalletBalance = 0;
export const passwordRegex = /(?=.*[A-Z]).*$/;
export const phoneRegex =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
export const passwordSalt = 12;
export const userOtpSalt = 6;
export const userOtpExpiredTime = 300; // in seconds

export const tokenTypes = {
  refreshToken: "refresh_token",
  accessToken: "access_token",
  resetPasswordToken: "reset_password_token",
  changeEmailToken: "change_email_token",
};
export const allowedFileExtensions = ["jpg", "jpeg", "png", "webp"];
