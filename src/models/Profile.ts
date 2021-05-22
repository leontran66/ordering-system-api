import { Document, model, Schema } from 'mongoose';

export type ProfileDocument = Document & {
  user: string;
  abn: string;
  name: string;
  phone: string;
  fax: string;
  address: string;
  suburb: string;
  state: string;
  postCode: string;
}

const profileSchema = new Schema<ProfileDocument>({
  user: { type: String, unique: true },
  abn: String,
  name: String,
  phone: String,
  fax: String,
  address: String,
  suburb: String,
  state: String,
  postCode: String,
});

profileSchema.pre('save', function save(next) {
  const profile = this as ProfileDocument;
  if (!profile.isModified('abn')) return next();
  profile.abn = profile.abn.replace(/ /g, '');
  profile.abn = `${profile.abn.slice(0, 2)} ${profile.abn.slice(2, 5)} ${profile.abn.slice(5, 8)} ${profile.abn.slice(8, 11)}`;
  return next();
});

export default model<ProfileDocument>('Profile', profileSchema);
