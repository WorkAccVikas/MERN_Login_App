import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

/** middleware for verify user */
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    // Todo : check the user existence
    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Can't find User!" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
}

/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;

    // Todo : check the existing user
    const existUsername = new Promise((resolve, reject) => {
      UserModel.findOne({ username })
        .then((user) => {
          if (user) reject({ error: "Please use unique username" });

          resolve();
        })
        .catch((err) => {
          // console.log("1");
          reject(new Error(err));
        });
    });

    // Todo : check for existing email
    const existEmail = new Promise((resolve, reject) => {
      UserModel.findOne({ email : email.toLowerCase() })
        .then((user) => {
          if (user) reject({ error: "Please use unique Email" });

          resolve();
        })
        .catch((err) => {
          // console.log("2");
          reject(new Error(err));
        });
    });

    Promise.all([existUsername, existEmail])
      .then(() => {
        if (password) {
          // console.log("hi");
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || "",
                email : email.toLowerCase(),
              });

              // Todo : return save result as a response
              user
                .save()
                .then((result) =>
                  res.status(201).send({ msg: "User Register Successfully" })
                )
                .catch((error) => {
                  // console.log("3");
                  return res.status(500).send({ error });
                });
            })
            .catch((err) => {
              // console.log("4");
              return res.status(500).send({
                error: "Enable to hashed password",
              });
            });
        }
      })
      .catch((err) => {
        // console.log("5");
        return res.status(500).send({ err });
      });
  } catch (error) {
    // console.log("6");
    return res.status(500).send(error);
  }
}

/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {
  const { username, password } = req.body;

  try {
    UserModel.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            // console.log("Ram = ", passwordCheck);

            if (!passwordCheck)
              return res.status(400).send({ error: "Don't have Password" });

            // Todo : create jwt token
            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username,
              },
              process.env.JWT_SECRET,
              { expiresIn: "24h" }
            );

            return res.status(200).send({
              msg: "Login Successful...!",
              username: user.username,
              token,
            });
          })
          .catch((err) => {
            return res.status(400).send({ error: "Password does not match" });
          });
      })
      .catch((err) => {
        return res.status(404).send({ error: "Username Not Found" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
  const { username } = req.params;

  try {
    if (!username) return res.status(501).send({ error: "Invalid Username" });
    UserModel.findOne({ username }, { password: 0 })
      .then((user) => {
        // console.log("vikas = ", user);
        // console.log(!user);

        if (!user)
          return res.status(501).send({ error: "Couldn't Find the User" });

        // Todo : Method 1 : if we use findOne({ username }, { password: 0 })
        return res.status(200).send(user);

        // Todo : Method 2 : if we use findOne({ username })
        // /** remove password from user */
        // // mongoose return unnecessary data with object so convert it into json
        // const { password, ...rest } = Object.assign({}, user.toJSON());

        // return res.status(200).send(rest);
      })
      .catch((err) => {
        return res.status(500).send({ err });
      });
  } catch (error) {
    return res.status(404).send({ error: "Cannot Find User Data" });
  }
}

/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req, res) {
  try {
    // const { id } = req.query;
    const { userId: id } = req.user;
    // console.log(id);

    if (!id) return res.status(404).send({ error: "User Not Found...!" });

    const { firstName, lastName, address, profile, email, mobile } = req.body;
    const body = { firstName, lastName, address, profile, email : email.toLowerCase(), mobile };
    // console.log(body);

    if (email) {
      let result = await UserModel.find({ email: email.toLowerCase() });
      
      if (result[0].email !== email)
        return res
          .status(409)
          .json({ error: "Email is already present ......." });
    }

    // Todo : This is useful when we use updateOne
    // const existUser = await UserModel.findOne({ _id: id });
    // console.log(existUser);
    // if (!existUser) return res.status(404).send({ msg: "Record Not Found..!" });

    // Todo : update the data
    UserModel.findByIdAndUpdate({ _id: id }, body, {
      new: true,
      // Todo : Learn : remove particular field from updated document
      projection: { password: 0 }, // Include or exclude fields using 1 or 0 respectively
    })
      .then((data) => {
        // console.log("Sachin = ", data);
        if (!data) return res.status(404).send({ msg: "Record Not Found..!" });

        return res.status(201).send({ msg: "Record Updated...!", data });
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    return res.status(404).send({ error });
  }
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  // console.log(req.app.locals.OTP);
  res.status(201).send({ code: req.app.locals.OTP });
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
  const { code } = req.query;

  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // reset the OTP value
    req.app.locals.resetSession = true; // start session for reset password
    return res.status(201).send({ msg: "Verify Successfully!" });
  }

  return res.status(400).send({ error: "Invalid OTP" });
}

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    // req.app.locals.resetSession = false; // allow access to this route only once
    // return res.status(201).send({ msg: "access granted!" });
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expired!" });
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
  try {
    const { username, password } = req.body;
    // console.log(username, password);
    if (!req.app.locals.resetSession)
      return res.status(440).send({ error: "Session expired!" });

    try {
      // Todo : find user
      const user = await UserModel.findOne({ username });

      if (!user) return res.status(404).send({ error: "Username Not Found" });

      // Todo : Compare password if user enters the old password, then show 400
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch)
        return res.status(500).send({ error: "Please Enter New Password" });

      // Todo : Following code executed only when the user enters a new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // console.log({ hashedPassword });

      const check = await UserModel.findOneAndUpdate(
        { username: user.username },
        { password: hashedPassword }
      );
      // console.log({ check });
      req.app.locals.resetSession = false; // reset session
      return res.status(201).send({ msg: "Record Updated" });
    } catch (error) {
      res.status(500).send({ error });
    }
  } catch (error) {
    res.status(401).send({ error });
  }
}
