import React, { Component, createContext, useEffect, useState } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import './scss/style.scss'
import { SOCKET_URL } from './app/config'
import { io } from 'socket.io-client'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

export const SocketContext = createContext(null)

const App = () => {
  const [socket, setSocket] = useState(null)
  useEffect(() => {
    const newSocket = io(SOCKET_URL)
    setSocket(newSocket)
    return () => newSocket.close()
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Connect socket')
        socket.emit('token', 'no-token')
      })
      socket.on('disconnect', (reason) => {
        console.log(reason)
      })
    }
  }, [socket])
  return (
    <HashRouter>
      <React.Suspense fallback={loading}>
        <SocketContext.Provider value={socket}>
          <Switch>
            <Route exact path="/login" name="Login Page" render={(props) => <Login {...props} />} />
            <Route
              exact
              path="/register"
              name="Register Page"
              render={(props) => <Register {...props} />}
            />
            <Route exact path="/404" name="Page 404" render={(props) => <Page404 {...props} />} />
            <Route exact path="/500" name="Page 500" render={(props) => <Page500 {...props} />} />
            <Route path="/" name="Home" render={(props) => <DefaultLayout {...props} />} />
          </Switch>
        </SocketContext.Provider>
      </React.Suspense>
    </HashRouter>
  )
}

export default App
