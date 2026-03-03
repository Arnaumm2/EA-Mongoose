import { Schema, Types, model } from 'mongoose';

// 1. Interface (Contracte d'Enginyeria)
export interface IDocument {
  _id?: Types.ObjectId | string;
  name: string;
  description: string;
  organization: Types.ObjectId | string;
}

// 2. Schema (Validació BBDD)
const documentSchema = new Schema<IDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  organization: {type: Schema.Types.ObjectId, ref: 'Organization'}
});

// 3. Model
export const DocumentModel = model<IDocument>('Document', documentSchema);