import database from '@/componentes/db'
import jwt, { decode } from 'jsonwebtoken'

export const POST = async (req, res) => {
    const { token, orden } = await req.json()
    
try {
    const db = await database()
    await db.run(`
    UPDATE productos set stock = stock + ? where id = ?
        `, [orden.cantidad, orden.id])
    return new Response(JSON.stringify({message: 'Operacion Exitosa'}), {
            status: 200
        })
} catch (error) {
    return new Response(JSON.stringify({message: `${error}`}), {
        status: 500
    })
}

}