import React, { useEffect } from 'react'
import { Navigate, Outlet, Link } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import axiosClient from '../axios-client';

const DefaultLayout = () => {

  const { user, token, SetUser, setToken  , notification} = useStateContext();

  if (!token) {
    return <Navigate to='/login' />;
  }

  const onLogout = (ev) => {
    ev.preventDefault()

    axiosClient.post('/logout')
      .then(() => {
        SetUser({})
        setToken(null)
      })
  }

  useEffect(
    () => {
      axiosClient.get('/user')
        .then(({ data }) => {
          SetUser(data)
        }
        )
    }
  )

  return (
    <div id='defaultLayout'>
      <aside>
        <Link to={'/dashboard'} >Dashboard</Link>
        <Link to={'/users'} >Users</Link>
      </aside>
      <div className="content">
        <header>
          <div>
            Header
          </div>
          <div>
            {user.name}
            <a href="#" onClick={onLogout} className="btn-logout">Logout</a>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
        {notification && 
        <div className="notification">
          {notification}
        </div>
        }
    </div>
  )
}

export default DefaultLayout