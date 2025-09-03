// src/test-utils/test-database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Crucial: debe ser 'postgres'
      host: 'localhost',
      port: 5433, // Puerto para tu DB de pruebas
      username: 'postgres',
      password: 'testpass', // Tu contraseña real
      database: 'testdb',   // Tu nombre real de DB de pruebas
      // En lugar de autoLoadEntities, vamos a ser explícitos
      // entities: [], // Las entidades se cargarán vía TypeOrmModule.forFeature en cada spec
      synchronize: true, // Para pruebas, crea tablas automáticamente
      dropSchema: true,  // Limpia la base de datos antes de cada ejecución
      logging: false,    // Poner en true para debuggear
      // Asegúrate de que estas opciones estén comentadas o eliminadas
      // type: 'sqlite', // NO debe estar aquí
      // database: ':memory:', // NO debe estar aquí si usas postgres
    }),
  ],
  exports: [TypeOrmModule],
})
export class TestDatabaseModule {}
