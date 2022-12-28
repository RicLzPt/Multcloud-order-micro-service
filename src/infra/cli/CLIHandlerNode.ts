import CLIHandler from "./CLIHandler";

export default class CLIHandlerNode extends CLIHandler {

    constructor() {
        super();
        process.stdin.on("data", async (chunk) => {
            const text = chunk.toString().replace(/\n/g, "");
            await this.type(text);
        })
    }

    write(text: string): void {
        console.log(text);
    }

}