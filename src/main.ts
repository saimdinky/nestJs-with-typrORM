import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { generateOpenApi } from "@ts-rest/open-api";

import { AppModule } from "./app.module";
import { api } from "./contracts";
import { CustomLoggerService } from "./modules/logger/logger.service";
import { SeederService } from "./modules/seeder/seeder.service";
import { APP_CONFIGS } from "./config/app.config";

async function bootstrap(): Promise<void> {
  const logger = new CustomLoggerService("NestApplication");
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  // Global pipes and interceptors
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // CORS configuration
  app.enableCors({
    origin: true,
    methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Access-Control-Allow-Headers",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("NestJS Auth Starter")
    .setDescription(
      "Authentication and Authorization API with JWT, RBAC, and TypeORM"
    )
    .setVersion("1.0.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth"
    )
    .build();

  const document = generateOpenApi(api, config, {
    setOperationId: "concatenated-path",
    operationMapper: (operation, appRoute) => {
      // Create unique operation IDs by combining resource and route name
      const pathSegments = appRoute.path.split("/").filter(Boolean);
      const resource = pathSegments[1] || pathSegments[0]; // Get resource name (users, roles, etc.)
      const method = appRoute.method.toLowerCase();

      // Generate a unique operationId
      let operationId = operation.operationId;
      if (resource && operationId) {
        operationId = `${resource}_${operationId}`;
      }

      // Public routes don't need authentication
      const isPublicRoute =
        appRoute.path.includes("/auth/login") ||
        appRoute.path.includes("/auth/register");

      if (isPublicRoute) {
        return {
          ...operation,
          operationId,
          security: [],
        };
      }

      // Default to JWT auth for protected routes
      return {
        ...operation,
        operationId,
        security: [{ "JWT-auth": [] }],
      };
    },
  });

  // Setup Swagger UI
  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: "alpha",
      operationsSorter: "alpha",
    },
    jsonDocumentUrl: "swagger.json",
  });

  const port = APP_CONFIGS.PORT;
  await app.listen(port);

  // Run database seeding
  try {
    const seederService = app.get(SeederService);
    await seederService.seed();
  } catch (error) {
    logger.error("Failed to run database seeds:", error);
    // Don't exit the application if seeding fails
  }

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger UI is available at: http://localhost:${port}/api`);
}

bootstrap().catch((error) => {
  const logger = new CustomLoggerService("Bootstrap");
  logger.error("❌ Error starting the application:", error);
  process.exit(1);
});
