import { AppDataSource } from '../app-data-source';

export const testConn = async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
  }
  return AppDataSource.initialize();
};
