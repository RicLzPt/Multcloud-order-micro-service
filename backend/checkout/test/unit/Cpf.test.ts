import Cpf from "../../src/domain/entities/Cpf";
import {validate} from "../../src/domain/entities/CpfValidator";

test("Deve retornar um CPF válido", function () {
    const cpf = new Cpf("041.829.006-77");
    expect(cpf.getValue()).toBe("041.829.006-77");
});

const invalidsCpfs: string[] = [
    "111.111.111-11",
    "222.222.222-22",
    "333.333.333-33",
    "555.555.555-55",
    "666.666.666-66",
    "777.777.777-77",
    "888.888.888-88",
    "999.999.999-99",
    "000.000.000-00",
    "04182900676",
    "987.654.321-01",
    "714.602.380-02",
    "313.030.210-73",
    "144.796.170-69",
    "144.796.170-6",
];
test.each(invalidsCpfs)("Deve testar um cpf inválido: %s", function (cpf: string) {
    expect(() => new Cpf(cpf)).toThrow("Invalid cpf");
});