import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Globe, User, Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../services/api/authApi';
import { useAuthStore } from '../../store/authStore';
import type { RegisterFormData } from '../../types';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import Card from '../../components/Common/Card';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<RegisterFormData & { confirmPassword: string }>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: RegisterFormData & { confirmPassword: string }) => {
    try {
      setServerError('');
      const { confirmPassword, ...registerData } = data;
      const res = await authApi.register(registerData);
      if (res.success) {
        setAuth(res.user, res.token);
        // ✅ Redirect to dashboard after registration (not homepage)
        navigate('/dashboard', { replace: true });
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setServerError(e.response?.data?.message || 'Registration failed. Please try again.');
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
            <span className="text-[10px] text-emerald-600 font-extrabold tracking-widest uppercase">Join Free</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 leading-tight">
              Start your journey abroad.
            </h2>
            <p className="text-slate-600 text-xs mt-3 leading-relaxed">
              Create a free account to access country comparisons, university matcher, document generator, and visa checklists — all without agency fees.
            </p>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
            <ShieldCheck size={16} className="text-emerald-600" />
            No hidden charges. No middlemen. Ever.
          </div>
        </div>

        {/* Registration Form Panel - right */}
        <div className="lg:col-span-7">
          <Card hoverEffect={false} className="p-8 md:p-10 border border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-slate-900">Create your account</h1>
              <p className="text-slate-500 text-xs mt-1.5">
                Already registered?{' '}
                <Link to="/login" className="text-blue-600 font-bold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3.5 rounded-xl mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <Input
                {...register('name')}
                label="Full Name"
                placeholder="e.g. Ayan Sarkar"
                icon={<User size={16} />}
                error={errors.name?.message}
              />

              <Input
                {...register('email')}
                label="Email Address"
                placeholder="you@example.com"
                icon={<Mail size={16} />}
                error={errors.email?.message}
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="Repeat your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                glow
                isLoading={isSubmitting}
                className="w-full mt-2"
              >
                Create Account <ArrowRight size={16} className="ml-2" />
              </Button>

              <p className="text-center text-[10px] text-slate-400 mt-4">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}