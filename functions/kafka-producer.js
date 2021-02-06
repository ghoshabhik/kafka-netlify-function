const Kafka = require("node-rdkafka") 
const { v4: uuidv4 } = require('uuid'); 

const kafkaConf = {
    "group.id": "cloudkarafka-example",
    "metadata.broker.list": process.env.CLOUDKARAFKA_BROKERS.split(","),
    "socket.keepalive.enable": true,
    "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "SCRAM-SHA-256",
    "sasl.username": process.env.CLOUDKARAFKA_USERNAME,
    "sasl.password": process.env.CLOUDKARAFKA_PASSWORD,
    //"debug": "generic,broker, security",
  }

const prefix = process.env.CLOUDKARAFKA_TOPIC_PREFIX;
const topic = `${prefix}test`;
const producer = new Kafka.Producer(kafkaConf);
console.log(producer)
console.log(process.env.CLOUDKARAFKA_USERNAME)
console.log(process.env.CLOUDKARAFKA_PASSWORD)

exports.handler = async (event, context) => {

    if (event.httpMethod !== 'POST') {
        return {
          statusCode: 400,
          body: 'Please enter text in POST Request',
        }
      }
      const { msg } = JSON.parse(event.body)

      producer.on("ready", function(arg) {
        console.log(`producer ${arg.name} ready.`);
        
        producer.produce(topic, -1, new Buffer.from(JSON.stringify(msg)), Date.now() );
        producer.flush()
        setTimeout(() => producer.disconnect(), 10000);
      });
      
      producer.on("disconnected", function(arg) {
          console.log(arg)
        //process.exit();
      });
      
      producer.on('event.error', function(err) {
        console.error(err.message);
        process.exit(1);
      });
      producer.on('event.log', function(log) {
        console.log(log);
      });
      


      try {
        producer.connect();
        return {
          statusCode: 200,
          body: JSON.stringify(msg),
        }
      } catch (error) {
        return {
          statusCode: 404,
          body: JSON.stringify(error),
        }
      }
  }