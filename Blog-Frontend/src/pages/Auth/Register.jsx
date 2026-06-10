import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../middleware/api/config';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // setFormData(prev => ({
        //     ...prev,
        //     [name]: type === 'checkbox' ? checked : value
        // }));
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation (simple pattern)
        const phoneRegex = /^[+]?[0-9]{8,15}$/;
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phoneNumber.replace(/[\s()-]/g, ''))) {
            newErrors.phoneNumber = 'Please enter a valid phone number';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setErrors({});

        const postDetails ={ 
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            password: formData.password
        }
        console.log(postDetails);
        try {
            const response = await api.post('/auth/register', postDetails);
            setSubmitSuccess(true);
            console.log(response.data);
            navigate('/login');
            // reset form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                password: ''
            });
        } catch (err) {
            console.error('Registration error:', err);
            setErrors(prev => ({
                ...prev,
                submit: err.message || 'An error occurred during registration. Please try again.'
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
                        Where ideas flow. <br />
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Share your stories with the world.</span>
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed mb-8">
                        Join our creative community of writers, thinkers, and creators today. Set up your profile in just a couple of minutes.
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

            {/* Right Side: Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-slate-950 overflow-y-auto">
                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-white">Create an account</h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 hover:underline transition">
                                Sign in instead
                            </Link>
                        </p>
                    </div>

                    {/* Success Message Banner */}
                    {submitSuccess && (
                        <div className="p-4 rounded-xl bg-blue-900/30 border border-blue-500/40 text-blue-200 animate-fadeIn">
                            <div className="flex gap-3">
                                <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="font-semibold text-white">Registration Successful!</p>
                                    <p className="text-sm text-blue-300 mt-1">Welcome to InkFlow. You can now log in with your credentials.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message Banner */}
                    {errors.submit && (
                        <div className="p-4 rounded-xl bg-red-900/30 border border-red-500/40 text-red-200 animate-fadeIn">
                            <div className="flex gap-3">
                                <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <p className="font-semibold text-white">Registration Failed</p>
                                    <p className="text-sm text-red-300 mt-1">{errors.submit}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Name Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* First Name */}
                            <div>
                                <label htmlFor="firstName" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    First Name
                                </label>
                                <div className="mt-1.5 relative">
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="John"
                                        className={`w-full px-4 py-3 bg-slate-900 border ${errors.firstName ? 'border-red-500/60 focus:ring-red-500/40' : 'border-slate-800 focus:ring-blue-500/40'} rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:border-blue-500/80 transition duration-200`}
                                    />
                                </div>
                                {errors.firstName && <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label htmlFor="lastName" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Last Name
                                </label>
                                <div className="mt-1.5 relative">
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Doe"
                                        className={`w-full px-4 py-3 bg-slate-900 border ${errors.lastName ? 'border-red-500/60 focus:ring-red-500/40' : 'border-slate-800 focus:ring-blue-500/40'} rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:border-blue-500/80 transition duration-200`}
                                    />
                                </div>
                                {errors.lastName && <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>}
                            </div>
                        </div>

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

                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phoneNumber" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Phone Number
                            </label>
                            <div className="mt-1.5 relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 019-2834"
                                    className={`w-full pl-11 pr-4 py-3 bg-slate-900 border ${errors.phoneNumber ? 'border-red-500/60 focus:ring-red-500/40' : 'border-slate-800 focus:ring-blue-500/40'} rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:border-blue-500/80 transition duration-200`}
                                />
                            </div>
                            {errors.phoneNumber && <p className="mt-1 text-xs text-red-400">{errors.phoneNumber}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Password
                            </label>
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

                        {/* Terms and Conditions */}
                        <div className="flex flex-col">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500/40 focus:ring-offset-slate-950 transition cursor-pointer"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="agreeToTerms" className="text-slate-400 select-none cursor-pointer">
                                        I agree to the{' '}
                                        <a href="#" className="font-semibold text-blue-400 hover:text-blue-300 hover:underline">
                                            Terms of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href="#" className="font-semibold text-blue-400 hover:text-blue-300 hover:underline">
                                            Privacy Policy
                                        </a>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full mt-2 relative py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:scale-100 transition-all duration-200 cursor-pointer flex items-center justify-center`}
                        >
                            {isSubmitting ? (
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;