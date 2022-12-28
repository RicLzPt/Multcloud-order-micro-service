export default class Currencies {
    values: { [currency: string]: number } = {}

    addCurrency(currency: string, value: number) {
        this.values[currency] = value;
    }

    getCurrency(currency: string): number {
        return this.values[currency];
    }
}