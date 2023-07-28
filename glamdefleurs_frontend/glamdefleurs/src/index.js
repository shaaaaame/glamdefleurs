import React, { Children } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'react-toastify/dist/ReactToastify.min.css';
import reportWebVitals from './reportWebVitals';

import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider, useIsFetching } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';

import Home from './components/Pages/Home/Home';
import Root from './components/global/Root';
import About from './components/Pages/About/About';
import ErrorPage from './components/global/ErrorPage';
import Flowers from './components/Pages/Flowers/Flowers';
import Login from './components/Pages/Login/Login';
import Contact from './components/Pages/Contact/Contact';
import Cart from './components/Pages/Cart/Cart';
import FlowerPage from './components/Pages/Flowers/FlowerPage';
import PaymentSuccess from './components/Pages/Checkout/Subpages/PaymentSuccess';


import { CartContextProvider } from './context/CartContext';
import Loading from './components/global/Loading';
import Profile from './components/Pages/Profile/Profile';
import Account from './components/Pages/Profile/subcomponents/Account';
import Address from './components/Pages/Profile/subcomponents/Address';
import Purchases from './components/Pages/Profile/subcomponents/Purchases';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { CLIENT_ID } from './Config/Config';
import Checkout from './components/Pages/Checkout/Checkout';
import Header from './components/global/Header';




const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();
const router = createHashRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />
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
        path: "categories/",
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
      },
      {
        path: "checkout/",
        element: <Checkout />
      },
      {
        path: "payment_success/",
        element: <PaymentSuccess />
      },
      {
        path: "profile/",
        element: <Profile />,
        children: [
          {
            path: "account/",
            element: <Account />,
            loader: () => {
              const example_user = {
                first_name: "John",
                last_name: "Doe",
                email: "email@example.com",
                phone_number: "+10123456789",
                dob: "2013-01-29", //yyyy-mm-dd
                address: "321 Example St",
                orders: [
                    // TODO
                ]
              }
              
              return example_user
            }
          },
          {
            path: "address/",
            element: <Address />,
            loader: () => {
              const example_user = {
                first_name: "John",
                last_name: "Doe",
                email: "email@example.com",
                phone_number: "+10123456789",
                dob: "2013-01-29", //yyyy-mm-dd
                address: "321 Example St",
                orders: [
                    // TODO
                ]
              }

              return example_user
            }
          },
          {
            path: "purchases/",
            element: <Purchases />,
            loader: () => {
              const example_user = {
                first_name: "John",
                last_name: "Doe",
                email: "email@example.com",
                phone_number: "+10123456789",
                dob: "2013-01-29", //yyyy-mm-dd
                address: "321 Example St",
                orders: [
                    {
                      id: "123",
                      customer_id: "1",
                      date_created: "25/6/2023",
                      status: "COMPLETED",
                      transaction_id: "1321321312",
                      total: 320.00,
                      items: {
                        1: 1,
                        2: 1,
                        3: 1,
                      }
                    }
                ]
              }

              return example_user
            }
          }
        ]
      }
    ]
  },
  
]);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PayPalScriptProvider options={{
              clientId: CLIENT_ID,
              currency: "CAD",
              intent: "capture",
          }}>
        <CartContextProvider>
          <Loading />
          <ToastContainer />
          <RouterProvider router={router}/>
        </CartContextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </PayPalScriptProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
