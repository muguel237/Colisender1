import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTruck, FaBars, FaTimes, FaUserCircle,
  FaSignOutAlt, FaPlusCircle, FaInbox,
  FaMapMarkedAlt, FaQrcode
} from "react-icons/fa";

export default function UserHeader({ setPage }) {
  const [isOpen, setIsOpen]       = useState(false);
  const [activePage, setActivePage] = useState("home");
  const navigate = useNavigate();

  const handleNavigation = (page) => {
    setActivePage(page);
    setPage(page);
    setIsOpen(false);
  };

  // Déconnexion : supprime les données locales et redirige vers le login
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getBtnClass = (page) =>
    `btn btn-sm rounded-pill px-3 fw-semibold d-flex align-items-center gap-2 ${
      activePage === page ? "btn-primary" : "btn-outline-primary"
    }`;

  return (
    <header className="bg-white shadow-sm sticky-top">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center py-2">

          {/* Logo — clic ramène à l'accueil */}
          <h2
            className="text-primary fw-bold m-0 fs-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleNavigation("home")}
          >
            Colisender
          </h2>

          {/* Burger mobile */}
          <button
            className="navbar-toggler d-md-none border-0 p-2 text-secondary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>

          {/* Navigation */}
          <div className={`
            d-md-flex gap-2 align-items-center
            ${isOpen
              ? "d-flex flex-column position-absolute top-100 start-0 w-100 bg-white p-3 border-top shadow-sm z-3"
              : "d-none"}
          `}>

            <button className={getBtnClass("envoyer")} onClick={() => handleNavigation("envoyer")}>
              <FaPlusCircle size={14} /> Envoyer
            </button>

            <button className={getBtnClass("recevoir")} onClick={() => handleNavigation("recevoir")}>
              <FaInbox size={14} /> Recevoir
            </button>

            <button className={getBtnClass("trajets")} onClick={() => handleNavigation("trajets")}>
              <FaTruck size={14} /> Mes trajets
            </button>

            <button className={getBtnClass("suivi")} onClick={() => handleNavigation("suivi")}>
              <FaMapMarkedAlt size={14} /> Suivi
            </button>

            <button className={getBtnClass("scanner")} onClick={() => handleNavigation("scanner")}>
              <FaQrcode size={14} /> Scanner QR
            </button>

            <div className="vr mx-2 d-none d-md-block text-secondary"></div>

            {/* ── Bouton Profil — maintenant fonctionnel ── */}
            <button
              className={getBtnClass("profil")}
              onClick={() => handleNavigation("profil")}
              title="Mon profil"
            >
              <FaUserCircle size={16} /> Profil
            </button>

            {/* ── Bouton Déconnexion ── */}
            <button
              className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-semibold d-flex align-items-center gap-2"
              onClick={handleLogout}
              title="Se déconnecter"
            >
              <FaSignOutAlt /> <span className="d-md-none">Déconnexion</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}