import HttpServerInterface from "./HttpServerInterface";
import express, {Express} from "express";
import cors from "cors";

export default class ExpressHttpServer implements HttpServerInterface {

    app: any;

    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(cors({
            origin: "http://localhost:5173"
        }));
    }

    on(method: string, url: string, callback: Function): void {
        this.app[method](url, async function (req: any, res: any) {
            try {
                const output = await callback(req.body, req.params);
                res.json(output);
            } catch (error: any) {
                res.status(422).json({
                    message: error.message
                });
            }
        });
    }

    async listen(port: number): Promise<any> {
         return await this.app.listen(port);
    }
}