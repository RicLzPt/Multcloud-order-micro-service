import Coupon from "../../src/domain/entities/Coupon";

test("Deve testar cupom de desconto", function () {
    const coupon = new Coupon("VALE20", 20, new Date("2023-12-31T00:00:00"));
    expect(coupon.isExpired()).toBeFalsy();
    expect(coupon.getDiscount(1000)).toBe(200);
})