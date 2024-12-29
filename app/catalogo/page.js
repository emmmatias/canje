'use client'

import { useContext, useState, useEffect, useRef} from "react"
import { authContext } from "@/componentes/authProvider"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import jsPDF from 'jspdf'
import Image from 'next/image'
import { useRouter } from "next/navigation"


export default function Catalogo(){
    const [categorias, setCategorias] = useState('todas')
    const [busqueda, setBusqueda] = useState('')
    const [productos, setProductos] = useState([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [pedido1, setPedido1] = useState('')
    const [cantidad, setCantidad] = useState(0)
    const [variante, setVariante] = useState('')
    const [detail, setDetail] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [prod_filtrados, setProd_filtrados] = useState([])
    const [openChart, setOpenchart] = useState(false)
    const [carrito, setCarrito] = useState({items: []})
    const [ordenes, setOrdenes] = useState(undefined)
    const [openOr, setOpenOr] = useState(false)
    const [or, setOr] = useState({})
    const [consent, setConset] = useState(false)
    const {
        user_data,
        token,
        isAutenticated,
        setUser_loged,
        setUser_data,
        setToken,
        setIsAutenticated
    } = useContext(authContext)
    
    const router = useRouter()

    const carritoRef = useRef(carrito);
    useEffect(() => {
        console.log(
            `
            DATOS DEL CONTEXTO:
            ${token}
            ${user_data}
            `
        )
    }, [])
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
                setLoading(false)
                console.log(data)
                setProductos(data.catalogo)
            }
        } catch (error) {
            
        }
    }

    const calc_max = (costo) => {
        return Math.floor(user_data.saldo / costo)
    }

    const obtener_ordenes = async () => {
        let response = await fetch('/api/ordenes',{
            method:'POST',
            body: JSON.stringify({
                id: user_data.id
            })
        })
        if(response.ok){
            let data = await response.json()
            setOrdenes(data)
        }
        if(!response.ok){
            setOrdenes(undefined)
        }
    }

    useEffect(() => {
        console.log('sddddddddddddddddddddddddddddd', ordenes)
    }, [ordenes])

    useEffect(() => {
        obtener_catalogo()
        obtener_ordenes()
    }, [])
    
    const handleAñadir = async (e, id, nombre, costo, cantidad, variante) => {
        e.preventDefault()
        let pedido = {
            id,
            nombre: variante.length > 0 ? nombre.concat(`, ${variante}`) : nombre,
            cantidad: Number(cantidad),
            variante,
            costo
        }
        setPedido1(pedido)
        console.log(pedido)
        let saldo_previo = Number(user_data.saldo)
        let user_data_previa = user_data
        let carrito_previo = carrito
        console.log(saldo_previo, typeof(saldo_previo))
        if((Number(saldo_previo) - (Number(costo) * Number(cantidad))) >= 0 ){
            setUser_data(prev => ({ ...prev, saldo: Number(saldo_previo - (Number(costo) * Number(cantidad)))}))
            const existe = carrito.items.some(item => item.nombre === pedido.nombre)
            if(!existe){
                setCarrito(prev => ({...prev, items:[...prev.items, pedido]}))
            }
            if(existe){
                setCarrito(prev => ({...prev, items: prev.items.map(item => 
                    item.nombre === pedido.nombre 
                        ? { ...item, cantidad: Number(item.cantidad) + Number(pedido.cantidad) }
                        : item
                )}))
            }
            setDetail(false)
            let response = await fetch('/api/carrito',{
                method:'POST',
                body: JSON.stringify({pedido, token})
            })
            if(response.ok){
                obtener_catalogo()
                setDetail(null)
                setCantidad(0)
            }
            if(!response.ok){
                alert('hubo algun error')
                obtener_catalogo()
                setDetail(null)
                setCantidad(0)
                setUser_data(user_data_previa)
                setCarrito(carrito_previo)
            }
        }
        if((Number(saldo_previo) - (Number(costo) * Number(cantidad))) < 0 ){
            alert('No tienes saldo suficiente')
        }
    }
    useEffect(() => {
        console.log('DEtaliii', detail)
    }, [detail])

    const handlefin = async (e) => {
        setConset(true)
        setOpenchart(false)
    }

    const finalizar = async (e) => {
        if(carrito.items.length > 0){
            setLoading(true)
            let response = await fetch('/api/ordenar',{
                method:'POST',
                body: JSON.stringify({carrito , token ,user_data})
            })
            if(response.ok){
                setLoading(false)
                setCarrito({items: []})
                setOpenchart(false)
                setConset(false)
                router.push('/gracias')
            }
            if(!response.ok){
                setLoading(false)
                setCarrito({items: []})
                alert('Error al procesar')
                setOpenchart(false)
                setConset(false)
                router.push('/gracias')
            }
        }
    }

    const delete_ = async (e, index) => {
        if(carrito.items.length > 0){
            console.log(index)
            let orden = carrito.items[index]
            let saldo_previo = Number(user_data.saldo)
            setUser_data(prev => ({ ...prev, saldo: Number(saldo_previo + (Number(orden.costo) * Number(orden.cantidad)))}))
            let copia = [...carrito.items];
            copia.splice(index, 1)
            setCarrito({items: copia})
            let response = await fetch('/api/eliminar_chart',{
                method:'POST',
                body: JSON.stringify({token , orden})
            })
            if(response.ok){
                obtener_catalogo()
            }
            if(!response.ok){
                alert('hubo un error')
            }
        }
    }

    useEffect(()=> {
        console.log(user_data)
    },[user_data])
    
    useEffect(() => {
        console.log(carrito)
    },[carrito])

    useEffect(() => {
        if(categorias != 'todas'){
            const objetosFiltrados = productos.filter(objeto => {
                return (
                    objeto.categorias.toLowerCase().includes(categorias.toLowerCase())
                )
            })
            setProductos([...objetosFiltrados])
        }
        if(categorias == 'todas'){
            obtener_catalogo()
        }
    }, [categorias])

    useEffect(() => {
        console.log(productos)
        if(busqueda.length == 0){
            obtener_catalogo()
        }
        if(busqueda.length > 0){
        const objetosFiltrados = productos.filter(objeto => {
            return (
                objeto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                objeto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
            )
        })
        setProductos([...objetosFiltrados])
        }
    }, [busqueda])

    const handleBeforeUnload = async () => {
        const queryString = carrito.items.map(item => `items[]=${encodeURIComponent(item)}`).join('&')
        fetch(`/api/restore?${queryString}`)
    }

    useEffect(() => {
        carritoRef.current = carrito;
      }, [carrito])

    useEffect(() => {
        // Datos a enviar al servidor
        const sendDataOnUnload = () => {
            let data = {
                carrito: carritoRef.current
            }
            if(data.carrito.items.length > 0){
                          // URL a la que enviamos los datos

                    const endpoint = "/api/restore"; // Define tu endpoint en Next.js
                
                    // Crear un Blob con los datos
                    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
                
                    // Enviar los datos con sendBeacon
                    navigator.sendBeacon(endpoint, blob);
            }
        }
    
        // Asociar el evento `unload`
        window.addEventListener("unload", sendDataOnUnload)

        // Cleanup para evitar fugas de memoria
        return () => {
          window.removeEventListener("unload", sendDataOnUnload)
        }
      }, [])

    useEffect(() => {
        obtener_ordenes()
      }, [openOr])
            
      const generatePDF = (e, id, detalles) => {
                e.preventDefault();
                const doc = new jsPDF();
            
                // Reemplazar comas por saltos de línea
                const articulosConSaltos = detalles.articulos.replace(/,/g, '\n');
            
                doc.text(`
                    Orden: ${id}
                    Detalles: 
                    ${articulosConSaltos}
                `, 10, 10);
            
                doc.save(`${id}.pdf`);
            };

            const fui = (e) => {
                if(e){
                    return e.tofixed(2)
                }
            }

    return(
        <>
        <nav>
            <div>
            <Image src={`/logo_tienda3.png`} className="logo" width={80} height={80} alt={'logo'}/>
            </div>
            <div>
                <input onChange={(e) => {setBusqueda(e.target.value)}} placeholder="¿Que estás buscando?"/>
                <select onChange={(e) => {setCategorias(e.target.value)}}>
                    <option value={'todas'}>todas</option>
                    <option value={'temperas'}>temperas</option>
                    <option value={'sacapuntas'}>sacapuntas</option>
                    <option value={'plastilina'}>plastilina</option>
                    <option value={'pincel'}>pincel</option>
                    <option value={'plastilina'}>plastilina</option>
                    <option value={'papel glace'}>papel glace</option>
                    <option value={'plastilina'}>plastilina</option>
                    <option value={'lapices'}>lapices</option>
                    <option value={'pinturita'}>pinturita</option>
                    <option value={'goma'}>goma</option>
                    <option value={'cuadernos'}>cuadernos</option>
                    <option value={'block'}>block</option>
                    <option value={'repuestos'}>repuestos</option>
                    <option value={'carpeta'}>categorias</option>
                    <option value={'folios'}>folios</option>
                    <option value={'corrector'}>corrector</option>
                    <option value={'marcadores'}>marcadores</option>
                    <option value={'resaltadores'}>resaltadores</option>

                </select>
            </div>
            <div>
            <div style={{backgroundColor:"rgb(248, 248, 0)", color:"black", borderRadius:"10px"}}>
                Puntos restantes: { user_data.sado ? user_data.saldo.toFixed(2): 0}
            </div>
            {
                ordenes && <button onClick={(e) => {setOpenOr(true)}} className="open-btn1">Ver ordenes</button>
            }
            </div>
            <div>
                <button className="cart-button" onClick={(e) => setOpenchart(true)}>
                <FontAwesomeIcon icon={faShoppingCart} />
                    Ir al carrito
                </button>
            </div>
        </nav>
        {
            consent && <div className="popup">
                <h6>¿Estas seguro de finalizar?</h6>
                <p>Las compras son únicas, es decir que una vez finalices tu compra no podrás hacer otra.
                Los puntos restantes se eliminarán de tu cuenta
                </p>
                <p>Te quedan: {user_data.saldo} puntos restantes</p>
                <button onClick={(e) => {finalizar()}} className="open-btn">Finalizar</button>
                <button className="close-btn">Cancelar</button>
            </div>
        }
        {
            !detail && <div className="grid_container">
                {
                productos.length > 0 ? productos.map((el, index) => {
                    let path = el.imagenes
                    //let path1 = path.split("public\\")
                    if(el.stock > 0){
                        return(
                            <div key={index} className="card" onClick={(e) => {setDetail(productos[index])}}>
                                <Image className="card-image"  src={`/${path}`} width={80} height={80} alt={el.nombre}/>
                                <div style={{ maxHeight: "100%", padding:"5%", backgroundColor:"rgb(248, 248, 0)", display:"grid", gridTemplateColumns:"1fr", gap:"3%"}}>
                                <h4>{el.nombre}</h4>
                                <p>{el.descripcion}</p>
                                <h5>{el.costo}</h5>
                                <p className="sub">Quedan: {el.stock}</p>
                                </div>
                            </div>
                        )
                    }
                }) : <h4>No hay productos para mostrar</h4>
                }</div>
        }
        {
            openOr && <div className="popup2">
                <div>
                <button className="close-btn1" onClick={(e) => {setOpenOr(false)}}>Cerrar</button>
                <h6>Tus ordenes</h6>
                </div>
                <div>
                    {
                        ordenes.ordenes.map((el, index) => {
                            return(
                            <div style={{marginBottom:"5%"}} key={index}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <td>Id</td>
                                            <td>Detalle</td>
                                            <td>Saldo actual</td>
                                            <td>Estado</td>
                                            <td>Acciones</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{el.orden_id}</td>
                                            <td>{el.articulos}</td>
                                            <td>{fui(el.saldo)}</td>
                                            <td>{el.estado}</td>
                                            <td><button className="open-btn1" onClick={(e) => {generatePDF(e, el.orden_id, el)}}>Descargar</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>)
                        })
                    }
                </div>
            </div>
        }
        {
            detail && <div className="popup">
            <h3 style={{marginBottom:"2%"}}>{detail.nombre}</h3>
            <Image src={`/${detail.imagenes}`} width={200} height={200} alt={detail.nombre}/><br/>
            <p style={{marginTop:"2%"}}>{detail.descripcion}</p>
            <p style={{marginTop:"2%"}}>{detail.costo} puntos</p>
            {
                calc_max(detail.costo) <= 0 ? <p style={{marginTop:"2%"}}>No tienes saldo suficiente</p> : <div style={{marginTop:"4%"}}>
                <label htmlFor="costo">Cantidad</label>
                <input id="costo" placeholder="cantidad" min={0} max={calc_max(detail.costo) < detail.stock ? calc_max(detail.costo) : detail.stock} value={cantidad} type="number" onChange={(e) => setCantidad(e.target.value)}/><br/>
                {detail.variantes.length > 0 && <>
                <label>Variantes</label>
                <select onChange={(e) => setVariante(e.target.value)} id="variantes">
                    {
                        detail.variantes.split(',').map((el,index) => {
                            return(
                                <option key={index} value={el}>{el}</option>
                            )
                        })
                    }
                </select>
                </>}
                {cantidad > 0 && <button className="open-btn" onClick={(e) => {handleAñadir(e, detail.id, detail.nombre, detail.costo, cantidad, variante)}}>Añadir al carrito</button>}
                </div>
            }
            <button className="close-btn" onClick={(e) => {setDetail(null); setCantidad(0)}}>cerrar</button>
            </div>
        }
        {
            openChart && 
            <div className="chart" style={{maxHeight: '90vh', overflowY: 'auto'}}>
                <div>
                <div>
                <h3>Tu carrito</h3>
                <h6>Revisa y modifica los productos que seleccionaste</h6>
                </div>
                <div>
                <table className="table">
                    <thead>
                        <tr>
                            <td>Item</td>
                            <td>Cantidad</td>
                            <td>Costo total</td>
                            <td>Acciones</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            carrito.items.map((el, index) => {
                                return(
                                    <tr key={index}>
                                        <td>{el.nombre}</td>
                                        <td>{el.cantidad}</td>
                                        <td>{el.cantidad * el.costo}</td>
                                        <td><button className="close-btn" onClick={(e) => {delete_(e, index)}}>Eliminar</button></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                </div>
                <div>
                <button className="close-btn" onClick={(e) => {setOpenchart(false)}}>Cerrar</button>
                <button className="open-btn" onClick={(e) => {handlefin(e)}}>Finalizar</button>
                </div>
                </div>
            </div>
        }
        </>
    )
}

