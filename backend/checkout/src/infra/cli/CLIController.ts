import Checkout from "../../application/Checkout";
import CLIHandler from "./CLIHandler";

export default class CLIController {

    constructor(readonly handler: CLIHandler, readonly checkout: Checkout) {
        const input: any = {
            items: []
        }
        handler.on("set-cpf", function (params: string) {
            input.cpf = params;
            // console.log(input);
        });
        handler.on("add-item", function (params: string) {
            const [idProduct, quantity] = params.split(" ");
            input.items.push({
                idProduct: parseInt(idProduct),
                quantity: parseInt(quantity)
            })
            // console.log(input);
        });
        handler.on("checkout", async function (params: string) {
            const output = await checkout.execute(input);
            handler.write(JSON.stringify(output));
        });
    }

}