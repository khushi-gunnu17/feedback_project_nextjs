import { z } from "zod";


export const signinSchema = z.object({

    identifier : z.string(),    // could use anything for this identifier such as email or username for signin.
    password : z.string()
    
})