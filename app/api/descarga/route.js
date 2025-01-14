import database from '@/componentes/db'
import path from 'path'
import fs from 'fs'

const SECRET_KEY = process.env.JWT_SECRET
const ADMIN_PASS = process.env.ADMIN_PASS

// localhost:3000/api/descarga?pass=****
export const GET = async (req, res) => {
    const filePath = path.join(process.cwd(), './database.sqlite')
    console.log('pathhhhhhhh', filePath)
    const { searchParams } = new URL(req.url)
    const admin_pass = searchParams.get('pass')

    console.log('url:', admin_pass, 'env:', ADMIN_PASS)

    if(admin_pass == ADMIN_PASS){

        if (fs.existsSync(filePath)) {

            const fileStream = fs.createReadStream(filePath)

            return new Response(fileStream, {
                status: 200,
                headers: {
                  'Content-Disposition': 'attachment; filename=database.sqlite',
                  'Content-Type': 'application/octet-stream',
                },
              })

          } else {
            // Maneja el caso en que el archivo no se encuentra
            return new Response(JSON.stringify({error: 'Ruta desconocido'}), {
                status: 404
            })
          }

    }
    if(admin_pass != ADMIN_PASS){
        return new Response(JSON.stringify({error: 'No tienes permiso para acceder'}), {
            status: 404
        })
    }
}