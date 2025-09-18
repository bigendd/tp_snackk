import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login"); // Redirige vers la page de connexion
  };

  const handleOrderClick = () => {
    navigate("/order"); // Redirige vers la page de commande (à créer)
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/prod/image/upload/me/rotate-food-1.png')",
      }}
    >
      {/* Overlay pour assombrir l'image de fond et améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="relative z-10 text-center text-white p-8 bg-black/50 rounded-lg shadow-xl max-w-2xl">
        {/* Logo du restaurant (vous pouvez remplacer par votre propre logo) */}
        <div className="mb-3">
          <img
            src={Logo} // Remplacez par le chemin de votre logo
            alt="Logo du Restaurant Snackk"
            className="mx-auto h-40 w-auto"
          />
        </div>

        {/* Phrase d'accroche / Slogan */}
        <h1 className="text-5xl font-extrabold mb-4 leading-tight">
          Votre Pause Gourmande à Portée de Main
        </h1>
        <p className="text-xl font-light mb-8 opacity-90">
          Commandez vos plats préférés en quelques clics, et régalez-vous !
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button
            onClick={handleLoginClick}
            className="px-8 py-4 bg-yellow-400 text-slate-900 font-bold text-lg rounded-full shadow-lg hover:bg-yellow-500 transition duration-300 transform hover:scale-105"
          >
            S'identifier
          </button>
          <button
            onClick={handleOrderClick}
            className="px-8 py-4 bg-white text-slate-900 font-bold text-lg rounded-full shadow-lg hover:bg-gray-200 transition duration-300 transform hover:scale-105"
          >
            Commander sans compte
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
