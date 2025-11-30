import database from '@/componentes/db'
import jwt, { decode } from 'jsonwebtoken'

// Forzar renderizado dinámico para evitar caché estático
export const dynamic = 'force-dynamic'
export const revalidate = 0

const SECRET_KEY = process.env.JWT_SECRET

export const POST = async (req, res) => {
    const { destacados } = await req.json()
    try {
        const db = await database()
        let des = await  db.all('SELECT * FROM destacados')
        if(des.length > 0){
            await db.run(`UPDATE destacados set orden = ?`, [destacados])
            return new Response(JSON.stringify({ message: 'OK' }), {
                status: 200
            })
        }
        if(des.length <= 0){
            await db.run(`INSERT INTO destacados (nombre, orden) VALUES (?,?)`, ['principal', destacados])
            return new Response(JSON.stringify({ message: 'OK' }), {
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