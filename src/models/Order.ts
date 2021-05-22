import { Document, model, Schema } from 'mongoose';

export type OrderDocument = Document & {
  user: string;
  status: string;
  type: string;
  items: Array<{
    product: Schema.Types.ObjectId;
    options: [string];
    quantity: number;
    price: number;
  }>;
  price: number;
  notes: string;
}

const orderSchema = new Schema<OrderDocument>({
  user: String,
  status: String,
  type: String,
  items: [
    {
      product: Schema.Types.ObjectId,
      options: [String],
      quantity: Number,
      price: Number,
    },
  ],
  price: Number,
  notes: String,
});

export default model<OrderDocument>('Order', orderSchema);
