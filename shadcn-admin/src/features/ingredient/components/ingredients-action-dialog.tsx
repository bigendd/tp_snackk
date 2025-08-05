'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { updateIngredient, createIngredient } from '../data/ingredients'
import { Produit } from '@/features/products/data/schema'
import { Ingredient } from '../data/schema'

const formSchema = z.object({
  nom: z.string().min(1, { message: 'Le nom est requis.' }),
  disponible: z.boolean(),
  prix_suppl: z
    .string()
    .min(1, { message: 'Le prix est requis.' })
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), { message: 'Prix invalide.' }),
  produit: z.string().nonempty({ message: 'Le produit est requis.' }),
})

type IngredientForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: Ingredient
  produits: Produit[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IngredientActionDialog({
  currentRow,
  produits,
  open,
  onOpenChange,
}: Props) {
  const isEdit = !!currentRow
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<IngredientForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          nom: currentRow!.nom,
          disponible: currentRow!.disponible,
          prix_suppl: currentRow!.prix_suppl.toString(),
          produit: typeof currentRow!.produit === 'string' ? currentRow!.produit : '',
        }
      : {
          nom: '',
          disponible: true,
          prix_suppl: '0',
          produit: '',
        },
  })

  const onSubmit = async (values: IngredientForm) => {
    setLoading(true)
    setError(null)
    try {
      if (isEdit && currentRow?.id) {
        const updated = await updateIngredient(currentRow.id, values)
        if (!updated) throw new Error('Erreur lors de la mise à jour')
      } else {
        const created = await createIngredient(values)
        if (!created) throw new Error('Erreur lors de la création')
      }
      form.reset()
      onOpenChange(false)
      window.location.reload()
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          form.reset()
          setError(null)
        }
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>
            {isEdit ? 'Modifier l’ingrédient' : 'Ajouter un nouvel ingrédient'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modifiez les informations de l’ingrédient ici.'
              : 'Ajoutez un nouvel ingrédient à un produit.'}
            Cliquez sur sauvegarder quand vous avez terminé.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Form {...form}>
            <form
              id="ingredient-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Nom */}
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l’ingrédient" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Disponible */}
              <FormField
                control={form.control}
                name="disponible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disponible</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-3">
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        <span className="text-sm text-gray-600">
                          {field.value ? 'Activé' : 'Désactivé'}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Prix supplémentaire */}
              <FormField
                control={form.control}
                name="prix_suppl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix supplémentaire (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Produit associé */}
              <FormField
                control={form.control}
                name="produit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produit associé</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un produit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {produits.map((produit) => (
                          <SelectItem key={produit.id} value={`/api/produits/${produit.id}`}>
                            {produit.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <p className="text-red-600 text-center mt-2" role="alert">
                  {error}
                </p>
              )}
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button type="submit" form="ingredient-form" disabled={loading}>
            {loading ? 'En cours...' : isEdit ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
