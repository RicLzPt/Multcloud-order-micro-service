import Currencies from "../../domain/entities/Currencies";

export default interface CurrencyGatewayInterface {
    getCurrencies(): Promise<Currencies>;
}