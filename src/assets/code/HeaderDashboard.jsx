import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBullhorn, FaSignInAlt, FaUserPlus, FaBars, FaTimes } from "react-icons/fa";
import "../style/HeaderDashboard.css"
export default function HeaderDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <header className="bg-white shadow-sm sticky-top">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center py-2">
          
          <h2 
            
          >
            Colisender
          </h2>

          <button 
            className="navbar-toggler d-md-none border-0 p-2 text-secondary" 
            type="button" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
          
          <div 
            className={`
              d-md-flex gap-2 align-items-center
              ${isOpen ? "d-flex flex-column position-absolute top-100 start-0 w-100 bg-white p-3 border-top shadow-sm z-3" : "d-none"}
            `}
          >
            <button
              className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold d-flex align-items-center justify-content-center gap-2 w-100 w-md-auto"
            >
              <FaBullhorn size={13} />
              <span>Voir les annonces</span>
            </button>

            <button
              onClick={() => handleNavigation("/login")}
              className="btn btn-sm btn-light text-secondary rounded-pill px-3 fw-semibold d-flex align-items-center justify-content-center gap-2 w-100 w-md-auto"
            >
              <FaSignInAlt size={13} />
              <span>Se connecter</span>
            </button>
            
            <button
              onClick={() => handleNavigation("/Inscription")}
              className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold d-flex align-items-center justify-content-center gap-2 w-100 w-md-auto shadow-sm"
            >
              <FaUserPlus size={13} />
              <span>Créer un compte</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}