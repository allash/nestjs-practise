import { DbInvoice } from './../entities/invoice.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(DbInvoice)
export class InvoiceRepository extends Repository<DbInvoice> { }
