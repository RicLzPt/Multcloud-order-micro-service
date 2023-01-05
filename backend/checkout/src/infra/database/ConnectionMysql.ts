import ConnectionInterface from "./ConnectionInterface";
import mysql, {RowDataPacket} from "mysql2/promise";

export default class ConnectionMysql implements ConnectionInterface {

    private constructor(readonly connection: any) {
    }

    static async build(): Promise<ConnectionMysql> {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'popric21',
            database: 'branas9',
        });
        return new ConnectionMysql(connection);
    }


    async query(statement: string, params: any): Promise<any> {
        // @ts-ignore
        return await this.connection.query<RowDataPacket[]>(statement, params);
    }

    async close(): Promise<void> {
        return this.connection.end();
    }

}