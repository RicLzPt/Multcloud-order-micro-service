export default interface ConnectionInterface {
    query(statement: string, params: any): Promise<any>;

    close(): Promise<void>;
}