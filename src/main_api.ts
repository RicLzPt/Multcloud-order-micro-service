import Checkout from "./application/Checkout";
import ProductDataDatabase from "./infra/data/ProductDataDatabase";
import CouponDataDatabase from "./infra/data/CouponDataDatabase";
import OrderDataDatabase from "./infra/data/OrderDataDatabase";
import ProductDataInterface from "./domain/datainterface/ProductDataInterface";
import CouponDataInterface from "./domain/datainterface/CouponDataInterface";
import OrderDataInterface from "./domain/datainterface/OrderDataInterface";
import MysqlConnection from "./infra/database/MysqlConnection";
import ExpressHttpServer from "./infra/http/ExpressHttpServer";
import RestController from "./infra/controller/RestController";
import HapiHttpServer from "./infra/http/HapiHttpServer";

(async function mainApi() {

    const connection = await MysqlConnection.build();
    const httpServer = new HapiHttpServer();
    // const httpServer = new ExpressHttpServer();
    const productData: ProductDataInterface = new ProductDataDatabase(connection);
    const couponData: CouponDataInterface = new CouponDataDatabase(connection);
    const orderData: OrderDataInterface = new OrderDataDatabase(connection);
    const checkout = new Checkout(productData, couponData, orderData);
    new RestController(httpServer, checkout);
    await httpServer.listen(3000).then(() => console.log("Port 3000"));

})().then(() => console.log("Iniciado..."));