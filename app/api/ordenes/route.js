import database from '@/componentes/db'
import jwt, { decode } from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'
import { verify } from 'crypto';

const SECRET_KEY = process.env.JWT_SECRET

export const GET = async (req, res) => {
    
    const { searchParams } = new URL(req.url)
    
    let token = searchParams.get('token')

    try {
        jwt.verify(token, SECRET_KEY)
        const db = await database()
        let ordenes = await db.all(`
        SELECT 
            u.id AS usuario_id,
            u.nombre,
            u.usuario,
            u.saldo,
            o.id AS orden_id,
            GROUP_CONCAT(o.articulo_nombre || ' (Cantidad: ' || o.cantidad || ')', ', ') AS articulos,
            SUM(o.cantidad * o.costo_uni) AS costo_total,
            o.estado
        FROM 
            USUARIOS u
        JOIN 
            ordenes o ON u.id = o.id_usuario
        GROUP BY 
            u.id, o.id
        ORDER BY 
            u.id
            `)
        return new Response(JSON.stringify({ordenes}), {
                status: 200
            })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({message: `${error}`}), {
            status: 500
        })
    }

}

export const POST = async (req, res) => {
    const id = await req.json()
    console.log(id)
    
    try {
        const db = await database()
        const ordenes = await db.all(`
                SELECT 
            u.id AS usuario_id,
            u.nombre,
            u.usuario,
            u.saldo,
            o.id AS orden_id,
            GROUP_CONCAT(o.articulo_nombre || ' (Cantidad: ' || o.cantidad || ')', ', ') AS articulos,
            SUM(o.cantidad * o.costo_uni) AS costo_total,
            o.estado
        FROM 
            USUARIOS u
        JOIN 
            ordenes o ON u.id = o.id_usuario
        WHERE u.id = ?
        GROUP BY 
            u.id, o.id
        ORDER BY 
            u.id
            `, [id.id])
            return new Response(JSON.stringify({ordenes}), {
                status: 200
            })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({message: `${error}`}), {
            status: 500
        }) 
    }
}

export const PUT = async (req, res) => {
    let data = await req.json()
    if(data.campo == 'estado'){
        try {
            const db = await database()
            await db.run(`
            UPDATE ordenes SET estado = ? where id = ? 
                `, [data.value, data.id])
                return new Response(JSON.stringify({message: 'Modificacion existosa'}), {
                    status: 200
                })
        } catch (error) {
            console.error(error)
            return new Response(JSON.stringify({message: `${error}`}), {
                status: 500
            }) 
        }
    } 
}