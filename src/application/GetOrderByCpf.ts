import OrderDataInterface from "../domain/datainterface/OrderDataInterface";

export default class GetOrderByCpf {

    constructor(readonly orderData: OrderDataInterface) {
    }

    async execute(cpf: string): Promise<Output> {
        const order = await this.orderData.getByCpf(cpf);
        return {
            total: parseFloat(order.total)
        }
    }
}

type Output = {
    total: number
}