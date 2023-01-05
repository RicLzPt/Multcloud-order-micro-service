import CouponDataInterface from "../domain/datainterface/CouponDataInterface";

export default class ValidateCoupon {

    constructor(readonly couponData: CouponDataInterface) {
    }

    async execute(code: string, total: number): Promise<Output> {
        const coupon = await this.couponData.getCoupon(code);
        return {
            isExpired: coupon.isExpired(),
            discount: coupon.getDiscount(total)
        }
    }

}

type Output = {
    isExpired: Boolean,
    discount: number
}