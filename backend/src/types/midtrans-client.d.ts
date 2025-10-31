declare module 'midtrans-client' {
  export class Snap {
    constructor(config: { isProduction: boolean; serverKey: string; clientKey: string });
    createTransaction(payload: any): Promise<any>;
  }
  
  export class CoreApi {
    constructor(config: { isProduction: boolean; serverKey: string; clientKey: string });
    charge(payload: any): Promise<any>;
    capture(payload: any): Promise<any>;
    cardRegister(payload: any): Promise<any>;
    cardToken(payload: any): Promise<any>;
    cardPointInquiry(tokenId: string): Promise<any>;
  }
}
