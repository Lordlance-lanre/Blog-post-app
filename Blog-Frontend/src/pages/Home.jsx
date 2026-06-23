import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/userSlice';

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const menuRef = useRef(null);
    const blogsSectionRef = useRef(null);

    // Get user from localStorage (decoding since it's base64 encoded by user's changes)
    useEffect(() => {
        try {
            const userInfoEncoded = localStorage.getItem('USER_Info');
            if (userInfoEncoded) {
                const decoded = JSON.parse(userInfoEncoded);
                setUser(decoded);
            }
        } catch (error) {
            console.error('Error parsing user info:', error);
        }
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('TOKS');
        localStorage.removeItem('USER_Info');
        localStorage.clear();
        dispatch(logout());
        navigate('/login');
    };

    const scrollToBlogs = () => {
        blogsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const categories = ['All', 'Technology', 'Design', 'Development', 'Creativity', 'Lifestyle'];

    const mockPosts = [
        {
            id: 1,
            title: 'The Future of Web Development in 2026',
            excerpt: 'Explore the shifting landscape of frontend architectures, AI-assisted coding, and the next generation of web performance standards.',
            category: 'Technology',
            readTime: '5 min read',
            date: 'June 12, 2026',
            author: 'Jane Doe',
            gradient: 'from-blue-600 to-indigo-600',
        },
        {
            id: 2,
            title: 'Mastering Glassmorphism in Modern UI Design',
            excerpt: 'Learn how to create beautiful, accessible glassmorphic cards and navigation elements using pure CSS and modern styling tokens.',
            category: 'Design',
            readTime: '8 min read',
            date: 'June 10, 2026',
            author: 'Alex Carter',
            gradient: 'from-purple-600 to-pink-600',
        },
        {
            id: 3,
            title: 'Building Scalable APIs with Fiber and Go',
            excerpt: 'A deep-dive tutorial on structuring high-performance Go Fiber applications, handling database connections, and securing routes.',
            category: 'Development',
            readTime: '12 min read',
            date: 'June 08, 2026',
            author: 'Michael Chen',
            gradient: 'from-cyan-500 to-blue-600',
        },
        {
            id: 4,
            title: 'Cultivating Creative Flow in an Era of Distraction',
            excerpt: 'Practical strategies for writers and creators to build focus blocks, combat creative block, and maintain consistent output.',
            category: 'Creativity',
            readTime: '6 min read',
            date: 'June 05, 2026',
            author: 'Sophia Vance',
            gradient: 'from-orange-500 to-amber-500',
        },
        {
            id: 5,
            title: 'Tailwind CSS v4: What You Need to Know',
            excerpt: 'A comprehensive walkthrough of the new features in Tailwind CSS v4, including faster compilation, new CSS parser, and clean upgrades.',
            category: 'Development',
            readTime: '7 min read',
            date: 'June 01, 2026',
            author: 'Lucas Thorne',
            gradient: 'from-teal-500 to-emerald-600',
        },
        {
            id: 6,
            title: 'Minimalism in Digital Workspace Setup',
            excerpt: 'How decluttering your desktop, editors, and operating systems can lead to enhanced coding efficiency and peace of mind.',
            category: 'Lifestyle',
            readTime: '4 min read',
            date: 'May 28, 2026',
            author: 'Emma Watson',
            gradient: 'from-rose-500 to-red-500',
        }
    ];

    const filteredPosts = mockPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden relative">
            {/* Background glowing gradient blobs */}
            {/* <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-blue-900/10 blur-[150px] pointer-events-none z-0"></div>
            <div className="absolute top-[40%] left-[-15%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[40%] rounded-full bg-purple-900/10 blur-[150px] pointer-events-none z-0"></div> */}

            {/* Sticky Header Navbar */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                        </div>
                        <span onClick={() => navigate('/')} className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">MajTek</span>
                    </div>

                    {/* Navigation items */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                        <a href="#" className="text-white hover:text-blue-400 transition">Dashboard</a>
                        <button onClick={scrollToBlogs} className="hover:text-blue-400 cursor-pointer transition">Explore Posts</button>
                        <Link to="/createBlog" className="hover:text-blue-400 transition">Write</Link>
                    </nav>

                    {/* User Profile Dropdown */}
                    <div className="relative" ref={menuRef}>
                        <button 
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-900 border border-slate-900 hover:border-slate-800 transition duration-150 cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-blue-500/10">
                                {getInitials(user?.name)}
                            </div>
                            <span className="hidden sm:inline text-xs font-medium text-slate-300 pr-1.5">{user?.name || 'User'}</span>
                            <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2.5 w-56 rounded-xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-md py-2 text-slate-300 animate-fadeIn z-50">
                                <div className="px-4 py-2.5 border-b border-slate-800">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Signed in as</p>
                                    <p className="text-sm font-semibold text-white truncate">{user?.name || 'Creator'}</p>
                                    <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email || ''}</p>
                                </div>
                                <div className="py-1">
                                    <Link to="/createBlog" className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-slate-850 hover:text-white transition">
                                        <svg className="w-4.5 h-4.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Create New Blog
                                    </Link>
                                    <button onClick={scrollToBlogs} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left hover:bg-slate-850 hover:text-white transition cursor-pointer">
                                        <svg className="w-4.5 h-4.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                        </svg>
                                        My Published Posts
                                    </button>
                                </div>
                                <div className="border-t border-slate-800 pt-1.5 mt-1.5">
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition cursor-pointer"
                                    >
                                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    {/* Premium Micro-badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-800/40 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                        Platform Dashboard Live
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-8">
                        Where Ideas Ignite. <br />
                        <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                            Share Stories with the World.
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
                        Welcome to your creative sanctuary. Write deep tech blogs, publish outstanding tutorials, and connect with a worldwide community of developers and innovators.
                    </p>

                    {/* High-impact CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                            to="/createBlog" 
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group"
                        >
                            <svg className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Create New Blog
                        </Link>
                        <button 
                            onClick={scrollToBlogs}
                            className="w-full sm:w-auto px-8 py-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold rounded-xl shadow-md backdrop-blur active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group"
                        >
                            Explore Published Posts
                            <svg className="w-4 h-4 text-slate-400 transition-transform duration-200 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Platform Highlights Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto mt-20 pt-12 border-t border-slate-900">
                    <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 backdrop-blur-sm flex flex-col justify-between hover:border-slate-800/80 transition duration-300">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Publications</span>
                        <div className="flex items-baseline gap-2 mt-4">
                            <span className="text-3xl font-bold text-white">142</span>
                            <span className="text-xs font-semibold text-emerald-400">+12 this week</span>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 backdrop-blur-sm flex flex-col justify-between hover:border-slate-800/80 transition duration-300">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Account Engagement</span>
                        <div className="flex items-baseline gap-2 mt-4">
                            <span className="text-3xl font-bold text-white">4.8k</span>
                            <span className="text-xs font-semibold text-blue-400">reads total</span>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 backdrop-blur-sm flex flex-col justify-between hover:border-slate-800/80 transition duration-300">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Platform Status</span>
                        <div className="flex items-baseline gap-2 mt-4">
                            <span className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                                Fully Operational
                            </span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Blogs Section (Explorer) */}
            <section ref={blogsSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-900 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Recent Articles</h2>
                        <p className="text-slate-400 text-sm mt-1">Explore insightful posts curated directly from our tech writers.</p>
                    </div>

                    {/* Search Input bar */}
                    <div className="relative w-full md:w-80">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-blue-500/80 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition duration-200"
                        />
                    </div>
                </div>

                {/* Categories Chip Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition whitespace-nowrap cursor-pointer ${
                                selectedCategory === category 
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/10' 
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Blog Cards Grid */}
                {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <article 
                                key={post.id}
                                className="group flex flex-col rounded-2xl bg-slate-900/20 border border-slate-900 hover:border-slate-800/80 hover:bg-slate-900/30 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {/* Simulated Card Header Graphic */}
                                <div className={`h-40 bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-slate-950/20"></div>
                                    {/* Abstract art lines */}
                                    <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full border-4 border-white/10 group-hover:scale-110 transition-transform duration-300"></div>
                                    <div className="absolute -left-5 -top-5 w-24 h-24 rounded-full border-4 border-white/10 group-hover:scale-110 transition-transform duration-300"></div>
                                    
                                    {/* Category Pill Tag */}
                                    <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-slate-950/70 border border-white/5 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-slate-200">
                                        {post.category}
                                    </span>
                                </div>

                                {/* Content Details */}
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        {/* Date and Reading Time */}
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                                            <span>{post.date}</span>
                                            <span>•</span>
                                            <span>{post.readTime}</span>
                                        </div>

                                        {/* Post Title */}
                                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
                                            {post.title}
                                        </h3>

                                        {/* Snippet / Excerpt */}
                                        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    </div>

                                    {/* Author & CTA */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-900">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                                                {getInitials(post.author)}
                                            </div>
                                            <span className="text-xs font-semibold text-slate-300">{post.author}</span>
                                        </div>

                                        {/* Animated read button arrow */}
                                        <button className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-all duration-200 cursor-pointer">
                                            Read More
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    /* Empty state search warning */
                    <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/10 border border-slate-900 max-w-md mx-auto">
                        <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h4 className="text-base font-bold text-white">No articles matched your criteria</h4>
                        <p className="text-xs text-slate-500 mt-1.5">Try widening your search terms or selecting another category filter.</p>
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-900 bg-slate-950 mt-20 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <div>
                        &copy; 2026 MajTek Inc. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-slate-400 transition">Terms of Service</a>
                        <a href="#" className="hover:text-slate-400 transition">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-400 transition">Contact Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
