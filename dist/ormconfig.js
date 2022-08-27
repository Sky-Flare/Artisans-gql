module.exports = {
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
};
//# sourceMappingURL=ormconfig.js.map