import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Github, Twitter, Linkedin, Mail, Lock, User } from "lucide-react";
import { cn } from "../../../utils/cn";

interface FormFieldProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: React.ReactNode;
    showToggle?: boolean;
    onToggle?: () => void;
    showPassword?: boolean;
    error?: string;
    name?: string;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const AnimatedFormField: React.FC<FormFieldProps> = ({
    type,
    placeholder,
    value,
    onChange,
    icon,
    showToggle,
    onToggle,
    showPassword,
    error,
    name,
    onBlur,
    onFocus
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    return (
        <div className="relative group">
            <div
                className={cn(
                    "relative overflow-hidden rounded-lg border transition-all duration-300 ease-in-out",
                    error ? "border-destructive" : (isFocused ? "border-primary" : "border-border"),
                    "bg-card/50 backdrop-blur-sm"
                )}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <div className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200",
                    isFocused ? "text-primary" : "text-muted-foreground"
                )}>
                    {icon}
                </div>

                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={(e) => {
                        setIsFocused(true);
                        onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur?.(e);
                    }}
                    className="w-full bg-transparent pl-10 pr-12 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
                    placeholder=""
                />

                <label className={cn(
                    "absolute left-10 transition-all duration-200 ease-in-out pointer-events-none",
                    isFocused || value
                        ? 'top-2 text-xs text-primary font-medium'
                        : 'top-1/2 -translate-y-1/2 text-sm text-muted-foreground'
                )}>
                    {placeholder}
                </label>

                {showToggle && (
                    <button
                        type="button"
                        onClick={onToggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}

                {isHovering && !error && (
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(200px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(19, 36, 64, 0.2) 0%, transparent 70%)`
                        }}
                    />
                )}
            </div>
            {error && <p className="text-xs text-destructive mt-1 ml-1">{error}</p>}
        </div>
    );
};

export const SocialButton: React.FC<{ icon: React.ReactNode; name: string; onClick?: () => void }> = ({ icon, name, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            type="button"
            onClick={onClick}
            className="relative group p-3 rounded-lg border border-border bg-card/50 hover:bg-accent transition-all duration-300 ease-in-out overflow-hidden flex items-center justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={cn(
                "absolute inset-0 bg-gradient-to-r from-dark-blue/20 via-primary/10 to-transparent transition-transform duration-500",
                isHovered ? 'translate-x-0' : '-translate-x-full'
            )} />
            <div className="relative text-foreground group-hover:text-primary transition-colors">
                {icon}
            </div>
        </button>
    );
};

export const FloatingParticles: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const setCanvasSize = () => {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };

        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            opacity: number;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.3;
            }

            update() {
                if (!canvas) return;
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = `rgba(19, 36, 64, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const particles: Particle[] = [];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
};
