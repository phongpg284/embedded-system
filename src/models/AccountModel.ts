import { Schema, model, Types } from "mongoose"

export interface IAccount {
    _id: string
    email: string
    password: string
    pk: string
    role: string
}

export const AccountSchema = new Schema<IAccount>({
    email: { type: String, required: true, match: [/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, "Please fill a valid email address"] },
    password: { type: String, required: true },
    pk: {
        type: String, required: true,
        validate: {
            validator: function (id: string) {
                if (Types.ObjectId.isValid(id)) {
                    if ((String)(new Types.ObjectId(id)) === id)
                        return true;
                    return false;
                }
                return false;
            },
            message: props => `${props.value} is not a valid ObjectId!`
        },
    },
    role: { type: String, required: true },
})

const AccountModel = model<IAccount>("Accounts", AccountSchema)

export default AccountModel
