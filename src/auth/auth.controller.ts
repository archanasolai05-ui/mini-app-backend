import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
// ✅ ADD this import line only
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

// ✅ ADD these 2 lines only
@ApiTags('Auth')
@Controller('auth')   //base route for all auth-related endpoints
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /auth/register
  // ✅ ADD this 1 line only
  @ApiOperation({ summary: 'Register a new user' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // POST /auth/login
  // ✅ ADD this 1 line only
  @ApiOperation({ summary: 'Login and get JWT token' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // GET /auth/profile
  // ✅ ADD these 2 lines only
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get logged in user profile' })
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }
}
