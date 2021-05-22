import { Document, model, Schema } from 'mongoose';

export type CategoryDocument = Document & {
  title: string;
  products: Array<Schema.Types.ObjectId>;
}

const categorySchema = new Schema<CategoryDocument>({
  title: String,
  products: { type: [Schema.Types.ObjectId], ref: 'Product' },
});

export default model<CategoryDocument>('Category', categorySchema);
