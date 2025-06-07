export interface Order {
  id: string;
  memberName: string;
  memberNumber: string;
  product: string;
  quantity: number;
  totalAmount: number;
  reservationDate: string;
  pickupDate: string;
  status: 'pending' | 'completed' | 'cancelled';
} 