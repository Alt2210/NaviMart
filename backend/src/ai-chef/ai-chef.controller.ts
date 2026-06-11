import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { AiChefService } from './ai-chef.service';
import { ChatDto } from './dto/chat.dto';

@ApiTags('AI Chef')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-chef')
export class AiChefController {
  constructor(private readonly aiChefService: AiChefService) {}

  @Get('status')
  @ApiOkResponse({ description: 'Whether the AI Chef integration is configured.' })
  getStatus() {
    return this.aiChefService.getStatus();
  }

  @Post('chat')
  @HttpCode(200)
  @ApiOkResponse({
    description:
      'AI Chef reply based on the current family pantry. Returns { reply, conversationId }.',
  })
  chat(@CurrentUser() user: AuthenticatedUser, @Body() chatDto: ChatDto) {
    return this.aiChefService.chat(user, chatDto);
  }
}
