const mqtt = require('mqtt')
const Broker = mqtt.connect('mqtt://app.spairum.my.id', {
    username: 'sandbox',
    password: 'testing',
    clientId: "server",
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
const querys = {}
let state = 1 ;
Broker.on('message', function (topic, message) {
    // message is Buffer
    // console.log(message.toString())
    pesan = message.toString()
    // console.log(topic)
    const query = topic.split("/");
    console.log(query[2]);

    if (query[2] === "count") {
        console.log("Partai = " + query[3]);
        console.log("count = " + pesan);
        // const name = 'Tom';
        const urutan = query[3]
        // if (state != urutan) {
        //     state = urutan;
        //     console.log("state change");
        //     console.log(state);
        //     // mengahpus data yang lama
        //     data.splice(0, data.length);
        //     // data = [];
        //     // memasukan data baru
        //     data.push(pesan);
        //     querys[urutan] = data;
        // }else{
        //     console.log("state not change");
        //     console.log(state);
        //     data.push(pesan);
        //     // querys[urutan] = data;
        // }
        // data.push(pesan);

        
        querys[urutan] = data;
        data.push(pesan);

        // data.push(querys);
    }
    // console.log(data);
    console.log(querys);
});