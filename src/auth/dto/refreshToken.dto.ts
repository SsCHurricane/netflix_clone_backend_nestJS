import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString({
    message: 'Token not provided or not a string',
  })
  refreshToken: string;
}
