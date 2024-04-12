export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export class PaginatedResult<T> {
  public data: T;
  public pagination: Pagination;

  constructor(data: T, pagination: Pagination) {
    this.data = data;
    this.pagination = pagination;
  }
}

export class PagingParams {
  public pageNumber: number;
  public pageSize: number;

  constructor(pageNumber = 1, pageSize = 2) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
  }
}
