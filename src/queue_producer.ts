import amqp from "amqplib";

async function init() {
    const connection = await amqp.connect("amqp://localhost");
    const chanel = await connection.createChannel();
    await chanel.assertQueue("checkout", {durable: true});
    const input = {
        cpf: "041.829.006-77",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 2, quantity: 1},
            {idProduct: 3, quantity: 3},
        ]
    }
    chanel.sendToQueue("checkout", Buffer.from(JSON.stringify(input)));
    console.log(input);
    setTimeout(function () {
        process.exit(0)
    }, 1000);
}

init().then(() => console.log("Producer executado"));