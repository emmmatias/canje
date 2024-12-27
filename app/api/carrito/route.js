import database from '@/componentes/db'
import jwt, { decode } from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET

export const POST = async (req, res) => {
    const { token, pedido } = await req.json()
    console.log(pedido)
    try {
        const db = await database()
        let add = await db.run(`
        UPDATE productos SET stock = stock - ? where id = ?
            `, [pedido.cantidad ,pedido.id])
            if(add.changes){
                return new Response(JSON.stringify({ changes: add.changes }), {
                    status: 200
                })
            }
            if(!add.changes){
                return new Response(JSON.stringify({ changes: add.changes }), {
                    status: 500
                })
            }
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({message: `${error}`}), {
            status: 500
        })
    }
}