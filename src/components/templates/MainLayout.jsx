import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Message from "../atoms/Message";
import NavBar from "../organisms/NavBar";

// Template : la mise en page commune à toutes les pages (menu + contenu).
// <Outlet /> affiche la page qui correspond à l'adresse (voir les routes dans App.jsx)
function MainLayout() {
  return (
    <>
      <NavBar />
      <main className="contenu">
        {/* Affiché pendant le téléchargement d'une page chargée à la demande (React.lazy) */}
        <Suspense fallback={<Message>Chargement de la page...</Message>}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
}

export default MainLayout;
