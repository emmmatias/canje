import database from '@/componentes/db'
import jwt, { decode } from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET

export const POST = async (req, res) => {
    const { token } = await req.json()
    try {
        const db = await database()
        jwt.verify(token, SECRET_KEY)
        let catalogo = await db.all(`
        SELECT * from productos
        `)
        if(catalogo.length > 0){
            return new Response(JSON.stringify({ catalogo }), {
                status: 200
            })
        }
        if(catalogo.length == 0){
            return new Response(JSON.stringify({ catalogo, message: 'No hay prductos cargados' }), {
                status: 200
            })
        }
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({message: `${error}`}), {
            status: 500
        })
    }

}