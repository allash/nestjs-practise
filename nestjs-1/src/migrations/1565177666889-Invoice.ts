import {MigrationInterface, QueryRunner} from "typeorm";

export class Invoice1565177666889 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "public"."invoice" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price_gross" double precision NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_0de9dfe31be1fbd6e48410f5229" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."invoice" ADD CONSTRAINT "FK_912e2aab6223ab8aa74274489dc" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."invoice" DROP CONSTRAINT "FK_912e2aab6223ab8aa74274489dc"`);
        await queryRunner.query(`DROP TABLE "public"."invoice"`);
    }

}
