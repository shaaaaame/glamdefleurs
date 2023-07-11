import React, { Children } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'react-toastify/dist/ReactToastify.min.css';
import reportWebVitals from './reportWebVitals';

import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";
import { QueryClient, QueryClientProvider, useIsFetching } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';

import Home from './components/Pages/Home/Home';
import About from './components/Pages/About/About';
import ErrorPage from './components/global/ErrorPage';
import Flowers from './components/Pages/Flowers/Flowers';
import Login from './components/Pages/Login/Login';
import Contact from './components/Pages/Contact/Contact';
import Cart from './components/Pages/Cart/Cart';
import FlowerPage from './components/Pages/Flowers/FlowerPage';

import { CartContextProvider } from './context/CartContext';
import Loading from './components/global/Loading';


const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "about/",
    element: <About />,
  },
  {
    path: "flowers/:id",
    element: <FlowerPage />,
  },
  {
    path: "categories/:type/:id?",
    element: <Flowers />,
  },
  {
    path: "login/",
    element: <Login />,
  },
  {
    path: "contact/",
    element: <Contact />,
  },
  {
    path: "cart/",
    element: <Cart />
  }
]);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CartContextProvider>
        <Loading />
        <ToastContainer />
        <RouterProvider router={router}/>
      </CartContextProvider>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
