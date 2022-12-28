import CLIController from "./infra/cli/CLIController";
import ProductDataInterface from "./domain/datainterface/ProductDataInterface";
import ProductDataDatabase from "./infra/data/ProductDataDatabase";
import CouponDataInterface from "./domain/datainterface/CouponDataInterface";
import CouponDataDatabase from "./infra/data/CouponDataDatabase";
import OrderDataInterface from "./domain/datainterface/OrderDataInterface";
import OrderDataDatabase from "./infra/data/OrderDataDatabase";
import Checkout from "./application/Checkout";
import CLIHandler from "./infra/cli/CLIHandler";
import MysqlConnection from "./infra/database/MysqlConnection";
import CLIHandlerNode from "./infra/cli/CLIHandlerNode";

(async function mainCLI() {

    const connection = await MysqlConnection.build();
    const productData: ProductDataInterface = new ProductDataDatabase(connection);
    const couponData: CouponDataInterface = new CouponDataDatabase(connection);
    const orderData: OrderDataInterface = new OrderDataDatabase(connection);
    const checkout = new Checkout(productData, couponData, orderData);
    const handler = new CLIHandlerNode();
    new CLIController(handler, checkout);

})().then(() => console.log("Iniciado..."));
