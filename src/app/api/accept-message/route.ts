import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.models";
import { User } from "next-auth";


export async function POST(request : Request) {

    await dbConnect()

    const session = await getServerSession(authOptions)

    const user : User = session?.user as User
    // const user = session?.user
    
    if (!session || !session.user) {
        return Response.json({
            success : false,
            message : "Not authenticated!"
        }, {status : 401})
    }

    const userid = user._id
    const {acceptMessages} = await request.json()


    try {

        const updatedUser = await UserModel.findByIdAndUpdate(
            userid,
            { isAcceptingMessage : acceptMessages },
            { new : true }
        )

        if (!updatedUser) {

            return Response.json({
                success : false,
                message : "Failed to update user status to accept messages."
            }, {status : 401})
            
        }   

        return Response.json({
            success : true,
            message : "Message acceptance status updated successfully.",
            updatedUser
        }, {status : 200})

        
    } catch (error) {

        console.log("Failed to update user status to accept messages.");

        return Response.json({
            success : false,
            message : "Failed to update user status to accept messages."
        }, {status : 500})

    }

}





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

    const userid = user._id
    const {acceptMessages} = await request.json()

    try {

        const foundUser = await UserModel.findById(userid)
    
        if (!foundUser) {
    
            return Response.json({
                success : false,
                message : "User not found."
            }, {status : 401})
            
        }
    
        return Response.json({
            success : true,
            isAcceptingMessage : foundUser.isAcceptingMessage
        }, {status : 200})

    } catch (error) {

        console.log("Error in geting message acceptance.")

        return Response.json({
            success : false,
            message : "Error in geting message acceptance."
        }, {status : 500})

    }

}   