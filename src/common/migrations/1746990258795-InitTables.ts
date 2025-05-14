import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1746990258795 implements MigrationInterface {
    name = 'InitTables1746990258795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "todo" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying, "isDone" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "firstname" character varying, "lastname" character varying, "avatarLink" character varying, "resumeLink" character varying, "isAdmin" boolean NOT NULL DEFAULT false, "isMentor" boolean NOT NULL DEFAULT false, "refreshToken" character varying, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "todo"`);
    }

}
