import database from '@/componentes/db'
import jwt, { decode } from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET
const ADMIN_PASS = process.env.ADMIN_PASS
export const POST = async (req, res) => {
    const { passw } = await req.json()
    if(passw == ADMIN_PASS){
        const token = jwt.sign({admin: 'admin'}, SECRET_KEY, {expiresIn: '4h'})
        return new Response(JSON.stringify({ token }), {
            status: 200
        })
    }
    else{
        return new Response(JSON.stringify({message: 'ADMIN PASS INCORRECTO'}), {
            status: 404
        })
    }
}