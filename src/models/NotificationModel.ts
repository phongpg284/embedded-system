import { Schema, model, Types } from "mongoose"

export interface INotification {
    _id: string
    title: string
    content: string
    account_id: string
}

export const NotificationSchema = new Schema<INotification>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    account_id: {
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
})

const NotificationModel = model<INotification>("Notification", NotificationSchema)

export default NotificationModel
