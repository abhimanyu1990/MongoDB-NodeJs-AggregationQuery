import mongoose, { Schema, Document} from 'mongoose';

export interface IProductView extends Document {
    userId: number;
    productId: string;
    viewDate: Date
}


const ProductViewSchema: Schema = new Schema({
    userId: { type: Number},
    productId: { type: String},
    viewDate: {type: Date}
});

export default mongoose.model<IProductView>('ProductView', ProductViewSchema);