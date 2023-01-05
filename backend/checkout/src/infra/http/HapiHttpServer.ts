import HttpServerInterface from "./HttpServerInterface";
import Hapi from "@hapi/hapi";

export default class HapiHttpServer implements HttpServerInterface {

    app: Hapi.Server;

    constructor() {
        this.app = Hapi.server({
            routes: {
                cors: {
                    origin:["http://localhost:5173"]
                }
            }
        });
    }

    private convertUrl(url: string): string {
        return url.replace(/\$/g, "");
    }

    async on(method: string, url: string, callback: Function): Promise<void> {
        this.app.route(
            {
                method,
                path: url,
                handler: async function (req: any, res: any) {
                    try {
                        const data = await callback(req.payload, req.params);
                        return data;
                    } catch (error: any) {
                        return res.response({
                            message: error.message
                        }).code(422);
                    }
                }
            }
        );
    }

    async listen(port: number): Promise<any> {
        this.app.settings.port = port;
        await this.app.start();
    }


}