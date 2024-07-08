import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/apiResponse";


// Emails are always async
export async function sendVerificationEmail(

    email : string,
    username : string,
    verifyCode : string

) : Promise<ApiResponse> {

    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Feedback_Project | Verification Code',
            react: VerificationEmail({username, otp : verifyCode}),
        });

        return {success : true, message : "Verificaton email sent successfully."}
        
    } catch (emailError) {
        console.error("Error sending verifiation email.", emailError);
        return {success : false, message : "Failed to send verificaton email."}
    }    

}