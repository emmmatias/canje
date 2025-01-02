import database from "./componentes/db.js"
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
const db = await database()
const directoryPath = path.join(__dirname, './public')/*
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('No se pudo listar la carpeta: ' + err);
    }
    const images = files.filter(file => {
        return file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png');
    })
    images.forEach((image, index) => {
        const imagePath = path.join(directoryPath, image)
        const query = `
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
        )`

        db.run(query, [imagePath, `producto ${index}`, `descripcion ${index}`, 'GENERAL', 500, 1, ''], function(err) {
            if (err) {
                console.error('Error al insertar la imagen: ' + err.message);
            } else {
                console.log('Imagen insertada: ' + imagePath);
            }
        })
    })
})*/
//const db = await database()
/*
await db.run(`
DROP TABLE productos
    `)

    await db.run(`
        CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        imagenes TEXT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        categorias TEXT,
        costo REAL NOT NULL,
        stock INTEGER NOT NULL,
        variantes TEXT
        )
            `)*/
/*
    await db.run(`
    delete from productos    
    `)*/

    await db.run(`
        CREATE TABLE IF NOT EXISTS destacados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        orden TEXT
        activa BOOLEAN
        )
            `)

/*db.run(`
UPDATE USUARIOS SET saldo = ? where usuario = ?
    `, [2500, 'mati123'])*/
/*
db.run(`
INSERT INTO USUARIOS (
    nombre,
    usuario,
    contraseña,
    saldo,
    ordenes,
    carrito
) VALUES (
    ?,?,?,?,?,?
)`, ['MATIAS', 'mati123', 'AAA', 2500, '', ''])*/

//db.run(`ALTER TABLE ordenes ADD COLUMN estado TEXT DEFAULT "pendiente"`)