import CouponDataDatabase from "../src/infra/data/CouponDataDatabase";
import ValidateCoupon from "../src/application/ValidateCoupon";
import MysqlConnection from "../src/infra/database/MysqlConnection";

test("Deve validar um cupom de desconto", async function () {
    const connection = await MysqlConnection.build();
    const couponData = new CouponDataDatabase(connection);
    const validateCoupon = new ValidateCoupon(couponData);
    const output = await validateCoupon.execute("VALE20", 1000);
    await connection.close();
    expect(output.isExpired).toBeFalsy();
    expect(output.discount).toBe(200);
});
