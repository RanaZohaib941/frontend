export interface ProductAllResponseVM {
    data: Product[] | null;
    success: boolean;
    statusCode: number;
    message: string;
  }
  
  export interface Product {
    id: string; // Guid is represented as a string in TypeScript
    name: string;
    description: string;
    display: boolean;
    active: boolean;
    deleted: boolean;
    createdBy: string; // Guid is represented as a string in TypeScript
    createdDate: Date;
    modifiedBy?: string | null; // Nullable Guid
    modifiedDate?: Date | null; // Nullable Date
  }