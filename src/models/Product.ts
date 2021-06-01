import { Document, model, Schema } from 'mongoose';

export type ProductDocument = Document & {
  name: string;
  price: number;
  options: Array<{
    name: string;
    price: number;
  }>;
  extras: Array<string>;
  description: string;
}

const productSchema = new Schema<ProductDocument>({
  name: String,
  price: Number,
  options: [
    {
      name: String,
      price: Number,
    },
  ],
  extras: [String],
  description: String,
});

productSchema.pre('save', function save(next) {
  const product = this as ProductDocument;
  if (!product.isModified('price')) return next();
  product.price = parseFloat(product.price.toFixed(2));
  return next();
});

export default model<ProductDocument>('Product', productSchema);
