const { createClient } = require("redis");

const redisClient = createClient({
  url: "rediss://default:gQAAAAAAAeKBAAIgcDJiMWYwMzg2MzczNWU0OGU3OGI3MTI0MjFjYmI5ZWU4OQ@content-satyr-123521.upstash.io:6379",
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

const connectRedis = async () => {
  await redisClient.connect();
  console.log("Redis Connected Successfully");
};

module.exports = { redisClient, connectRedis };
