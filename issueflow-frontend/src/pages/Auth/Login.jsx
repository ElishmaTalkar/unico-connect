import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Github, Twitter, Linkedin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { AnimatedFormField, SocialButton, FloatingParticles } from './components/AnimatedAuth';
import '../../styles/auth.css';

export const Login = () => {
    const { login } = useAuth();
    const { push } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await login(data);
            push('Logged in successfully', 'success');
            navigate('/dashboard');
        } catch (error) {
            const dataErr = error.response?.data;
            const errMsg = dataErr?.error || (dataErr?.errors && dataErr.errors[0]?.message) || 'Failed to login';
            push(errMsg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            <FloatingParticles />

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                            <User className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
                        <p className="text-muted-foreground">Sign in to continue to IssueFlow</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <AnimatedFormField
                            type="email"
                            placeholder="Email Address"
                            icon={<Mail size={18} />}
                            error={errors.email?.message}
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                            })}
                        />

                        <AnimatedFormField
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            icon={<Lock size={18} />}
                            showToggle
                            onToggle={() => setShowPassword(!showPassword)}
                            showPassword={showPassword}
                            error={errors.password?.message}
                            {...register('password', { required: 'Password is required' })}
                        />

                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                                />
                                <span className="text-sm text-muted-foreground">Remember me</span>
                            </label>

                            <button type="button" className="text-sm text-primary hover:underline">
                                Forgot password?
                            </button>
                        </div>

                        <Button type="submit" variant="primary" className="w-full py-6 text-lg" isLoading={isLoading}>
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                            <SocialButton icon={<Github size={20} />} name="GitHub" />
                            <SocialButton icon={<Twitter size={20} />} name="Twitter" />
                            <SocialButton icon={<Linkedin size={20} />} name="LinkedIn" />
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary hover:underline font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
