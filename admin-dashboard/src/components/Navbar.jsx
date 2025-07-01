import { Link } from 'react-router-dom';

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav>
      <Link to="/">Dashboard</Link> | <Link to="/users">Utilisateurs</Link> | <button onClick={handleLogout}>Déconnexion</button>
    </nav>
  );
};

export default Navbar;
