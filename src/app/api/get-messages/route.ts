import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.models";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request : Request) {

    await dbConnect()

    const session = await getServerSession(authOptions)

    const user : User = session?.user as User
    
    if (!session || !session.user) {
        return Response.json({
            success : false,
            message : "Not authenticated!"
        }, {status : 401})
    }

    // as we are applying aggregation pipelines here, we cannot let the user._id to be in string format. Thus, we need to convert it to mongoose id.
    const userid = new mongoose.Types.ObjectId(user._id)

    try {

        const user = await UserModel.aggregate([
            {
                $match : {
                    id : userid
                }
            }, 

            {
                $unwind : '$messages'
            },

            {
                $sort : {
                    'messages.createdAt' : -1
                }
            },

            {
                $group : {
                    _id : '$_id',
                    messages : {
                        $push : '$messages'
                    }
                }
            }
        ])

        if (!user || user.length === 0) {
            return Response.json({
                success : false,
                message : "User not found."
            }, {status : 401})
        }

        return Response.json({
            success : true,
            messages : user[0].messages     // you always get an array as a return type from aggregation pipelines.
        }, {status : 200})
        
    } catch (error : any) {

        console.log(error.message);

        return Response.json({
            success : true,
            message : "Cannot get messages."
        }, {status : 500})
        
    }

}