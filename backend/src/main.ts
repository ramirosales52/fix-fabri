// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de CORS
  app.enableCors();
  
  // Pipes globales
  app.useGlobalPipes(new ValidationPipe());
  
  // Solo configura Swagger en desarrollo
  if (process.env.NODE_ENV !== 'production') {
    const { DocumentBuilder, SwaggerModule } = require('@nestjs/swagger');
    
    const config = new DocumentBuilder()
      .setTitle('Sistema de Autogestión Académica')
      .setDescription('API para gestión académica de estudiantes')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
      
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    
    const redocConfig = new DocumentBuilder()
      .setTitle('Sistema de Autogestión Académica')
      .setDescription('API para gestión académica de estudiantes')
      .setVersion('1.0')
      .build();
      
    const redocDocument = SwaggerModule.createDocument(app, redocConfig);
    SwaggerModule.setup('redoc', app, redocDocument, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }'
    });
  }
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();