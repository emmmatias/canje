'use client'
import { Passero_One } from "next/font/google"
import { useContext, useState, useEffect } from "react"
import Image from 'next/image'
import jsPDF from 'jspdf'
import Loader from "@/componentes/loader"

export default function Admin(){

    const [isLoged, setIsloged] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [passw, setPassw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(false)
    const [token, setToken] = useState(null)
    const [adding, setAdding] = useState(false)
    const [action, setAction] = useState(false)
    const [page, setPage] = useState('productos')
    const [productos, setProductos] = useState([])
    const [file, setFile] = useState(null)
    const [consent, setConset] = useState(false)
    const [nombre, setNombre] = useState('')
    const [stock, setStock] = useState('') 
    const [costo, setCosto] = useState(0)
    const [elimando, setEliminando] = useState(null)
    const [descripcion, setDescripcion] = useState('')
    const [variantes, setVariantes] = useState([])
    const [variante, setVariante] = useState('')
    const [categoria, setCategoria] = useState('')
    const [categorias, setCategorias] = useState([])
    const [editando, setEditando] = useState(false)
    const [editprod, setEditprod] = useState({})
    const [usuarios, setUsuarios] = useState([])
    const [editando_us, setEditando_us] = useState(false)
    const [user_ed, setUser_ed] = useState({}) 
    const [user_el, setUser_el] = useState({})
    const [ordenes, setOrdenes] = useState([]) 
    const [editando_or, setEditando_or] = useState(false)
    const [or, setOr] = useState({})

    const obtener_catalogo = async () => {
        try {
            setLoading(true)
            let response = await fetch('/api/catalogo',{
                method:'POST',
                body: JSON.stringify({
                    token
                })
            })
            if(response.ok){
                let data = await response.json()
                console.log(data)
                setProductos(data.catalogo)
            }
        } catch (error) {
            alert('Error, no se han podido encontrar los productos')
        }
    }

    useEffect(() => {
        obtener_catalogo()
    }, [token])

    const login = async (e) => {
        setIsLoading(true)
        let response = await fetch('/api/admin_log',{
            method:'POST',
            body: JSON.stringify({
                passw: passw
            })
        })
        if(response.ok){
            setIsLoading(false)
            let data = await response.json()
            setToken(data.token)
            setIsloged(true)
        }   
        if(!response.ok){
            setIsLoading(false)
            setMessage('error')
        }
    }

    const handleDrop = (event) => {
        event.preventDefault()
        const droppedFiles = event.dataTransfer.files;
        if (droppedFiles.length > 0) {
          setFile(droppedFiles[0])
        }
      }

    const handleDragOver = (event) => {
        event.preventDefault()
      }

    const alta_prod = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        if(!file || !nombre || !costo || !stock){
            return alert('Debes ingresar una imagen, nombre, costo y stock')
        }
        formData.append('file', file)
        formData.append('token', token)
        formData.append('nombre', nombre)
        formData.append('costo', costo)
        formData.append('stock', stock)
        formData.append('descripcion', descripcion)
        variantes.length > 0 ? formData.append('variantes', variantes.join(',')) : formData.append('variantes', variantes)
        categorias.length > 0 ? formData.append('categorias', categorias.join(',')) : formData.append('categorias', categorias)

        let response = await fetch('/api/productos',{
            method:'POST',
            body: formData
            }
        )

        if(response.ok){
            setFile(null)
            setNombre('')
            setCosto(0)
            setStock(0)
            setDescripcion('')
            setVariantes([])
            setCategorias([])
            obtener_catalogo()
        }
        if(!response.ok){
            setFile(null)
            setNombre('')
            setCosto(0)
            setStock(0)
            setDescripcion('')
            setVariantes([])
            setCategorias([])
        }
    }

    const remove_Cat = (index) => {
        const copia = categorias
        copia.splice(index, 1)
        setCategorias([...copia])
    }

    const remove_var = (index) => {
        const copia = variantes
        copia.splice(index, 1)
        setVariantes([...copia])
    }

    const handle_remove = (e, id) => {
        setEliminando(id)
        setAction('remove')
        e.preventDefault()
        setConset(true)
    }

    const remove_prod = async () => {
        const id = elimando
        let response = await fetch('/api/productos',{
            method:'DELETE',
            body: JSON.stringify({token, id})
        })
        if(response.ok){
            setEliminando(null)
            setConset(false)
            obtener_catalogo()
        }
        if(!response.ok){
            setEliminando(null)
            setConset(false)
            obtener_catalogo()
        }
    }

    const handle_put = async (e, prod) => {

        setEditando(true)
        setEditprod(prod)
    }

    const put_prod = async () => {
        const formData = new FormData()
        formData.append('nombre', editprod.nombre)
        formData.append('descripcion', editprod.descripcion)
        formData.append('variantes', editprod.variantes)
        formData.append('categorias', editprod.categorias)
        formData.append('stock', editprod.stock)
        formData.append('token', token)
        formData.append('id', editprod.id)
        formData.append('costo', editprod.costo)
        let response = await fetch('/api/productos', {
            method:'PUT',
            body: formData
        })
        if(response.ok){
            setEditando(false)
            obtener_catalogo()
            setEditprod({})
        }
        if(!response.ok){
            setEditando(false)
            obtener_catalogo()
            setEditprod({})
        }
    }

    const onbtener_usuarios = async () => {
        let response = await fetch(`/api/usuarios?token=${token}`)
        if(response.ok){
            let data = await response.json()
            console.log(data)
            setUsuarios(data.usuarios)
        }
        if(!response.ok){

        }
    }
    
    const handle_del = (user_) => {
        setUser_el(user_)
        setConset(true)
        setAction('user')
    } 
    
    const del_us = async (e, id) => {
        let response = await fetch('/api/usuarios',{
            method:'DELETE',
            body: JSON.stringify({
                id,
                token
            })
        })
        if(response.ok){
            setUser_el({})
            setConset(false)
            setAction('user')
        }
        if(!response.ok){
            setUser_el({})
            setConset(false)
            setAction('user')
        }
    }

    const add_user = async (e) => {
        if(user_ed.nombre.length > 0 && user_ed.usuario.length > 0 && user_ed.contraseña.length > 0 && user_ed.saldo > 0){
            let response = await fetch('/api/usuarios', {
                method:'POST',
                body: JSON.stringify({
                    user: user_ed,
                    token
                })
            })
            if(response.ok){
                onbtener_usuarios()
                setConset(false)
            }
            if(!response.ok){
                let data = await response.json()
                alert(`Error: ${data}`)
            }
        }else{
            alert('Deben definirse todas las características principales de cada usuario')
        }
    }

    const modif_user = async (e) => {
        let response = await fetch('/api/usuarios', {
            method:'PUT',
            body: JSON.stringify({user: user_ed, token})
        })
        if(response.ok){
            setEditando_us(false)
            onbtener_usuarios()
        }
        if(!response.ok){
            setEditando_us(false)
            onbtener_usuarios()
        }
    }

    const marcar = async (e, typo) => {
        if(typo == 'pendiente'){
            let response = await fetch('/api/ordenes',{
                method:'PUT',
                body: JSON.stringify({
                    id: or.orden_id,
                    campo: 'estado',
                    value: 'pendiente'
                })
            })
            if(response.ok){
                obtener_ordenes()
                setEditando_or(false)
                setOr({})
            }
            if(!response.ok){
                obtener_ordenes()
                setEditando_or(false)
                setOr({})
            }
        }
        if(typo == 'hecho'){
            let response = await fetch('/api/ordenes',{
                method:'PUT',
                body: JSON.stringify({
                    id: or.orden_id,
                    campo: 'estado',
                    value: 'hecho'
                })
            })
            if(response.ok){
                obtener_ordenes()
                setEditando_or(false)
                setOr({})
            }
            if(!response.ok){
                obtener_ordenes()
                setEditando_or(false)
                setOr({})
            }
        }
    }

    const markArr = (str) => {
        const inputString = or.articulos
        const resultadoArray = inputString.split(')')
        const resultadoLimpio = resultadoArray
        .map(item => item.replace(/[,()]/g, '').trim())
        return(
            <div>
                {
                resultadoLimpio.map((el, index) => {
                    return(
                        <p key={index}>
                            {el}
                        </p>
                    )
                })
                }
            </div>
        )
    }

    useEffect(() => {
        if(page == 'usuarios'){
         onbtener_usuarios()
        }
        if(page == 'ordenes'){
            obtener_ordenes()
        }
    },[page])

    const obtener_ordenes = async (e) => {
        let response = await fetch(`/api/ordenes?token=${token}`)
        if(response.ok){
            let data = await response.json()
            console.log('ORDENES', data)
            setOrdenes(data.ordenes)
        }
        if(!response.ok){
            let data = await response.json()
            alert(`error: ${data.message}`)
        }
    }

    const generatePDF = (e, id, usuario, detalles) => {
        e.preventDefault()
        const doc = new jsPDF()
        const articulosConSaltos = detalles.replace(/,/g, '\n');
        doc.text(`
        Orden: ${id}
        Usuario: ${usuario.usuario}
        Nombre: ${usuario.nombre}
        Estado: ${usuario.estado}
        Detalles: 
        ${detalles}
            `, 10, 10)
        doc.save(`${id}.pdf`)
    }

    const hand = (e) => {
        let v = e.target.value.replace(',', '.') 
        setCosto(Number(v))
    }

    const hand2 = (e) => {
        let v = e.target.value.replace(',', '.')
        setEditprod(prev => ({...prev, costo: Number(v)}))
    }

    return(
        <>
        {
            editando_us && <div className="chart">
                <label htmlFor="nom">Nombre</label>
                <input className="input" id="nom" onChange={(e) => {setUser_ed(prev => ({...prev, nombre: e.target.value}))}} value={user_ed.nombre} placeholder="nombre"/>
                <label htmlFor="us">Usuario</label>
                <input className="input" id="us" onChange={(e) => {setUser_ed(prev => ({...prev, usuario: e.target.value}))}} value={user_ed.usuario}  placeholder="usuario" />
                <label htmlFor="con">Contraseña</label>
                <input className="input" id="con" onChange={(e) => {setUser_ed(prev => ({...prev, contraseña: e.target.value}))}} value={user_ed.contraseña}  placeholder="contraseña" />
                <label htmlFor="sal">Saldo</label>
                <input className="input" id="sal" onChange={(e) => {setUser_ed(prev => ({...prev, saldo: e.target.value}))}} value={user_ed.saldo} type="number" placeholder="saldo" />
                <div>
                <button className="close-btn" onClick={(e) => {setEditando_us(false); setUser_ed({})}} >Cancelar</button>
                <button className="open-btn" onClick={(e) => {modif_user(e)}}>Guardar</button>
                </div>
            </div>
        }
        {
            editando && 
            <div className="chart">
            <h6>Edición de producto</h6>
            <label htmlFor="nombre">Nombre</label>
            <input className="input" id="nombre" onChange={(e) => {setEditprod(prev => ({...prev, nombre: e.target.value}))}} value={editprod.nombre} />
            <label htmlFor="des">Descripcion</label>
            <input className="input" id="des" onChange={(e) => {setEditprod(prev => ({...prev, descripcion: e.target.value}))}} value={editprod.descripcion}/>
            <label htmlFor="var">Variantes {'(separadas por comas)'}</label>
            <input className="input" id="var" onChange={(e) => {setEditprod(prev => ({...prev, variantes: e.target.value}))}} value={editprod.variantes}/>
            <label htmlFor="cat">Categorias {'(separadas por comas)'}</label>
            <input className="input" id="cat" onChange={(e) => {setEditprod(prev => ({...prev, categorias: e.target.value}))}} value={editprod.categorias}/>
            <label htmlFor="stock">Stock</label>
            <input className="input" id="stock" type="number"  onChange={(e) => { setEditprod(prev => ({...prev, stock: e.target.value})) }} value={editprod.stock}/>
            <label htmlFor="cos">Costo</label>
            <input className="input" id="cos" type="text" onChange={(e) => { hand2(e) }} value={editprod.costo}/>
            <div>
                <button className="close-btn" onClick={(e) => {setEditando(false); setEditprod({})}}>Cancelar</button>
                <button className="open-btn" onClick={(e) => put_prod(e)}>Modificar</button>
            </div>
            </div>
        }
        {
            editando_or && 
            <div className="chart">
                    <div style={{display:"grid", gridTemplateColumns:"1fr", gap:"10%"}}>
                        <p>Datos del usuario</p>
                        <p style={{backgroundColor:"rgb(248, 248, 0)", padding:"5px", borderRadius:"5px"}}>Usuario: {`${or.usuario}`}</p>
                        <p style={{backgroundColor:"rgb(248, 248, 0)", padding:"5px", borderRadius:"5px"}}>Nombre: {`${or.nombre}`}</p>
                        <p style={{backgroundColor:"rgb(248, 248, 0)", padding:"5px", borderRadius:"5px"}}>Saldo Actual: {`${or.saldo}`}</p>
                        <p style={{backgroundColor:"rgb(248, 248, 0)", padding:"5px", borderRadius:"5px"}}>ID - Orden: {`${or.orden_id}`}</p>
                        <p style={{backgroundColor:"rgb(248, 248, 0)", padding:"5px", borderRadius:"5px"}}>Estado: {`${or.estado}`}</p>
                        <div>Detalles: {
                            markArr(or.articulos)
                            }</div>
                    </div>
                <div>
                <button className="open-btn" onClick={(e) => {
                    or.estado == 'pendiente' ? marcar(e, 'hecho') : marcar(e, 'pendiente')
                }}>{or.estado == 'pendiente' ? 'Marcar hecho': 'Marcar pendiente'}</button>
                <button style={{marginLeft:"1%", marginRight:"1%"}} onClick={(e) => {generatePDF(e, or.orden_id, {usuario: or.usuario, nombre: or.nombre, estado: or.estado}, or.articulos)}} className="open-btn">Descargar orden</button>
                <button className="close-btn" onClick={(e) => {setEditando_or(false); setOr({})}}>Cerrar</button>
                </div>
            </div>
        }
        {
            consent && 
            <div className="popup">
                {
                    action == 'remove' && 
                    <div>
                        <p>¿Estas seguro de eliminar el producto con el id {elimando}?, la acción es irreversible</p>
                        <button className="close-btn" onClick={(e) => remove_prod(e)}>Eliminar</button>
                    </div>
                }
                {
                    action == 'user' && 
                    <div>
                    <p>¿Estas seguro de eliminar el usuario: {user_el.usuario}?</p>
                    <button className="close-btn" onClick={(e) => {del_us(e, user_el.id)}}>Eliminar</button>
                    </div>
                }
                {
                    action == 'add' && 
                    <div>
                        <label htmlFor="nom">Nombre</label><br/>
                        <input id="nom" onChange={(e) => {setUser_ed(prev => ({...prev, nombre: e.target.value}))}} value={user_ed.nombre} placeholder="nombre"/><br/>
                        <label htmlFor="us">Usuario</label><br/>
                        <input id="us" onChange={(e) => {setUser_ed(prev => ({...prev, usuario: e.target.value}))}} value={user_ed.usuario}  placeholder="usuario" /><br/>
                        <label htmlFor="con">Contraseña</label><br/>
                        <input id="con" onChange={(e) => {setUser_ed(prev => ({...prev, contraseña: e.target.value}))}} value={user_ed.contraseña}  placeholder="contraseña" /><br/>
                        <label htmlFor="sal">Saldo</label><br/>
                        <input id="sal" onChange={(e) => {setUser_ed(prev => ({...prev, saldo: e.target.value}))}} value={user_ed.saldo} type="number" placeholder="saldo" /><br/>
                        <button  className="open-btn" onClick={(e) => {add_user(e)}} >Guardar</button>    
                    </div>
                }
                <button className="open-btn" onClick={(e) => setConset(false)}>Cancelar</button>
            </div>
        }
        {
            adding &&
            <div className="chart">
                <h6>Añade un nuevo elemento</h6>
                <form onSubmit={alta_prod}>
                <label>Nombre </label><br/><br/>
                <input className="input" placeholder="nombre" onChange={(e) => { setNombre(e.target.value) }} value={nombre} /><br/><br/>
                <label>Descripcion </label><br/><br/>
                <input className="input" placeholder="descripcion" onChange={(e) => { setDescripcion(e.target.value) }} value={descripcion} />
                <div>
                <input className="input" onChange={(e) => {setVariante(e.target.value)}} placeholder="variantes" value={variante} />
                <button className="open-btn" disabled={variante.length == 0} onClick={(e) => {setVariantes(prev => [...prev, variante]); setVariante('')}}> Añadir </button>
                    <div>
                    {
                        variantes.length > 0 && <>
                        {
                            variantes.map((el, index) => {
                                return(
                                    <div key={index} onClick={(e) => {remove_var(index)}}>
                                        {el}
                                    </div>
                                )
                            })
                        }
                        </>
                    }
                    </div>
                </div>
                <div>
                <input className="input" placeholder="categorias" onChange={(e) => {setCategoria(e.target.value)}} value={categoria} />
                <button className="open-btn" disabled={categoria.length == 0} onClick={(e) => {setCategorias(prev => [...prev, categoria]); setCategoria('')}}> Añadir </button><br/>
                    <div>
                    {
                        categorias.length > 0 && <>
                        {
                            categorias.map((el, index) => {
                                return(
                                    <div key={index} onClick={(e) => remove_Cat(index)}>
                                        {el}
                                    </div>
                                )
                            })
                        }
                        </>
                    }
                    </div>
                </div><br/>
                <label>Stock </label>
                <input min={"0"} placeholder="Stock" onChange={(e) => { setStock(e.target.value) }} value={stock} type="number"/><br/>
                <label>Costo </label>
                <input placeholder="Costo" onChange={(e) => { hand(e) }} value={costo} type="text" /><br/><br/>
                <label htmlFor="imagen">Imagen</label>
                <div
                id="imagen"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{
                border: '2px dashed #cccccc',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                marginBottom: '20px'
                }}
            >
                {file ? (
                <p>Archivo: {file.name}</p>
                ) : (
                <p>Arrastra y suelta una imagen aquí</p>
                )}
                <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: 'none' }}
                />
                </div>
                <div>
                    <button className="close-btn" onClick={(e) => {setAdding(false)}}>Cerrar</button>
                    <button className="open-btn" type="submit">Finalizar</button>
                </div>
                </form>
            </div>
        }
        {
            (isLoged && token) ?
            <>
            <nav>
                <div onClick={(e)=>{setPage('ordenes')}}>Ordenes</div>
                <div onClick={(e)=>{setPage('productos')}}>Productos</div>
                <div onClick={(e)=>{setPage('usuarios')}}>Usuarios</div>
            </nav>
            <main>
                {
                    page == 'productos' &&
                    <div >
                        <div>
                            <button className="open-btn" onClick={(e) => {setAdding(true)}}>Añadir producto</button>
                            {
                                <table className="table">
                                   <thead>
                                    <tr>
                                        <td>ID</td>
                                        <td>Imagen</td>
                                        <td>Nombre</td>
                                        <td>descripcion</td>
                                        <td>variantes</td>
                                        <td>categorias</td>
                                        <td>stock</td>
                                        <td>costo</td>
                                        <td>acciones</td>
                                    </tr>
                                   </thead>
                                   <tbody>
                                    {
                                        productos.map((el, index) => {
                                            //let path = el.imagenes
                                            let path = el.imagenes.replace('/opt/render/project/src/public', '')
                                            if (!path.startsWith('/')) {
                                                path = '/' + path;
                                            }
                                            //let path1 = path.split("public\\")
                                            return(
                                                <tr key={index}>
                                                    <td>
                                                        {el.id}
                                                    </td>
                                                    <td>
                                                        <Image src={`${path}`} width={50} height={50} alt={el.nombre}/><br/>
                                                    </td>
                                                    <td>{el.nombre}</td>
                                                    <td>{el.descripcion}</td>
                                                    <td>{el.variantes}</td>
                                                    <td>{el.categorias}</td>
                                                    <td>{el.stock}</td>
                                                    <td>{el.costo}</td>
                                                    <td>
                                                        <button className="open-btn" onClick={(e) => { handle_put(e, el) }}>Modificar</button>
                                                        <button className="close-btn"  onClick={(e) => { handle_remove(e, el.id) }}>Eliminar</button>
                                                        </td>
                                                </tr>
                                            )
                                        })
                                    }
                                   </tbody>
                                </table>
                            }
                        <table></table>
                        </div>
                    </div>
                }
                {
                    page == 'usuarios' &&
                    <div>
                        <button className="open-btn" onClick={(e) => {setConset(true); setAction('add'); setUser_ed({nombre: '', usuario:'', contraseña:'', saldo: ''})}}>Añadir usuario</button>
                        <table className="table">
                            <thead>
                                <tr>
                                    <td>
                                        nombre
                                    </td>
                                    <td>usuario</td>
                                    <td>contraseña</td>
                                    <td>saldo</td>
                                    <td>acciones</td>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                usuarios.length > 0 ? 
                                <>
                                {
                                    usuarios.map((el,index) => {
                                        return(
                                            <tr key={index}>
                                            <td>{el.nombre}</td>
                                            <td>{el.usuario}</td>
                                            <td>{el.contraseña}</td>
                                            <td>{el.saldo}</td>
                                            <td>
                                                <button className="open-btn" onClick={(e) => {setEditando_us(true); setUser_ed(el)}}>Modificar</button>
                                                <button className="close-btn" onClick={(e) => {handle_del(el)}}>Eliminar</button>
                                            </td>
                                        </tr>
                                        )
                                    })
                                }
                                </> : <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr> 
                            }
                            </tbody>
                        </table>
                    </div>
                }
                {
                    page == 'ordenes' && 
                    <div>
                        <h6 style={{marginTop:"1%", marginBottom:"1%"}}>Para ver detalles de la orden haga click sobre una</h6>
                        <table className="table">
                            <thead>
                                <tr>
                                    <td>Numero Orden</td>
                                    <td>Usuario</td>
                                    <td>Costo</td>
                                    <td>Estados</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ordenes.map((el, index) => {
                                        return(
                                            <tr style={el.estado == 'pendiente' ? {backgroundColor:'red'} : {backgroundColor:'green'}} key={index} onClick={(e) => {setEditando_or(true); setOr(el)}}>
                                                <td>{el.orden_id}</td>
                                                <td>{el.usuario}</td>
                                                <td>{el.costo_total}</td>
                                                <td>{el.estado}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </main>
            </> : 
            <div className="popup">
            <label htmlFor="pass">Ingreso Admin</label><br/><br/>
            <div> <input placeholder="Contraseña Admin" onChange={(e) => {setPassw(e.target.value)}} id="pass" type="password"/>
            </div>
            {
                isLoading && <Loader/>
            }
            {message && <div>
            <p>Contraseña incorrecta</p>
            <button className="close-btn" onClick={(e) => {setMessage(false)}}>x</button>    
            </div>}
            { !isLoading && <button className="open-btn" onClick={(e) => {login(e)}}>Ingresar</button>}
            </div>
        }
        </>
    )
}