import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: [
      'https://mini-app-frontend-pi.vercel.app',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true,
  })

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(process.env.PORT ?? 3000)
  console.log('Backend running on http://localhost:3000 🚀')
}
bootstrap()