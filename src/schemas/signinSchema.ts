import { z } from "zod";


export const signinSchema = z.object({

    // could use any name for this
    identifier : z.string(),
    password : z.string(),
    
})