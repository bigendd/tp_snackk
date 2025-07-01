"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api/categoryApi";
import { useRouter } from "@tanstack/react-router";

type Category = {
  id: number;
  nom: string;
  disponible: boolean;
};

export default function CategoryListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getCategories();
        setCategories(response.data["member"] || []);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
      }
    }

    fetchCategories();
  }, []);

  const handleDetail = (id: number) => {
    router.navigate({ to: `/categories/${id}` });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Catégories</h1>

      {categories.length === 0 ? (
        <p>Aucune catégorie trouvée.</p>
      ) : (
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left text-background">Nom</th>
              <th className="p-2 text-left text-background">Disponible</th>
              <th className="p-2 text-left text-background">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t">
                <td className="p-2">{cat.nom}</td>
                <td className="p-2">{cat.disponible ? "Oui" : "Non"}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDetail(cat.id)}
                    className="text-sm text-background bg-primary hover:bg-primary/90 px-3 py-1 rounded"
                  >
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
