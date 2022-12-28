import CouponDataInterface from "../../domain/datainterface/CouponDataInterface";
import mysql, {RowDataPacket} from "mysql2/promise";
import Coupon from "../../domain/entities/Coupon";
import ConnectionInterface from "../database/ConnectionInterface";

export default class CouponDataDatabase implements CouponDataInterface {

    constructor(readonly connection: ConnectionInterface) {
    }
    async getCoupon(code: string): Promise<Coupon> {

        const [rowData] = await this.connection.query('SELECT * FROM branas9.coupon WHERE code = ?', [code]);
        const couponData = rowData[0];
        return new Coupon(
            couponData.code,
            parseFloat(couponData.percentage),
            couponData.expire_date
        );
    }

}