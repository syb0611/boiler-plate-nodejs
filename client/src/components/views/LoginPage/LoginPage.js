import React, {useState} from 'react';
import Axios from 'axios';
import {useDispatch} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {loginUser} from '../../../_actions/user_action';

function LoginPage(props) {
    const dispatch = useDispatch();

    //State
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    //Handler
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    };
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    };
    const onSubmitHandler = (event) => {
        event.preventDefault();

        let body = {
            email: Email,
            password: Password
        };

        //redux action
        dispatch(loginUser(body))
            .then(response => {
                if(response.payload.loginSuccess) {
                    props.history.push('/'); //랜딩페이지로 이동
                } else {
                    alert('Error');
                }
            })
    };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <form style={{display: 'flex', flexDirection: 'column'}}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default withRouter(LoginPage);