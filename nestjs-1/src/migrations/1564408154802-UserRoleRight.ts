import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRoleRight1564408154802 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "public"."right" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_408900453033817b96f1ec0b021" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ab841b6a976216a286c10c117f1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."role_right" ("right_id" uuid NOT NULL, "role_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cf2d596f2af10c44f6efdeb4fa7" PRIMARY KEY ("right_id", "role_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."user_role" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_fec59139484b51abdcf52ff74cf" PRIMARY KEY ("user_id", "role_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."role_right" ADD CONSTRAINT "FK_23acee505fca33858a9e8719ee2" FOREIGN KEY ("right_id") REFERENCES "public"."right"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."role_right" ADD CONSTRAINT "FK_bda66514d520622d6f3d940e628" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_role" ADD CONSTRAINT "FK_2a80c390439e4c59eae18d69854" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_role" ADD CONSTRAINT "FK_5f10a55b89edd3be64e9eba0906" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "public"."user_role" DROP CONSTRAINT "FK_5f10a55b89edd3be64e9eba0906"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_role" DROP CONSTRAINT "FK_2a80c390439e4c59eae18d69854"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."role_right" DROP CONSTRAINT "FK_bda66514d520622d6f3d940e628"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."role_right" DROP CONSTRAINT "FK_23acee505fca33858a9e8719ee2"`,
    );
    await queryRunner.query(`DROP TABLE "public"."user_role"`);
    await queryRunner.query(`DROP TABLE "public"."role_right"`);
    await queryRunner.query(`DROP TABLE "public"."role"`);
    await queryRunner.query(`DROP TABLE "public"."right"`);
  }
}
