export class UpdateSupplierDto {
  constructor(
    public name: string,
    public description: string,
    public uuid: string,
    public mobileNumber?: string,
    public telephoneNumber?: string,
    public country?: string,
    public city?: string,
    public zipCode?: string,
    public address?: string,
    public street?: string,
    public building?: string
  ) {}
}
