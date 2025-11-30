import database from '@/componentes/db'
import jwt, { decode } from 'jsonwebtoken'

// Forzar renderizado dinámico para evitar caché estático
export const dynamic = 'force-dynamic'
export const revalidate = 0

const SECRET_KEY = process.env.JWT_SECRET

export const POST = async (req, res) => {
    const { token } = await req.json()
    try {
        const db = await database()
        jwt.verify(token, SECRET_KEY)
        let catalogo = await db.all(`
        SELECT * from productos
        `)
        let destacados = await db.get(`
            SELECT orden from destacados
            `)
        if(catalogo.length > 0){
            if(destacados.orden.length > 0){
                let idOrder = destacados.orden.split(',').map(Number)
                let ordered = catalogo.filter(obj => idOrder.includes(obj.id)).sort((a, b) => {
                    return idOrder.indexOf(a.id) - idOrder.indexOf(b.id);
                  })
                let others = catalogo.filter(obj => !idOrder.includes(obj.id))
                let sortedArr = [...ordered, ...others]
                return new Response(JSON.stringify({ catalogo: sortedArr, destacados: destacados ? destacados : '' }), {
                    status: 200
                })
            }
            return new Response(JSON.stringify({ catalogo, destacados: destacados ? destacados : '' }), {
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