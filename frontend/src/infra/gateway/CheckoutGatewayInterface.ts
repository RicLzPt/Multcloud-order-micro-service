import Product from "../../domain/Product";

export default interface CheckoutGatewayInterface {

    getProducts(): Promise<Product[]>;

    checkout(input: any): Promise<any>;

}