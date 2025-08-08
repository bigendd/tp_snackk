'use client'

import { z } from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { useCommande } from '../context/commande-context'
import { createCommande, updateCommande } from '../data/commande'
import { getProduits } from '@/features/products/data/produits' 
import { Commande, Produit } from '../data/schema'
import { toast } from 'sonner'

// Schéma de validation pour le formulaire
const formSchema = z.object({
  modeCons: z.enum(['SUR_PLACE', 'A_EMPORTER', 'LIVRAISON'], {
    required_error: 'Le mode de consommation est requis.',
  }),
  moyenPaiment: z.enum(['CARTE', 'ESPECE', 'CHEQUE', 'VIREMENT'], {
    required_error: 'Le moyen de paiement est requis.',
  }),
  userId: z.number().optional(),
  userName: z.string().optional(),
  userEmail: z.string().email().optional().or(z.literal('')),
  commandeProduits: z.array(z.object({
    produitId: z.number(),
    quantite: z.number().min(1, 'La quantité doit être au moins 1'),
    prixUnitaire: z.number().min(0),
  })).min(1, 'Au moins un produit est requis'),
  commentaire: z.string().optional(),
  remise: z.number().min(0).optional(),
})

type CommandeForm = z.infer<typeof formSchema>

interface Props {
  mode: 'add' | 'edit'
  currentRow?: Commande
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandeActionDialog({ mode, currentRow, open, onOpenChange }: Props) {
  const isEdit = mode === 'edit'
  const [produits, setProduits] = useState<Produit[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingProduits, setIsLoadingProduits] = useState(false)
  const { refreshCommandes } = useCommande()

  const form = useForm<CommandeForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit && currentRow
      ? {
          modeCons: currentRow.modeCons,
          moyenPaiment: currentRow.moyenPaiment,
          userId: currentRow.user?.id,
          userName: currentRow.user?.nom || '',
          userEmail: currentRow.user?.email || '',
          commandeProduits: currentRow.commandeProduits?.map(cp => ({
            produitId: cp.produit.id,
            quantite: cp.quantite,
            prixUnitaire: cp.prixUnitaire,
          })) || [],
          commentaire: currentRow.commandeInfo?.commentaire || '',
          remise: currentRow.commandeInfo?.remise || 0,
        }
      : {
          modeCons: 'SUR_PLACE' as const,
          moyenPaiment: 'CARTE' as const,
          userName: '',
          userEmail: '',
          commandeProduits: [],
          commentaire: '',
          remise: 0,
        },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'commandeProduits',
  })

  // Charger les produits disponibles
  useEffect(() => {
    const loadProduits = async () => {
      setIsLoadingProduits(true)
      try {
        const produitsData = await getProduits()
    setProduits(produitsData)
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error)
        toast.error('Erreur lors du chargement des produits')
      } finally {
        setIsLoadingProduits(false)
      }
    }

    if (open) {
      loadProduits()
    }
  }, [open])

  // Calculer le total
  const calculateTotal = () => {
    const commandeProduits = form.watch('commandeProduits')
    const remise = form.watch('remise') || 0
    
    const sousTotal = commandeProduits.reduce((sum, cp) => 
      sum + (cp.quantite * cp.prixUnitaire), 0
    )
    
    const totalAvantRemise = sousTotal
    const totalApresRemise = totalAvantRemise - remise
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

  const onSubmit = async (values: CommandeForm) => {
    setIsSubmitting(true)
    
    try {
      const totals = calculateTotal()
      
      const commandeData = {
        modeCons: values.modeCons,
        moyenPaiment: values.moyenPaiment,
        userId: values.userId,
        commandeProduits: values.commandeProduits,
        commandeInfo: {
          totalTTC: totals.totalTTC,
          tva: totals.tva,
          remise: values.remise,
          commentaire: values.commentaire,
        }
      }

      let result
      if (isEdit && currentRow?.id) {
        result = await updateCommande(currentRow.id, {
          modeCons: values.modeCons,
          moyenPaiment: values.moyenPaiment,
          commandeInfo: commandeData.commandeInfo,
        })
      } else {
        result = await createCommande(commandeData)
      }

      if (result) {
        toast.success(isEdit ? 'Commande modifiée avec succès' : 'Commande créée avec succès')
        form.reset()
        onOpenChange(false)
        refreshCommandes()
      } else {
        toast.error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addProduit = () => {
    if (produits.length === 0) return
    
    const firstProduit = produits[0]
    append({
      produitId: firstProduit.id,
      quantite: 1,
      prixUnitaire: firstProduit.prix,
    })
  }

  const updatePrixUnitaire = (index: number, produitId: number) => {
    const produit = produits.find(p => p.id === produitId)
    if (produit) {
      form.setValue(`commandeProduits.${index}.prixUnitaire`, produit.prix)
    }
  }

  const totals = calculateTotal()

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          form.reset()
        }
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {isEdit ? 'Modifier la commande' : 'Nouvelle commande'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modifiez les informations de la commande ici.'
              : 'Créez une nouvelle commande en sélectionnant les produits et en remplissant les détails.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Form {...form}>
            <form
              id="commande-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Informations générales */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="modeCons"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mode de consommation</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez le mode" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="SUR_PLACE">Sur place</SelectItem>
                              <SelectItem value="A_EMPORTER">À emporter</SelectItem>
                              <SelectItem value="LIVRAISON">Livraison</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="moyenPaiment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Moyen de paiement</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez le moyen" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="CARTE">Carte</SelectItem>
                              <SelectItem value="ESPECE">Espèces</SelectItem>
                              <SelectItem value="CHEQUE">Chèque</SelectItem>
                              <SelectItem value="VIREMENT">Virement</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="userName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom du client (optionnel)</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom du client" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="userEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email du client (optionnel)</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@exemple.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Produits */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Produits
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addProduit}
                      disabled={isLoadingProduits || produits.length === 0}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un produit
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      Aucun produit ajouté. Cliquez sur "Ajouter un produit" pour commencer.
                    </p>
                  )}

                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                      <FormField
                        control={form.control}
                        name={`commandeProduits.${index}.produitId`}
                        render={({ field }) => (
                          <FormItem className="col-span-5">
                            <FormLabel>Produit</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(parseInt(value))
                                updatePrixUnitaire(index, parseInt(value))
                              }}
                              defaultValue={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez un produit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {produits.map((produit) => (
                                  <SelectItem key={produit.id} value={produit.id.toString()}>
                                    {produit.nom} - {produit.prix.toFixed(2)}€
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`commandeProduits.${index}.quantite`}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Quantité</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`commandeProduits.${index}.prixUnitaire`}
                        render={({ field }) => (
                          <FormItem className="col-span-3">
                            <FormLabel>Prix unitaire (€)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="col-span-1 flex justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="col-span-1 text-right font-semibold">
                        {(form.watch(`commandeProduits.${index}.quantite`) * 
                          form.watch(`commandeProduits.${index}.prixUnitaire`)).toFixed(2)}€
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Résumé et options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Résumé et options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="remise"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Remise (€)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Sous-total:</span>
                        <span>{totals.sousTotal.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Remise:</span>
                        <span>-{totals.remise.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total HT:</span>
                        <span>{totals.totalHT.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>TVA (10%):</span>
                        <span>{totals.tva.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total TTC:</span>
                        <span>{totals.totalTTC.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="commentaire"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commentaire (optionnel)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Commentaires ou instructions spéciales..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            form="commande-form" 
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (isEdit ? 'Modification...' : 'Création...') 
              : (isEdit ? 'Modifier' : 'Créer')
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}