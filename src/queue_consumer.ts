import amqp from "amqplib";
import Checkout from "./application/Checkout";
import ProductDataDatabase from "./infra/data/ProductDataDatabase";
import CouponDataDatabase from "./infra/data/CouponDataDatabase";
import OrderDataDatabase from "./infra/data/OrderDataDatabase";
import MysqlConnection from "./infra/database/MysqlConnection";
import ProductDataInterface from "./domain/datainterface/ProductDataInterface";
import CouponDataInterface from "./domain/datainterface/CouponDataInterface";
import OrderDataInterface from "./domain/datainterface/OrderDataInterface";

async function init() {
    const connectionQueue = await amqp.connect("amqp://localhost");
    const channel = await connectionQueue.createChannel();
    await channel.assertQueue("checkout", {durable: true});
    await channel.consume("checkout", async function (msg: any) {
        const input = JSON.parse(msg.content.toString());
        const connection = await MysqlConnection.build();
        try {
            const productData: ProductDataInterface = new ProductDataDatabase(connection);
            const couponData: CouponDataInterface = new CouponDataDatabase(connection);
            const orderData: OrderDataInterface = new OrderDataDatabase(connection);
            const checkout = new Checkout(productData, couponData,orderData);
            const output = await checkout.execute(input);
            console.log(output);
        } catch (e: any) {
            console.log(e.message);
        } finally {
            await connection.close();
        }
        channel.ack(msg);
    });
    setTimeout(function () {
        connectionQueue.close();
        process.exit(0)
    }, 1000);
}

init().then(() => console.log("Consumer executado"));