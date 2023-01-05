import QueueInterface from "./QueueInterface";

export default class QueueMemory implements QueueInterface {

    observers: { queueName: string, callback: Function }[];

    constructor() {
        this.observers = [];
    }

    async connect(): Promise<any> {
    }

    on(queueName: string, callback: Function): void {
        this.observers.push({queueName, callback});
    }

    async publish(queueName: string, data: any): Promise<void> {
        for (const observer of this.observers) {
            if (observer.queueName == queueName) {
                await observer.callback(data);
            }
        }
    }

}