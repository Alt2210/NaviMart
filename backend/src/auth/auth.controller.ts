import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthenticatedUser } from './types/authenticated-user.type';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ description: 'User account created.' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ description: 'User authenticated.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Access and refresh tokens rotated.' })
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Refresh token revoked.' })
  logout(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.logout(user);
  }

  @Post('forgot-password')
  @HttpCode(200)
  @ApiOperation({
    description:
      'Always returns { success: true } regardless of whether the identifier matches an account. ' +
      'When NODE_ENV is not production, the response also includes devResetToken (no SMTP in dev).',
  })
  @ApiOkResponse({ description: 'Password reset requested.' })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Password reset and refresh tokens revoked.' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('send-verification')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    description:
      'Requires the account to have an email. When NODE_ENV is not production, ' +
      'the response also includes devVerificationToken (no SMTP in dev).',
  })
  @ApiOkResponse({ description: 'Email verification requested.' })
  sendVerification(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.sendVerification(user);
  }

  @Post('verify-email')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Email verified.' })
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }
}
