// src/test-utils/test-database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

const testOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'testpass',
  database: 'testdb',
  autoLoadEntities: true,
  synchronize: true,
  dropSchema: true,
  logging: false,
  ssl: false,
  connectTimeoutMS: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
};

@Module({
  imports: [
    TypeOrmModule.forRoot(testOrmConfig),
  ],
  exports: [TypeOrmModule],
})
export class TestDatabaseModule {}