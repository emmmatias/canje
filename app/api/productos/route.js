import database from '@/componentes/db'
import jwt, { decode } from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'
import { verify } from 'crypto';

// Forzar renderizado dinámico para evitar caché estático
export const dynamic = 'force-dynamic'
export const revalidate = 0

const SECRET_KEY = process.env.JWT_SECRET

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
// Usar process.cwd() para obtener el directorio raíz de la aplicación
// Esto funciona tanto en desarrollo como en producción standalone
const directoryPath = path.join(process.cwd(), 'public')

const deleteFile = (absoluteFilePath) => {
    // Verificar si el archivo existe antes de intentar eliminarlo
    fs.access(absoluteFilePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(`El archivo no existe: ${absoluteFilePath}`);
        return;
      }
  
      // Eliminar el archivo
      fs.unlink(absoluteFilePath, (err) => {
        if (err) {
          console.error(`Error al eliminar el archivo: ${err}`);
          return;
        }
      });
    });
  };

function generarIdUnico() {
    return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

export const POST = async (req, res) => {
    const formData = await req.formData();
    const file = formData.get('file')
    const token = formData.get('token')
    const nombre = formData.get('nombre')
    const costo = formData.get('costo') || 0
    const stock = formData.get('stock') || 0
    const descripcion = formData.get('descripcion')
    const variantes = formData.get('variantes') || ''
    const categorias = formData.get('categorias') || ''
    const id_unico  = generarIdUnico()
    const originalFileName = file.name;
    const fileExtension = path.extname(originalFileName)
    if(!nombre || !file){
        return new Response(JSON.stringify({ error: 'Faltan datos' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
    }

    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
      }
    
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(path.join(directoryPath, id_unico.concat(fileExtension)), Buffer.from(buffer))

    try {
        jwt.verify(token, SECRET_KEY)
        const db = await database()
        await db.run(`
                INSERT INTO productos (
                imagenes,
                nombre,
                descripcion,
                categorias,
                costo,
                stock,
                variantes
                ) VALUES (
                ?,?,?,?,?,?,? 
                )    
        `,[`${id_unico.concat(fileExtension)}`, nombre, descripcion, categorias, costo, stock, variantes])
        return new Response(JSON.stringify({message: 'Operacion Exitosa'}), {
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
        const db = await database()
        jwt.verify(token, SECRET_KEY)
        const imagen = await db.get(`
        SELECT * FROM productos where id = ?
            `,[id])
        // Construir la ruta completa del archivo
        const absoluteFilePath = path.join(directoryPath, imagen.imagenes)
        deleteFile(absoluteFilePath)
        await db.run(`
        DELETE FROM productos WHERE id = ?
            `, [id])
            return new Response(JSON.stringify({message: 'Operacion Exitosa'}), {
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
    const formData = await req.formData();
    const token = formData.get('token')
    const nombre = formData.get('nombre')
    const id = formData.get('id')
    const costo = formData.get('costo') || 0
    const stock = formData.get('stock') || 0
    const descripcion = formData.get('descripcion')
    const variantes = formData.get('variantes') || ''
    const categorias = formData.get('categorias') || ''
    try {
        jwt.verify(token, SECRET_KEY)
        const db = await database()
        await db.run(`
        UPDATE productos set nombre = ?, costo = ?, stock = ?, descripcion = ?, variantes = ?, categorias = ? where id = ?  
            `, [nombre, costo, stock,descripcion, variantes, categorias, id])
            return new Response(JSON.stringify({message: 'Operacion Exitosa'}), {
                status: 200
            })
        } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({message: `${error}`}), {
            status: 500
        })
    }
}