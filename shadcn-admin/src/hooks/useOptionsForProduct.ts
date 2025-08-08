import { useState, useEffect } from 'react'

type Option = { produit: string | { id: number } | null; [key: string]: any }
type FetchFunction<T> = () => Promise<T[]>
type ExtractProduitIdFunction<T> = (option: T) => number | null

export function useOptionsForProduct<T extends Option>(
  produitId: number | null,
  fetchOptions: FetchFunction<T>,
  extractProduitId: ExtractProduitIdFunction<T>
) {
  const [options, setOptions] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!produitId) {
      setOptions([])
      return
    }

    setLoading(true)
    setError(null)

    fetchOptions()
      .then((allOptions) => {
        const filtered = allOptions.filter((opt) => {
          const prodId = extractProduitId(opt)
          return prodId === produitId
        })
        setOptions(filtered)
      })
      .catch((err) => {
        setError(err)
        setOptions([])
      })
      .finally(() => setLoading(false))
  }, [produitId, fetchOptions, extractProduitId])

  return { options, loading, error }
}
