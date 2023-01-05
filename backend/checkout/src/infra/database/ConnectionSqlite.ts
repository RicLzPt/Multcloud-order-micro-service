import ConnectionInterface from "./ConnectionInterface";
import sqlite3 from "sqlite3";
import {open} from "sqlite";
import ConnectionTestInterface from "./ConnectionTestInterface";

export default class ConnectionSqlite implements ConnectionInterface, ConnectionTestInterface {

    private constructor(readonly connection: any) {
    }

    static async build(): Promise<ConnectionSqlite> {
        // console.log("passei");
        const connection = await open({
            filename: ':memory:',
            driver: sqlite3.Database
        });
        // console.log(connection);
        return new ConnectionSqlite(connection);
    }

    async query(statement: string, params: any): Promise<any> {
        return this.connection.all(statement, params);
    }

    async close(): Promise<void> {
        return this.connection.close();
    }

    generateDb(): Promise<void> {
        return Promise.resolve(undefined);
    }


}