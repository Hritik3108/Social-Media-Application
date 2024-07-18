import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {Provider} from 'react-redux'
import { persistor, store } from './util/appStore.js';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App.jsx'
import Error from './components/error'
import Home from './components/home/index.jsx';
import Auth from './components/auth/index.jsx';
import ViewProfile from './components/viewProfile/index.jsx';
import ViewTweet from './components/viewTweet/index.jsx';

const appRouter = createBrowserRouter([
  {
      path: "/",
      element: <App/>,
      errorElement: <Error/>,
      children: [
          {
              path: "/",
              element: <Home/>
          },
          {
            path: "/login",
            element: <Auth/>
          },
          {
            path: "/viewProfile",
            element: <ViewProfile/>
          },
          {
            path: "/viewTweet",
            element: <ViewTweet/>
          },
          
      ]
  }, 
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <RouterProvider router={appRouter} />
    </PersistGate>
    </Provider>
  </React.StrictMode>,
)
