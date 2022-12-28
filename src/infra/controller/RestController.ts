import Checkout from "../../application/Checkout";
import HttpServerInterface from "../http/HttpServerInterface";

export default class RestController {

    constructor(readonly httpServer: HttpServerInterface, readonly checkout: Checkout) {
        httpServer.on("post", "/checkout", async function (body: any, params: any) {
            const output = await checkout.execute(body);
            return output;
        });
    }

}