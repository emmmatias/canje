import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

// Forzar renderizado dinámico para evitar caché
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request, { params }) {
    try {
        const { filename } = await params
        
        // Log para debugging
        console.log(`[Images API] Solicitando: ${filename}`)
        
        const imagePath = path.join(process.cwd(), 'public', filename)
        
        console.log(`[Images API] Ruta completa: ${imagePath}`)
        
        // Verificar si el archivo existe
        if (!fs.existsSync(imagePath)) {
            console.warn(`[Images API] Archivo no encontrado: ${imagePath}`)
            return new NextResponse('Image not found', { status: 404 })
        }

        console.log(`[Images API] ✓ Archivo encontrado`)

        // Leer el archivo
        const imageBuffer = fs.readFileSync(imagePath)
        
        // Determinar el tipo MIME basado en la extensión
        const ext = path.extname(filename).toLowerCase()
        const mimeTypes = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml'
        }
        
        const contentType = mimeTypes[ext] || 'application/octet-stream'
        
        // Retornar la imagen con headers sin caché
        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        })
    } catch (error) {
        console.error('[Images API] Error:', error)
        return new NextResponse('Error loading image', { status: 500 })
    }
}
