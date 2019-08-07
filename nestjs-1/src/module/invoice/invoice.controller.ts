import { RightsEnum } from './../../config/rights.enum';
import { HasRight } from './../../guards/auth.guard';
import { AppConstants } from './../../config/constants';
import { ApiUseTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { DtoCreateInvoiceRequest } from './dto/request/dto.create.invoice.request';
import { CurrentSession } from '../../decorators/current.session.decorator';
import { DtoSession } from '../../shared/dto/dto.session';
import { InvoiceService } from './invoice.service';

@Controller(`${AppConstants.API_PREFIX}/invoices`)
@ApiUseTags('invoices')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) { }

    @Post()
    @HasRight(RightsEnum.CAN_CREATE_INVOICE)
    @HttpCode(HttpStatus.CREATED)
    async createInvoice(@CurrentSession() session: DtoSession, @Body() body: DtoCreateInvoiceRequest) {
        await this.invoiceService.createInvoice(session.userId, body);
    }
}
