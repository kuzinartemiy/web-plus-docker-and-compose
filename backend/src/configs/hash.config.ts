import { ConfigService } from '@nestjs/config';

export const getHashConfig = (configService: ConfigService) => ({
  saltRounds: configService.get('SALT_ROUNDS') || 10,
});
