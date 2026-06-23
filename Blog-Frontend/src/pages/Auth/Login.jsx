import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../../middleware/api/config';
import { setEmail, setToken, setUserId } from '../../store/userSlice';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Load saved email if 'Remember me' was checked
    useEffect(() => {
        const savedEmail = localStorage.getItem('remembered_email');
        if (savedEmail) {
            setFormData(prev => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    const handleAutofillDemo = () => {
        setFormData({
            email: 'john.doe@example.com',
            password: 'password123'
        });
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await api.post('/auth/login', {
                email: formData.email.trim(),
                password: formData.password
            });

            // console.log('Login response:', response);

            // Handle successful login response
            if (response.token) {
                localStorage.setItem('TOKS', response.token);
                localStorage.setItem('USER_Info', JSON.stringify({id: response.user.id, name: response.user.first_name + ' ' + response.user.last_name, email: response.user.email, phone: response.user.phone}));
                dispatch(setToken(response.token));
                dispatch(setUserId(response.user.id));
                dispatch(setEmail(response.user.email));
            }

            

            // Manage Remember Me preference
            if (rememberMe) {
                localStorage.setItem('remembered_email', btoa(formData.email.trim()));
            } else {
                localStorage.removeItem('remembered_email');
            }

            // Redirect user to the dashboard/home page
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setErrors(prev => ({
                ...prev,
                submit: err.message || 'Invalid email or password. Please try again.'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex text-slate-100 selection:bg-blue-600 selection:text-white">
            {/* Left Side: Brand & Accent (Hidden on mobile) */}
            <div className="relative hidden lg:flex lg:w-1/2 bg-slate-900 overflow-hidden flex-col justify-between p-12 border-r border-slate-800">
                {/* Decorative glowing gradient blobs */}
                <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[60%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[50%] rounded-full bg-indigo-900/10 blur-[100px] pointer-events-none"></div>

                {/* Header/Logo */}
                <div className="relative z-10 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">MajTek</span>
                </div>

                {/* Marketing Copy / Hero Center */}
                <div className="relative z-10 max-w-md my-auto">
                    <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white mb-6">
                        Welcome back. <br />
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Continue sharing your stories with the world.</span>
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed mb-8">
                        Log in to access your dashboard, write new posts, and keep up with stories from creators around the globe.
                    </p>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800">
                        <div>
                            <p className="text-2xl font-bold text-white">10k+</p>
                            <p className="text-sm text-slate-500">Active Bloggers</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">50k+</p>
                            <p className="text-sm text-slate-500">Published Posts</p>
                        </div>
                    </div>
                </div>

                {/* Footer credit */}
                <div className="relative z-10 text-xs text-slate-500">
                    &copy; 2026 InkFlow Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-slate-950 overflow-y-auto">
                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-white">Sign in to your account</h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300 hover:underline transition">
                                Sign up instead
                            </Link>
                        </p>
                    </div>

                    {/* Error Message Banner */}
                    {errors.submit && (
                        <div className="p-4 rounded-xl bg-red-900/30 border border-red-500/40 text-red-200 animate-fadeIn">
                            <div className="flex gap-3">
                                <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <p className="font-semibold text-white">Sign In Failed</p>
                                    <p className="text-sm text-red-300 mt-1">{errors.submit}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Email Address
                            </label>
                            <div className="mt-1.5 relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john.doe@example.com"
                                    className={`w-full pl-11 pr-4 py-3 bg-slate-900 border ${errors.email ? 'border-red-500/60 focus:ring-red-500/40' : 'border-slate-800 focus:ring-blue-500/40'} rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:border-blue-500/80 transition duration-200`}
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Password
                                </label>
                                <a href="#" className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline transition">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="mt-1.5 relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full pl-11 pr-11 py-3 bg-slate-900 border ${errors.password ? 'border-red-500/60 focus:ring-red-500/40' : 'border-slate-800 focus:ring-blue-500/40'} rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:border-blue-500/80 transition duration-200`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
                        </div>

                        {/* Options: Remember Me & Quick Demo Autofill */}
                        <div className="flex items-center justify-between text-sm py-1">
                            <label className="flex items-center space-x-2 text-slate-400 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={handleRememberMeChange}
                                    className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500/40 focus:ring-offset-slate-950 transition cursor-pointer"
                                />
                                <span>Remember me</span>
                            </label>
                            
                            <button
                                type="button"
                                onClick={handleAutofillDemo}
                                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition"
                            >
                                Use Demo Account
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-2 relative py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:scale-100 transition-all duration-200 cursor-pointer flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;