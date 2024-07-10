import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcryptjs from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.models";


export const authOptions : NextAuthOptions = {

    providers : [
        CredentialsProvider({

            id : "credentials",
            name : "Credentials",

            credentials: {
                email : { label: "Email", type: "text" },
                password : { label: "Password", type: "password" }
            },

            async authorize(credentials : any) : Promise<any> {

                await dbConnect()

                try {

                    const user = await UserModel.findOne({
                        $or : [
                            {email : credentials.identifier.email},         // also no need to write email after identifier as per the new syntax.
                            {username : credentials.identifier.username}
                        ]
                    })

                    if (!user) {
                        throw new Error('No user found with this email.')
                    }
                    
                    if (!user.isVerified) {
                        throw new Error('Please verify your account first before login.')
                    }

                    const isPasswordCorrect = await bcryptjs.compare(credentials.password, user.password)

                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error("Incorrect Password.")
                    }
                    
                } catch (error : any) {
                    throw new Error(error)
                }

            }

        })
    ],

    callbacks : {

        async session({ session, token }) {

            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
            }

            return session
        },

        // the user in the parameters down below is the user which is returned from the providers section.
        async jwt({ token, user }) {

            if (user) {
                // we have modified token over here.
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessage
                token.username = user.username
            }

            return token
        }

    },

    pages : {
        signIn: '/signin'
    },

    session : {
        strategy : "jwt"
    },

    secret : process.env.NEXTAUTH_SECRET,

}