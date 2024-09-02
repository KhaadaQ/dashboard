const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../Utils/utils");

const register = async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    const user = new userModel({
      email: req.body.email,
      password: password,
    });
    await user.save();
    res.status(201).json({ status: "succeeded", user: user });
  } catch (error) {
    res.status(404).json({ status: "failed", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ status: "failed", message: "Email or password incorrect" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ status: "failed", message: "Email or password incorrect" });
    }

    const payload = {
      _id: user._id,
      email: user.email,
    };

    const token = generateToken(payload, false);
    const refresh_token = generateToken(payload, true);

    res.status(200).json({ status: "succeeded", user, token, refresh_token });
  } catch (error) {
    res.status(404).json({ status: "failed", error: error.message });
  }
};

const getRefreshToken = async (req, res) => {
  try {
    if (!req.payload) {
      return res.status(401).json({ status: "failed", message: "Denied" });
    }
    const payload = {
      _id: req.payload._id,
      email: req.payload.email,
    };
    const token = generateToken(payload, false);
    const refresh_token = generateToken(payload, true);
    res.status(200).json({ status: "succeeded", token, refresh_token });
  } catch (error) {
    res.status(404).json({ status: "failed", error: error.message });
  }
};

module.exports = { register, login, getRefreshToken };
