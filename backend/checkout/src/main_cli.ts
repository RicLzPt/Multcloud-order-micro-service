import CLIController from "./infra/cli/CLIController";
import ProductDataInterface from "./domain/datainterface/ProductDataInterface";
import ProductDataDatabase from "./infra/data/ProductDataDatabase";
import CouponDataInterface from "./domain/datainterface/CouponDataInterface";
import CouponDataDatabase from "./infra/data/CouponDataDatabase";
import OrderDataInterface from "./domain/datainterface/OrderDataInterface";
import OrderDataDatabase from "./infra/data/OrderDataDatabase";
import Checkout from "./application/Checkout";
import CLIHandler from "./infra/cli/CLIHandler";
import ConnectionMysql from "./infra/database/ConnectionMysql";
import CLIHandlerNode from "./infra/cli/CLIHandlerNode";
import ZipcodeDataInterface from "./domain/datainterface/ZipcodeDataInterface";
import ZipcodeDataDatabase from "./infra/data/ZipcodeDataDatabase";
import CalculateFreight from "./application/CalculateFreight";

(async function mainCLI() {

    const connection = await ConnectionMysql.build();
    const productData: ProductDataInterface = new ProductDataDatabase(connection);
    const couponData: CouponDataInterface = new CouponDataDatabase(connection);
    const orderData: OrderDataInterface = new OrderDataDatabase(connection);
    const zipcodeData: ZipcodeDataInterface = new ZipcodeDataDatabase(connection);
    const calculateFreight: CalculateFreight = new CalculateFreight(productData, zipcodeData)
    const checkout = new Checkout(productData, couponData, orderData, calculateFreight);
    const handler = new CLIHandlerNode();
    new CLIController(handler, checkout);

})().then(() => console.log("Iniciado..."));
