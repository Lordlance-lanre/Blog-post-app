import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/userSlice';
import api from '../../middleware/api/config';

const ViewBlogs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const rawPage = searchParams.get('page');
  const page = Number(rawPage) > 0 ? Number(rawPage) : 1;

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ currentPage: page, totalPages: 1, totalCount: 0 });

  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  // Load user from localStorage
  useEffect(() => {
    try {
      const userInfoEncoded = localStorage.getItem('USER_Info');
      if (userInfoEncoded) {
        const decoded = JSON.parse(userInfoEncoded);
        setUser(decoded);
      }
    } catch (err) {
      console.error('Error parsing user info:', err);
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

  useEffect(() => {
    if (rawPage && (Number(rawPage) < 1 || Number.isNaN(Number(rawPage)))) {
      setSearchParams({ page: '1' }, { replace: true });
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await api.get(`/blog/all-posts?page=${page}`);
        console.log('Fetched data:', data.blog);
        const items = Array.isArray(data.blog) ? data.blog : [];

        const totalCount = items.length;
        const totalPages = data.totalPages || items.totalPages || data.blog?.totalPages;

        setBlogs(items);
        setPagination({ currentPage: page, totalPages, totalCount });
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to load blog posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, rawPage, setSearchParams]);

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setSearchParams({ page: String(newPage) });
  };

  const handleLogout = () => {
    localStorage.removeItem('TOKS');
    localStorage.removeItem('USER_Info');
    localStorage.clear();
    dispatch(logout());
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const pageButtons = () => {
    const buttons = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(pagination.totalPages, start + 4);

    for (let i = start; i <= end; i += 1) {
      buttons.push(
        <button
          key={i}
          type="button"
          onClick={() => changePage(i)}
          className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            i === page 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105' 
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  const renderBlogCard = (blog) => {
    const title = blog.title || blog.heading || 'Untitled Post';
    const excerpt = blog.description || blog.excerpt || 'No description available yet.';
    const author = (blog.User ? `${blog.User.first_name} ${blog.User.last_name}` : null) || blog.userName || blog.user || 'Unknown Author';
    const date = blog.date || blog.created_at || blog.createdAt || 'Unknown date';
    const image = blog.image_url || blog.imageUrl || blog.image || '';
    const category = blog.category || blog.tag || 'General';
    const id = blog.id || blog._id || blog.blogId;

    return (
      <article 
        key={id} 
        className="group flex flex-col rounded-2xl bg-slate-900/20 border border-slate-900 hover:border-slate-800/80 hover:bg-slate-900/30 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 transform hover:-translate-y-1.5"
      >
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-950/40 to-indigo-950/40">
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg className="w-12 h-12 text-slate-700 group-hover:text-blue-500/30 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className="px-2.5 py-1 rounded-md bg-slate-950/70 border border-white/5 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-slate-200">
              {category}
            </span>
          </div>
        </div>
        
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {author}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-800"></span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {date}
              </span>
            </div>
            
            <h2 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
              {title}
            </h2>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
              {excerpt}
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => navigate(`/blogs/all-posts?page=${page}`)}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white font-semibold rounded-xl text-xs shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 group"
          >
            Read More
            <svg className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden relative pb-16">
      {/* Background glowing gradient blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-blue-900/10 blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[45%] h-[40%] rounded-full bg-purple-900/10 blur-[150px] pointer-events-none z-0"></div>

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
            <span onClick={() => navigate('/')} className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent cursor-pointer">MajTek</span>
          </div>

          {/* Navigation items */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <Link to="/" className="hover:text-blue-400 transition">Dashboard</Link>
            <span className="text-white border-b border-blue-500/80 pb-1 cursor-default">Explore Posts</span>
            <Link to="/blogs/create" className="hover:text-blue-400 transition">Write</Link>
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
                  <Link to="/blogs/create" className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-slate-850 hover:text-white transition">
                    <svg className="w-4.5 h-4.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Blog
                  </Link>
                  <Link to="/" className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-slate-850 hover:text-white transition">
                    <svg className="w-4.5 h-4.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    My Published Posts
                  </Link>
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

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Hero Banner Section */}
        <div className="relative mb-12 rounded-3xl overflow-hidden bg-slate-900/40 border border-slate-900 p-8 sm:p-10 backdrop-blur-sm">
          {/* Subtle decoration inside banner */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-800/40 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                Archived Knowledge Base
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Explore the <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Latest Insights</span>
              </h1>
              <p className="text-slate-400 text-sm mt-3 max-w-xl leading-relaxed">
                Discover a collection of deep technical articles, design processes, and development walkthroughs created by the MajTek community.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/blogs/all-posts?page=1')}
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white text-xs font-semibold rounded-xl transition duration-200 flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Board
              </button>
              <Link
                to="/blogs/create"
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Write New Post
              </Link>
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Top Toolbar: Showing Page / Pagination Controls */}
            <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl backdrop-blur-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Active Catalog View</p>
                <p className="text-sm font-bold text-white mt-1">
                  Page {pagination.currentPage} <span className="text-slate-650 font-normal">/ {pagination.totalPages}</span>
                </p>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => changePage(1)}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-slate-700 transition duration-150 cursor-pointer"
                  title="First Page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => changePage(page - 1)}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-slate-700 transition duration-150 cursor-pointer"
                  title="Previous Page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex gap-1.5 mx-1">
                  {pageButtons()}
                </div>

                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => changePage(page + 1)}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-slate-700 transition duration-150 cursor-pointer"
                  title="Next Page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => changePage(pagination.totalPages)}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-slate-700 transition duration-150 cursor-pointer"
                  title="Last Page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Articles List / Grid */}
            {loading ? (
              /* Premium Pulsing Skeleton Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-slate-900/10 border border-slate-900 rounded-2xl p-5 space-y-4 animate-pulse">
                    <div className="h-44 bg-slate-900/40 rounded-xl"></div>
                    <div className="space-y-2">
                      <div className="h-3.5 bg-slate-900/40 rounded w-1/3"></div>
                      <div className="h-5 bg-slate-900/40 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-900/40 rounded w-full"></div>
                      <div className="h-4 bg-slate-900/40 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              /* Redesigned Premium Error state card */
              <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-10 text-center max-w-lg mx-auto">
                <div className="w-14 h-14 bg-red-900/30 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-500/5">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Board Loading Blocked</h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  We encountered an issue communicating with the database. Please verify your connection status.
                </p>
                <p className="text-xs text-red-400/90 font-mono bg-red-950/30 border border-red-500/10 rounded-lg p-2.5 mt-4 inline-block">
                  {error}
                </p>
              </div>
            ) : blogs.length === 0 ? (
              /* Premium Empty state design */
              <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-12 text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-slate-900/40 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-800">
                  <svg className="w-7 h-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">No articles archived yet</h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  There are no blog posts published for this catalog block. Be the first to add one!
                </p>
                <Link
                  to="/blogs/create"
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Create First Post
                </Link>
              </div>
            ) : (
              /* Gorgeous Card Grid layout */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map(renderBlogCard)}
              </div>
            )}
          </div>

          {/* Sidebar Stats Panel */}
          <div className="space-y-6">
            
            {/* Quick stats widget */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm sticky top-24">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 border-b border-slate-900 pb-3 mb-4">
                Session Catalog Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3.5 bg-slate-900/30 border border-slate-900/40 rounded-xl hover:border-slate-800 transition duration-150">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Page Pool size</span>
                  </div>
                  <span className="text-sm font-bold text-white">{pagination.totalCount}</span>
                </div>
                
                <div className="flex justify-between items-center p-3.5 bg-slate-900/30 border border-slate-900/40 rounded-xl hover:border-slate-800 transition duration-150">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Viewing Page</span>
                  </div>
                  <span className="text-sm font-bold text-white">{pagination.currentPage}</span>
                </div>

                <div className="flex justify-between items-center p-3.5 bg-slate-900/30 border border-slate-900/40 rounded-xl hover:border-slate-800 transition duration-150">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Total Page Sets</span>
                  </div>
                  <span className="text-sm font-bold text-white">{pagination.totalPages}</span>
                </div>
              </div>

              {/* Static tip card in stats sidebar */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-blue-900/10 to-indigo-900/10 border border-blue-900/20 text-xs text-slate-400 leading-relaxed relative overflow-hidden">
                <div className="absolute top-[-30%] right-[-30%] w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex items-start gap-2.5 relative z-10">
                  <svg className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-semibold text-white block mb-0.5">Quick Tip</span>
                    Use the navigation controls to easily switch pages or submit a new post using the navbar links.
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 mt-16 relative z-10">
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

export default ViewBlogs;