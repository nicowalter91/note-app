// *** Controller for User ***
const User = require("../models/user.model");

const getUser = async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) return res.sendStatus(401);
  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: "",
  });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!password)
    return res.status(400).json({ message: "Password is required" });

  try {
    const userInfo = await User.findOne({ email });
    if (!userInfo) return res.status(400).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, userInfo.password);
    if (!isPasswordValid)
      return res
        .status(400)
        .json({ error: true, message: "Invalid Credentials" });

    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });

    return res.json({
      error: false,
      message: "Login Successful",
      email,
      accessToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const createUser = async (req, res)  => {
    const { fullName, email, password } = req.body;

    // Validierung der Eingabedaten
    if (!fullName)
      return res
        .status(400)
        .json({ error: true, message: "Full Name is required" });
    if (!email)
      return res.status(400).json({ error: true, message: "Email is required" });
    if (!password)
      return res
        .status(400)
        .json({ error: true, message: "Password is required" });
  
    // Überprüfen, ob der Benutzer existiert
    const isUser = await User.findOne({ email });
    if (isUser) return res.json({ error: true, message: "User already exists" });
  
    // Benutzer erstellen und speichern
    const user = new User({ fullName, email, password });
    await user.save();
  
    // JWT-Token generieren
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });
    return res.json({
      error: false,
      user,
      accessToken,
      message: "Registration Successful",
    });
};

module.exports = { getUser, loginUser, createUser};
