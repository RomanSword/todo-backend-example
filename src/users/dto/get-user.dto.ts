import { Exclude, Expose } from 'class-transformer';

export class GetUserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  firstname: string;

  @Expose()
  lastname: string;

  @Exclude()
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  refreshToken: string;

  @Expose()
  avatarLink?: string;

  @Expose()
  resumeLink?: string;

  @Expose()
  isAdmin?: boolean;

  @Expose()
  isMentor?: boolean;
}
