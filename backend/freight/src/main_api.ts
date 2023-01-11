import ConnectionMysql from "./infra/database/ConnectionMysql";
import ExpressHttpServer from "./infra/http/ExpressHttpServer";
import RestController from "./infra/controller/RestController";
import HapiHttpServer from "./infra/http/HapiHttpServer";
import ConnectionSqlite from "./infra/database/ConnectionSqlite";
import ZipcodeDataInterface from "./domain/datainterface/ZipcodeDataInterface";
import ZipcodeDataDatabase from "./infra/data/ZipcodeDataDatabase";
import CalculateFreight from "./application/CalculateFreight";

(async function mainApi() {

    const connection = await ConnectionMysql.build();
    // const connection = await ConnectionSqlite.build();
    // const httpServer = new HapiHttpServer();
    const httpServer = new ExpressHttpServer();
    const zipcodeData: ZipcodeDataInterface = new ZipcodeDataDatabase(connection);
    const calculateFreight: CalculateFreight = new CalculateFreight(zipcodeData)
    new RestController(httpServer, calculateFreight);
    await httpServer.listen(3001
    ).then(() => console.log("Port 3001"));

})().then(() => console.log("Iniciado..."));