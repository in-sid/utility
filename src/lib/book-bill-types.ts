
export interface BookItem {
  title: string;
  seller: string;
  price: number;
  imageUrl?: string;
}

export interface BookBillInput {
  orderDate: string;
  orderNumber: string;
  shipTo: {
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: {
    cardType: string;
    lastFour: string;
  };
  summary: {
    subtotal: number;
    shipping: number;
  };
  items: BookItem[];
}
