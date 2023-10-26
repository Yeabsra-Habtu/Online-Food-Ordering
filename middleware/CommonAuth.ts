import { NextFunction,Request,Response } from "express";
import { AuthPayloadInput } from "../dto/Auth.dto";
import { ValidateSignature } from "../utility";

declare global{
    namespace Express{
        export interface Request{
            user?:AuthPayloadInput
        }
    }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const validate = await ValidateSignature(req);
    if (validate) {
        next();
    } else {
        return res.status(401).json({ error: 'Unauthorized' }); 
    }
};