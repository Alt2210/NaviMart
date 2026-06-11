import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminUsersService } from './admin-users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOkResponse({ description: 'Paginated user list.' })
  findAll(@Query() query: ListUsersQueryDto) {
    return this.adminUsersService.findAll(query);
  }

  @Get(':userId')
  @ApiOkResponse({ description: 'User detail.' })
  findOne(@Param('userId') userId: string) {
    return this.adminUsersService.findOne(userId);
  }

  @Post()
  @ApiCreatedResponse({ description: 'User created.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.adminUsersService.create(createUserDto);
  }

  @Patch(':userId')
  @ApiOkResponse({ description: 'User updated.' })
  update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.adminUsersService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  @ApiOkResponse({ description: 'User deactivated (soft delete).' })
  remove(@Param('userId') userId: string) {
    return this.adminUsersService.remove(userId);
  }
}
