import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🌱 Iniciando seed de la base de datos...\n');

  try {
    // Limpiar la base de datos
    console.log('🧹 Limpiando base de datos...');
    await dataSource.query('TRUNCATE TABLE "user" CASCADE');
    await dataSource.query('TRUNCATE TABLE "carrera" CASCADE');
    await dataSource.query('TRUNCATE TABLE "plan_estudio" CASCADE');
    await dataSource.query('TRUNCATE TABLE "departamento" CASCADE');
    await dataSource.query('TRUNCATE TABLE "materia" CASCADE');
    await dataSource.query('TRUNCATE TABLE "comision" CASCADE');
    await dataSource.query('TRUNCATE TABLE "horario" CASCADE');

    // Crear usuarios
    console.log('👤 Creando usuarios...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const adminUser = await dataSource.query(`
      INSERT INTO "user" (nombre, apellido, email, password, legajo, dni, rol)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, ['Admin', 'Sistema', 'admin@universidad.edu', hashedPassword, 'ADM001', '10000001', 'admin']);

    const profesorUser = await dataSource.query(`
      INSERT INTO "user" (nombre, apellido, email, password, legajo, dni, rol)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, ['Juan', 'Pérez', 'profesor@universidad.edu', hashedPassword, 'PROF001', '20000001', 'profesor']);

    const estudianteUser = await dataSource.query(`
      INSERT INTO "user" (nombre, apellido, email, password, legajo, dni, rol)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, ['María', 'González', 'estudiante@universidad.edu', hashedPassword, 'EST001', '30000001', 'estudiante']);

    // Crear más estudiantes
    for (let i = 2; i <= 5; i++) {
      await dataSource.query(`
        INSERT INTO "user" (nombre, apellido, email, password, legajo, dni, rol)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [`Estudiante${i}`, `Apellido${i}`, `estudiante${i}@universidad.edu`, hashedPassword, `EST00${i}`, `3000000${i}`, 'estudiante']);
    }

    // Crear carreras
    console.log('🎓 Creando carreras...');
    const carreraIngenieria = await dataSource.query(`
      INSERT INTO "carrera" (nombre, descripcion, duracion, titulo)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, ['Ingeniería en Sistemas', 'Carrera de grado en Ingeniería en Sistemas de Información', 5, 'Ingeniero/a en Sistemas de Información']);

    const carreraLicenciatura = await dataSource.query(`
      INSERT INTO "carrera" (nombre, descripcion, duracion, titulo)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, ['Licenciatura en Ciencias de la Computación', 'Carrera de grado en Ciencias de la Computación', 5, 'Licenciado/a en Ciencias de la Computación']);

    // Crear departamentos
    console.log('🏢 Creando departamentos...');
    const deptoBasicas = await dataSource.query(`
      INSERT INTO "departamento" (nombre, descripcion)
      VALUES ($1, $2)
      RETURNING id
    `, ['Ciencias Básicas', 'Departamento de materias de ciencias básicas']);

    const deptoSistemas = await dataSource.query(`
      INSERT INTO "departamento" (nombre, descripcion)
      VALUES ($1, $2)
      RETURNING id
    `, ['Sistemas', 'Departamento de materias de sistemas y programación']);

    const deptoGestion = await dataSource.query(`
      INSERT INTO "departamento" (nombre, descripcion)
      VALUES ($1, $2)
      RETURNING id
    `, ['Gestión', 'Departamento de materias de gestión y administración']);

    // Crear planes de estudio
    console.log('📋 Creando planes de estudio...');
    const planIngenieria2023 = await dataSource.query(`
      INSERT INTO "plan_estudio" (nombre, descripcion, "añoInicio", "añoFin", "carreraId")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, ['Plan 2023 - Ingeniería', 'Plan de estudios 2023 para Ingeniería en Sistemas', 2023, 2028, carreraIngenieria[0].id]);

    // Crear materias
    console.log('📚 Creando materias...');
    const materias = [
      // Primer año
      { nombre: 'Análisis Matemático I', descripcion: 'Introducción al cálculo diferencial e integral', departamento: deptoBasicas[0].id, año: 1, cuatrimestre: 1 },
      { nombre: 'Álgebra y Geometría Analítica', descripcion: 'Fundamentos de álgebra lineal y geometría', departamento: deptoBasicas[0].id, año: 1, cuatrimestre: 1 },
      { nombre: 'Algoritmos y Estructuras de Datos', descripcion: 'Fundamentos de programación y estructuras de datos', departamento: deptoSistemas[0].id, año: 1, cuatrimestre: 1 },
      { nombre: 'Arquitectura de Computadoras', descripcion: 'Organización y arquitectura de sistemas computacionales', departamento: deptoSistemas[0].id, año: 1, cuatrimestre: 1 },
      
      { nombre: 'Análisis Matemático II', descripcion: 'Cálculo multivariable y series', departamento: deptoBasicas[0].id, año: 1, cuatrimestre: 2 },
      { nombre: 'Física I', descripcion: 'Mecánica clásica y termodinámica', departamento: deptoBasicas[0].id, año: 1, cuatrimestre: 2 },
      { nombre: 'Programación Orientada a Objetos', descripcion: 'Paradigma de programación orientada a objetos', departamento: deptoSistemas[0].id, año: 1, cuatrimestre: 2 },
      { nombre: 'Sistemas y Organizaciones', descripcion: 'Introducción a los sistemas y las organizaciones', departamento: deptoGestion[0].id, año: 1, cuatrimestre: 2 },
      
      // Segundo año
      { nombre: 'Probabilidad y Estadística', descripcion: 'Fundamentos de probabilidad y estadística', departamento: deptoBasicas[0].id, año: 2, cuatrimestre: 1 },
      { nombre: 'Base de Datos', descripcion: 'Diseño y gestión de bases de datos', departamento: deptoSistemas[0].id, año: 2, cuatrimestre: 1 },
      { nombre: 'Sistemas Operativos', descripcion: 'Fundamentos de sistemas operativos', departamento: deptoSistemas[0].id, año: 2, cuatrimestre: 1 },
      { nombre: 'Ingeniería de Software I', descripcion: 'Introducción a la ingeniería de software', departamento: deptoSistemas[0].id, año: 2, cuatrimestre: 1 },
    ];

    const materiasCreadas: any[] = [];
    for (const materia of materias) {
      const result = await dataSource.query(`
        INSERT INTO "materia" (nombre, descripcion, "planEstudioId", "departamentoId")
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `, [materia.nombre, materia.descripcion, planIngenieria2023[0].id, materia.departamento]);
      materiasCreadas.push({ ...materia, id: result[0].id });
    }

    // Crear comisiones
    console.log('👥 Creando comisiones...');
    for (const materia of materiasCreadas.slice(0, 8)) { // Primeras 8 materias (primer año)
      // Comisión mañana
      const comisionManana = await dataSource.query(`
        INSERT INTO "comision" (nombre, "cupoMaximo", "cupoDisponible", "materiaId", "docenteId")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, [`${materia.nombre} - Turno Mañana`, 30, 25, materia.id, profesorUser[0].id]);

      // Comisión tarde
      const comisionTarde = await dataSource.query(`
        INSERT INTO "comision" (nombre, "cupoMaximo", "cupoDisponible", "materiaId", "docenteId")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, [`${materia.nombre} - Turno Tarde`, 30, 28, materia.id, profesorUser[0].id]);

      // Crear horarios para cada comisión
      const dias = ['LUNES', 'MIERCOLES', 'VIERNES'];
      for (const dia of dias) {
        // Horario mañana
        await dataSource.query(`
          INSERT INTO "horario" (dia, "horaInicio", "horaFin", aula, "comisionId", "materiaId")
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [dia, '08:00', '10:00', `Aula ${Math.floor(Math.random() * 10) + 1}`, comisionManana[0].id, materia.id]);

        // Horario tarde
        await dataSource.query(`
          INSERT INTO "horario" (dia, "horaInicio", "horaFin", aula, "comisionId", "materiaId")
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [dia, '18:00', '20:00', `Aula ${Math.floor(Math.random() * 10) + 11}`, comisionTarde[0].id, materia.id]);
      }
    }

    // Crear correlatividades
    console.log('🔗 Creando correlatividades...');
    // Análisis II requiere Análisis I
    const analisisI = materiasCreadas.find(m => m.nombre === 'Análisis Matemático I');
    const analisisII = materiasCreadas.find(m => m.nombre === 'Análisis Matemático II');
    if (analisisI && analisisII) {
      await dataSource.query(`
        INSERT INTO "correlativas_cursada" ("materiaId", "correlativaId")
        VALUES ($1, $2)
      `, [analisisII.id, analisisI.id]);
    }

    // POO requiere Algoritmos
    const algoritmos = materiasCreadas.find(m => m.nombre === 'Algoritmos y Estructuras de Datos');
    const poo = materiasCreadas.find(m => m.nombre === 'Programación Orientada a Objetos');
    if (algoritmos && poo) {
      await dataSource.query(`
        INSERT INTO "correlativas_cursada" ("materiaId", "correlativaId")
        VALUES ($1, $2)
      `, [poo.id, algoritmos.id]);
    }

    // Crear algunas inscripciones de ejemplo
    console.log('📝 Creando inscripciones de ejemplo...');
    const comisiones = await dataSource.query(`
      SELECT c.id, c."materiaId" 
      FROM "comision" c
      LIMIT 4
    `);

    for (const comision of comisiones) {
      await dataSource.query(`
        INSERT INTO "inscripcion" ("estudianteId", "materiaId", "comisionId", "fechaInscripcion")
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      `, [estudianteUser[0].id, comision.materiaId, comision.id]);
    }

    console.log('\n✅ Seed completado exitosamente!');
    console.log('\n📧 Usuarios de prueba creados:');
    console.log('  Admin: admin@universidad.edu / password123');
    console.log('  Profesor: profesor@universidad.edu / password123');
    console.log('  Estudiante: estudiante@universidad.edu / password123');
    console.log('  Estudiantes adicionales: estudiante2-5@universidad.edu / password123');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

seed().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
