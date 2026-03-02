import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import '../../styles/auth.css';

export const Login = () => {
    const { login } = useAuth();
    const { push } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await login(data);
            push('Logged in successfully', 'success');
            navigate('/');
        } catch (error) {
            const dataErr = error.response?.data;
            const errMsg = dataErr?.error || (dataErr?.errors && dataErr.errors[0]?.message) || 'Failed to login';
            push(errMsg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Welcome back</h1>
                    <p className="auth-subtitle">Sign in to your IssueFlow account</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
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
                        {...register('password', { required: 'Password is required' })}
                    />

                    <Button type="submit" variant="primary" className="auth-submit-btn" isLoading={isLoading}>
                        Sign In
                    </Button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
};
