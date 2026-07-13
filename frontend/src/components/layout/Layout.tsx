import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import './layout.css'

// The overall page frame: Navbar on top, the current page in the middle
// (<Outlet /> is where react-router renders the matched route), footer at bottom.
// Every route renders inside this shell.
export function Layout() {
  return (
    <>
      <Navbar />
      <main className="page">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          TeachHub — a learning project for practicing NestJS &amp; React.
        </div>
      </footer>
    </>
  )
}
