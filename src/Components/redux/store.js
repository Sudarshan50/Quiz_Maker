import {createStore} from 'redux';

const initState = {
    user:null,
}

const reducer = (state,action) =>{
    if(action.type === 'login'){
        localStorage.setItem("JWT_PAYLOAD", action.token);
        localStorage.setItem("user",action.user._id);
        return {
            ...state,
            user:action.user
        }
    }else if(action.type === 'set__user'){
        return {
            ...state,
            user:action.user
        }
    }
    else{
        return state;
    }
}
const store = createStore(reducer);
export default store;