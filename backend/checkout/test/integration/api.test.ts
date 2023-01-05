import axios from "axios";

axios.defaults.validateStatus = () => true;

test("Não deve fazer pedido com CPF inválido", async function () {
    const input = {
        cpf: "111.111.111-45"
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    expect(response.status).toBe(422);
    const output = response.data;
    expect(output.message).toBe("Invalid cpf");

});

test("Deve fazer pedido com 3 produtos", async function () {
    const input = {
        cpf: "041.829.006-77",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 2, quantity: 1},
            {idProduct: 3, quantity: 3},
        ]
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toBe(6370);

});

test("Não deve fazer pedido com produto que não existe", async function () {
    const input = {
        cpf: "041.829.006-77",
        items: [
            {idProduct: 5, quantity: 1},
        ]
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    expect(response.status).toBe(422);
    const output = response.data;
    expect(output.message).toBe("Product not found");

});

test("Deve fazer pedido com 3 produtos com desconto", async function () {
    const input = {
        cpf: "041.829.006-77",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 2, quantity: 1},
            {idProduct: 3, quantity: 3},
        ],
        coupon: "VALE20"
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toBe(5152);
});

test("Deve fazer pedido com 3 produtos com desconto expirado", async function () {
    const input = {
        cpf: "041.829.006-77",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 2, quantity: 1},
            {idProduct: 3, quantity: 3},
        ],
        coupon: "VALE20EXPIRED"
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toBe(6370);
});

test("Deve fazer pedido com quantidade negativa", async function () {
    const input = {
        cpf: "041.829.006-77",
        items: [
            {idProduct: 1, quantity: -1},

        ]
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    expect(response.status).toBe(422);
    const output = response.data;
    expect(output.message).toBe("Quantity must be positive");
});

test("Deve fazer pedido com duplicidade de produtos", async function () {
    const input = {
        cpf: "041.829.006-77",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 1, quantity: 1},

        ]
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    expect(response.status).toBe(422);
    const output = response.data;
    expect(output.message).toBe("Duplicated product");


});

test("Deve fazer pedido e calcular o frete", async function () {
    const input = {
        cpf: "041.829.006-77",
        items: [
            {idProduct: 1, quantity: 1},
        ]
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toBe(1030);

});

test("Deve fazer pedido e calcular o frete", async function () {
    const input = {
        cpf: "041.829.006-77",
        items: [
            {idProduct: 3, quantity: 1},
        ]
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toBe(40);

});