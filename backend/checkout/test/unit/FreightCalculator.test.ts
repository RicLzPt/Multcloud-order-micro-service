import FreightCalculator from "../../src/domain/entities/FreightCalculator";
import Product from "../../src/domain/entities/Product";

test("Deve calcular o frete com distância padrão", function () {
    const product: Product = new Product(1, "A", 1000, 100, 30, 10, 3);
    const freight = FreightCalculator.calculate(product);
    expect(freight).toBe(30);
});

test("Deve calcular o frete mínimo", function () {
    const product = new Product(3, "C", 30, 10, 10, 10, 0.9);
    const freight = FreightCalculator.calculate(product);
    expect(freight).toBe(10);
});

test("Deve calcular o frete com distância variável", function () {
    const product: Product = new Product(1, "A", 1000, 100, 30, 10, 3);
    const distance = 748.2217780081631;
    const freight = FreightCalculator.calculate(product, distance);
    expect(freight).toBe(22.45);
});