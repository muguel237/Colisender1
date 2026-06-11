import { useState, useEffect, useRef } from "react";
import { FaLock, FaCamera, FaCheckCircle, FaTimesCircle, FaUserCircle } from "react-icons/fa";
import "../style/Profil.css";

const API_BASE = "http://localhost:8080/api";

export default function Profil() {
  // ── Récupère l'ID utilisateur stocké lors de la connexion ──────────────────
  // Le login.jsx fait navigate("/UserDashboard") mais ne stocke pas l'userId.
  // On l'attend dans localStorage sous la clé "userId"
  // (voir Étape 7 pour la modification de login.jsx)
  const userId = localStorage.getItem("userId");

  // ── États du composant ──────────────────────────────────────────────────────
  const [profil, setProfil]               = useState(null);       // données du profil
  const [loading, setLoading]             = useState(true);        // chargement initial
  const [numeroPrincipal, setNumeroPrincipal]   = useState("");
  const [numeroSecondaire, setNumeroSecondaire] = useState("");
  const [saving, setSaving]               = useState(false);       // sauvegarde numéros
  const [photoUploading, setPhotoUploading] = useState(false);     // upload photo
  const [alerteNumeros, setAlerteNumeros] = useState(null);        // { type: "success"|"error", message }
  const [alertePhoto, setAlertePhoto]     = useState(null);

  // Référence vers l'input file caché (déclenché par clic sur la photo)
  const fileInputRef = useRef(null);

  // ── Chargement du profil au montage du composant ───────────────────────────
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    chargerProfil();
  }, [userId]);

  // ── Disparition automatique des alertes après 4 secondes ──────────────────
  useEffect(() => {
    if (alerteNumeros) {
      const t = setTimeout(() => setAlerteNumeros(null), 4000);
      return () => clearTimeout(t);
    }
  }, [alerteNumeros]);

  useEffect(() => {
    if (alertePhoto) {
      const t = setTimeout(() => setAlertePhoto(null), 4000);
      return () => clearTimeout(t);
    }
  }, [alertePhoto]);

  // ── Fonction : charger le profil depuis l'API ──────────────────────────────
  const chargerProfil = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/profil/${userId}`);
      if (!res.ok) throw new Error("Profil introuvable");
      const data = await res.json();
      setProfil(data);
      setNumeroPrincipal(data.numeroPrincipal  || "");
      setNumeroSecondaire(data.numeroSecondaire || "");
    } catch (err) {
      console.error("Erreur chargement profil :", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Fonction : sauvegarder les numéros modifiés ───────────────────────────
  const sauvegarderNumeros = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlerteNumeros(null);

    try {
      const res = await fetch(`${API_BASE}/profil/${userId}/numeros`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeroPrincipal, numeroSecondaire }),
      });

      const data = await res.json();

      if (res.ok) {
        // Mettre à jour l'état local immédiatement sans recharger
        setProfil((prev) => ({
          ...prev,
          numeroPrincipal:  data.numeroPrincipal,
          numeroSecondaire: data.numeroSecondaire,
        }));
        setAlerteNumeros({ type: "success", message: "Numéros mis à jour avec succès !" });
      } else {
        setAlerteNumeros({ type: "error", message: data.message || "Erreur lors de la mise à jour." });
      }
    } catch {
      setAlerteNumeros({ type: "error", message: "Impossible de joindre le serveur." });
    } finally {
      setSaving(false);
    }
  };

  // ── Fonction : changer la photo de profil ─────────────────────────────────
  const changerPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérification côté client avant d'envoyer (économise un appel réseau inutile)
    const typesAcceptes = ["image/jpeg", "image/png", "image/webp"];
    if (!typesAcceptes.includes(file.type)) {
      setAlertePhoto({ type: "error", message: "Format non supporté. Utilisez JPG, PNG ou WEBP." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAlertePhoto({ type: "error", message: "Image trop lourde. Maximum 5 Mo." });
      return;
    }

    setPhotoUploading(true);
    setAlertePhoto(null);

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch(`${API_BASE}/profil/${userId}/photo`, {
        method: "POST",
        body: formData,
        // NE PAS mettre Content-Type ici : le navigateur le gère automatiquement
        // avec le bon boundary pour multipart/form-data
      });

      const data = await res.json();

      if (res.ok) {
        // Construire l'URL publique pour afficher la nouvelle photo
        const nouvelleUrl = `http://localhost:8080/uploads/${data.photoProfil}`;
        setProfil((prev) => ({ ...prev, photoProfil: nouvelleUrl }));
        setAlertePhoto({ type: "success", message: "Photo de profil mise à jour !" });
      } else {
        setAlertePhoto({ type: "error", message: data.message || "Erreur lors de l'upload." });
      }
    } catch {
      setAlertePhoto({ type: "error", message: "Impossible de joindre le serveur." });
    } finally {
      setPhotoUploading(false);
      // Réinitialiser l'input pour permettre de re-sélectionner le même fichier
      e.target.value = "";
    }
  };

  // ── URL de la photo à afficher ─────────────────────────────────────────────
  // Si photoProfil commence par "http" c'est déjà une URL complète
  // Sinon c'est un chemin de fichier serveur — on construit l'URL publique
  const getPhotoUrl = () => {
    if (!profil?.photoProfil || profil.photoProfil === "") return null;
    if (profil.photoProfil.startsWith("http")) return profil.photoProfil;
    // Extraire juste le nom du fichier depuis le chemin complet
    const parts = profil.photoProfil.replace(/\\/g, "/").split("/");
    const fileName = parts[parts.length - 1];
    return `http://localhost:8080/uploads/${fileName}`;
  };

  // ── Affichage si userId absent (pas connecté) ──────────────────────────────
  if (!userId) {
    return (
      <div className="profil-page">
        <div className="profil-card text-center">
          <FaUserCircle size={60} color="#cbd5e1" />
          <h4 className="mt-3 fw-bold text-dark">Non connecté</h4>
          <p className="text-muted small">
            Vous devez être connecté pour accéder à votre profil.
          </p>
          <a href="/login" className="btn btn-primary-cocolis rounded-pill px-4 py-2 fw-bold">
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  // ── Affichage pendant le chargement ───────────────────────────────────────
  if (loading) {
    return (
      <div className="profil-page d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: 48, height: 48 }} />
          <p className="text-muted mt-3 small">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  // ── Affichage si profil non trouvé ─────────────────────────────────────────
  if (!profil) {
    return (
      <div className="profil-page">
        <div className="profil-card text-center">
          <p className="text-muted">Impossible de charger le profil. Réessayez.</p>
          <button onClick={chargerProfil} className="btn btn-primary-cocolis rounded-pill px-4">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const photoUrl = getPhotoUrl();

  // ── Rendu principal ────────────────────────────────────────────────────────
  return (
    <div className="profil-page">
      <div className="profil-card">

        {/* ── EN-TÊTE : Photo + Nom + Email + Badge ── */}
        <div className="profil-header">

          {/* Zone photo cliquable */}
          <div
            className="profil-photo-wrapper"
            onClick={() => !photoUploading && fileInputRef.current?.click()}
            title="Cliquez pour changer votre photo"
          >
            {/* Spinner pendant l'upload */}
            {photoUploading ? (
              <div className="profil-photo-uploading">
                <div className="spinner-border text-primary" style={{ width: 30, height: 30 }} />
              </div>
            ) : photoUrl ? (
              <>
                <img
                  src={photoUrl}
                  alt="Photo de profil"
                  className="profil-photo"
                  onError={(e) => {
                    // Si l'image ne charge pas (fichier manquant), afficher le placeholder
                    e.target.style.display = "none";
                    e.target.nextSibling.style.opacity = "0";
                    e.target.parentNode.innerHTML = `
                      <div class="profil-photo-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                          <path d="M2 13c0-2.67 1.79-4.69 4-5.32V13H2zm6 0V7.68C10.21 8.31 12 10.33 12 13H8z"/>
                        </svg>
                      </div>`;
                  }}
                />
                <div className="profil-photo-overlay">
                  <FaCamera size={18} />
                  <span>Modifier</span>
                </div>
              </>
            ) : (
              <>
                <div className="profil-photo-placeholder">
                  <FaUserCircle size={60} />
                </div>
                <div className="profil-photo-overlay">
                  <FaCamera size={18} />
                  <span>Ajouter</span>
                </div>
              </>
            )}
          </div>

          {/* Input file caché */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="profil-file-input"
            onChange={changerPhoto}
          />

          {/* Nom complet */}
          <h2 className="profil-name">
            {profil.prenom} {profil.nom}
          </h2>

          {/* Email 
          <span className="profil-email">{profil.email}</span>*/}

          {/* Badge statut */}
          <span className={`profil-badge ${
            profil.statusCompte === "ACTIF" ? "profil-badge-actif" : "profil-badge-attente"
          }`}>
            {profil.statusCompte === "ACTIF" ? "✓ Compte actif" : "⏳ En attente"}
          </span>
        </div>

        {/* Alerte photo */}
        {alertePhoto && (
          <div className={alertePhoto.type === "success" ? "profil-alert-success mb-3" : "profil-alert-error mb-3"}>
            {alertePhoto.type === "success"
              ? <FaCheckCircle />
              : <FaTimesCircle />}
            {alertePhoto.message}
          </div>
        )}

        <hr className="my-3 text-light" />

        {/* ── SECTION : Informations personnelles (lecture seule) ── */}
        <div className="mb-4">
          <p className="profil-section-title">
            Informations personnelles
          </p>

          <div className="row g-3">
            {/* Nom — lecture seule */}
            <div className="col-12 col-sm-6">
              <label className="form-label text-dark small fw-bold mb-1 d-flex align-items-center">
                Nom
                <FaLock className="profil-locked-icon" title="Non modifiable" />
              </label>
              <div className="profil-field-readonly">{profil.nom}</div>
            </div>

            {/* Prénom — lecture seule */}
            <div className="col-12 col-sm-6">
              <label className="form-label text-dark small fw-bold mb-1 d-flex align-items-center">
                Prénom
                <FaLock className="profil-locked-icon" title="Non modifiable" />
              </label>
              <div className="profil-field-readonly">{profil.prenom}</div>
            </div>

            {/* Email — lecture seule */}
            <div className="col-12">
              <label className="form-label text-dark small fw-bold mb-1 d-flex align-items-center">
                Adresse email
                <FaLock className="profil-locked-icon" title="Non modifiable" />
              </label>
              <div className="profil-field-readonly">{profil.email}</div>
            </div>
          </div>
        </div>

        {/* ── SECTION : Numéros de téléphone (modifiables) ── */}
        <div>
          <p className="profil-section-title">
            Numéros de téléphone
          </p>

          <form onSubmit={sauvegarderNumeros}>
            <div className="row g-3">

              {/* Numéro principal */}
              <div className="col-12 col-sm-6">
                <label className="form-label text-dark small fw-bold mb-1">
                  Numéro principal <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  className="profil-input"
                  value={numeroPrincipal}
                  onChange={(e) => setNumeroPrincipal(e.target.value)}
                  placeholder="Ex: 677123456"
                  maxLength={9}
                  required
                />
                <small className="text-muted" style={{ fontSize: "0.78rem" }}>
                  Format : 6XXXXXXXX (9 chiffres)
                </small>
              </div>

              {/* Numéro secondaire */}
              <div className="col-12 col-sm-6">
                <label className="form-label text-dark small fw-bold mb-1">
                  Numéro secondaire
                  <span className="text-muted fw-normal ms-1" style={{ fontSize: "0.78rem" }}>
                    (optionnel)
                  </span>
                </label>
                <input
                  type="tel"
                  className="profil-input"
                  value={numeroSecondaire}
                  onChange={(e) => setNumeroSecondaire(e.target.value)}
                  placeholder="Ex: 698765432"
                  maxLength={9}
                />
              </div>

              {/* Alerte numéros */}
              {alerteNumeros && (
                <div className="col-12">
                  <div className={alerteNumeros.type === "success"
                    ? "profil-alert-success"
                    : "profil-alert-error"}>
                    {alerteNumeros.type === "success"
                      ? <FaCheckCircle />
                      : <FaTimesCircle />}
                    {alerteNumeros.message}
                  </div>
                </div>
              )}

              {/* Bouton sauvegarder */}
              <div className="col-12 d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn-profil-save"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      />
                      Sauvegarde...
                    </>
                  ) : (
                    "Sauvegarder les numéros"
                  )}
                </button>
              </div>

            </div>
          </form>
        </div>

      </div>
    </div>
  );
}