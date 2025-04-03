import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import  Portfolio from '../src/portfolio/Portfolio.jsx';

createRoot(document.getElementById('root')).render(
    
   <Portfolio/>
    // <StrictMode>
    //     {/* eslint-disable-next-line react/jsx-no-undef */}
    //     <App></App>

    // </StrictMode>
)
