import React, {useEffect} from 'react';
import Axios from 'axios';
import {useDispatch} from 'react-redux';
import {authUser} from '../_actions/user_action';

export default function(SpecificComponent, option, adminRoute = null) {

    //option 
    //  null: 아무나 출입이 가능한 페이지
    //  true: 로그인한 유저만 출입이 가능한 페이지
    //  false: 로인한 유저는 출입 불가능한 페이지

    function AuthenticationCheck(props) {

        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(authUser()).then(response => {
                //console.log(response);

                //로그아웃 상태
                if(!response.payload.isAuth) {

                    //로그인한 유저만 접근 가능한 페이지에 접속하는 경우
                    if(option) {
                        props.history.push('/login');
                    }
                } else {
                    //로그인 상태

                    //admin 아닌데 admin페이지 접속하는 경우
                    if(adminRoute && !response.paylooad.isAdmin) {
                        props.history.push('/');
                    } else {
                        //로그인한 유저가 접근 불가능한 페이지에 접속하는 경우
                        if(option === false) {
                            props.history.push('/');
                        }
                    }
                }

            });
        }, []);

        return (
            <SpecificComponent />
        );
    }

    return AuthenticationCheck;
}