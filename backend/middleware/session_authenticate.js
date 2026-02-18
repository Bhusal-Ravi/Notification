import { auth } from "../utils/auth.js";

 export async  function authenticateSession(req,res,next){
    console.log("Session authenticate middleware hit")
    
        try{
            const session = await auth.api.getSession({
                headers: req.headers
            });

            if(!session){
              return  res.status(401).json({message:"Not Authorized to perform the action"})
            }
           
            return next()
        }catch(error){
            return res.status(401).json({message:"Could not verify the session"})
        }
    }
