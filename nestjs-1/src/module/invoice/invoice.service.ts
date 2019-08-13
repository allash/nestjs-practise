import { UserRepository } from '../db/repositories/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../db/repositories/invoice.repository';
import { DtoCreateInvoiceRequest } from './dto/request/dto.create.invoice.request';
import { DbConstants } from '../db/db.constants';
import { DbInvoice } from '../db/entities/invoice.entity';
import { UserNotFoundByIdException } from '../../exceptions/user/user.not.found.by.id.exception';

@Injectable()
export class InvoiceService {
  constructor(
    @Inject(DbConstants.USER_REPOSITORY)
    private readonly userRepo: UserRepository,
    @Inject(DbConstants.INVOICE_REPOSITORY)
    private readonly invoiceRepo: InvoiceRepository,
  ) {}

  async createInvoice(userId: string, body: DtoCreateInvoiceRequest) {
    const user = await this.userRepo.findOne(userId);
    if (user == null) {
      throw new UserNotFoundByIdException(userId);
    }

    const invoice = new DbInvoice();
    invoice.priceGross = body.priceGross;
    invoice.user = user;
    invoice.userId = user.id;

    await this.invoiceRepo.save(invoice);
  }
}
