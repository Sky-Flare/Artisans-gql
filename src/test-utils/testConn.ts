import { AppDataSource } from '../app-data-source';

export const testConn = () => {
  return AppDataSource.initialize();
};
