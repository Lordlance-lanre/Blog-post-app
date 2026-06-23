import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../middleware/api/config';

const CreateBlog = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    
    // Form States
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [userId, setUserId] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    
    // Status/Feedback States
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // { success: boolean, message: string }
    
    // Drag and drop state
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Auto-populate UserID if user is logged in
    useEffect(() => {
        try {
            const userInfoEncoded = localStorage.getItem('USER_Info');
            // console.log("userInfoEncoded>>", userInfoEncoded);
            if (userInfoEncoded) {
                const decoded = JSON.parse(userInfoEncoded);
                setUser(decoded);
                if (decoded.id) {
                    setUserId(decoded.id.toString());
                }
            }
        } catch (error) {
            console.error('Error loading user info for initial User ID:', error);
        }
    }, []);

    // Clean up preview URL when component unmounts
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // Handle Image Validation
    const validateAndSetImage = (file) => {
        const newErrors = { ...errors };
        delete newErrors.image;
        setErrors(newErrors);

        if (!file) return;

        // 1. File Type Validation
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'svg'];
        
        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
            setErrors(prev => ({ 
                ...prev, 
                image: 'Invalid file format. Only JPG, PNG, and SVG are supported.' 
            }));
            return;
        }

        // 2. File Size Validation (1MB = 1,048,576 bytes)
        const maxSize = 1 * 1024 * 1024;
        if (file.size > maxSize) {
            setErrors(prev => ({ 
                ...prev, 
                image: 'File size exceeds 1MB limit. Please upload a smaller file.' 
            }));
            return;
        }

        // Set Image File and Preview
        setImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const handleFileChange = async(e) => {
        const file = e.target.files[0];
        // console.log("file>>",file);
        validateAndSetImage(file);

        let formData = new FormData();
        formData.append('image', file);
        // console.log("formData>>",formData);
        try{
           const response = await api.post('/image/upload', formData);
        // console.log('Upload success:', response);
        // console.log('Upload success:', response.url);
        // console.log('Upload success:', typeof(response.url));
         setImageFile(response.url); 

        }catch(err){
          console.log(err);
          setSubmitStatus({
            success: false,
            message: err.message || 'Failed to upload image. Please verify backend connectivity.'
        });
        }
    };

    // Drag and Drop Handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        validateAndSetImage(file);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const removeImage = () => {
        setImageFile(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview('');
        }
    };

    // Form Validation
    const validateForm = () => {
        const newErrors = {};

        if (!title.trim()) {
            newErrors.title = 'Blog title is required';
        } else if (title.trim().length < 5) {
            newErrors.title = 'Title must be at least 5 characters long';
        }

        if (!userId.trim()) {
            newErrors.userId = 'User ID is required';
        }

        if (!description.trim()) {
            newErrors.description = 'Blog description content is required';
        } else if (description.trim().length < 20) {
            newErrors.description = 'Description content must be at least 20 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus(null);

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const payload = {
                title: title.trim(),
                description: description.trim(),
                user_id: Number(userId.trim()),
                image_url: imageFile // Assuming this is the URL returned from the image upload
            }

            // console.log("payload>>", payload);

            const response = await api.post('/blog/create', payload);
            // console.log('Blog post created successfully:', response);
            
            setSubmitStatus({
                success: true,
                message: 'Your blog post has been successfully created!'
            });

            // Reset Form Fields after short delay
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error) {
            console.error('Create blog post error:', error);
            setSubmitStatus({
                success: false,
                message: error.message || 'Failed to create blog post. Please verify backend connectivity.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden relative pb-16">
            {/* Header Navigation */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                        </div>
                        <span onClick={() => navigate('/')} className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent cursor-pointer">MajTek</span>
                    </div>
                    <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-white transition flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* Form Container */}
            <main className="max-w-2xl mx-auto px-4 sm:px-6 mt-10 relative z-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">Create New Post</h1>
                    <p className="text-slate-400 text-sm mt-2">Publish your original tech analysis, designs, and development articles.</p>
                </div>

                {/* Submit Feedback Banner */}
                {submitStatus && (
                    <div className={`p-4 rounded-xl border mb-6 animate-fadeIn ${
                        submitStatus.success 
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
                            : 'bg-red-950/30 border-red-500/40 text-red-200'
                    }`}>
                        <div className="flex gap-3">
                            {submitStatus.success ? (
                                <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            )}
                            <div>
                                <p className="font-semibold text-white">
                                    {submitStatus.success ? 'Success!' : 'Post Submission Failed'}
                                </p>
                                <p className="text-sm opacity-90 mt-0.5">{submitStatus.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Grid for Title and UserID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Title Input */}
                        <div className="md:col-span-2">
                            <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                Blog Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                                }}
                                placeholder="e.g. Master React Hooks in 2026"
                                className={`w-full px-4 py-3 bg-slate-900 border ${
                                    errors.title ? 'border-red-500/60 focus:ring-red-500/40' : 'border-slate-800 focus:ring-blue-500/40'
                                } rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:border-blue-500/80 transition duration-200`}
                            />
                            {errors.title && <p className="mt-1.5 text-xs text-red-400">{errors.title}</p>}
                        </div>

                        {/* UserID Input */}
                        <div>
                            <label htmlFor="userId" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                Author User ID
                            </label>
                            <input
                                type="text"
                                id="userId"
                                value={userId}
                                onChange={(e) => {
                                    setUserId(e.target.value);
                                    if (errors.userId) setErrors(prev => ({ ...prev, userId: '' }));
                                }}
                                placeholder="e.g. 104"
                                className={`w-full px-4 py-3 bg-slate-900 border ${
                                    errors.userId ? 'border-red-500/60 focus:ring-red-500/40' : 'border-slate-800 focus:ring-blue-500/40'
                                } rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:border-blue-500/80 transition duration-200`}
                            />
                            {errors.userId && <p className="mt-1.5 text-xs text-red-400">{errors.userId}</p>}
                            {!errors.userId && (
                                <p className="mt-1.5 text-[10px] text-slate-500">Auto-resolved from session.</p>
                            )}
                        </div>
                    </div>

                    {/* Image File Uploader */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                            Featured Header Image
                        </label>
                        
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".jpg,.jpeg,.png,.svg"
                            className="hidden"
                        />

                        {imagePreview ? (
                            /* Preview Section */
                            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/40 p-4">
                                <div className="relative h-48 sm:h-60 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
                                    <img 
                                        src={imagePreview} 
                                        alt="Blog header preview" 
                                        className="max-h-full max-w-full object-contain"
                                    />
                                    {/* Overlay overlay */}
                                    <div className="absolute inset-0 bg-slate-950/40 transition hover:bg-slate-950/60 flex items-center justify-center opacity-0 hover:opacity-100 duration-200">
                                        <button 
                                            type="button" 
                                            onClick={removeImage}
                                            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-md transition cursor-pointer"
                                        >
                                            Remove Image
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-3 text-xs text-slate-400 px-1">
                                    <span className="truncate max-w-xs">{imageFile?.name}</span>
                                    <span>{(imageFile?.size / 1024).toFixed(1)} KB</span>
                                </div>
                            </div>
                        ) : (
                            /* Drag and drop zone */
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={triggerFileInput}
                                className={`h-40 rounded-2xl border-2 border-dashed ${
                                    errors.image 
                                        ? 'border-red-500/40 hover:border-red-500/60 bg-red-950/5' 
                                        : isDragging 
                                            ? 'border-blue-500 bg-blue-950/10' 
                                            : 'border-slate-800 hover:border-slate-700 bg-slate-900/20'
                                } flex flex-col items-center justify-center px-4 py-6 text-center cursor-pointer transition-all duration-200`}
                            >
                                <svg className={`w-8 h-8 ${isDragging ? 'text-blue-400 animate-bounce' : 'text-slate-500'} mb-3`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <p className="text-sm font-semibold text-slate-200">
                                    Drag and drop your image, or <span className="text-blue-400 hover:underline">browse</span>
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Supports JPG, PNG, and SVG formats. Max size limit: 1MB.
                                </p>
                            </div>
                        )}
                        {errors.image && <p className="mt-1.5 text-xs text-red-400">{errors.image}</p>}
                    </div>

                    {/* Blog Description Textarea */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Blog Description / Content
                            </label>
                            <span className="text-[10px] text-slate-500 font-medium">
                                {description.trim().length} characters
                            </span>
                        </div>
                        <textarea
                            id="description"
                            rows="12"
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                            }}
                            placeholder="Write your article description here. Supports paragraphs and rich text updates..."
                            className={`w-full px-4 py-3 bg-slate-900 border ${
                                errors.description ? 'border-red-500/60 focus:ring-red-500/40' : 'border-slate-800 focus:ring-blue-500/40'
                            } rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:border-blue-500/80 transition duration-200 resize-y min-h-[200px]`}
                        ></textarea>
                        {errors.description && <p className="mt-1.5 text-xs text-red-400">{errors.description}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-900">
                        <Link 
                            to="/" 
                            className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition active:scale-[0.98]"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:scale-100 cursor-pointer flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    Publish Post
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default CreateBlog;