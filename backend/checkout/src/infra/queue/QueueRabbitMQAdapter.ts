import QueueInterface from "./QueueInterface";
import amqp from "amqplib";

export default class QueueRabbitMQAdapter implements QueueInterface {

    private connection: any;

    constructor() {
    }

    async connect(): Promise<any> {
        this.connection = await amqp.connect("amqp://localhost");
    }

    async on(input: string, callback: Function): Promise<void> {
        const channel = await this.connection.createChannel();
        await channel.assertQueue("checkout", {durable: true});
        await channel.consume("checkout", async function (msg: any) {
            const input = JSON.parse(msg.content.toString());
            await callback(input);
            channel.ack(msg);
        });

    }

    async publish(queueName: string, data: any): Promise<void> {
        const channel = await this.connection.createChannel();
        await channel.assertQueue("checkout", {durable: true});
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    }

}