export class UpdateItemDto {
    constructor(
      public name: string,
      public description: string,
      public categoryId: string,
      public uuid:string,
      public isDraft: boolean
    ) {}
  }
  