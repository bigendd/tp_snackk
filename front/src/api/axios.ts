import axios from "axios";

// Liste des routes publiques (pas besoin de token ni de refresh)
const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/token/refresh"
];

// Instance Axios pour ton backend Symfony
const api = axios.create({
  baseURL: "http://localhost:8080/api", // En production, utilise une variable d'environnement
  withCredentials: true, // ← essentiel pour envoyer les cookies HTTP-only
});

// Intercepteur pour gérer les erreurs 401 et le refresh automatique
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Ignore les routes publiques
    if (publicRoutes.some(route => originalRequest.url.includes(route))) {
      return Promise.reject(error);
    }

    // Si erreur 401 et qu'on n'a pas déjà tenté un refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/token/refresh");
        return api(originalRequest); // Relance la requête initiale
      } catch (refreshError) {
        window.location.href = "/login"; // Redirection si le refresh échoue
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Fonction d'upload vers Cloudinary
export const uploadImageToCloudinary = async (
  file: File,
  type: "user" | "produit"
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "snackk_upload"); // ← ton preset Cloudinary

  // Choix du dossier selon le type
  const folder = type === "user" ? "users" : "produits";
  formData.append("folder", folder);

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dujyydoyr/image/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data.secure_url;
  } catch (error) {
    console.error("Erreur d'upload Cloudinary :", error);
    throw new Error("Échec de l'upload de l'image");
  }
};

export default api;