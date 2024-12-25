export const sendToken = (res, user, statusCode, message) => {
  const token = user.getJwtToken();

  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 60 * 24 * 60 * 1000),
  };

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    referenceNumber: user.referenceNumber,
    meterID: user.meterID,
    darkMode: user.darkMode,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    user: userData,
  });
};
