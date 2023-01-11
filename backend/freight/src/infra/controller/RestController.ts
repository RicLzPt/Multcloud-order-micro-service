import HttpServerInterface from "../http/HttpServerInterface";
import CalculateFreight from "../../application/CalculateFreight";

export default class RestController {

    constructor(readonly httpServer: HttpServerInterface, readonly calculateFreight: CalculateFreight) {
        httpServer.on("post", "/calculatefreight", async function (body: any, params: any) {

            const output = await calculateFreight.execute(body);
            return output;
        });
    }
}