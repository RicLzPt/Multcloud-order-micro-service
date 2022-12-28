import Checkout from "./application/Checkout";
import ProductDataDatabase from "./infra/data/ProductDataDatabase";
import CouponDataDatabase from "./infra/data/CouponDataDatabase";
import OrderDataDatabase from "./infra/data/OrderDataDatabase";
import MysqlConnection from "./infra/database/MysqlConnection";
import ProductDataInterface from "./domain/datainterface/ProductDataInterface";
import CouponDataInterface from "./domain/datainterface/CouponDataInterface";
import OrderDataInterface from "./domain/datainterface/OrderDataInterface";
import {connect} from "amqplib/callback_api";

(async () => {
    const input: any = {
        items: []
    };
    process.stdin.on("data", async function (chunk) {
        const command = chunk.toString().replace(/\n/g, "");

        if (command.startsWith("set-cpf")) {
            const params = command.replace("set-cpf ", "");
            input.cpf = params;
        }
        if (command.startsWith("add-item")) {
            const params = command.replace("add-item ", "");
            const [idProduct, quantity] = params.split(" ");
            input.items.push({idProduct, quantity});
        }
        if (command.startsWith("checkout")) {
            const connection = await MysqlConnection.build();
            try {
                const productData: ProductDataInterface = new ProductDataDatabase(connection);
                const couponData: CouponDataInterface = new CouponDataDatabase(connection);
                const orderData: OrderDataInterface = new OrderDataDatabase(connection);
                const checkout = new Checkout(productData, couponData,orderData);
                const output = await checkout.execute(input);
                console.log(output);
            } catch (e: any) {
                console.log(e.message);
            } finally {
                await connection.close();
            }

        }
    })
})();
