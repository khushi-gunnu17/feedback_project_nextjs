import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.models";
import bcryptjs from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request : Request) {

    await dbConnect()

    try {

        const {username, email, password} = await request.json()

        // if user already exist and is verified
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified : true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success : false,
                message : "Username is already taken."
            }, {status : 400})
        }


        
        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()


        if (existingUserByEmail) {

            if (existingUserByEmail.isVerified) {

                return Response.json({
                    success : false,
                    message : "User alread exist with this email."
                }, {status : 400})

            } else {

                const hashedPassword = await bcryptjs.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()

            }

        } else {

            // in this else block we are completely setting up a new user
            const hashedPassword = await bcryptjs.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password : hashedPassword,
                verifyCode,
                verifyCodeExpiry : expiryDate,
                isVerified : false,
                isAcceptingMessage : true,
                messages : []
            })

            await newUser.save()
        }

        // sending verification email
        const emailResponse = await sendVerificationEmail(
            email, username, verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({
                success : false,
                message : emailResponse.message
            }, {status : 500})
        }


        return Response.json({
            success : true,
            message : "User registered successfully. Please verify your email."
        }, {status : 201})

        
    } catch (error) {

        console.error("Error Registering User", error);     // this error will be shown here and the other one will be send to the frontend.

        return Response.json({
            success : false,
            message : "Error Registering User"
        }, {status : 500})

    }

}