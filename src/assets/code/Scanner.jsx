import { useState } from 'react';
import { QrReader } from 'react-qr-reader';

export default function Scanner() {
  const [scanned, setScanned] = useState(false);

  const validerLivraison = async (colisId) => {
    try {

      const response = await fetch("http://localhost:8080/api/colis/valider-livraison", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: colisId }),
      });

      if (!response.ok) throw new Error("Erreur lors de la validation");

      alert("Livraison validée avec succès pour le colis : " + colisId);
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de la validation de la livraison.");
    }
  };

return (
    <div className="container py-5 text-center">
      <h3 className="mb-4">Scanner le code QR de livraison</h3>
      <div className="mx-auto border rounded-4 overflow-hidden shadow-sm" style={{ maxWidth: "400px" }}>
        <QrReader
          onResult={(result) => {
            if (result && !scanned) {
              setScanned(true); 
              const colisId = result.text;
              console.log("Colis détecté :", colisId);
              validerLivraison(colisId);
            }
          }}
          constraints={{ facingMode: 'environment' }}
        />
      </div>
      <p className="mt-3 text-muted">La caméra s'active automatiquement pour scanner.</p>
    </div>
  );
}