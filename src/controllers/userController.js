const { loginService, registerService, validateTokenService, getUserByIdService } = require('../services/userServices');
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
      res.status(error.status).json({
        message: error.message,
        success: false,

      });
    }
    else{
      res.status(500).json({
        message: error.message,
        success: false,
      });
    }
  }
};

const login = async (req, res, next) => {
  try {
    const token = await loginService(req.body);
    res.status(200).json({
      message: 'Login successful',
      success: true,  
      token
    });
  } catch (error) {
    if (error instanceof HTTPError) {
      res.status(error.status).json({
        
        message: error.message,
        success: false,

      });
    }
    else{
      res.status(500).json({
        message: error.message,
        success: false,
      });
    }
  }
};

const validateToken = async (req, res) => {
  try {
    const userId = await validateTokenService(req);

    console.log('userId', userId);
    res.status(200).json({
      message: 'Token validated successfully',
      success: true,
      userId: userId,
    });

  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Authorization failed', success: false });

  }

};
const getUserById = async (req, res,next) => {
  try {
    const {id}=req.params;
    console.log(id);
    const user = await getUserByIdService(id);
    res.status(200).json({
      message: 'User fetched successfully',
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  validateToken,
  getUserById
};