import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserLastName1565353687069 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "age"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD "last_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD "phone" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "phone"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user" DROP COLUMN "last_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD "age" integer NOT NULL`,
    );
  }
}
