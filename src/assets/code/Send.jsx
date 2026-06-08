import { useState } from "react";
import { 
  FaMapMarkerAlt, 
  FaWeightHanging, 
  FaBoxOpen, 
  FaCamera, 
  FaInfoCircle, 
  FaTimes, 
  FaUserCircle 
} from "react-icons/fa";

export default function Send() {
  const [formData, setFormData] = useState({
    villeDepart: "",
    villeArrivee: "",
    adresseRecuperation: "",
    adresseLivraison: "",
    poids: "",
    volume: "",
    description: "",
    dateDisponibilite: "",
    telephoneDestinataire: "", 
  });

  const [files, setFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
    const newImageUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newImageUrls]);
  };

  const removeImage = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
    setPreviewImages(previewImages.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    
    // Ajout automatique des champs du formulaire
    Object.keys(formData).forEach(key => {
      formDataObj.append(key, formData[key]);
    });
    
    formDataObj.append("prix_transport", 2500.0);
    formDataObj.append("statut_colis", "EN_ATTENTE");

    files.forEach((file) => {
      formDataObj.append("photos", file);
    });

    try {
      const response = await fetch("http://localhost:8080/api/colis", {
        method: "POST",
        body: formDataObj,
      });

      if (!response.ok) throw new Error("Erreur serveur : " + response.statusText);
      alert("Votre annonce a été publiée avec succès !");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue : " + error.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5">
            <h2 className="fw-bold text-dark mb-4">Publier une annonce</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Section Itinéraire */}
              <div className="mb-4">
                <h5 className="text-primary mb-3"><FaMapMarkerAlt /> Itinéraire</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input type="text" className="form-control rounded-pill p-3" placeholder="Ville de départ" required onChange={(e) => setFormData({...formData, villeDepart: e.target.value})}/>
                  </div>
                  <div className="col-md-6">
                    <input type="text" className="form-control rounded-pill p-3" placeholder="Ville d'arrivée" required onChange={(e) => setFormData({...formData, villeArrivee: e.target.value})}/>
                  </div>
                  <div className="col-12">
                    <input type="text" className="form-control rounded-pill p-3" placeholder="Adresse précise de récupération" required onChange={(e) => setFormData({...formData, adresseRecuperation: e.target.value})}/>
                  </div>
                  <div className="col-12">
                    <input type="text" className="form-control rounded-pill p-3" placeholder="Adresse précise de livraison" required onChange={(e) => setFormData({...formData, adresseLivraison: e.target.value})}/>
                  </div>
                </div>
              </div>

              {/* Section Destinataire */}
              <div className="mb-4">
                <h5 className="text-primary mb-3"><FaUserCircle /> Informations du destinataire</h5>
                <input 
                  type="tel" 
                  className="form-control rounded-pill p-3" 
                  placeholder="Numéro principal du destinataire" 
                  required 
                  onChange={(e) => setFormData({...formData, telephoneDestinataire: e.target.value})}
                />
              </div>

              {/* Section Détails du colis */}
              <div className="mb-4">
                <h5 className="text-primary mb-3"><FaBoxOpen /> Détails du colis</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input type="number" className="form-control rounded-pill p-3" placeholder="Poids (kg)" required onChange={(e) => setFormData({...formData, poids: e.target.value})}/>
                  </div>
                  <div className="col-md-6">
                    <input type="number" className="form-control rounded-pill p-3" placeholder="Volume (facultatif)" onChange={(e) => setFormData({...formData, volume: e.target.value})}/>
                  </div>
                </div>
                <div className="mt-3">
                  <input type="date" className="form-control rounded-pill p-3" required onChange={(e) => setFormData({...formData, dateDisponibilite: e.target.value})}/>
                </div>
                <div className="mt-3">
                  <textarea className="form-control rounded-4 p-3" rows="3" placeholder="Description détaillée..." required onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
                
                {/* Photos */}
                <div className="mt-3">
                  <label className="text-muted small mb-2 d-block"><FaCamera /> Ajoutez des photos de votre colis</label>
                  <div className="border border-2 border-dashed rounded-4 p-4 text-center bg-light position-relative" style={{ minHeight: "120px" }}>
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="position-absolute top-0 start-0 w-100 h-100 opacity-0" style={{ cursor: "pointer" }} />
                    <p className="mb-0 text-secondary" style={{ marginTop: "30px" }}>Cliquez pour choisir des images</p>
                  </div>
                  <div className="d-flex gap-3 mt-3 flex-wrap">
                    {previewImages.map((src, index) => (
                      <div key={index} className="position-relative" style={{ width: "80px", height: "80px" }}>
                        <img src={src} alt="Preview" className="rounded-3 shadow-sm" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle p-0" style={{ width: "24px", height: "24px", fontSize: "12px", transform: "translate(25%, -25%)" }} onClick={() => removeImage(index)}>
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
                
              <div className="alert alert-info border-0 rounded-4 p-4 d-flex align-items-center gap-3">
                <FaInfoCircle size={24} className="text-primary" />
                <div>
                  <h6 className="fw-bold mb-0">Prix fixe de transport</h6>
                  <p className="mb-0 text-muted small">Tarif unique : <span className="fw-bold text-primary">2500 FCFA</span></p>
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary w-100 btn-lg rounded-pill fw-bold py-3">
                Valider et publier
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}