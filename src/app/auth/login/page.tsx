'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email && password) {
      router.push('/dashboard');
    }
  };

  return (
    
      <form onSubmit={handleLogin} className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-neutral-800 dark:text-neutral-200">
          Connexion
        </h2>
        <Input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <Input 
          type="password" 
          placeholder="Mot de passe" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <Button 
          type="submit" 
          className="w-full btn-primary"
        >
          Se connecter
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
    
  );
}