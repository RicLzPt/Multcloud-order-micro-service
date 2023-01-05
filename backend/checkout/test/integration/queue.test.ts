import QueueRabbitMQAdapter from "../../src/infra/queue/QueueRabbitMQAdapter";
import ConnectionMysql from "../../src/infra/database/ConnectionMysql";
import ProductDataInterface from "../../src/domain/datainterface/ProductDataInterface";
import ProductDataDatabase from "../../src/infra/data/ProductDataDatabase";
import CouponDataInterface from "../../src/domain/datainterface/CouponDataInterface";
import CouponDataDatabase from "../../src/infra/data/CouponDataDatabase";
import OrderDataInterface from "../../src/domain/datainterface/OrderDataInterface";
import OrderDataDatabase from "../../src/infra/data/OrderDataDatabase";
import Checkout from "../../src/application/Checkout";
import QueueController from "../../src/infra/queue/QueueController";
import * as sinon from "sinon";
import QueueMemory from "../../src/infra/queue/QueueMemory";
import ZipcodeDataInterface from "../../src/domain/datainterface/ZipcodeDataInterface";
import ZipcodeDataDatabase from "../../src/infra/data/ZipcodeDataDatabase";
import CalculateFreight from "../../src/application/CalculateFreight";

test("Deve testar a fila", async function () {
    const queue = new QueueMemory();
    await queue.connect();
    const connection = await ConnectionMysql.build();
    const productData: ProductDataInterface = new ProductDataDatabase(connection);
    const couponData: CouponDataInterface = new CouponDataDatabase(connection);
    const orderData: OrderDataInterface = new OrderDataDatabase(connection);
    const zipcodeData: ZipcodeDataInterface = new ZipcodeDataDatabase(connection);
    const calculateFreight: CalculateFreight = new CalculateFreight(productData, zipcodeData)
    const checkout = new Checkout(productData, couponData, orderData, calculateFreight);
    const checkouSpy = sinon.spy(checkout, "execute");
    new QueueController(queue, checkout);
    const input = {
        cpf: "041.829.006-77",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 2, quantity: 1},
            {idProduct: 3, quantity: 3},
        ]
    };
    await queue.publish("checkout", input);
    const [returnValue] = checkouSpy.returnValues;
    const output = await returnValue;
    expect(output.code).toBe("202300000001");
    expect(output.total).toBe(6370);
    checkouSpy.restore();
    await connection.close();
});