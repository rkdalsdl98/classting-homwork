import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerSetting } from './swagger.setting';
import { listenCommandLine } from './server_command.helper';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: "*",
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  //app.useGlobalInterceptors(new LoggingInterceptor())
  app.enableShutdownHooks()
  
  SwaggerSetting(app)
  
  await app.listen(80)
  .then(_=> Logger.log(`API 서버 초기화 ✅ : 대기 포트 => ${80}`, "APIServer"))
  
  listenCommandLine(app)
}
bootstrap();
