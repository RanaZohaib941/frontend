export interface ProductUpsertRequestVM {
    id?: string;         // Optional, corresponds to Guid? in C#
    name: string;
    description: string;
    display: boolean;
}