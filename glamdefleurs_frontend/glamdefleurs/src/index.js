import React, { Children } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Home from './components/Home/Home';
import About from './components/About/About';
import ErrorPage from './components/global/ErrorPage';
import Flowers from './components/Flowers/Flowers';
import Login from './components/Login/Login';
import Contact from './components/Contact/Contact';
import Cart from './components/Cart/Cart';
import { CartContextProvider } from './context/CartContext';
import { CategoryContextProvider } from './context/CategoryContext';

import FlowerPage from './components/Flowers/FlowerPage';
import { loader as flowerLoader } from './components/Flowers/FlowerPage';

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
    path: "categories/:type/:id",
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
        <CategoryContextProvider>
          <RouterProvider router={router}/>
        </CategoryContextProvider>
      </CartContextProvider>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
