import Order from "../entities/Order";

export default interface OrderDataInterface {
    save(order: Order): Promise<void>;

    getByCpf(cpf: string): Promise<any>;

    count(): Promise<number>;
}