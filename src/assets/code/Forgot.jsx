import { useState } from "react";
import "../style/login.css"; 

export default function Forgot() {
  // Étape 1 = Saisir Email, Étape 2 = Saisir OTP, Étape 3 = Nouveau Mot de passe
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validatePasswordStrength = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
const API_BASE_URL = "http://localhost:8080/api/auth"; 
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password/request`, {//dival va envoyer l'otp par emeil et l'utilisateur doit l'entrer
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert("Un code de réinitialisation a été envoyé à votre adresse email.");
        setStep(2); 
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Cet email n'existe pas dans notre système.");
      }
    } catch (error) {
      alert("Erreur réseau. Impossible de joindre le serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password/verify`, {//dival envoie la reponse de verfication si l'otp est correct ou pas
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      });

      if (response.ok) {
        setStep(3);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Code OTP incorrect ou expiré.");
      }
    } catch (error) {
      alert("Erreur lors de la validation du code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    // Vérification de la force du mot de passe
    if (!validatePasswordStrength(newPassword)) {
      alert(
        "Le mot de passe est trop faible. Il doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@, $, !, %, *, ?, &)."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password/reset`, {//j'envoie le nouveau mot de passe a dival il va faire un update 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          code: otp, 
          nouveau_mot_de_passe: newPassword 
        }),
      });

      if (response.ok) {
        alert("Votre mot de passe a été modifié avec succès ! Vous pouvez vous connecter.");
        window.location.href = "/login"; 
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Une erreur est survenue.");
      }
    } catch (error) {
      alert("Erreur réseau lors de la réinitialisation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-light-cocolis min-vh-100 d-flex flex-column align-items-center justify-content-center p-3">
      <div className="w-100 style-login-card" style={{ maxWidth: "480px" }}>
        
        <div className="text-center mb-4">
          <h2 className="fw-extrabold text-dark tracking-tight mb-2 fs-3">
            Mot de passe oublié
          </h2>
          <div className="badge bg-light text-muted rounded-pill mb-3">
            Étape {step} sur 3
          </div>
        </div>
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="text-start">
            <p className="text-muted small text-center mb-4">
              Saisissez votre adresse email. Nous vous enverrons un code OTP pour réinitialiser votre mot de passe.
            </p>
            <div className="mb-4">
              <label className="form-label text-dark small fw-bold mb-2">Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control rounded-3 cocolis-input-field"
                placeholder="Ex: kamdem@gmail.com"
                required
              />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary-cocolis w-100 rounded-pill py-2-5 fw-bold shadow-sm">
              {isSubmitting ? "Envoi du code..." : "Recevoir le code OTP"}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="text-start">
            <p className="text-muted small text-center mb-4">
              Un code de validation a été envoyé à <strong>{email}</strong>.
            </p>
            <div className="mb-4">
              <label className="form-label text-dark small fw-bold mb-2">Code de validation (OTP)</label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-control rounded-3 cocolis-input-field text-center tracking-widest fs-4 fw-bold"
                placeholder="000000"
                required
              />
            </div>
            <div className="d-flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn btn-outline-secondary rounded-pill px-4 py-2-5 fw-bold">
                Retour
              </button>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary-cocolis flex-grow-1 rounded-pill py-2-5 fw-bold shadow-sm">
                {isSubmitting ? "Vérification..." : "Vérifier le code"}
              </button>
            </div>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="text-start">
            <p className="text-muted small text-center mb-4">
              Votre identité a été vérifiée. Choisissez votre nouveau mot de passe sécurisé.
            </p>
            
            <div className="mb-3">
              <label className="form-label text-dark small fw-bold mb-2">Nouveau mot de passe</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control rounded-start-3 cocolis-input-field border-end-0"
                  placeholder="Minimum 8 caractères"
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
              <div className="form-text text-muted tiny-text mt-1">
                Doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-dark small fw-bold mb-2">Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control rounded-3 cocolis-input-field"
                placeholder="Répétez le mot de passe"
                required
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary-cocolis w-100 rounded-pill py-2-5 fw-bold shadow-sm">
              {isSubmitting ? "Mise à jour..." : "Enregistrer le mot de passe"}
            </button>
          </form>
        )}

        <div className="text-center mt-5 pt-3 border-top border-light">
          <a href="/login" className="text-primary-cocolis small fw-bold text-decoration-none text-link-hover">
            Retour à la page de connexion
          </a>
        </div>

      </div>
    </div>
  );
}