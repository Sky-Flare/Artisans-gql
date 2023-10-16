import 'dotenv/config';
import { DataSource } from 'typeorm';
import { entities } from '@entity/config/entities';

const dataSource = new DataSource({
  database: process.env.DB_NAME,
  dropSchema: true,
  entities: entities,
  host: 'localhost',
  logging: 'all',
  password: process.env.DB_PASSWORD,
  port: 3306,
  logger: 'advanced-console',
  cache: process.env.DB_DROP_SCHEMA !== 'true',
  synchronize: true,
  type: 'mysql',
  username: process.env.DB_USERNAME
});

export { dataSource };
