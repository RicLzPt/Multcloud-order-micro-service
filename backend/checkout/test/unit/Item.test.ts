import Item from "../../src/domain/entities/Item";

test("Deve instanciar um item de order", function () {
    const item = new Item(1, 1000, 2, "USD", 2);
    expect(item.getTotal()).toBe(4000);
});