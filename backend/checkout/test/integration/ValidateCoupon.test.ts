import CouponDataDatabase from "../../src/infra/data/CouponDataDatabase";
import ValidateCoupon from "../../src/application/ValidateCoupon";
import ConnectionMysql from "../../src/infra/database/ConnectionMysql";

test("Deve validar um cupom de desconto", async function () {
    const connection = await ConnectionMysql.build();
    const couponData = new CouponDataDatabase(connection);
    const validateCoupon = new ValidateCoupon(couponData);
    const output = await validateCoupon.execute("VALE20", 1000);
    await connection.close();
    expect(output.isExpired).toBeFalsy();
    expect(output.discount).toBe(200);
});
