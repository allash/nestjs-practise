import { Socket } from 'socket.io';
import uuid = require('uuid');
import { SubscribeMessage } from '@nestjs/websockets';
import { RedisClient } from 'redis';

export class SocketGateway2 {
  private connections: Map<string, Socket> = new Map<string, Socket>();
  private redisPub = new RedisClient({ port: 6380 });
  private redisSub = new RedisClient({ port: 6380 });

  handleConnection(socket: Socket) {
    socket.id = uuid.v4();
    this.connections.set(socket.id, socket);

    this.redisSub.on('message', (topic: any, data: any) => {
      if (topic === 'configurationRequest') {
        const packetConfiguration = { event: 'configurationRequest', data };
        socket.send(JSON.stringify(packetConfiguration));
      }
    });
    this.redisSub.subscribe(socket.id);

    const packetHandshake = { event: 'handshake', socketId: socket.id };
    socket.send(JSON.stringify(packetHandshake));
  }

  @SubscribeMessage('ConfigurationResponse')
  public onSendConfigurationResponse(socket: Socket, payload: any) {
    this.redisPub.publish(`Response_${socket.id}`, JSON.stringify(payload));
  }

  public async sendConfigurationRequest(socketId: string, payload: any) {
    return new Promise(resolve => {
      const connection = this.connections.get(socketId);
      const packet = JSON.stringify({
        event: 'configurationRequest',
        data: payload,
      });
      if (!connection) {
        this.redisPub.publish(socketId, packet);
        this.redisSub.subscribe(`Response_${socketId}`);
        this.redisPub.on('message', (topic: any, data: any) => {
          if (topic === 'configurationResponse') {
            resolve(data);
          }
          // reject on timeout
        });
      } else {
        connection.send(packet);
      }
    });
  }
}
