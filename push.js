const mqtt = require('mqtt')
const { logger, verify } = require('./mysql');
const Broker = mqtt.connect(process.env.mqtt_host, {
    username: process.env.mqtt_username,
    password: process.env.mqtt_password,
    clientId: process.env.mqtt_clientId,
    connectTimeout: 1000,
    keepalive: 10
})


Broker.on('connect', function () {
    console.log('Mqtt is connect');
    Broker.subscribe('/query/count/#');
    Broker.subscribe('/start/data/#');
    // Broker.subscribe('#');
})

const data = []
let state = 1;
let benar = 0;
let salah = 0;
Broker.on('message', function (topic, message) {
    // message is Buffer
    payload = message.toString()
    const query = topic.split("/");
    // console.log(query[2]);

    if (query[2] === "count") {
        // console.log("query = " + query[3]);
        // console.log("vaule = " + payload);
        const urutan = query[3]
        const clientId = query[4]
        if (state != urutan) {
            var vaule = JSON.stringify(data);
            logger(clientId, state, vaule);
            verify(clientId,state, benar, salah);
            state = urutan;
            // console.log("state change");
            // console.log(state);
            // mengahpus data yang lama
            data.splice(0, data.length);
            benar = 0;
            salah = 0;
            data.push(payload);
            if (data.length  == payload) {
                benar = benar + 1;
            } else {
                salah = salah + 1;
            }

        } else {
            // console.log("state not change");
            // console.log(state);
            data.push(payload);
            // console.log(data.length);
            if (data.length  == payload) {
                benar = benar + 1;
            } else {
                salah = salah + 1;
            }
        }
    }
    // console.log(data);
    // console.log("benar = " + benar);
    // console.log("salah = " + salah);
    // console.log(querys);
});