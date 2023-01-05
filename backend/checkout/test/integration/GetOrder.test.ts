import Checkout from "../../src/application/Checkout";
import ProductDataInterface from "../../src/domain/datainterface/ProductDataInterface";
import ProductDataDatabase from "../../src/infra/data/ProductDataDatabase";
import CouponDataInterface from "../../src/domain/datainterface/CouponDataInterface";
import CouponDataDatabase from "../../src/infra/data/CouponDataDatabase";
import OrderDataInterface from "../../src/domain/datainterface/OrderDataInterface";
import GetOrderByCpf from "../../src/application/GetOrderByCpf";
import OrderDataDatabase from "../../src/infra/data/OrderDataDatabase";
import ConnectionMysql from "../../src/infra/database/ConnectionMysql";
import ZipcodeDataInterface from "../../src/domain/datainterface/ZipcodeDataInterface";
import ZipcodeDataDatabase from "../../src/infra/data/ZipcodeDataDatabase";
import CalculateFreight from "../../src/application/CalculateFreight";

test("Deve consultar um pedido", async function () {
    const input = {
        cpf: "041.829.006-77",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 2, quantity: 1},
            {idProduct: 3, quantity: 3},
        ],
        coupon: "VALE20"
    };

    const connection = await ConnectionMysql.build();
    const productData: ProductDataInterface = new ProductDataDatabase(connection);
    const couponData: CouponDataInterface = new CouponDataDatabase(connection);
    const orderData: OrderDataInterface = new OrderDataDatabase(connection);
    const zipcodeData: ZipcodeDataInterface = new ZipcodeDataDatabase(connection);
    const calculateFreight: CalculateFreight = new CalculateFreight(productData, zipcodeData)
    const checkout = new Checkout(productData, couponData, orderData, calculateFreight);
    await checkout.execute(input);

    const getOrderByCpf = new GetOrderByCpf(orderData);
    const output = await getOrderByCpf.execute("041.829.006-77");
    await connection.close();
    expect(output.total).toBe(5132);

});