export interface Order {
  id: string;
  userId: string;
  total: number;
  dateOrder: string;
  hourOrder: string;
  comment?: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELED';
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      description: string;
      image: string;
      price: number;
      category: string;
      thc: number;
      CBD: number;
      stock: number;
      active: boolean;
      createdAt: string;
      updatedAt: string;
      clubId: string;
    };
  }[];
  user: {
    id: string;
    name: string;
    email: string;
    clubId: string;
  };
} 