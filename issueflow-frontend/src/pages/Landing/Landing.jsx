import { Link, useNavigate } from 'react-router-dom';
import {
    CheckSquare,
    Zap,
    Shield,
    BarChart3,
    Users,
    Github,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import '../../styles/landing.css';
import DemoButton from '../../components/DemoButton';
import MotionButton from '../../components/ui/MotionButton';

export const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="container">
                    <div className="logo">
                        <CheckSquare size={28} className="text-primary" />
                        <span>IssueFlow</span>
                    </div>
                    <div className="nav-links">
                        <Link to="/login" className="btn btn-primary">Login</Link>
                        <Link to="/signup" className="btn btn-primary">Sign In</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero">
                <div className="container hero-content">
                    <h1 className="hero-title">
                        Streamline Your Workflow with <span className="highlight">IssueFlow</span>
                    </h1>
                    <p className="hero-subtitle">
                        The ultimate project management tool for modern teams. Track bugs, manage tasks, and visualize progress with real-time analytics.
                    </p>
                    <div className="hero-actions flex flex-col items-center gap-6">
                        <MotionButton
                            label="Start a Project"
                            onClick={() => navigate('/signup')}
                        />
                        <a href="https://github.com/ElishmaTalkar/unico-connect.git" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
                            <Github size={20} /> View on GitHub
                        </a>
                    </div>
                </div>
                <div className="hero-glow"></div>
            </header>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <div className="section-header">
                        <h2>Powerful Features</h2>
                        <p>Everything you need to ship better software, faster.</p>
                    </div>
                    <div className="feature-grid">
                        <div className="feature-card">
                            <div className="feature-icon"><Zap size={24} /></div>
                            <h3>Fast Performance</h3>
                            <p>Built with Vite and React Query for near-instant transitions and data fetching.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><BarChart3 size={24} /></div>
                            <h3>Live Analytics</h3>
                            <p>Visualize your project health with interactive charts and real-time board updates.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><Users size={24} /></div>
                            <h3>Team Collaboration</h3>
                            <p>Invite members to your workspace and collaborate on issues with threaded comments.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><Shield size={24} /></div>
                            <h3>Secure by Design</h3>
                            <p>Industry-standard JWT authentication and password hashing to keep your data safe.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <div className="cta-content flex flex-col items-center">
                        <h2 className="text-white">Ready to boost your productivity?</h2>
                        <p className="text-white/80">Join thousands of developers using IssueFlow to manage their projects.</p>
                        <MotionButton
                            label="Start Your Journey"
                            onClick={() => navigate('/signup')}
                            classes="mt-4"
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <p>&copy; 2026 IssueFlow. Built for modern development teams.</p>
                </div>
            </footer>
        </div>
    );
};
