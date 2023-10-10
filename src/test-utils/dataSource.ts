import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Container } from 'typedi';
import { entities } from '@src/config/entities';

const testDataSource = (refreshDb = false): DataSource =>
  new DataSource({
    database: 'artisantstest',
    dropSchema: refreshDb,
    entities: entities,
    host: 'localhost',
    logging: 'all',
    password: process.env.DB_PASSWORD,
    port: 3306,
    cache: process.env.DB_DROP_SCHEMA !== 'true',
    synchronize: refreshDb,
    type: 'mysql',
    username: process.env.DB_USERNAME
  });

const initializeDataSource = async (): Promise<DataSource> => {
  const dataSource = testDataSource(false);

  // Initialize the data source and store it in the container. Required for the dependency injection.
  await dataSource
    .initialize()
    .then(async () => dataSource.synchronize(false))
    .then(() => Container.set(DataSource, dataSource));

  return dataSource;
};

export { testDataSource, initializeDataSource };
