import ZipcodeDataInterface from "../../domain/datainterface/ZipcodeDataInterface";
import ConnectionInterface from "../database/ConnectionInterface";
import Zipcode from "../../domain/entities/Zipcode";

export default class ZipcodeDataDatabase implements ZipcodeDataInterface {

    constructor(readonly connection: ConnectionInterface) {
    }

    async get(code: string): Promise<Zipcode | undefined> {
        const [rowData] = await this.connection.query('SELECT * FROM branas9.zipcode WHERE code = ?', [code]);
        const zipcodeData = rowData[0];
        if (!zipcodeData) throw new Error("Zipcode not found");
        return new Zipcode(
            zipcodeData.code,
            zipcodeData.street,
            zipcodeData.neighborhood,
            parseFloat(zipcodeData.lat),
            parseFloat(zipcodeData.long)
        )
    }

}