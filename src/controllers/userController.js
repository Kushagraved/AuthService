const { loginService, registerService, validateTokenService } = require('../services/userServices');
const HTTPError = require('../utils/httpError');

const register = async (req, res) => {
  try {
    const newUser = await registerService(req.body);
    res.status(201).json({
      message: 'User created successfully',
      success: true,
      user: newUser
    });
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPError) {
      return res.status(error.status).json({
        message: error.message,
        success: false,

      });
    }
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const token = await loginService(req.body);
    res.status(200).json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    next(error);
  }
};

const validateToken = async (req, res) => {
  try {
    const userId = await validateTokenService(req);

    console.log('userId', userId);
    res.status(200).json({
      message: 'Token validated successfully',
      userId: userId,
    });

  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Authorization failed', success: false });

  }


};
module.exports = {
  register,
  login,
  validateToken
};