// import { ChevronDown } from 'lucide-react'; // Assurez-vous que cette icône est importée
// import React, { useState } from 'react'; // Nécessaire pour gérer l'état des sous-menus
// import { NavLink } from 'react-router-dom'; // Pour une navigation réactive
// import { menuItems } from '../../data/menu'; // Importation correcte de vos données

// const Navigation = () => {
//     // État pour gérer l'ouverture/fermeture des sous-menus
//     const [openSubMenu, setOpenSubMenu] = useState(null);

//     const handleToggleSubMenu = (index) => {
//         setOpenSubMenu(openSubMenu === index ? null : index);
//     };

//     return (
//         <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//             {menuItems.map((item, index) => {
//                 const isActive = window.location.pathname === item.path; // Détecte si le lien principal est actif
//                 const isSubMenuOpen = openSubMenu === index;

//                 return (
//                     <React.Fragment key={index}>
//                         {/* Bouton de navigation principal */}
//                         <NavLink
//                             to={item.path}
//                             className={({ isActive }) =>
//                                 `flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors duration-200
//                                 ${isActive
//                                     ? 'bg-yellow-400 text-white shadow-sm' // Style actif
//                                     : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800' // Style inactif
//                                 }`
//                             }
//                             // Si l'élément a un sous-menu, on le traite comme un bouton cliquable pour ouvrir/fermer
//                             onClick={(e) => {
//                                 if (item.subMenu) {
//                                     e.preventDefault(); // Empêche la navigation immédiate
//                                     handleToggleSubMenu(index);
//                                 }
//                             }}
//                         >
//                             <item.icon className="w-5 h-5" />
//                             <span>{item.name}</span>

//                             {/* Affichage du badge de notification */}
//                             {item.badge && (
//                                 <span className="ml-auto px-2 py-1 text-xs font-semibold bg-red-600 text-white rounded-full">
//                                     {item.badge}
//                                 </span>
//                             )}

//                             {/* Affichage du chevron pour les sous-menus */}
//                             {item.subMenu && (
//                                 <ChevronDown
//                                     className={`w-4 h-4 ml-auto text-slate-400 dark:text-slate-500 transition-transform ${isSubMenuOpen ? 'rotate-180' : ''}`}
//                                 />
//                             )}
//                         </NavLink>

//                         {/* Rendu des sous-menus s'ils existent et si le menu principal est ouvert */}
//                         {item.subMenu && isSubMenuOpen && (
//                             <div className="pl-6 space-y-1">
//                                 {item.subMenu.map((subItem, subIndex) => (
//                                     <NavLink
//                                         key={subIndex}
//                                         to={subItem.path}
//                                         className={({ isActive }) =>
//                                             `flex items-center space-x-3 p-2 rounded-lg text-sm transition-colors duration-200
//                                             ${isActive
//                                                 ? 'bg-yellow-100 text-yellow-800' // Style actif pour sous-menu
//                                                 : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800' // Style inactif pour sous-menu
//                                             }`
//                                         }
//                                     >
//                                         <span>{subItem.name}</span>
//                                     </NavLink>
//                                 ))}
//                             </div>
//                         )}
//                     </React.Fragment>
//                 );
//             })}
//         </nav>
//     );
// };

// export default Navigation; // Assurez-vous de l'exporter si c'est un composant séparé