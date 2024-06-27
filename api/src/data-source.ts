import { DataSource } from 'typeorm';
import * as path from 'path';

export const dataSource = new DataSource({
  type: 'sqlite',
  database: path.resolve(__dirname, '../db.sql'),
  entities: ['api/src/entities/**/*.ts'],
  logging: true,
  synchronize: true,
});
