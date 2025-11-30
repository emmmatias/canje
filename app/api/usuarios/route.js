import database from '@/componentes/db'
import jwt, { decode } from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'

// Forzar renderizado dinámico para evitar caché estático
export const dynamic = 'force-dynamic'
export const revalidate = 0

const SECRET_KEY = process.env.JWT_SECRET

export const GET = async (req, res) => {
    
    const { searchParams } = new URL(req.url)
    
    let token = searchParams.get('token')

    try {
        jwt.verify(token, SECRET_KEY)
        const db = await database()
        let usuarios = await db.all(`
        SELECT * from USUARIOS
            `)
        return new Response(JSON.stringify({usuarios}), {
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
    const { user, token} = await req.json()
    try {
        jwt.verify(token, SECRET_KEY)
        const db = await database()
        await db.run(`
        UPDATE USUARIOS SET nombre = ?, usuario = ?, contraseña = ?, saldo = ?, telefono = ?, dni = ? 
        where id = ? 
        `, [user.nombre, user.usuario, user.contraseña, user.saldo, user.telefono, user.dni, user.id])
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

export const DELETE = async (req, res) => {
    const { id, token} = await req.json()
    try {
        jwt.verify(token, SECRET_KEY)
        const db = await database()
        await db.run(`DELETE FROM USUARIOS WHERE id = ?`, [id])
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

export const POST = async (req, res) => {
    const { user, token} = await req.json()

    try {
        jwt.verify(token, SECRET_KEY)
        const db = await database()
        await db.run(`INSERT INTO USUARIOS (nombre, usuario, contraseña, saldo, ordenes, carrito, dni, telefono) VALUES (
            ?,?,?,?,?,?,?,?)`, [user.nombre, user.usuario, user.contraseña, user.saldo, '', '', user.dni, user.telefono])
        return new Response(JSON.stringify({message: 'Alta existosa'}), {
            status: 200
        })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({message: `${error}`}), {
            status: 500
        }) 
    }
}