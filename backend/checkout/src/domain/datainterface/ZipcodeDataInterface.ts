import Zipcode from "../entities/Zipcode";

export default interface ZipcodeDataInterface {
    get(code: string): Promise<Zipcode | undefined>;
}