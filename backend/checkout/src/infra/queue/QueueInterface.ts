export default interface QueueInterface {

    connect(): Promise<any>;
    on(queueName: string, callback: Function): void;
    publish(queueName: string, data: any): Promise<void>
}