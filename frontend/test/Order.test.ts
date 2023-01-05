import Order from "../src/domain/Order";
import Product from "../src/domain/Product";

test("Deve criar um pedido vazio", function () {
    const order = new Order("041.829.006-77");
    expect(order.getTotal()).toBe(0);
});

test("Deve criar um pedido com 3 itens", function () {
    const order = new Order("041.829.006-77");
    order.addItem(new Product(1, "A", 1000));
    order.addItem(new Product(2, "B", 5000));
    order.addItem(new Product(3, "C", 30));
    expect(order.getTotal()).toBe(6030);
});

test("Deve criar um pedido com 3 itens", function () {
    const order = new Order("041.829.006-77");
    order.addItem(new Product(1, "A", 1000));
    order.addItem(new Product(1, "A", 1000));
    order.addItem(new Product(1, "A", 1000));
    expect(order.getTotal()).toBe(3000);
    expect(order.items).toHaveLength(1);
    expect(order.items[0].quantity).toBe(3);
});

test("Deve criar um pedido com 1 item e aumentar quantidade", function () {
    const order = new Order("041.829.006-77");
    const product = new Product(1, "A", 1000);
    order.addItem(product);
    order.increaseItem(order.items[0]);
    order.increaseItem(order.items[0]);
    expect(order.getTotal()).toBe(3000);
});

test("Deve criar um pedido com 1 item e diminuir quantidade", function () {
    const order = new Order("041.829.006-77");
    const product = new Product(1, "A", 1000);
    order.addItem(product);
    order.addItem(product);
    order.increaseItem(order.items[0]);
    order.increaseItem(order.items[0]);
    order.decreaseItem(order.items[0]);
    order.decreaseItem(order.items[0]);
    expect(order.getTotal()).toBe(2000);
});

test("Deve criar um pedido com 1 item e diminuir quantidade abaixo de 0", function () {
    const order = new Order("041.829.006-77");
    const product = new Product(1, "A", 1000);
    order.addItem(product);
    order.addItem(product);
    order.increaseItem(order.items[0]);
    order.increaseItem(order.items[0]);
    order.decreaseItem(order.items[0]);
    order.decreaseItem(order.items[0]);
    order.decreaseItem(order.items[0]);
    order.decreaseItem(order.items[0]);
    order.decreaseItem(order.items[0]);
    order.decreaseItem(order.items[0]);
    expect(order.getTotal()).toBe(0);
});