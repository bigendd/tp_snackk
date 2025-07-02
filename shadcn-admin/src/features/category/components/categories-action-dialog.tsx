'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/utils/show-submitted-data'
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

// Schéma de validation basé sur votre entité Category
const formSchema = z.object({
  nom: z.string().min(1, { message: 'Le nom est requis.' }),
  disponible: z.boolean(),
})

type CategoryForm = z.infer<typeof formSchema>

// Interface pour votre entité Category
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
  
  const form = useForm<CategoryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          nom: currentRow.nom,
          disponible: currentRow.disponible,
        }
      : {
          nom: '',
          disponible: true, // Par défaut, une nouvelle catégorie est disponible
        },
  })

  const onSubmit = (values: CategoryForm) => {
    form.reset()
    showSubmittedData(values)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>
            {isEdit ? 'Modifier la catégorie' : 'Ajouter une nouvelle catégorie'}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? 'Modifiez les informations de la catégorie ici. ' 
              : 'Créez une nouvelle catégorie ici. '
            }
            Cliquez sur sauvegarder quand vous avez terminé.
          </DialogDescription>
        </DialogHeader>
        
        <div className='py-4'>
          <Form {...form}>
            <form
              id='category-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
            >
              <FormField
                control={form.control}
                name='nom'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Nom
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nom de la catégorie'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name='disponible'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Disponible
                    </FormLabel>
                    <FormControl>
                      <div className='col-span-4 flex items-center'>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span className='ml-3 text-sm text-gray-600'>
                          {field.value ? 'Activée' : 'Désactivée'}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        
        <DialogFooter>
          <Button 
            type='button' 
            variant='outline' 
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button type='submit' form='category-form'>
            {isEdit ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}