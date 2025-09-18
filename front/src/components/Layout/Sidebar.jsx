// import { ChevronDown, Utensils } from 'lucide-react';
// import { MenuItems } from '../data/menu';

// const Sidebar = ({ collapsed, onToggle, currentPage, onPageChange }) => {
//     return (
//         <div
//             className={`${
//                 collapsed ? 'w-20' : 'w-72'
//             } transition duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col relative z-10`}
//         >
//             {/* Logo */}
//             <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
//                 <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
//                         <Utensils className="w-6 h-6 text-white" />
//                     </div>
//                     <span className="text-slate-900 dark:text-white font-semibold text-lg tracking-wide">
//                         Snack'K
//                     </span>
//                 </div>
//                 {!collapsed && (
//                     <div>
//                         <h1 className="text-xl font-bold text-slate-800 dark:text-white">
//                             Bienvenue Admin
//                         </h1>
//                         <p className="text-xs text-slate-500 dark:text-slate-400">
//                             Gérez vos catégories et produits facilement!
//                         </p>
//                     </div>
//                 )}
//             </div>

//             {/* Navigation */}
//             <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//                 {MenuItems.map((item) => (
//                     <div key={item.id}>
//                         <button
//                             className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
//                                 currentPage === item.id || item.active
//                                     ? 'bg-gradient-to-br from-yellow-400 to-red-600 text-white shadow-lg shadow-orange-500/25'
//                                     : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
//                             }`}
//                         >
//                             <div className="flex items-center space-x-3">
//                                 <item.icon className="w-5 h-5" />
//                                 <span className="font-medium ml-2">{item.name}</span>
//                                 {item.badge && (
//                                     <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
//                                         {item.badge}
//                                     </span>
//                                 )}
//                                 {item.count && (
//                                     <span className="px-2 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
//                                         {item.count}
//                                     </span>
//                                 )}
//                             </div>
//                             {item.children && (
//                                 <ChevronDown className="w-4 h-4 transition-transform" />
//                             )}
//                         </button>
//                         {item.children &&
//                             item.children.map((child) => {
//                                 return <button key={child.name}>{child.name}</button>;
//                             })}
//                     </div>
//                 ))}
//             </nav>

//             {/* User profile */}
//             <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
//                 <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
//                     <img
//                         src="https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg"
//                         alt="user"
//                         className="w-10 h-10 rounded-full ring-2 ring-yellow-400"
//                     />
//                     <div className="flex-1 min-w-0">
//                         <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
//                             Fal Muyombo
//                         </p>
//                         <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
//                             Administrateur
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Sidebar;
