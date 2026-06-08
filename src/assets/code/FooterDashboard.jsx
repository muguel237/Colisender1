import "../style/FooterDashboard.css"

export default function Footer() {

  return (

    <footer className="footer mt-5">

      <div className="container py-5">

        <div className="row gy-4">

          {/* LEFT */}

          <div className="col-12 col-md-4">

            <h3 className="footer-logo">
              Colisender
            </h3>

            <p className="footer-text">

              Plateforme moderne de transport
              de colis au Cameroun.

            </p>

          </div>

          {/* CENTER */}

          <div className="col-12 col-md-4">

            <h5>Navigation</h5>

            <ul className="list-unstyled">

              <li className="mb-2">
                Accueil
              </li>

              <li className="mb-2">
                Trajets
              </li>

              <li className="mb-2">
                Colis
              </li>

            </ul>

          </div>

          {/* RIGHT */}

          <div className="col-12 col-md-4">

            <h5>Contact</h5>

            <p>
              contact@colisender.com
            </p>

          </div>

        </div>

      </div>

    </footer>

  )
}