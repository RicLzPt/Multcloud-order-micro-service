import Coupon from "../entities/Coupon";

export default interface CouponDataInterface {
    getCoupon(code: string): Promise<Coupon>;
}