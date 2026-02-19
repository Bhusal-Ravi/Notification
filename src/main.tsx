import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './components/index.css'
import App from './components/App.tsx'
import Home from './components/Home.tsx'
import Layout from './components/Layout.tsx'
import Welcome from './components/Welcome.tsx';

import ErrorFallback from './components/ErrorFallBack.tsx';
import Pagenotfound from './components/ui/Pagenotfound.tsx';
import Sessionverify from './components/Sessionverify.tsx';
import Telegramverify from './components/Telegramverify.tsx';




const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement:<ErrorFallback/>,
    children: [
      { index: true, element: <Home /> },
      { path: 'main', element:<Welcome><App /></Welcome> },
      { path: 'welcome', element: <Welcome><App /></Welcome> },
       {path:'telegramverify',element:<Sessionverify><Telegramverify/></Sessionverify>},
    ],
  },
  {path:'*',
  element:<Pagenotfound/>
  },
 
 

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <RouterProvider router={router}/>
   
  
  </StrictMode> 
)


