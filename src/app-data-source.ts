import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logger: 'advanced-console',
  logging: 'all',
  cache: process.env.DB_DROP_SCHEMA !== 'true',
  dropSchema: process.env.DB_DROP_SCHEMA === 'true',
  entities: [__dirname + '/entities/*{.ts,.js}']
});
