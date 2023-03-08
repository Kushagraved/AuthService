const { createClient } = require('redis');

const redisHost = process.env.REDIS_HOST ?? 'localhost';
const config = {
  socket: {
    host: redisHost,
    port: 6379,
  },
};

const redisClient = createClient(config);
redisClient.on('error', (err) => {
  console.error(err);
});

async function getRedisClient() {
  if (!redisClient.isReady) {
    console.log('connecting to redis');
    await redisClient.connect();
  }

  return redisClient;
}

async function disconnectRedis() {
  if (redisClient.isReady)
    await redisClient.disconnect();
}


module.exports = {
  getRedisClient,
  disconnectRedis,
};
