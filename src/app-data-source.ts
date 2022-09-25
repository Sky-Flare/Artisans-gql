import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
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
  dropSchema: true,
  entities: ['dist/entities/*.js'],
});
