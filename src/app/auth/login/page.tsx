'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { AuthService } from '@/services/AuthService';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!email || !password) {
      toast.error('Veuillez saisir votre email et mot de passe');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await AuthService.login({ email, password });
      
      if (response?.access) { // Vérification de access au lieu de token
        toast.success('Connexion réussie');
        router.push('/dashboard');
      } else {
        throw new Error('Token non reçu');
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      toast.error(error.message || 'Échec de la connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Toaster position="top-right" />
      <form onSubmit={handleLogin} className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-neutral-800 dark:text-neutral-200">
          Connexion
        </h2>
        <Input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          //required 
          className="dark:text-neutral-800"
        />
        <Input 
          type="password" 
          placeholder="Mot de passe" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
         // required 
          className="dark:text-neutral-800"
        />
        <Button 
          type="submit" 
          className="w-full btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </Button>
        <div className="text-center">
          <a 
            href="/password-reset" 
            className="text-primary hover:underline text-sm"
          >
            Mot de passe oublié ?
          </a>
        </div>
      </form>
    </>
  );
}