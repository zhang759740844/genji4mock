import React from 'react'
import MainPage from './pages/mainpage'
import Login from './pages/login'
import { BrowserRouter, Route } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'

function App () {
  return (
    <div>
      <BrowserRouter>
        <Route exact path='/' render={() => <MainPage />} />
        <Route exact path='/login' render={() => <Login />} />
        <Route exact path='/detail' render={() => <div>hahah</div>} />
      </BrowserRouter>
    </div>
  )
}

export default function () {
  return (
    <CookiesProvider>
      {App()}
    </CookiesProvider>
  )
}
