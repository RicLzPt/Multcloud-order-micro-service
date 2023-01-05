import OrderDataInterface from "../../domain/datainterface/OrderDataInterface";
import mysql, {RowDataPacket} from "mysql2/promise";
import {rootLogger} from "ts-jest";
import Order from "../../domain/entities/Order";
import ConnectionInterface from "../database/ConnectionInterface";

export default class OrderDataDatabase implements OrderDataInterface {

    constructor(readonly connection: ConnectionInterface) {
    }

    async getByCpf(cpf: string): Promise<any> {

        const [orderData] = await this.connection.query("select * from branas9.db_order where cpf = ?", [cpf]);
        return orderData[0];
    }

    async save(order: Order): Promise<void> {
        const [resultArray] = await this.connection.query(
            "insert into branas9.db_order (cpf, total) values (?,?)", [order.getCpf(), order.getTotal()]
        );
    }

    async count(): Promise<number> {
        const [count] = await this.connection.query("select count(*) as count from branas9.db_order", []);
        return count[0].count;
    }


}