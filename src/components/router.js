import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const CustomRouter = ({component:Component, ...rest}) =>{
    return(
        <Route {...rest} render={
            (props) =>{
                if(!props.user){
                    return <Component {...props}/>
                } else {
                    return <Redirect to={
                        {
                            pathname:"/",
                            state:{
                                from: props.location
                            }
                        }
                    } />
                }
            }
        }/>
    )
}

export default CustomRouter