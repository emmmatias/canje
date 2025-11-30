import database from '@/componentes/db'
import jwt, { decode } from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'


export const POST = async (req, res) => {

    const body = await req.text()
    const { carrito } = JSON.parse(body);
    try {
        const db = await database()
        for(let or of carrito.items){
            await db.run(`
            UPDATE productos set stock = stock + ? where id = ?
                `,[or.cantidad, or.id])
        }
        return new Response(JSON.stringify({message: 'TODO PERFECTO'}), {
            status: 200
        })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({message: `${error}`}), {
            status: 500
        })
    }
}