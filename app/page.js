'use client'
import { useContext, useState, useEffect } from "react"
import { authContext } from "@/componentes/authProvider"
import { Router, useRouter } from "next/navigation"
import Loader from "@/componentes/loader"

export default function Home() {
  const [user, setUser] = useState()
  const [pass, setPass] = useState()
  const [message, setMessage] = useState(false)
  const [login, setLogin] = useState(false)
  const router = useRouter()
  const {
      isAutenticated,
      setUser_loged,
      setUser_data,
      setToken,
      setIsAutenticated} = useContext(authContext)

  useEffect(() => {
      if(isAutenticated){
        router.push('/catalogo')
      }  
    },[])

    const Login = async (e) => {
      setLogin(true)
      e.preventDefault()
      try {
        let response = await fetch('/api/login',{
          method:'POST',
          body: JSON.stringify({
            user,
            pass
          })
        })
        if(response.ok){
          let data = await response.json()
          console.log(data)
          setToken(data.token)
          setUser_loged(data.match.usuario)
          setUser_data(data.match)
          setIsAutenticated(true)
          router.push('/catalogo')
        }
        if(!response.ok){
          let data = await response.json()
          setLogin(false)
          setMessage(data.message)
        }
      } catch (error) {
        setLogin(false)
        setMessage(`${error}`)
      }finally{
        setLogin(false)
      }
    }

  return (
          <main>
            <div className="popup">  
              <div>
                <label htmlFor="usu">Usuario</label><br/><br/>
                <input id="usu" onChange={(e) => {setUser(e.target.value)}} placeholder="Usuario" type="text"/></div>
              <div><br/>
                <label htmlFor="pass">Contraseña</label><br/><br/>
                <input id="pass" onChange={(e) => {setPass(e.target.value)}} placeholder="Contraseña" type="password"/></div>
              <button className="open-btn" onClick={(e) => Login(e)}>Ingresar</button>
              {login && <Loader/>}
              {
                message && <div><p>{message}</p><button className="close-btn" onClick={(e) => setMessage(false)}>x</button></div>
              }
            </div>
          </main>
  )
}
