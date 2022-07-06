export class CreateSupplierDto {
  constructor(
    public name: string,
    public description: string,
    public mobileNumber?: string,
    public telephoneNumber?: string,
    public country?: string,
    public city?: string,
    public zipCode?: string,
    public street?: string,
    public building?: string,
  ) {}
}
