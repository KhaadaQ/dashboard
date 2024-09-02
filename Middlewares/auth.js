const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(400).send("Access denied");

  try {
    const verified = jwt.verify(token, process.env.PASSWORD_SECRET);
    req.payload = { userId: verified.userId };
    next();
  } catch (error) {
    console.error("Access token verification failed:", error);
    try {
      const payload = jwt.verify(token, process.env.PASSWORD_SECRET_REFRESH);
      req.payload = { userId: payload.userId };
      next();
    } catch (error) {
      console.error("Refresh token verification failed:", error);
      res.status(401).send("Expired token");
    }
  }
};

module.exports = verifyToken;
