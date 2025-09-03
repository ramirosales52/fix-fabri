// test-db-connection.ts
import { DataSource } from 'typeorm';

async function testConnection() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: 'testpass',
    database: 'testdb',
    logging: true,
    synchronize: true,
    dropSchema: true,
    entities: ['src/**/*.entity{.ts,.js}'], // Asegúrate de que esto apunte a tus entidades
  });

  try {
    console.log('🔍 Intentando conectar a la base de datos de prueba...');
    await dataSource.initialize();
    console.log('✅ Conexión a la base de datos de prueba exitosa');
    
    // Verifica que se puedan crear las tablas
    console.log('🔄 Verificando creación de tablas...');
    await dataSource.runMigrations();
    console.log('✅ Tablas creadas correctamente');
    
    // Prueba una operación básica
    console.log('🧪 Realizando prueba de operación básica...');
    
    // Cerrar conexión
    await dataSource.destroy();
    console.log('✅ Conexión cerrada correctamente');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    console.error('Posibles causas:');
    console.error('1. El contenedor de PostgreSQL no está corriendo');
    console.error('2. Las credenciales son incorrectas');
    console.error('3. El puerto 5433 no está disponible');
    console.error('4. Las entidades no están correctamente definidas');
  }
}

testConnection();