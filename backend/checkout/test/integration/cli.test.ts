import ConnectionMysql from "../../src/infra/database/ConnectionMysql";
import ProductDataInterface from "../../src/domain/datainterface/ProductDataInterface";
import ProductDataDatabase from "../../src/infra/data/ProductDataDatabase";
import CouponDataInterface from "../../src/domain/datainterface/CouponDataInterface";
import CouponDataDatabase from "../../src/infra/data/CouponDataDatabase";
import OrderDataInterface from "../../src/domain/datainterface/OrderDataInterface";
import OrderDataDatabase from "../../src/infra/data/OrderDataDatabase";
import Checkout from "../../src/application/Checkout";
import CLIHandler from "../../src/infra/cli/CLIHandler";
import CLIController from "../../src/infra/cli/CLIController";
import * as sinon from "sinon";
import CLIHandlerMemory from "../../src/infra/cli/CLIHandlerMemory";
import ZipcodeDataInterface from "../../src/domain/datainterface/ZipcodeDataInterface";
import ZipcodeDataDatabase from "../../src/infra/data/ZipcodeDataDatabase";
import CalculateFreight from "../../src/application/CalculateFreight";

test("Deve testar o cli", async function () {
    const connection = await ConnectionMysql.build();
    const productData: ProductDataInterface = new ProductDataDatabase(connection);
    const couponData: CouponDataInterface = new CouponDataDatabase(connection);
    const orderData: OrderDataInterface = new OrderDataDatabase(connection);
    const zipcodeData: ZipcodeDataInterface = new ZipcodeDataDatabase(connection);
    const calculateFreight: CalculateFreight = new CalculateFreight(productData, zipcodeData)
    const checkout = new Checkout(productData, couponData, orderData, calculateFreight);
    const checkoutSpy = sinon.spy(checkout, "execute");
    const handler = new CLIHandlerMemory();
    new CLIController(handler, checkout);
    await handler.type("set-cpf 041.829.006-77");
    await handler.type("add-item 1 1");
    await handler.type("checkout");
    await connection.close();
    const [returnValue] = checkoutSpy.returnValues;
    const output = await returnValue;
    expect(output.code).toBe("202300000001");
    expect(output.total).toBe(1030);
    checkoutSpy.restore();
});

test("Deve testar o cli com comando incorreto", async function () {
    const connection = await ConnectionMysql.build();
    const productData: ProductDataInterface = new ProductDataDatabase(connection);
    const couponData: CouponDataInterface = new CouponDataDatabase(connection);
    const orderData: OrderDataInterface = new OrderDataDatabase(connection);
    const zipcodeData: ZipcodeDataInterface = new ZipcodeDataDatabase(connection);
    const calculateFreight: CalculateFreight = new CalculateFreight(productData, zipcodeData)
    const checkout = new Checkout(productData, couponData, orderData, calculateFreight);
    const checkoutSpy = sinon.spy(checkout, "execute");
    const handler = new CLIHandlerMemory();
    new CLIController(handler, checkout);
    await handler.type("set-cpf 041.829.006-77");
    await handler.type("additem 1 1");
    await handler.type("checkout");
    await connection.close();
    const [returnValue] = checkoutSpy.returnValues;
    const output = await returnValue;
    expect(output.code).toBe("202300000001");
    expect(output.total).toBe(0);
    checkoutSpy.restore();
});