import { useState } from "react";
import "../style/login.css";

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    mot_de_passe: "",
    rememberMe: false,
  });
const API_BASE_URL = "http://localhost:8080/api/auth";
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData({
      ...loginData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {//envoie du mot de passe et de l'email a dival
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          mot_de_passe: loginData.mot_de_passe, 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        
        alert("Connexion réussie !");
        
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Identifiants incorrects ou problème de compte.");
      }
    } catch (error) {
      console.error("Erreur réseau lors de la connexion :", error);
      alert("verifier votre connexion internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-light-cocolis min-vh-100 d-flex flex-column align-items-center justify-content-center p-3">
      <div className="w-100 style-login-card" style={{ maxWidth: "480px" }}>
    
        <div className="text-center mb-4">
          <h2 className="fw-extrabold text-dark tracking-tight mb-2 fs-3">
            Ravi de vous revoir sur <span className="text-primary-cocolis">Colisender</span>
          </h2>
          <p className="text-muted small">
            Connectez-vous pour gérer vos colis.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="text-start">
          <div className="d-flex flex-column gap-4">
            <div>
              <label className="form-label text-dark small fw-bold mb-2">Adresse email</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                className="form-control rounded-3 cocolis-input-field"
                placeholder="Ex: kamdem@gmail.com"
                required
              />
            </div>
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label text-dark small fw-bold mb-0">Mot de passe</label>
              </div>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="mot_de_passe"
                  value={loginData.mot_de_passe}
                  onChange={handleChange}
                  className="form-control rounded-start-3 cocolis-input-field border-end-0"
                  placeholder="Entrez votre mot de passe"
                  required
                />
                
                <button
                  type="button"
                  className="input-group-text bg-transparent text-muted border-start-0 eye-btn-login"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
            
                <a href="/Forgot" className="text-primary-cocolis small fw-bold text-decoration-none text-link-hover">
                  Mot de passe oublié ?
                </a>
              </div>
            <div className="form-check d-flex align-items-center gap-2 my-1">
              <input
                type="checkbox"
                name="rememberMe"
                id="rememberMe"
                checked={loginData.rememberMe}
                onChange={handleChange}
                className="form-check-input cocolis-login-checkbox"
              />
              <label htmlFor="rememberMe" className="form-check-label text-muted small user-select-none">
                Se souvenir de moi
              </label>
            </div>

            <div>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="btn btn-primary-cocolis w-100 rounded-pill py-2-5 fw-bold fs-6 shadow-sm"
              >
                {isSubmitting ? "Connexion en cours..." : "Se connecter"}
              </button>
            </div>

          </div>
        </form>

        <div className="text-center mt-5 pt-3 border-top border-light">
          <p className="text-muted small mb-0">
            Nouveau sur Colisender ?{" "}
            <a href="/Inscription" className="text-primary-cocolis fw-bold text-decoration-none text-link-hover">
              Créez un compte
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}