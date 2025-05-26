import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setSuccess('Sign up successful! Please check your email to confirm your account.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else {
        setSuccess('Logged in successfully! Redirecting...');
        setTimeout(() => navigate('/track-order'), 800);
      }
    }
    setLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage(null);
    setError(null);
    if (!email) {
      setError('Please enter your email to reset your password.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setError(error.message);
    else setResetMessage('Password reset email sent! Please check your inbox.');
  };

  return (
    <div className="space-y-4 max-w-sm mx-auto p-6 rounded-xl bg-zinc-900 shadow-lg border border-zinc-800">
      <h2 className="text-2xl font-semibold mb-2 text-white text-center">{isSignUp ? 'Sign Up' : 'Log In'}</h2>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="email" className="text-zinc-200">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="bg-zinc-800 text-zinc-100 placeholder-zinc-500 border-zinc-700 focus:ring-2 focus:ring-primary mt-2 mb-4"
        />
        <Label htmlFor="password" className="text-zinc-200">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="bg-zinc-800 text-zinc-100 placeholder-zinc-500 border-zinc-700 focus:ring-2 focus:ring-primary mt-2 mb-4"
        />
        <Button type="submit" className="w-full" variant="default" disabled={loading}>
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
        </Button>
        <Button
          type="button"
          variant="link"
          className="w-full text-blue-400 hover:text-blue-300"
          onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccess(null); setShowReset(false); setResetMessage(null); }}
        >
          {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
        </Button>
        {!isSignUp && (
          <Button
            type="button"
            variant="link"
            className="w-full text-blue-400 hover:text-blue-300"
            onClick={() => { setShowReset(!showReset); setResetMessage(null); setError(null); }}
          >
            Forgot Password?
          </Button>
        )}
      </form>
      {showReset && (
        <form onSubmit={handlePasswordReset} className="mt-2">
          <Label htmlFor="reset-email" className="text-zinc-200">Enter your email to reset password</Label>
          <Input
            id="reset-email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="bg-zinc-800 text-zinc-100 placeholder-zinc-500 border-zinc-700 focus:ring-2 focus:ring-primary mb-4"
          />
          <Button type="submit" className="w-full" variant="default">Send Reset Email</Button>
        </form>
      )}
      {error && <div className="text-red-400 text-sm mt-2 font-medium text-center">{error}</div>}
      {success && <div className="text-green-400 text-sm mt-2 font-medium text-center">{success}</div>}
      {resetMessage && <div className="text-green-400 text-sm mt-2 font-medium text-center">{resetMessage}</div>}
    </div>
  );
} 