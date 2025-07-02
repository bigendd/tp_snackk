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
import { useState } from 'react'
import { updateCategory } from '../data/categories' // adapte le chemin
// import { createCategory } from '../api/categories' // si tu as une fonction création

const formSchema = z.object({
  nom: z.string().min(1, { message: 'Le nom est requis.' }),
  disponible: z.boolean(),
})

type CategoryForm = z.infer<typeof formSchema>

interface Category {
  id?: number
  nom: string
  disponible: boolean
}

interface Props {
  currentRow?: Category
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CategoryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          nom: currentRow!.nom,
          disponible: currentRow!.disponible,
        }
      : {
          nom: '',
          disponible: true,
        },
  })

  const onSubmit = async (values: CategoryForm) => {
    setLoading(true)
    setError(null)
    try {
      if (isEdit && currentRow?.id) {
        const updated = await updateCategory(currentRow.id, values)
        if (!updated) throw new Error('Erreur lors de la mise à jour')
            window.location.reload()
      } else {
        // Exemple d'ajout (à remplacer par ta vraie fonction createCategory)
        // await createCategory(values)
        console.log('Ajouter catégorie', values)
      }
      form.reset()
      onOpenChange(false)
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
          <DialogTitle>{isEdit ? 'Modifier la catégorie' : 'Ajouter une nouvelle catégorie'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modifiez les informations de la catégorie ici. '
              : 'Créez une nouvelle catégorie ici. '}
            Cliquez sur sauvegarder quand vous avez terminé.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Form {...form}>
            <form id="category-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-right">Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de la catégorie" className="col-span-4" autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="disponible"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-right">Disponible</FormLabel>
                    <FormControl>
                      <div className="col-span-4 flex items-center">
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        <span className="ml-3 text-sm text-gray-600">{field.value ? 'Activée' : 'Désactivée'}</span>
                      </div>
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
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
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" form="category-form" disabled={loading}>
            {loading ? 'En cours...' : isEdit ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
