import React, {useEffect, useState} from 'react';
import  Portfolio from '../src/portfolio/Portfolio.jsx';
import { useDispatch } from 'react-redux';
import AuthService from './AppWritre/auth.js';


function App(props) {

   const [loading , setLoading] = useState(true)
    const dispatch = useDispatch();
  
    useEffect(() => {
        const user = AuthService.getCurrentUser()
        if (user) {
            // dispatch({ ', payload: user });
        }
        else{
            // dispatch({ type: 'LOGOUT' });
        }
        setLoading(false);

    }, []);

  if (loading) {
        return <div>Loading...</div>;
    }


    return (
        <>
        <h1>Hellp</h1>
      {/* <Portfolio/>  */}
        </>
    );
}

export default App;