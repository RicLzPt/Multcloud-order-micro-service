import CalculateFreight from "../../src/application/CalculateFreight";
import ConnectionMysql from "../../src/infra/database/ConnectionMysql";
import ZipcodeDataInterface from "../../src/domain/datainterface/ZipcodeDataInterface";
import Zipcode from "../../src/domain/entities/Zipcode";
import ZipcodeDataDatabase from "../../src/infra/data/ZipcodeDataDatabase";

test("Deve simular o frete para um pedido sem ceps fake", async function () {
    const zipcode: ZipcodeDataInterface = {
        async get(code: string): Promise<Zipcode | undefined> {
            switch (code) {
                case "22030060":
                    return new Zipcode(code, "", "", -27.5945, -48.5477);
                case "88015600":
                    return new Zipcode(code, "", "", -22.9129, -43.2003);
            }
        }
    };
    const calculateFreight = new CalculateFreight(zipcode);
    const input = {
        items: [
            {volume: 0.03, density: 100, quantity: 1}
        ]
    };
    const output = await calculateFreight.execute(input);
    expect(output.total).toBe(30);
});

test("Deve simular o frete para um pedido com ceps fake", async function () {
    const zipcodeData: ZipcodeDataInterface = {
        async get(code: string): Promise<Zipcode | undefined> {
            switch (code) {
                case "22030060":
                    return new Zipcode(code, "", "", -27.5945, -48.5477);
                case "88015600":
                    return new Zipcode(code, "", "", -22.9129, -43.2003);
            }
        }
    };
    const calculateFreight = new CalculateFreight(zipcodeData);
    const input = {
        from: "22030060",
        to: "88015600",
        items: [
            {volume: 0.03, density: 100, quantity: 1}
        ]
    };
    const output = await calculateFreight.execute(input);
    expect(output.total).toBe(22.45);
});

test("Deve simular o frete para um pedido com ceps DB", async function () {
    const connection = await ConnectionMysql.build();
    const zipcode: ZipcodeDataInterface = new ZipcodeDataDatabase(connection);
    const calculateFreight = new CalculateFreight(zipcode);
    const input = {
        from: "22030060",
        to: "88015600",
        items: [
            {volume: 0.03, density: 100, quantity: 1}
        ]
    };
    const output = await calculateFreight.execute(input);
    await connection.close();
    expect(output.total).toBe(22.45);
});

test("Deve simular o frete para um pedido com ceps DB, cep errado", async function () {
    const connection = await ConnectionMysql.build();
    const zipcode: ZipcodeDataInterface = new ZipcodeDataDatabase(connection);
    const calculateFreight = new CalculateFreight(zipcode);
    const input = {
        from: "22030061",
        to: "88015600",
        items: [
            {volume: 0.03, density: 100, quantity: 1}
        ]
    };
    await expect(async () => {
        await calculateFreight.execute(input);
    }).rejects.toThrowError("Zipcode not found");
    await connection.close();
});