import Order from "../../src/domain/entities/Order";
import Product from "../../src/domain/entities/Product";
import Coupon from "../../src/domain/entities/Coupon";
import ConnectionMysql from "../../src/infra/database/ConnectionMysql";
import ProductDataInterface from "../../src/domain/datainterface/ProductDataInterface";
import ProductDataDatabase from "../../src/infra/data/ProductDataDatabase";
import CouponDataInterface from "../../src/domain/datainterface/CouponDataInterface";
import CouponDataDatabase from "../../src/infra/data/CouponDataDatabase";
import OrderDataInterface from "../../src/domain/datainterface/OrderDataInterface";
import OrderDataDatabase from "../../src/infra/data/OrderDataDatabase";
import Checkout from "../../src/application/Checkout";
import GetOrderByCpf from "../../src/application/GetOrderByCpf";

test("Deve criar  vazio com CPF válido", function () {
    const order = new Order("041.829.006-77");
    expect(order.getTotal()).toBe(0);
});

test("Não deve criar pedido com CPF inválido", function () {
    expect(() => new Order("041.829.006-76")).toThrow("Invalid cpf");
});

test("Deve criar pedido com 3 items", function () {
    const order = new Order("041.829.006-77");
    order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3), 1);
    order.addItem(new Product(2, "B", 5000, 50, 50, 50, 22), 1);
    order.addItem(new Product(3, "C", 30, 10, 10, 10, 1), 3);
    order.freight = 280;
    expect(order.getTotal()).toBe(6370);
});

test("Deve criar pedido com 3 items com desconto", function () {
    const order = new Order("041.829.006-77");
    order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3), 1);
    order.addItem(new Product(2, "B", 5000, 50, 50, 50, 22), 1);
    order.addItem(new Product(3, "C", 30, 10, 10, 10, 1), 3);
    order.addCoupon(new Coupon("VALE20", 20, new Date("2023-12-31T00:00:00")));
    order.freight = 280;
    expect(order.getTotal()).toBe(5152);
});

test("Não deve fazer pedido com quantidade zerada ou negativa", function () {
    const order = new Order("041.829.006-77");
    expect(() => order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3), 0))
        .toThrow("Quantity must be positive")
});

test("Não deve fazer pedido com item duplicado", function () {
    const order = new Order("041.829.006-77");
    order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3), 1);
    expect(() => order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3), 1))
        .toThrow("Duplicated product")

});

test("Deve criar pedido com 3 items com desconto e código", function () {
    const order = new Order("041.829.006-77", new Date("2023-01-02T00:00:00"), 1);
    order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3), 1);
    order.addItem(new Product(2, "B", 5000, 50, 50, 50, 22), 1);
    order.addItem(new Product(3, "C", 30, 10, 10, 10, 1), 3);
    order.addCoupon(new Coupon("VALE20", 20, new Date("2023-12-31T00:00:00")));
    expect(order.getOrderCode()).toBe("202300000001");
});
