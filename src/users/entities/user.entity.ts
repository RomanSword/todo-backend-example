import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  firstname?: string;

  @Column({ nullable: true })
  lastname?: string;

  @Column({ nullable: true })
  avatarLink?: string;

  @Column({ nullable: true })
  resumeLink?: string;

  @Column({ default: false })
  isAdmin?: boolean;

  @Column({ default: false })
  isMentor?: boolean;

  @Column({ nullable: true })
  refreshToken?: string;
}
