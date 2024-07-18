import {configureStore,applyMiddleware} from '@reduxjs/toolkit'
import storageSession from 'redux-persist/lib/storage/session';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import * as thunkMiddleware  from 'redux-thunk';
import userReducer from './userSlice';
import visiblityReducer from './visiblitySlice';
import tweetReducer from './tweetSlice';

const rootReducer = combineReducers({ 
    user:userReducer,
    visiblity:visiblityReducer,
    tweet:tweetReducer,
})

const persistConfig = {
    key: 'root',
    storage: storageSession,
    // storage,
    whitelist: ['user'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware( {serializableCheck: false}).concat(),
},
applyMiddleware(thunkMiddleware)
)

export const persistor = persistStore(store)