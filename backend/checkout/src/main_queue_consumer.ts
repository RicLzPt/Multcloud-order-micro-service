import amqp from "amqplib";
import Checkout from "./application/Checkout";
import ProductDataDatabase from "./infra/data/ProductDataDatabase";
import CouponDataDatabase from "./infra/data/CouponDataDatabase";
import OrderDataDatabase from "./infra/data/OrderDataDatabase";
import ConnectionMysql from "./infra/database/ConnectionMysql";
import ProductDataInterface from "./domain/datainterface/ProductDataInterface";
import CouponDataInterface from "./domain/datainterface/CouponDataInterface";
import OrderDataInterface from "./domain/datainterface/OrderDataInterface";
import CLIHandlerNode from "./infra/cli/CLIHandlerNode";
import CLIController from "./infra/cli/CLIController";
import QueueController from "./infra/queue/QueueController";
import QueueRabbitMQAdapter from "./infra/queue/QueueRabbitMQAdapter";
import ZipcodeDataInterface from "./domain/datainterface/ZipcodeDataInterface";
import ZipcodeDataDatabase from "./infra/data/ZipcodeDataDatabase";
import CalculateFreight from "./application/CalculateFreight";

(async function mainQueue() {

    const queue = new QueueRabbitMQAdapter();
    await queue.connect();
    const connection = await ConnectionMysql.build();
    const productData: ProductDataInterface = new ProductDataDatabase(connection);
    const couponData: CouponDataInterface = new CouponDataDatabase(connection);
    const orderData: OrderDataInterface = new OrderDataDatabase(connection);
    const zipcodeData: ZipcodeDataInterface = new ZipcodeDataDatabase(connection);
    const calculateFreight: CalculateFreight = new CalculateFreight(productData, zipcodeData)
    const checkout = new Checkout(productData, couponData, orderData, calculateFreight);
    new QueueController(queue, checkout);
    setTimeout(function () {
        connection.close();
        process.exit(0)
    }, 2000);

})().then(() => console.log("Iniciado..."));