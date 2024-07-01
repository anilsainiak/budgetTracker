import { Curriencies } from "@/lib/currencies";
import {z} from 'zod';

export const UpdateUserCurrencySchema = z.object({
    currency:z.custom((value)=>{
        const found = Curriencies.some(c=>c.value===value);
        if(!found){
            throw new Error('invalid currency: ${value}');
        }
        return value;
    })
})