import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            AutoParts Seller Dashboard
          </h1>
          <p className="text-gray-600 mt-3">
            Seller web app setup successful.
          </p>
        </div>
      </div>
    </>
  )
}

export default App
