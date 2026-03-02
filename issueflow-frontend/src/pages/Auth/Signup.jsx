import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import '../../styles/auth.css';

export const Signup = () => {
    const { signup } = useAuth();
    const { push } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

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
            navigate('/');
        } catch (error) {
            const dataErr = error.response?.data;
            const errMsg = dataErr?.error || (dataErr?.errors && dataErr.errors[0]?.message) || 'Failed to create account';
            push(errMsg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Create an account</h1>
                    <p className="auth-subtitle">Start organizing your work with IssueFlow</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        label="Full Name"
                        placeholder="Jane Doe"
                        error={errors.name?.message}
                        {...register('name', {
                            required: 'Name is required',
                            pattern: { value: /^[a-zA-Z\s'\-]{2,80}$/, message: 'Name must be 2-80 letters' }
                        })}
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        error={errors.email?.message}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                        })}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        {...register('password', {
                            required: 'Password is required',
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                                message: 'Password must be at least 8 chars with uppercase, lowercase, number and special char',
                            }
                        })}
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: value => value === password || 'Passwords do not match'
                        })}
                    />

                    <Button type="submit" variant="primary" className="auth-submit-btn" isLoading={isLoading}>
                        Create Account
                    </Button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
};
