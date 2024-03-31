console.log('Kafka brokers:', process.env.KAFKA_BROKERS);
console.log('Kafka username:', process.env.KAFKA_USERNAME);
const kafkaConfig = {
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROKERS],
    sasl: {
      mechanism: 'plain',
      username: process.env.KAFKA_USERNAME,
      password: process.env.KAFKA_PASSWORD,
    },
  };
  
export default kafkaConfig;
  