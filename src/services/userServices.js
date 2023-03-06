const { User } = require('../../database/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const HTTPError = require('../utils/httpError');
const { getRedisClient } = require('../utils/redisUtil');

const registerService = async (user) => {
  const { email, password } = user;
  const userExists = await User.findOne({
    where: {
      email: email
    }
  });
  if (userExists) {
    throw new HTTPError(400, 'User already exists');
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  user.password = hash;

  const newUser = await User.create(user);
  return newUser;

};

const loginService = async (user) => {

  const userExits = await User.findOne({
    where: {
      email: user.email
    }
  });
  if (!userExits) {
    throw new HTTPError(400, 'User doesnot exist');
  }

  const isMatch = bcrypt.compareSync(user.password, userExits.password);
  if (!isMatch) {
    throw new HTTPError(400, 'Invalid credentials');
  }
  const token = jwt.sign({ id: userExits.id }, process.env.JWT_SECRET, { expiresIn: '1h' }); //payload,secret_key,validation

  const redisClient = await getRedisClient();
  redisClient.set(token, userExits.id, 'EX', 3600); //token,userId,expiry time(1hr))
  return token;


};

const validateTokenService = async (req) => {
  const token = req.headers['authorization'].split(' ')[1];

  const redisClient = await getRedisClient();
  const userId = await redisClient.get(token);
  if (!userId) {
    throw new HTTPError(401, 'Unauthorized');
  }

  // await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  //   if (err) {
  //     throw new HTTPError(401, 'Authorization failed');
  //   }
  //   else {
  //     // console.log('decoded', decoded);
  //     req.body.userId = decoded.id;
  //     userId = decoded.id;
  //   }
  // });
  const decodedResult = jwt.verify(token, process.env.JWT_SECRET);
  return decodedResult.id;
};
module.exports = {
  registerService,
  loginService,
  validateTokenService
};