import { useState } from "react";
import UserHeader from "./UserHeader";
import UserContent from "./UserContent";
import Footer from "./FooterDashboard";

export default function UserD() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <UserHeader setPage={setCurrentPage} />
      
      <UserContent activePage={currentPage} />
      
      <Footer />
    </div>
  );
}