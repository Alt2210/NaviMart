import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from '../auth/types/authenticated-user.type';
import { RealtimeService } from './realtime.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:5173'],
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection {
  private readonly logger = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly realtimeService: RealtimeService,
  ) {}

  afterInit(server: Server) {
    this.realtimeService.setServer(server);
  }

  async handleConnection(socket: Socket) {
    const token = (socket.handshake.auth as Record<string, unknown> | undefined)
      ?.token;

    if (typeof token !== 'string' || token.length === 0) {
      socket.disconnect(true);
      return;
    }

    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      });
    } catch {
      socket.disconnect(true);
      return;
    }

    await socket.join(`user:${payload.sub}`);
    if (payload.activeFamilyId) {
      await socket.join(`family:${payload.activeFamilyId}`);
    }

    this.logger.debug(`Socket ${socket.id} connected for user ${payload.sub}`);
  }
}
