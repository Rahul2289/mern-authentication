const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SignUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    console.log(error);
  }
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "user already exist ! Login Instead" });
  }
  const hashedPassword = bcrypt.hashSync(password);
  const user = new User({
    name: name,
    email: email,
    password: hashedPassword,
  });
  try {
    await user.save();
  } catch (error) {
    console.log(error);
  }
  return res.status(201).json({ msg: user });
};

const Login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return new Error(error);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "User Not Found! SignUp to Login" });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Email / Password" });
  }
  const token = jwt.sign(
    { id: existingUser._id },
    process.env.JWT_SECRETE_KEY,
    {
      expiresIn: "35s",
    }
  );

  if (req.cookies[`${existingUser._id}`]) {
    req.cookies[`${existingUser._id}`] = "";
  }
  res.cookie(String(existingUser._id), token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 30),
    httpOnly: true,
    sameSite: "lax",
  });
  return res
    .status(200)
    .json({ message: "scucessfully logged In", user: existingUser, token });
};

const verifyToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  let token = cookies.split("=");
  token = token[1];
  if (!token) {
    return res.status(404).json({ message: "no token found" });
  }
  jwt.verify(String(token), process.env.JWT_SECRETE_KEY, (err, user) => {
    if (err) {
      return res.status(404).json({ message: "Invalid token" });
    }
    req.id = user.id;
  });
  next();
};
const getUser = async (req, res, next) => {
  const userId = req.id;
  let user;
  try {
    user = await User.findById(userId, "-password");
  } catch (error) {
    return new Error(error);
  }
  if (!user) {
    return res.status(400).json({ message: "user Not Found" });
  }
  return res.status(200).json({ user });
};

const refreshToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  let prevToken = cookies.split("=");
  prevToken = prevToken[1];
  if (!prevToken) {
    res.status(400).json({ message: "couldn't find token" });
  }
  jwt.verify(String(prevToken), process.env.JWT_SECRETE_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }
    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = "";
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRETE_KEY, {
      expiresIn: "35s",
    });
    res.cookie(String(user.id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 30),
      httpOnly: true,
      sameSite: "lax",
    });

    req.id = user.id;
    next();
  });
};

const Logout = (req, res, next) => {
  const cookies = req.headers.cookie;
  let prevToken = cookies.split("=");
  prevToken = prevToken[1];

  if (!prevToken) {
    res.status(400).json({ message: "couldn't find token" });
  }

  jwt.verify(String(prevToken), process.env.JWT_SECRETE_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }

    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = "";

    return res.status(200).json({ message: "sucessfuly logged out" });
  });
};

module.exports = { SignUp, Login, verifyToken, getUser, refreshToken, Logout };
