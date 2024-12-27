import database from '@/componentes/db'
import jwt, { decode } from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET

export const POST = async (req, res) => {
    const { user, pass } = await req.json()
    try {
        const db = await database()
        console.log('user:', user, 'pass:', pass)
        let match = await db.get(`SELECT * FROM USUARIOS WHERE usuario = ? AND contraseña = ?`, [user, pass])
        if(match){
            const token = jwt.sign({usuario: match}, SECRET_KEY, { expiresIn: '4h' })
            return new Response(JSON.stringify({message: 'Usuario encontrado', match, token}), {
                status: 200
            })
        }
        if(!match){
            return new Response(JSON.stringify({message: 'Usuario no encontrado, revise usuario y/o contraseña'}), {
                status: 404
            })
        }
    } catch (error) {
        return new Response(JSON.stringify({message: `${error}`}), {
            status: 500
        })
    }
}