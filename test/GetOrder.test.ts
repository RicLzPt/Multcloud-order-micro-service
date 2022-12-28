import Checkout from "../src/application/Checkout";
import ProductDataInterface from "../src/domain/datainterface/ProductDataInterface";
import ProductDataDatabase from "../src/infra/data/ProductDataDatabase";
import CouponDataInterface from "../src/domain/datainterface/CouponDataInterface";
import CouponDataDatabase from "../src/infra/data/CouponDataDatabase";
import OrderDataInterface from "../src/domain/datainterface/OrderDataInterface";
import GetOrderByCpf from "../src/application/GetOrderByCpf";
import OrderDataDatabase from "../src/infra/data/OrderDataDatabase";
import MysqlConnection from "../src/infra/database/MysqlConnection";

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

    const connection = await MysqlConnection.build();
    const productData: ProductDataInterface = new ProductDataDatabase(connection);
    const couponData: CouponDataInterface = new CouponDataDatabase(connection);
    const orderData: OrderDataInterface = new OrderDataDatabase(connection);
    const checkout: Checkout = new Checkout(productData, couponData, orderData);
    await checkout.execute(input);

    const getOrderByCpf = new GetOrderByCpf(orderData);
    const output = await getOrderByCpf.execute("041.829.006-77");
    await connection.close();
    expect(output.total).toBe(5132);

});