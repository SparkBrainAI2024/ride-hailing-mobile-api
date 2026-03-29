import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DB_CONNECTION_URL } from "src/config";

@Module({
    imports: [
        MongooseModule.forRoot(DB_CONNECTION_URL),
    ],
})
export class DatabaseProvider { }