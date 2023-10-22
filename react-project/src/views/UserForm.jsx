import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import axiosClient from '../axios-client'
import { useStateContext } from '../contexts/ContextProvider'

const UserForm = () => {

    const { id } = useParams()
    const navigate = useNavigate();

    const [errors, setErrors] = useState(null)

    const { setNotification } = useStateContext()

    const [loading, setLoading] = useState(false)

    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: "",
        password_confirmation: ""
    })

    if (id) {
        useEffect(
            () => {
                setLoading(true)
                axiosClient.get(`/users/${id}`)
                    .then(({ data }) => {
                        console.log('user', data);
                        setLoading(false)
                        setUser(data)
                    }).catch(() => {
                        setLoading(false)
                    });
            }
            , []
        )
    }

    const onSubmit = (ev) => {
        ev.preventDefault();
        if (user.id) {
            axiosClient.put(`/users/${user.id}`, user)
                .then(
                    () => {
                        //Notification
                        setNotification("User was Successfully Updated")
                        navigate('/users')
                    }
                )
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }

                })
        }else {
            axiosClient.post(`/users`, user)
            .then(
                () => {
                    //Notification
                    setNotification("User was Successfully Created")

                    navigate('/users')
                }
            )
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors)
                }

            })
        }
    }
    return (
        <div>
            {
                user.id && <h1>Update User : <i> {user.name} </i></h1>
            }
            {
                !user.id && <h1>New User</h1>
            }
            <div className="card animated fadeInDown">
                {
                    loading &&
                    (
                        <div className="text-center">
                            Loading...
                        </div>
                    )
                }
                {
                    errors &&
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p  key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                }

                { !loading &&

                    (<form  onSubmit={onSubmit}>
                        <input value={user.name} type="text" onChange={ev => setUser({ ...user, name: ev.target.value })} placeholder='Name' />
                        <input value={user.email} type="email" onChange={ev => setUser({ ...user, email: ev.target.value })} placeholder='Email' />
                        <input onChange={ev => setUser({ ...user, password: ev.target.value })} type="password" placeholder='Password' />
                        <input onChange={ev => setUser({ ...user, password_confirmation: ev.target.value })} type="password" placeholder='Pasword Confirmation' />

                        <button className='btn'>
                            Save
                        </button>
                    </form>)
                }

            </div>

        </div>
    )
}

export default UserForm