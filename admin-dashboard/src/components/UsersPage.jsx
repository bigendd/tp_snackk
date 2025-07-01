import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from './Navbar';

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data);
      } catch (err) {
        alert('Erreur chargement utilisateurs (peut-être non connecté)');
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <Navbar />
      <h2>Utilisateurs</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
