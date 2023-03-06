const { createClient } = require('redis');

// const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';

const redisClient = createClient();
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
