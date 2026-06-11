import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class ChatDto {
  @ApiProperty({ example: 'Tối nay nấu gì với thịt bò và cà chua?' })
  @IsString()
  @Length(1, 2000)
  message!: string;

  @ApiPropertyOptional({
    example: 'conv_665f7b1e7c7a8f93df38b111',
    description:
      'Conversation id to keep chat memory across messages. Omit to start a new conversation.',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[\w-]{1,80}$/)
  conversationId?: string;
}
