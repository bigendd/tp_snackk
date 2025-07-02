import { HTMLAttributes, useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

// Import de ta fonction login
import { login } from '@/lib/api/auth'

// Exemple simple de hook useAuth, adapte-le selon ta logique
function useAuth() {
  // Par exemple, regarde si un token est stocké
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  return {
    isAuthenticated: !!token,
  }
}

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirection automatique si utilisateur connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/' })
    }
  }, [isAuthenticated, navigate])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const result = await login(data.email, data.password)
      // Stocke le token en localStorage
      localStorage.setItem('token', result.token)

      console.log('Login successful:', result)
      // Redirection après connexion réussie
      navigate({ to: '/' })
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || 'Login failed. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Si utilisateur connecté, on peut afficher un message ou rien du tout (car redirigé)
  if (isAuthenticated) {
    return <p>Redirecting...</p>
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />

        {errorMessage && (
          <p className='text-sm text-red-600 mt-1'>{errorMessage}</p>
        )}

        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Login'}
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              Or continue with
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button variant='outline' type='button' disabled={isLoading}>
            <IconBrandGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button variant='outline' type='button' disabled={isLoading}>
            <IconBrandFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  )
}
