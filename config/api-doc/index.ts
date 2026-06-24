import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export default class SwaggerConfig {
  set(app: INestApplication) {
    const options = new DocumentBuilder()
      .setTitle('Example App Backend')
      .setDescription(
        'Example description of the API documentation for the Example App Backend. This documentation provides details about the available endpoints, request/response formats, and authentication methods.',
      )
      .setVersion('1.0.0')
      .addTag('Example App Backend')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'authorization',
          description: 'Enter JWT token',
          in: 'header',
        },
        'token',
      )
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
  }
}
