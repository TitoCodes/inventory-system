export class CreateItemDto {
  constructor(
    public name: string,
    public description: string,
    public categoryId: string,
    public isDraft: boolean
  ) {}
}
