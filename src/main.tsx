import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './components/index.css'
import App from './components/App.tsx'
import Home from './components/Home.tsx'
import Layout from './components/Layout.tsx'
import Login from './components/Login.tsx';
import Welcome from './components/Welcome.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'main', element: <Welcome><App /></Welcome> },
    ],
  },
  // {
  //   path:'/welcome',
  //   element:<Welcome/>
  // }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
