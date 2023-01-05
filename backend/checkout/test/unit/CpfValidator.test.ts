import {validate} from "../../src/domain/entities/CpfValidator";

const validsCpfs: string[] = [
    "04182900677",
    "987.654.321-00",
    "714.602.380-01",
    "313.030.210-72",
    "144.796.170-60",
];

test.each(validsCpfs)("Deve testar um cpf válido: %s", function (cpf: string) {
    const isValid = validate(cpf);
    expect(isValid).toBeTruthy();
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
];

test.each(invalidsCpfs)("Deve testar um cpf inválido: %s", function (cpf: string) {
    const isValid = validate(cpf);
    expect(isValid).toBeFalsy();
});

test("CPF com tamanho diferente de 11", function () {
    const isValid = validate("123");
    expect(isValid).toBeFalsy();
});

