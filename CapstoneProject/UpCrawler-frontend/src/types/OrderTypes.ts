export type OrderAddCommand = {
    RequestedAmount: number;
    ProductCrawlType: string;
}
export type OrderGetAll = {
    id:string;
    requestedAmount: number;
    totalFoundAmount: number;
    productCrawlType: string;
    createdOn: Date;
}
    
export type OrderDelete = {
    id:string;
}