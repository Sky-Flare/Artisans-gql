import { DataSource } from 'typeorm';
import { AppDataSource } from '../app-data-source';

export const testConn = (drop = true) => {
  return AppDataSource.initialize();
};
