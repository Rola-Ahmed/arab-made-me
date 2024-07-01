import React from 'react'
import { Link } from 'react-router-dom';

export default function PageUtility(props) {

 let   {currentPage}=props
  return (

    <div className="page-utility  gap">
    <Link
      to="/"
      className="back-btn-dash cursor text-decoration-none text-muted"
      onClick={() => {
        localStorage.setItem("ToHomePage", "true");
      }}
    >
      Home
    </Link>
    <i class="fa-solid fa-chevron-right btn-back-icon"></i>
    <p className="back-btn-dash-2  text-muted">{currentPage}</p>
  </div>
  )
}
