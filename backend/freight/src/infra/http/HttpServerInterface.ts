export default interface HttpServerInterface {
    on(method: string, url: string, callback: Function): void;
    listen(port:number): any;

}