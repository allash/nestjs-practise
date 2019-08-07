import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { InvoiceRepository } from '../db/repositories/invoice.repository';
import { UserRepository } from '../db/repositories/user.repository';

@Module({
    controllers: [InvoiceController],
    providers: [InvoiceService],
    imports: [TypeOrmModule.forFeature([InvoiceRepository, UserRepository])]
})
export class InvoiceModule { }
