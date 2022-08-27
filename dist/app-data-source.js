"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'password',
    database: 'artisants',
    synchronize: true,
    logger: 'advanced-console',
    logging: 'all',
    cache: true,
    dropSchema: false,
    entities: ['dist/entities/*.js'],
});
//# sourceMappingURL=app-data-source.js.map