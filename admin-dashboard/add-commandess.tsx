'use client'

import { useState, useEffect } from 'react'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Minus, ShoppingCart, X } from 'lucide-react'
import { createCommande } from '../data/commande'
import { getProduits } from '../data/produit'
import { Commande, Produit } from '../data/schema'
import { toast } from 'sonner'

type AddCommandeButtonProps = {
  onCommandeCreated?: (newCommande: Commande) => void
}

interface PanierItem {
  produit: Produit
  quantite: number
}

export function AddCommandeButton({ onCommandeCreated }: AddCommandeButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [produits, setProduits] = useState<Produit[]>([])
  const [panier, setPanier] = useState<PanierItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingProduits, setIsLoadingProduits] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
const [categorieId, setCategorieId] = useState<number | null>(null)


  // Données de commande
  const [modeCons, setModeCons] = useState<'SUR_PLACE' | 'A_EMPORTER' | 'LIVRAISON'>('SUR_PLACE')
  const [moyenPaiment, setMoyenPaiement] = useState<'CARTE' | 'ESPECE' | 'CHEQUE' | 'VIREMENT'>('CARTE')
  const [clientNom, setClientNom] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [commentaire, setCommentaire] = useState('')
  const [remise, setRemise] = useState(0)

 useEffect(() => {
  if (!isOpen) return

  const loadProduits = async () => {
    setIsLoadingProduits(true)
    try {
      const result = await getProduits()
      console.log('Produits API bruts :', result) // 👈 Ajout pour debug

      if (Array.isArray(result)) {
        setProduits(result.filter(p => p && p.disponible === true))
      } else {
        setProduits([])
        toast.error('Erreur : données produits invalides')
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits', error)
      toast.error('Erreur lors du chargement des produits')
    } finally {
      setIsLoadingProduits(false)
    }
  }

  loadProduits()
}, [isOpen])


  const ajouterAuPanier = (produit: Produit) => {
    setPanier(prev => {
      const existant = prev.find(item => item.produit.id === produit.id)
      if (existant) {
        return prev.map(item =>
          item.produit.id === produit.id
            ? { ...item, quantite: item.quantite + 1 }
            : item
        )
      }
      return [...prev, { produit, quantite: 1 }]
    })
  }

  const modifierQuantite = (produitId: number, nouvelleQuantite: number) => {
    if (nouvelleQuantite <= 0) {
      setPanier(prev => prev.filter(item => item.produit.id !== produitId))
      return
    }
    setPanier(prev =>
      prev.map(item =>
        item.produit.id === produitId
          ? { ...item, quantite: nouvelleQuantite }
          : item
      )
    )
  }

  const retirerDuPanier = (produitId: number) => {
    setPanier(prev => prev.filter(item => item.produit.id !== produitId))
  }

  const calculerTotaux = () => {
    const sousTotal = panier.reduce((total, item) => total + item.produit.prix * item.quantite, 0)
    const totalApresRemise = sousTotal - remise
    const tva = totalApresRemise * 0.1 // 10% TVA
    const totalTTC = totalApresRemise + tva

    return {
      sousTotal,
      remise,
      totalHT: totalApresRemise,
      tva,
      totalTTC
    }
  }

  const resetForm = () => {
    setPanier([])
    setClientNom('')
    setClientEmail('')
    setCommentaire('')
    setRemise(0)
    setModeCons('SUR_PLACE')
    setMoyenPaiement('CARTE')
    setError('')
  }

  const validateEmail = (email: string) => {
    // Validation très simple
    return /^\S+@\S+\.\S+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (panier.length === 0) {
      setError('Veuillez ajouter au moins un produit au panier')
      return
    }
    if (clientEmail && !validateEmail(clientEmail)) {
      setError('Veuillez entrer un email valide')
      return
    }

    setIsSubmitting(true)
    try {
      const totaux = calculerTotaux()

      const commandeData = {
        modeCons,
        moyenPaiment,
        // userId: undefined // gestion auth à prévoir si besoin
        commandeProduits: panier.map(item => ({
          produitId: item.produit.id,
          quantite: item.quantite,
          prixUnitaire: item.produit.prix
        })),
        commandeInfo: {
          totalTTC: totaux.totalTTC,
          tva: totaux.tva,
          remise: remise || undefined,
          commentaire: commentaire || undefined,
          clientNom: clientNom || undefined,
          clientEmail: clientEmail || undefined,
        }
      }

      const newCommande = await createCommande(commandeData)

      if (newCommande) {
        toast.success('Commande créée avec succès !')
        onCommandeCreated?.(newCommande)
        resetForm()
        setIsOpen(false)
      } else {
        setError('Erreur lors de la création de la commande')
      }
    } catch (error) {
      setError('Erreur lors de la création de la commande')
    } finally {
      setIsSubmitting(false)
    }
  }

  const totaux = calculerTotaux()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) resetForm()
    }}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Nouvelle commande
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Passer une commande
          </DialogTitle>
          <DialogDescription>
            Sélectionnez vos produits et remplissez les informations de commande
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Produits disponibles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Produits disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingProduits ? (
                <div className="text-center py-4">Chargement des produits...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {produits.map((produit) => (
                    <div
                      key={produit.id}
                      className="p-3 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{produit.nom}</h4>
                          <p className="text-green-600 font-semibold">{produit.prix.toFixed(2)} €</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {produit.disponible ? 'Disponible' : 'Indisponible'}
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => ajouterAuPanier(produit)}
                        disabled={!produit.disponible}
                        className="w-full"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Panier */}
          <Card>
            <CardHeader>
              <CardTitle>Panier</CardTitle>
            </CardHeader>
            <CardContent>
              {panier.length === 0 ? (
                <p className="text-center text-muted-foreground">Aucun produit dans le panier</p>
              ) : (
                <div className="space-y-3">
                  {panier.map(({ produit, quantite }) => (
                    <div
                      key={produit.id}
                      className="flex justify-between items-center border rounded p-2"
                    >
                      <div>
                        <p className="font-medium">{produit.nom}</p>
                        <p className="text-sm text-gray-600">{produit.prix.toFixed(2)} €</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => modifierQuantite(produit.id, quantite - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span>{quantite}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => modifierQuantite(produit.id, quantite + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => retirerDuPanier(produit.id)}
                          aria-label="Supprimer"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations de commande */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de la commande</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="modeCons">Mode de consommation</Label>
                <Select
                  value={modeCons}
                  onValueChange={(value) => setModeCons(value as typeof modeCons)}
                >
                  <SelectTrigger id="modeCons">
                    <SelectValue placeholder="Choisissez un mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUR_PLACE">Sur place</SelectItem>
                    <SelectItem value="A_EMPORTER">À emporter</SelectItem>
                    <SelectItem value="LIVRAISON">Livraison</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="moyenPaiement">Moyen de paiement</Label>
                <Select
  value={moyenPaiment}
  onValueChange={(value) => setMoyenPaiement(value as typeof moyenPaiment)}
>
  <SelectTrigger id="moyenPaiement">
    <SelectValue placeholder="Choisissez un moyen" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="CARTE">Carte</SelectItem>
    <SelectItem value="ESPECE">Espèce</SelectItem>
    <SelectItem value="CHEQUE">Chèque</SelectItem>
    <SelectItem value="VIREMENT">Virement</SelectItem>
  </SelectContent>
</Select>

              </div>

              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="clientNom">Nom du client</Label>
                <Input
                  type="text"
                  id="clientNom"
                  value={clientNom}
                  onChange={(e) => setClientNom(e.target.value)}
                  placeholder="Nom complet"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="clientEmail">Email du client</Label>
                <Input
                  type="email"
                  id="clientEmail"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="exemple@domaine.com"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="commentaire">Commentaire</Label>
                <Textarea
                  id="commentaire"
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  placeholder="Commentaire ou instructions particulières"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="remise">Remise (€)</Label>
                <Input
                  type="number"
                  id="remise"
                  value={remise}
                  onChange={(e) => setRemise(Number(e.target.value) || 0)}
                  min={0}
                  step={0.01}
                />
              </div>
            </CardContent>
          </Card>

          {/* Résumé des totaux */}
          <Card>
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p>Sous-total : {totaux.sousTotal.toFixed(2)} €</p>
                <p>Remise : {totaux.remise.toFixed(2)} €</p>
                <p>Total HT : {totaux.totalHT.toFixed(2)} €</p>
                <p>TVA (10%) : {totaux.tva.toFixed(2)} €</p>
                <p className="font-semibold">Total TTC : {totaux.totalTTC.toFixed(2)} €</p>
              </div>
            </CardContent>
          </Card>

          {error && (
            <p className="text-red-600 font-medium text-center">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setIsOpen(false)
                resetForm()
              }}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'En cours...' : 'Passer la commande'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
