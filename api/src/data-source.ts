import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'sqlite',
  database: '../db.sql',
  entities: ['api/src/entities/**/*.ts'],
  logging: true,
  synchronize: true,
});
