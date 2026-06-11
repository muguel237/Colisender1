import Send from "./Send";
import Scanner from "./Scanner";
import Profil from "./Profil";      // ← Import du nouveau composant

export default function UserContent({ activePage }) {
  const renderContent = () => {
    switch (activePage) {

      case "home":
        return (
          <div className="text-center py-5">
            <h1 className="display-3 fw-bold text-dark">
              Bienvenue sur <span className="text-primary">Colisender</span>
            </h1>
            <p className="fs-4 text-muted">
              Votre plateforme de logistique collaborative au Cameroun.
            </p>
          </div>
        );

      case "envoyer":
        return <Send />;

      case "scanner":
        return <Scanner />;

      case "profil":
        return <Profil />;           // ← Nouveau cas

      case "suivi":
        return (
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="card shadow-sm border-0 rounded-4 p-5 text-center">
                <h4 className="fw-bold text-primary mb-3">Suivi de votre trajet</h4>
                <p className="text-muted">La carte interactive sera affichée ici prochainement.</p>
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="card shadow-sm border-0 rounded-4 d-flex flex-column" style={{ height: "450px" }}>
                <div className="p-3 border-bottom bg-primary text-white rounded-top-4">
                  <h5 className="fw-bold m-0">Messagerie sécurisée</h5>
                </div>
                <div className="flex-grow-1 p-3 overflow-auto bg-light">
                  <div className="alert alert-primary mb-2 small">
                    Voyageur: Bonjour, je prends en charge votre colis.
                  </div>
                </div>
                <div className="p-3 border-top bg-white">
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="Message..." />
                    <button className="btn btn-primary">Envoyer</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-5">
            <h3 className="text-muted">
              Section <strong>{activePage}</strong> en cours de développement...
            </h3>
          </div>
        );
    }
  };

  return (
    <main className="container py-5">
      {renderContent()}
    </main>
  );
}