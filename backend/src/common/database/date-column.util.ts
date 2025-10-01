import { ColumnType } from 'typeorm';

const inferDatabaseType = (): string => {
  const explicit = process.env.DB_TYPE || process.env.TYPEORM_CONNECTION;
  if (explicit) {
    return explicit.toLowerCase();
  }

  if (process.env.NODE_ENV === 'test') {
    return 'sqlite';
  }

  return 'postgres';
};

export const getDateColumnType = (): ColumnType => {
  const dbType = inferDatabaseType();

  if (dbType.includes('sqlite')) {
    return 'datetime';
  }

  return 'timestamp';
};
