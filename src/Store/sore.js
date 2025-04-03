// import  {configureStore} from "@reduxjs/toolkit";

// const store = configureStore({

//     reducer: {

//     },
// })

// export function useStore() {
//     return store
// }
// export default store;
import { createStore } from 'redux';
import rootReducer from '../reducers'; // Adjust the path to your reducers folder

// Create the Redux store
const store = createStore(rootReducer);

export default store; // Ensure the store is exported as default