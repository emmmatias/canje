import database from '@/componentes/db'
import jwt, { decode } from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET
function generarIdUnico() {
    return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}
export const POST = async (req, res) => {
    const { token, carrito, user_data } = await req.json()
    try {
        const db = await database()
        const id_orden = generarIdUnico()
        await carrito.items.forEach(async (el) => {
            let saldo = await db.get(`
                select saldo from USUARIOS where id = ?`, [user_data.id])
            if(Number(saldo.saldo) < 0 ){
                return new Response(JSON.stringify({message: `No hay saldo suficiente`}), {
                    status: 500
                })
            }
            let res = await db.run(`
                UPDATE USUARIOS SET saldo = ? where id = ?
                    `, [0, user_data.id])
            await db.run(`
                INSERT INTO ordenes (
                    id,
                    id_usuario,
                    articulo_id,
                    articulo_nombre,
                    cantidad,
                    costo_uni  
                ) values (?,?,?,?,?,?)
                    `, [id_orden, user_data.id, el.id, el.nombre.concat(el.variante), el.cantidad, el.costo])    
        })
        await db.run(`
        UPDATE USUARIOS set saldo = ? where id = ?
            `, [0, user_data.id])
        return new Response(JSON.stringify({message: 'Operacion Exitosa'}), {
            status: 200
        })
    } catch (error) {
        return new Response(JSON.stringify({message: `${error}`}), {
            status: 500
        })
    }
}