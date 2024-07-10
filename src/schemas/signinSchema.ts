import { z } from "zod";


export const signinSchema = z.object({

    identifier : z.string(),    // could use any name for this identifier
    password : z.string(),
    
})