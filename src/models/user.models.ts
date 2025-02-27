import mongoose, {Schema, Document} from "mongoose"


// Message Schema
export interface Message extends Document {     // Document here for type safety
    content : string
    createdAt : Date
}

const MessageSchema : Schema<Message> = new Schema({

    content : {
        type : String,
        required : true
    },

    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    }
    
})




// User Schema
export interface User extends Document {
    username : string
    email : string
    password : string
    verifyCode : string
    verifyCodeExpiry : Date
    isVerified : boolean
    isAcceptingMessage : boolean
    messages : Message[]
}

const UserSchema : Schema<User> = new Schema({

    username : {
        type : String,
        required : [true, "Username is required."],
        trim : true,
        unique : true
    },

    email : {
        type : String,
        required : [true, "Email is required."],
        unique : true,
        // match : [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "Please use a valid email address."]         // regex expression from regexr.com
    },

    password : {
        type : String,
        required : [true, "Password is required."],
    },

    verifyCode : {
        type : String,
        required : [true, "Verify Code is required."],
    },

    verifyCodeExpiry : {
        type : Date,
        required : [true, "Verify Code Expiry is required."],
    },

    isVerified : {
        type : Boolean,
        default : false
    },

    isAcceptingMessage : {
        type : Boolean,
        required : true
    },

    messages : [MessageSchema]

})


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel