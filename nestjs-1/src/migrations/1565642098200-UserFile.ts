import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserFile1565642098200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "public"."user_file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "original_name" character varying NOT NULL, "size" integer NOT NULL, "mime_type" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_8a4e6e7f01647b0121fbe3a8276" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_file" ADD CONSTRAINT "FK_444b830aa94b0f3a2027bcde181" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "public"."user_file" DROP CONSTRAINT "FK_444b830aa94b0f3a2027bcde181"`,
    );
    await queryRunner.query(`DROP TABLE "public"."user_file"`);
  }
}
