import OrderCode from "../src/domain/entities/OrderCode";

test("Deve criar um código para o pedido", function () {
    const orderCode = new OrderCode(new Date("2022-12-20T00:00:00"), 1);
    expect(orderCode.getValue()).toBe("202200000001");
});

test("Não deve criar código com sequence negativo", function () {
    expect(() => new OrderCode(new Date("2022-12-20T00:00:00"), -1))
        .toThrow("Invalid sequence");
})