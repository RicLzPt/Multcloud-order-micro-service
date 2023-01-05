import Checkout from "./application/Checkout";
import ProductDataDatabase from "./infra/data/ProductDataDatabase";
import CouponDataDatabase from "./infra/data/CouponDataDatabase";
import OrderDataDatabase from "./infra/data/OrderDataDatabase";
import ProductDataInterface from "./domain/datainterface/ProductDataInterface";
import CouponDataInterface from "./domain/datainterface/CouponDataInterface";
import OrderDataInterface from "./domain/datainterface/OrderDataInterface";
import ConnectionMysql from "./infra/database/ConnectionMysql";
import ExpressHttpServer from "./infra/http/ExpressHttpServer";
import RestController from "./infra/controller/RestController";
import HapiHttpServer from "./infra/http/HapiHttpServer";
import ConnectionSqlite from "./infra/database/ConnectionSqlite";
import ZipcodeDataInterface from "./domain/datainterface/ZipcodeDataInterface";
import ZipcodeDataDatabase from "./infra/data/ZipcodeDataDatabase";
import CalculateFreight from "./application/CalculateFreight";

(async function mainApi() {

    const connection = await ConnectionMysql.build();
    // const connection = await ConnectionSqlite.build();
    // const httpServer = new HapiHttpServer();
    const httpServer = new ExpressHttpServer();
    const productData: ProductDataInterface = new ProductDataDatabase(connection);
    const couponData: CouponDataInterface = new CouponDataDatabase(connection);
    const orderData: OrderDataInterface = new OrderDataDatabase(connection);
    const zipcodeData: ZipcodeDataInterface = new ZipcodeDataDatabase(connection);
    const calculateFreight: CalculateFreight = new CalculateFreight(productData, zipcodeData)
    const checkout = new Checkout(productData, couponData, orderData, calculateFreight);
    new RestController(httpServer, checkout);
    await httpServer.listen(3000).then(() => console.log("Port 3000"));

})().then(() => console.log("Iniciado..."));