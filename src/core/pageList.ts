import { Prisma } from "@prisma/client";

export class PageList<Type> {
  data?: Type[];
  searchString: string;
  take?: number;
  skip?: number;
  orderBy?: Prisma.SortOrder;
  constructor(
    searchString: string,
    take?: number,
    skip?: number,
    orderBy?: Prisma.SortOrder
  ) {
    this.searchString = searchString;
    this.take = take;
    this.skip = skip;
    this.orderBy = orderBy;
  }
}
