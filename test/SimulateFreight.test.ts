import ProductDataInterface from "../src/domain/datainterface/ProductDataInterface";
import ProductDataDatabase from "../src/infra/data/ProductDataDatabase";
import SimulateFreight from "../src/application/SimulateFreight";
import Checkout from "../src/application/Checkout";
import MysqlConnection from "../src/infra/database/MysqlConnection";

test("Deve simular o frete para um pedido", async function () {
    const connection = await MysqlConnection.build();
    const productData: ProductDataInterface = new ProductDataDatabase(connection);
    const simulateFreight = new SimulateFreight(productData);
    const input = {
        items: [
            {idProduct: 1, quantity: 1}
        ]
    };
    const output = await simulateFreight.execute(input);
    await connection.close();
    expect(output.total).toBe(30);
});

test("Deve simular o frete para um pedido com produto inexistente", async function () {
    const connection = await MysqlConnection.build();
    const productData: ProductDataInterface = new ProductDataDatabase(connection);
    const simulateFreight = new SimulateFreight(productData);
    const input = {
        items: [
            {idProduct: 10, quantity: 1}
        ]
    };
    await expect(async () => {
        await simulateFreight.execute(input);
    }).rejects.toThrowError("Product not found");
    await connection.close();
})