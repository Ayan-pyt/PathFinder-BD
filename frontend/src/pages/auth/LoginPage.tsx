import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Globe, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { authApi } from '../../services/api/authApi';
import { useAuthStore } from '../../store/authStore';
import type { LoginFormData } from '../../types';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import Card from '../../components/Common/Card';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const [serverError, setServerError] = useState('');

  // ✅ Redirect to dashboard after login (not homepage)
  const redirectTo = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginFormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError('');
      const res = await authApi.login(data);
      if (res.success) {
        setAuth(res.user, res.token);
        navigate(redirectTo, { replace: true });
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setServerError(e.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 animated-bg flex items-center justify-center p-6 pt-24 relative overflow-hidden">
      {/* Background glow layers */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-100/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-100/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Info panel - left */}
        <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl glass-panel border border-slate-200 bg-white/70 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/10">
              <Globe size={20} className="text-white" />
            </div>
            <span className="font-extrabold text-lg text-slate-900">PathFinder</span>
          </div>

          <div className="my-12">
            <span className="text-[10px] text-blue-600 font-extrabold tracking-widest uppercase">Welcome Back</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 leading-tight">
              Manage your future directly.
            </h2>
            <p className="text-slate-600 text-xs mt-3 leading-relaxed">
              Log in to retrieve your shortlists, academic preference profile, dynamic documents checklist, and personal tasks dashboard.
            </p>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
            <ShieldCheck size={16} className="text-blue-600" />
            100% Direct Student-to-Embassy channels.
          </div>
        </div>

        {/* Input Form Panel - right */}
        <div className="lg:col-span-7">
          <Card hoverEffect={false} className="p-8 md:p-10 border border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-slate-900">Sign In</h1>
              <p className="text-slate-500 text-xs mt-1.5">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 font-bold hover:underline">
                  Create one free
                </Link>
              </p>
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3.5 rounded-xl mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <Input
                {...register('email')}
                label="Email Address"
                placeholder="you@example.com"
                icon={<Mail size={16} />}
                error={errors.email?.message}
              />

              <Input
                {...register('password')}
                label="Password"
                type="password"
                placeholder="Your secure password"
                icon={<Lock size={16} />}
                error={errors.password?.message}
              />

              <div className="flex items-center justify-between text-xs mt-1">
                <label className="flex items-center gap-2 text-slate-500 hover:text-slate-900 cursor-pointer select-none">
                  <input type="checkbox" className="w-4 h-4 rounded bg-slate-50 border border-slate-300 text-blue-600 focus:ring-0 focus:ring-offset-0" />
                  Remember me
                </label>
                <a href="#forgot" className="text-blue-600 font-bold hover:underline">Forgot password?</a>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                glow
                isLoading={isSubmitting}
                className="w-full mt-4"
              >
                Sign In <ArrowRight size={16} className="ml-2" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}