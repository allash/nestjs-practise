import { IsNotEmpty } from 'class-validator';

export class DtoCreateInvoiceRequest {
  @IsNotEmpty()
  priceGross: number;
}
