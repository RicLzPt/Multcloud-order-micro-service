import Checkout from "../../application/Checkout";
import QueueInterface from "./QueueInterface";

export default class QueueController{

    constructor(readonly queue: QueueInterface, readonly checkout: Checkout) {
        queue.on("checkout", async function (input: any) {
            const output = await checkout.execute(input);
        });
    }

}