import CurrencyGatewayInterface from "./CurrencyGatewayInterface";
import Currencies from "../../domain/entities/Currencies";

export default class CurrencyGatewayRandom implements CurrencyGatewayInterface {

    async getCurrencies(): Promise<Currencies> {
        const currencies = new Currencies();
        currencies.addCurrency("USD", 3 + Math.random());
        currencies.addCurrency("BRL", 1);
        return currencies;
        // return {
        //     "USD": 3 + Math.random(),
        //     "BRL": 1
        // };
    }
}