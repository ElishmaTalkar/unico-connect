import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Github, Twitter, Linkedin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { AnimatedFormField, SocialButton, FloatingParticles } from './components/AnimatedAuth';
import '../../styles/auth.css';

export const Signup = () => {
    const { signup } = useAuth();
    const { push } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const password = watch('password');

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await signup({
                name: data.name,
                email: data.email,
                password: data.password
            });
            push('Account created successfully', 'success');
            navigate('/dashboard');
        } catch (error) {
            const dataErr = error.response?.data;
            const errMsg = dataErr?.error || (dataErr?.errors && dataErr.errors[0]?.message) || 'Failed to create account';
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
                        <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
                        <p className="text-muted-foreground">Join IssueFlow today and start organizing</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <AnimatedFormField
                            type="text"
                            placeholder="Full Name"
                            icon={<User size={18} />}
                            error={errors.name?.message}
                            {...register('name', {
                                required: 'Name is required',
                                pattern: { value: /^[a-zA-Z\s'-]{2,80}$/, message: 'Name must be 2-80 letters' }
                            })}
                        />

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
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 8, message: 'Password must be at least 8 characters' }
                            })}
                        />

                        <AnimatedFormField
                            type="password"
                            placeholder="Confirm Password"
                            icon={<Lock size={18} />}
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: value => value === password || 'Passwords do not match'
                            })}
                        />

                        <Button type="submit" variant="primary" className="w-full py-6 text-lg mt-4" isLoading={isLoading}>
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6">
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
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
