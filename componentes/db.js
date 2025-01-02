import sqlite3 from 'sqlite3';
import path from 'path';
const dbPath = path.join(process.cwd(), './database', 'database.sqlite');
import { open } from 'sqlite';

const database = async () => {
    return open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    })
  }

  const initDB = async () => {
    const db = await database()
    await db.run(`
    CREATE TABLE IF NOT EXISTS USUARIOS (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    usuario TEXT UNIQUE NOT NULL,
    contraseña TEXT,
    saldo INTEGER,
    ordenes TEXT,
    carrito LONGTEXT
    )
        `)

    await db.run(`
          CREATE TABLE IF NOT EXISTS destacados (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          orden TEXT
          activa BOOLEAN
          )
              `)

    await db.run(`
    CREATE TABLE IF NOT EXISTS ordenes (
    id TEXT NOT NULL,
    id_usuario INTEGER NOT NULL,
    articulo_id INTEGER NOT NULL,
    articulo_nombre TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    costo_uni REAL NOT NULL,
    estado TEXT DEFAULT "pendiente"
    )
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
        `)
    
  }

  initDB().catch(console.error)

  export default database