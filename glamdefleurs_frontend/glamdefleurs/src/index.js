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
import PaymentSuccess from './components/Pages/Checkout/PaymentSuccess';
import CheckoutPayment from './components/Pages/Checkout/subcomponents/CheckoutPayment';
import CheckoutDelivery from './components/Pages/Checkout/subcomponents/CheckoutDelivery';
import CheckoutDetails from './components/Pages/Checkout/subcomponents/CheckoutDetails';

import { CartContextProvider } from './context/CartContext';
import Loading from './components/global/Loading';
import Profile from './components/Pages/Profile/Profile';
import Account from './components/Pages/Profile/subcomponents/Account';
import Address from './components/Pages/Profile/subcomponents/Address';
import Purchases from './components/Pages/Profile/subcomponents/Purchases';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { CLIENT_ID } from './Config/Config';
import Checkout from './components/Pages/Checkout/Checkout';





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
        element: <Checkout />,
        children: [
          {
            path: "delivery/",
            element: <CheckoutDelivery />
          },
          {
            path: "details/",
            element: <CheckoutDetails />
          },
          {
            path: "payment/",
            element: <CheckoutPayment />
          },
        ]
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
          },
          {
            path: "address/",
            element: <Address />,
          },
          {
            path: "purchases/",
            element: <Purchases />,
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
