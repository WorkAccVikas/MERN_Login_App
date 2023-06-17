import jwt from "jsonwebtoken";
/** auth middleware */
export default async function Auth(req, res, next) {
  try {
    // Todo : access authorize header to validate request
    const token = req.headers.authorization.split(" ")[1];

    // Todo : retrieve the user details fo the logged in user
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken;

    next();
  } catch (error) {
    res.status(401).send({ error: "Authentication Failed!" });
  }
}

export function localVariables(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}
