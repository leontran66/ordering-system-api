import { Schema } from 'mongoose';

type Item = {
  product: Schema.Types.ObjectId;
  options: [string];
  quantity: number;
  price: number;
}

export default Item;
