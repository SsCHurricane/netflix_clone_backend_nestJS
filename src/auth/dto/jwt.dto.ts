import { IsString } from 'class-validator';

export class JWTDto {
  @IsString()
  token: string;

  @IsString()
  refreshToken: string;
}
