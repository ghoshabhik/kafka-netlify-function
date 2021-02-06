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
  const topics = [`${prefix}test`];
  const consumer = new Kafka.KafkaConsumer(kafkaConf, {
    "auto.offset.reset": "beginning"
  });
  const numMessages = 100;
let counter = 0;
var msg = "Waiting..."

  exports.handler = async (event, context) => {
  
      try {
        msg = await f()
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

  const f = async() => {
    consumer.on("ready", function(arg) {
      console.log(`Consumer ${arg.name} ready`);
      consumer.subscribe(topics);
      consumer.consume();
    });
    consumer.on("data", function(m) {
      counter++;
      if (counter % numMessages === 0) {
        console.log("calling commit");
        consumer.commit(m);
      }
      console.log("Message Received: "+m.value.toString());
       msg = m.value.toString()
  
       console.log("Returning : "+msg)
       return(msg)
       
    });
    consumer.on("disconnected", function(arg) {
      //process.exit();
    });
    consumer.on('event.error', function(err) {
      console.error(err);
      process.exit(1);
    });
    consumer.on('event.log', function(log) {
      console.log(log);
    });

    consumer.connect();
      
    setTimeout(function() {
      consumer.disconnect();
    }, 300000);
  }