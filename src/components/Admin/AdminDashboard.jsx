import './AdminDashboard.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaQuoteLeft } from 'react-icons/fa';


const AdminDashboard = () => {



    const [dashboardStats, setDashboardStats] = useState({
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        cancelledBookings: 0,
        totalPackages: 0,
        totalUsers: 0,
        activeUsers: 0,
        totalGuides: 0,
        recentBookings: [],
        monthlyRevenue: 0,
        popularPackages: []
    });

    // Add this useEffect to fetch dashboard data when component mounts
    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Add this fetch function
    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/travelaapi/dashboard/stats`);
            setDashboardStats(response.data);
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
        }
    };

    const navigate = useNavigate();
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            // Clear localStorage
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');

            // Redirect to login page
            navigate('/admin/login');
        }
    }

    const [sidebarActive, setSidebarActive] = useState(false);
    const [activeSection, setActiveSection] = useState('packages');


    // Contact Satate
    // Add these states at the top with other states
    const [contactInfo, setContactInfo] = useState([]);
    const [contactFormData, setContactFormData] = useState({
        office: '',
        mobile: '',
        email: '',
        mapUrl: ''
    });
    const [contactEditingId, setContactEditingId] = useState(null);

    //home content
    const [homeInfo, setHomeInfo] = useState([]);
    const [homeFormData, setHomeFormData] = useState({
        topic: '',
        line: '',
        welcometopic: '',
        welcomepara1: '',
        welcomepara2: '',
        servicetopic1: '',
        servicepara1: '',
        servicetopic2: '',
        servicepara2: '',
        servicetopic3: '',
        servicepara3: '',
        servicetopic4: '',
        servicepara4: '',
    });
    const [homeEditingId, setHomeEditingId] = useState(null);


    const fetchContactInfo = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/vipapi/contact-info`);
            setContactInfo([res.data]); // Wrap in array for table display
        } catch (err) {
            console.error('Error fetching contact info:', err);
        }
    };

    const handleContactInputChange = (e) => {
        setContactFormData({ ...contactFormData, [e.target.name]: e.target.value });
    };

    const fetchHomeInfo = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/vipapi/home`);

            // Ensure homeInfo is always an array of objects
            const data = Array.isArray(res.data) ? res.data : [res.data];
            setHomeInfo(data);
        } catch (err) {
            console.error('Error fetching home info:', err);
        }
    };


    const handleHomeInputChange = (e) => {
        setHomeFormData({ ...homeFormData, [e.target.name]: e.target.value });
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        try {
            if (contactEditingId) {
                await axios.put(`${process.env.REACT_APP_API_URL}/vipapi/contact-info/${contactEditingId}`, contactFormData);
                alert('Contact info updated successfully');
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/vipapi/contact-info`, contactFormData);
                alert('Contact info created successfully');
            }

            setContactFormData({ mobile: '', email: '' });
            setContactEditingId(null);
            fetchContactInfo();
        } catch (err) {
            console.error(err);
            alert('Error saving contact info');
        }
    };

    const handleContactEdit = (contact) => {
        setContactEditingId(contact._id);
        setContactFormData({
            mobile: contact.mobile,
            email: contact.email,
        });
    };

    const handleHomeSubmit = async (e) => {
        e.preventDefault();
        try {
            if (homeEditingId) {
                await axios.put(`${process.env.REACT_APP_API_URL}/vipapi/home/${homeEditingId}`, homeFormData);
                alert('Home Content updated successfully');
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/vipapi/home`, homeFormData);
                alert('Home Content created successfully');
            }

            setHomeFormData({ topic: '', line: '', welcometopic: '', welcomepara1: '', welcomepara2: '', servicetopic1: '', servicepara1: '', servicetopic2: '', servicepara2: '', servicetopic3: '', servicepara3: '', servicetopic4: '', servicepara4: '' });
            setHomeEditingId(null);
            fetchHomeInfo();
        } catch (err) {
            console.error(err);
            alert('Error saving home info');
        }
    };

    const handleHomeEdit = (home) => {
        if (!home || !home._id) {
            console.error('Invalid home data:', home);
            return;
        }

        setHomeEditingId(home._id);
        setHomeFormData({
            topic: home.topic || '',
            line: home.line || '',
            welcometopic: home.welcometopic || '',
            welcomepara1: home.welcomepara1 || '',
            welcomepara2: home.welcomepara2 || '',
            servicetopic1: home.servicetopic1 || '',
            servicepara1: home.servicepara1 || '',
            servicetopic2: home.servicetopic2 || '',
            servicepara2: home.servicepara2 || '',
            servicetopic3: home.servicetopic3 || '',
            servicepara3: home.servicepara3 || '',
            servicetopic4: home.servicetopic4 || '',
            servicepara4: home.servicepara4 || '',
        });
    };

    useEffect(() => {
        fetchHomeInfo();
    }, []);

    const toggleSidebar = () => {
        setSidebarActive(!sidebarActive);
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
        if (window.innerWidth <= 768) {
            setSidebarActive(false);
        }
    };

    const [users, setUsers] = useState([]);
    const [userFormData, setUserFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        status: 'active'
    });
    const [editingUserId, setEditingUserId] = useState(null);
    const [showUserForm, setShowUserForm] = useState(false);
    const [userStats, setUserStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        newThisMonth: 0
    });
    const [userSearch, setUserSearch] = useState('');

    // Add to useEffect dependencies
    useEffect(() => {
        if (activeSection === 'users') {
            fetchUsers();
            fetchUserStats();
        }
        // ... rest of your existing useEffect code
    }, [activeSection]);

    // Fetch functions
    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/travelaapi/users`);
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
            alert('Error fetching users');
        }
    };

    const fetchUserStats = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/travelaapi/users/stats/summary`);
            setUserStats(res.data);
        } catch (err) {
            console.error('Error fetching user stats:', err);
        }
    };

    // Handler functions
    const handleUserInputChange = (e) => {
        setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUserId) {
                // Don't send password if it's empty during edit
                const updateData = { ...userFormData };
                if (!updateData.password) {
                    delete updateData.password;
                }

                await axios.put(`${process.env.REACT_APP_API_URL}/travelaapi/users/${editingUserId}`, updateData);
                alert('User updated successfully');
            } else {
                if (!userFormData.password) {
                    alert('Password is required for new users');
                    return;
                }
                await axios.post(`${process.env.REACT_APP_API_URL}/travelaapi/users`, userFormData);
                alert('User created successfully');
            }

            setUserFormData({ name: '', email: '', password: '', role: 'user', status: 'active' });
            setEditingUserId(null);
            setShowUserForm(false);
            fetchUsers();
            fetchUserStats();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Error saving user');
        }
    };

    const handleUserEdit = (user) => {
        setEditingUserId(user._id);
        setUserFormData({
            name: user.name,
            email: user.email,
            password: '', // Don't populate password for security
            role: user.role,
            status: user.status
        });
        setShowUserForm(true);
    };

    const handleUserDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/travelaapi/users/${id}`);
                alert('User deleted successfully');
                fetchUsers();
                fetchUserStats();
            } catch (err) {
                console.error(err);
                alert('Error deleting user');
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const searchLower = userSearch.toLowerCase();
        return user.name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.role?.toLowerCase().includes(searchLower);
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleString();
    };

    // ============= ABOUT STATE (Replace existing about state) =============
    const [abouts, setAbouts] = useState([]);
    const [aboutFormData, setAboutFormData] = useState({
        section1Heading: '',
        section1Para1: '',
        section1Para2: '',
        section2Para1: '',
        section2Para2: '',
        section2Para3: ''
    });
    const [aboutImages, setAboutImages] = useState({
        section1Image: null,
        section2Image: null
    });
    const [aboutPreviews, setAboutPreviews] = useState({
        section1: null,
        section2: null
    });
    const [aboutEditingId, setAboutEditingId] = useState(null);

    // ============= ABOUT HANDLERS (Replace existing about handlers) =============
    const fetchAbouts = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/vipapi/about`);
            // Backend returns single document, wrap in array for consistency
            if (res.data) {
                setAbouts([res.data]);
            }
        } catch (err) {
            console.error('Error fetching Content:', err);
        }
    };

    const handleAboutInputChange = (e) => {
        setAboutFormData({ ...aboutFormData, [e.target.name]: e.target.value });
    };

    const handleAboutImageChange = (e, section) => {
        const file = e.target.files[0];
        if (file) {
            setAboutImages({
                ...aboutImages,
                [section]: file
            });

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAboutPreviews({
                    ...aboutPreviews,
                    [section === 'section1Image' ? 'section1' : 'section2']: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAboutSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();

            // Append text data
            Object.keys(aboutFormData).forEach(key => {
                if (aboutFormData[key]) {
                    formDataToSend.append(key, aboutFormData[key]);
                }
            });

            // Append images if selected
            if (aboutImages.section1Image) {
                formDataToSend.append('section1Image', aboutImages.section1Image);
            }
            if (aboutImages.section2Image) {
                formDataToSend.append('section2Image', aboutImages.section2Image);
            }

            if (aboutEditingId) {
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/vipapi/about/${aboutEditingId}`,
                    formDataToSend,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                alert('Content updated successfully');
            } else {
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/vipapi/about`,
                    formDataToSend,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                alert('Content created successfully');
            }

            // Reset form
            setAboutFormData({
                section1Heading: '',
                section1Para1: '',
                section1Para2: '',
                section2Para1: '',
                section2Para2: '',
                section2Para3: ''
            });
            setAboutImages({ section1Image: null, section2Image: null });
            setAboutPreviews({ section1: null, section2: null });
            setAboutEditingId(null);
            fetchAbouts();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Error saving content');
        }
    };

    const handleAboutEdit = (about) => {
        setAboutEditingId(about._id);
        setAboutFormData({
            section1Heading: about.section1?.heading || '',
            section1Para1: about.section1?.paragraph1 || '',
            section1Para2: about.section1?.paragraph2 || '',
            section2Para1: about.section2?.paragraph1 || '',
            section2Para2: about.section2?.paragraph2 || '',
            section2Para3: about.section2?.paragraph3 || ''
        });

        // Set image previews if they exist
        setAboutPreviews({
            section1: about.section1?.image ? `${process.env.REACT_APP_API_URL}/${about.section1.image}` : null,
            section2: about.section2?.image ? `${process.env.REACT_APP_API_URL}/${about.section2.image}` : null
        });

        setAboutImages({ section1Image: null, section2Image: null });
    };

    const handleAboutDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this content?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/vipapi/about/${id}`);
                alert('Content deleted successfully');
                fetchAbouts();
            } catch (err) {
                console.error(err);
                alert('Error deleting content');
            }
        }
    };

    // Add these states with your other states
    const [galleryItems, setGalleryItems] = useState([]);
    const [galleryFormData, setGalleryFormData] = useState({
        name: ''
    });
    const [galleryImage, setGalleryImage] = useState(null);
    const [galleryPreview, setGalleryPreview] = useState(null);
    const [galleryEditingId, setGalleryEditingId] = useState(null);

    // Add to your useEffect
    useEffect(() => {
        // ... existing code
        if (activeSection === 'gallery') {
            fetchGalleryItems();
        }
    }, [activeSection]);

    // Add these handler functions
    const fetchGalleryItems = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/vipapi/gallery`);
            setGalleryItems(res.data);
        } catch (err) {
            console.error('Error fetching gallery items:', err);
        }
    };

    const handleGalleryInputChange = (e) => {
        setGalleryFormData({ ...galleryFormData, [e.target.name]: e.target.value });
    };

    const handleGalleryImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setGalleryImage(file);
            setGalleryPreview(URL.createObjectURL(file));
        }
    };

    const handleGallerySubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', galleryFormData.name);

            if (galleryImage) {
                formData.append('image', galleryImage);
            } else if (!galleryEditingId) {
                alert('Please select an image');
                return;
            }

            if (galleryEditingId) {
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/vipapi/gallery/${galleryEditingId}`,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                alert('Gallery item updated successfully');
            } else {
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/vipapi/gallery`,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                alert('Gallery item created successfully');
            }

            setGalleryFormData({ name: '' });
            setGalleryImage(null);
            setGalleryPreview(null);
            setGalleryEditingId(null);
            fetchGalleryItems();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Error saving gallery item');
        }
    };

    const handleGalleryEdit = (item) => {
        setGalleryEditingId(item._id);
        setGalleryFormData({ name: item.name });
        setGalleryPreview(`${process.env.REACT_APP_API_URL}/${item.image}`);
        setGalleryImage(null);
    };

    const handleGalleryDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this gallery item?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/vipapi/gallery/${id}`);
                alert('Gallery item deleted successfully');
                fetchGalleryItems();
            } catch (err) {
                console.error(err);
                alert('Error deleting gallery item');
            }
        }
    };

    // Add these states with your other states
    const [testimonials, setTestimonials] = useState([]);
    const [testimonialFormData, setTestimonialFormData] = useState({
        name: '',
        role: '',
        quote: '',
        isActive: true
    });
    const [testimonialEditingId, setTestimonialEditingId] = useState(null);
    const [testimonialStats, setTestimonialStats] = useState({
        total: 0,
        active: 0,
        inactive: 0
    });

    // Add to your useEffect
    useEffect(() => {
        // ... existing code
        if (activeSection === 'testimonials') {
            fetchTestimonials();
        }
    }, [activeSection]);

    // Add these handler functions
    const fetchTestimonials = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/vipapi/testimonials`);
            setTestimonials(res.data);
            calculateTestimonialStats(res.data);
        } catch (err) {
            console.error('Error fetching testimonials:', err);
        }
    };

    const calculateTestimonialStats = (data) => {
        const stats = {
            total: data.length,
            active: data.filter(t => t.isActive).length,
            inactive: data.filter(t => !t.isActive).length
        };
        setTestimonialStats(stats);
    };

    const handleTestimonialInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTestimonialFormData({
            ...testimonialFormData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleTestimonialSubmit = async (e) => {
        e.preventDefault();
        try {
            if (testimonialEditingId) {
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/vipapi/testimonials/${testimonialEditingId}`,
                    testimonialFormData
                );
                alert('Testimonial updated successfully');
            } else {
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/vipapi/testimonials`,
                    testimonialFormData
                );
                alert('Testimonial created successfully');
            }

            setTestimonialFormData({ name: '', role: '', quote: '', isActive: true });
            setTestimonialEditingId(null);
            fetchTestimonials();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Error saving testimonial');
        }
    };

    const handleTestimonialEdit = (testimonial) => {
        setTestimonialEditingId(testimonial._id);
        setTestimonialFormData({
            name: testimonial.name,
            role: testimonial.role,
            quote: testimonial.quote,
            isActive: testimonial.isActive
        });
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleTestimonialDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this testimonial?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/vipapi/testimonials/${id}`);
                alert('Testimonial deleted successfully');
                fetchTestimonials();
            } catch (err) {
                console.error(err);
                alert('Error deleting testimonial');
            }
        }
    };

    const handleTestimonialToggle = async (id) => {
        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/vipapi/testimonials/${id}/toggle`);
            fetchTestimonials();
        } catch (err) {
            console.error(err);
            alert('Error toggling testimonial status');
        }
    };

    // Add these states with your other states (around line 100-200)
    const [vipPackages, setVipPackages] = useState([]);
    const [vipPackageFormData, setVipPackageFormData] = useState({
        packageId: '',
        title: '',
        description: '',
        price: '',
        isActive: true,
        displayOrder: 0
    });
    const [vipPackageImage, setVipPackageImage] = useState(null);
    const [vipPackagePreview, setVipPackagePreview] = useState(null);
    const [vipPackageEditingId, setVipPackageEditingId] = useState(null);
    const [vipPackageStats, setVipPackageStats] = useState({
        total: 0,
        active: 0,
        inactive: 0
    });

    // Add these states with your other vipPackage states
    const [vipPackageDetailedData, setVipPackageDetailedData] = useState({
        detailedTitle: '',
        detailedIntro: '',
        proTip: ''
    });

    const [vipPackageSections, setVipPackageSections] = useState([
        { sectionTitle: '', sectionContent: '', sectionImage: null }
    ]);

    const [sectionPreviews, setSectionPreviews] = useState([]);

    // Update handleVipPackageInputChange to include detailed fields
    const handleVipPackageDetailedInputChange = (e) => {
        const { name, value } = e.target;
        setVipPackageDetailedData({
            ...vipPackageDetailedData,
            [name]: value
        });
    };

    // Handle section changes
    const handlevipSectionChange = (index, field, value) => {
        const updatedSections = [...vipPackageSections];
        updatedSections[index][field] = value;
        setVipPackageSections(updatedSections);
    };

    const handleSectionImageChange = (index, file) => {
        const updatedSections = [...vipPackageSections];
        updatedSections[index].sectionImage = file;
        setVipPackageSections(updatedSections);

        // Update preview
        const updatedPreviews = [...sectionPreviews];
        updatedPreviews[index] = URL.createObjectURL(file);
        setSectionPreviews(updatedPreviews);
    };

    const addSection = () => {
        setVipPackageSections([
            ...vipPackageSections,
            { sectionTitle: '', sectionContent: '', sectionImage: null }
        ]);
        setSectionPreviews([...sectionPreviews, null]);
    };

    const removeSection = (index) => {
        const updatedSections = vipPackageSections.filter((_, i) => i !== index);
        const updatedPreviews = sectionPreviews.filter((_, i) => i !== index);
        setVipPackageSections(updatedSections);
        setSectionPreviews(updatedPreviews);
    };

    // Update handleVipPackageSubmit
    const handleVipPackageSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('packageId', vipPackageFormData.packageId);
            formData.append('title', vipPackageFormData.title);
            formData.append('price', vipPackageFormData.price);
            formData.append('description', vipPackageFormData.description);
            formData.append('isActive', vipPackageFormData.isActive);
            formData.append('displayOrder', vipPackageFormData.displayOrder);

            // Add detailed content
            formData.append('detailedTitle', vipPackageDetailedData.detailedTitle);
            formData.append('detailedIntro', vipPackageDetailedData.detailedIntro);
            formData.append('proTip', vipPackageDetailedData.proTip);

            // Add sections
            formData.append('sections', JSON.stringify(vipPackageSections.map(s => ({
                sectionTitle: s.sectionTitle,
                sectionContent: s.sectionContent
            }))));

            if (vipPackageImage) {
                formData.append('image', vipPackageImage);
            } else if (!vipPackageEditingId) {
                alert('Please select an image');
                return;
            }

            // Add section images
            vipPackageSections.forEach((section) => {
                if (section.sectionImage) {
                    formData.append('sectionImages', section.sectionImage);
                }
            });

            if (vipPackageEditingId) {
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/vipapi/packages/${vipPackageEditingId}`,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                alert('Package updated successfully');
            } else {
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/vipapi/packages`,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                alert('Package created successfully');
            }

            // Reset all forms
            setVipPackageFormData({ packageId: '', title: '', description: '', price: '', isActive: true, displayOrder: 0 });
            setVipPackageDetailedData({ detailedTitle: '', detailedIntro: '', proTip: '' });
            setVipPackageSections([{ sectionTitle: '', sectionContent: '', sectionImage: null }]);
            setSectionPreviews([]);
            setVipPackageImage(null);
            setVipPackagePreview(null);
            setVipPackageEditingId(null);
            fetchVipPackages();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Error saving package');
        }
    };

    // Update handleVipPackageEdit
    const handleVipPackageEdit = (pkg) => {
        setVipPackageEditingId(pkg._id);
        setVipPackageFormData({
            packageId: pkg.packageId,
            title: pkg.title,
            price: pkg.price,
            description: pkg.description,
            isActive: pkg.isActive,
            displayOrder: pkg.displayOrder
        });
        setVipPackageDetailedData({
            detailedTitle: pkg.detailedTitle || '',
            detailedIntro: pkg.detailedIntro || '',
            proTip: pkg.proTip || ''
        });

        // Set sections
        if (pkg.sections && pkg.sections.length > 0) {
            setVipPackageSections(pkg.sections.map(s => ({
                sectionTitle: s.sectionTitle,
                sectionContent: s.sectionContent,
                sectionImage: null
            })));
            setSectionPreviews(pkg.sections.map(s =>
                s.sectionImage ? `${process.env.REACT_APP_API_URL}/${s.sectionImage}` : null
            ));
        }

        setVipPackagePreview(`${process.env.REACT_APP_API_URL}/${pkg.image}`);
        setVipPackageImage(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    const fetchVipPackages = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/vipapi/packages`);
            setVipPackages(res.data);
            calculateVipPackageStats(res.data);
        } catch (err) {
            console.error('Error fetching packages:', err);
        }
    };

    const calculateVipPackageStats = (data) => {
        const stats = {
            total: data.length,
            active: data.filter(p => p.isActive).length,
            inactive: data.filter(p => !p.isActive).length
        };
        setVipPackageStats(stats);
    };

    const handleVipPackageInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setVipPackageFormData({
            ...vipPackageFormData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleVipPackageImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVipPackageImage(file);
            setVipPackagePreview(URL.createObjectURL(file));
        }
    };

    const handleVipPackageDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this package?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/vipapi/packages/${id}`);
                alert('Package deleted successfully');
                fetchVipPackages();
            } catch (err) {
                console.error(err);
                alert('Error deleting package');
            }
        }
    };

    const handleVipPackageToggle = async (id) => {
        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/vipapi/packages/${id}/toggle`);
            fetchVipPackages();
        } catch (err) {
            console.error(err);
            alert('Error toggling package status');
        }
    };

    const handleVipPackageOrderChange = async (id, newOrder) => {
        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/vipapi/packages/${id}/order`, {
                displayOrder: newOrder
            });
            fetchVipPackages();
        } catch (err) {
            console.error(err);
            alert('Error updating display order');
        }
    };



    const [bookings, setBookings] = useState([]);
    const [bookingFormData, setBookingFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        checkin: '',
        checkout: '',
        destination: '',
        adults: 1,
        children: 0,
        request: '',
        status: 'pending'
    });
    const [bookingEditingId, setBookingEditingId] = useState(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [bookingStats, setBookingStats] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        cancelled: 0
    });
    const [bookingSearch, setBookingSearch] = useState('');
    const [bookingStatusFilter, setBookingStatusFilter] = useState('all');

    // Add to your useEffect (around line 500)
    useEffect(() => {
        // ... existing code
        if (activeSection === 'bookings') {
            fetchBookings();
        }
    }, [activeSection]);

    // Add these handler functions (around line 800)
    const fetchBookings = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/vipapi/bookings`);
            setBookings(res.data);
            calculateBookingStats(res.data);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            alert('Error fetching bookings');
        }
    };

    const calculateBookingStats = (data) => {
        const stats = {
            total: data.length,
            pending: data.filter(b => b.status === 'pending').length,
            confirmed: data.filter(b => b.status === 'confirmed').length,
            cancelled: data.filter(b => b.status === 'cancelled').length
        };
        setBookingStats(stats);
    };

    const handleBookingInputChange = (e) => {
        const { name, value, type } = e.target;
        setBookingFormData({
            ...bookingFormData,
            [name]: type === 'number' ? parseInt(value) || 0 : value
        });
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        try {
            if (bookingEditingId) {
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/vipapi/bookings/${bookingEditingId}`,
                    bookingFormData
                );
                alert('Booking updated successfully');
            } else {
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/vipapi/bookings`,
                    bookingFormData
                );
                alert('Booking created successfully');
            }

            setBookingFormData({
                name: '',
                phone: '',
                email: '',
                address: '',
                checkin: '',
                checkout: '',
                destination: '',
                adults: 1,
                children: 0,
                request: '',
                status: 'pending'
            });
            setBookingEditingId(null);
            setShowBookingForm(false);
            fetchBookings();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Error saving booking');
        }
    };

    const handleBookingEdit = (booking) => {
        setBookingEditingId(booking._id);
        setBookingFormData({
            name: booking.name,
            phone: booking.phone,
            email: booking.email,
            address: booking.address,
            checkin: booking.checkin ? new Date(booking.checkin).toISOString().split('T')[0] : '',
            checkout: booking.checkout ? new Date(booking.checkout).toISOString().split('T')[0] : '',
            destination: booking.destination,
            adults: booking.adults,
            children: booking.children,
            request: booking.request || '',
            status: booking.status
        });
        setShowBookingForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBookingDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/vipapi/bookings/${id}`);
                alert('Booking deleted successfully');
                fetchBookings();
            } catch (err) {
                console.error(err);
                alert('Error deleting booking');
            }
        }
    };

    const handleBookingStatusChange = async (id, newStatus) => {
        try {
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/vipapi/bookings/${id}/status`,
                { status: newStatus }
            );
            fetchBookings();
        } catch (err) {
            console.error(err);
            alert('Error updating booking status');
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const searchLower = bookingSearch.toLowerCase();
        const matchesSearch =
            booking.name?.toLowerCase().includes(searchLower) ||
            booking.email?.toLowerCase().includes(searchLower) ||
            booking.destination?.toLowerCase().includes(searchLower) ||
            booking.phone?.includes(bookingSearch);

        const matchesStatus = bookingStatusFilter === 'all' || booking.status === bookingStatusFilter;

        return matchesSearch && matchesStatus;
    });

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };




    useEffect(() => {
        if (activeSection === 'packages') {
            fetchVipPackages();
        }
        if (activeSection === 'bookings') {

        }
        if (activeSection === 'website') {
            fetchAbouts();
            fetchContactInfo();
        }

    }, [activeSection]);

    const renderContent = () => {
        switch (activeSection) {

            case 'users':
                return (
                    <div className="content-wrapper">
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">User Management</h2>
                            </div>

                            {/* User Statistics */}
                            <div className="users-content">
                                <div className="users-stats">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="dashboard-card">
                                                <h5>Total Users</h5>
                                                <h3>{userStats.total}</h3>
                                                <small className="text-success">All registered users</small>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="dashboard-card">
                                                <h5>Active Users</h5>
                                                <h3>{userStats.active}</h3>
                                                <small className="text-success">Currently active</small>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="dashboard-card">
                                                <h5>New This Month</h5>
                                                <h3>{userStats.newThisMonth}</h3>
                                                <small className="text-warning">Last 30 days</small>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="dashboard-card">
                                                <h5>Inactive Users</h5>
                                                <h3>{userStats.inactive}</h3>
                                                <small className="text-info">Deactivated</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* User Form */}
                                {showUserForm && (
                                    <div className="package-form" style={{ marginTop: '20px' }}>
                                        <h4>{editingUserId ? 'Edit User' : 'Add New User'}</h4>
                                        <form onSubmit={handleUserSubmit}>
                                            <input
                                                name="name"
                                                placeholder="Full Name"
                                                value={userFormData.name}
                                                onChange={handleUserInputChange}
                                                required
                                            />
                                            <input
                                                name="email"
                                                type="email"
                                                placeholder="Email Address"
                                                value={userFormData.email}
                                                onChange={handleUserInputChange}
                                                required
                                            />
                                            <input
                                                name="password"
                                                type="password"
                                                placeholder={editingUserId ? "New Password (leave blank to keep current)" : "Password"}
                                                value={userFormData.password}
                                                onChange={handleUserInputChange}
                                                required={!editingUserId}
                                            />
                                            <select
                                                name="role"
                                                value={userFormData.role}
                                                onChange={handleUserInputChange}
                                                required
                                            >
                                                <option value="user">User</option>
                                                <option value="agent">Agent</option>
                                                <option value="editor">Editor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <select
                                                name="status"
                                                value={userFormData.status}
                                                onChange={handleUserInputChange}
                                                required
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>

                                            <button type="submit">
                                                {editingUserId ? 'Update User' : 'Create User'}
                                            </button>
                                            <button type="button" onClick={() => {
                                                setEditingUserId(null);
                                                setUserFormData({ name: '', email: '', password: '', role: 'user', status: 'active' });
                                                setShowUserForm(false);
                                            }}>Cancel</button>
                                        </form>
                                    </div>
                                )}

                                {/* Users Table Section */}
                                <div className="users-table-section" style={{ marginTop: '20px' }}>
                                    <div className="table-header">
                                        <h4>All Users ({filteredUsers.length})</h4>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <input
                                                type="text"
                                                placeholder="Search users..."
                                                value={userSearch}
                                                onChange={(e) => setUserSearch(e.target.value)}
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: '5px',
                                                    border: '1px solid #ddd',
                                                    minWidth: '200px'
                                                }}
                                            />
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    setShowUserForm(true);
                                                    setEditingUserId(null);
                                                    setUserFormData({ name: '', email: '', password: '', role: 'user', status: 'active' });
                                                }}
                                            >
                                                Add New User
                                            </button>
                                        </div>
                                    </div>
                                    <div className="users-table">
                                        {filteredUsers.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                                No users found.
                                            </div>
                                        ) : (
                                            <table >
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Role</th>
                                                        <th>Last Login</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredUsers.map(user => (
                                                        <tr key={user._id}>
                                                            <td>{user._id}</td>
                                                            <td>{user.name}</td>
                                                            <td>{user.email}</td>
                                                            <td>
                                                                <span className={`role-badge role-${user.role}`}>
                                                                    {user.role.toUpperCase()}
                                                                </span>
                                                            </td>
                                                            <td>{formatDate(user.lastLogin)}</td>
                                                            <td>
                                                                <span className={`status ${user.status}`}>
                                                                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="btn-action edit"
                                                                    onClick={() => handleUserEdit(user)}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    className="btn-action delete"
                                                                    onClick={() => handleUserDelete(user._id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'bookings':
                return (
                    <div className="content-wrapper">
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">Booking Management</h2>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '5px 0 0 0' }}>
                                    Manage customer bookings and reservations
                                </p>
                            </div>

                            {/* Booking Statistics */}
                            <div className="users-content">
                                <div className="users-stats">

                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="dashboard-card" style={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: 'white'
                                            }}>
                                                <h5 style={{ color: 'rgba(255,255,255,0.9)' }}>Total Bookings</h5>
                                                <h3 style={{ color: 'white' }}>{bookingStats.total}</h3>
                                                <small style={{ color: 'rgba(255,255,255,0.8)' }}>All bookings</small>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="dashboard-card" style={{
                                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                                color: 'white'
                                            }}>
                                                <h5 style={{ color: 'rgba(255,255,255,0.9)' }}>Pending</h5>
                                                <h3 style={{ color: 'white' }}>{bookingStats.pending}</h3>
                                                <small style={{ color: 'rgba(255,255,255,0.8)' }}>Awaiting confirmation</small>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="dashboard-card" style={{
                                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                                color: 'white'
                                            }}>
                                                <h5 style={{ color: 'rgba(255,255,255,0.9)' }}>Confirmed</h5>
                                                <h3 style={{ color: 'white' }}>{bookingStats.confirmed}</h3>
                                                <small style={{ color: 'rgba(255,255,255,0.8)' }}>Active bookings</small>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="dashboard-card" style={{
                                                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                                color: 'white'
                                            }}>
                                                <h5 style={{ color: 'rgba(255,255,255,0.9)' }}>Cancelled</h5>
                                                <h3 style={{ color: 'white' }}>{bookingStats.cancelled}</h3>
                                                <small style={{ color: 'rgba(255,255,255,0.8)' }}>Cancelled bookings</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Form */}
                                {showBookingForm && (
                                    <div className="package-form" style={{ marginTop: '20px' }}>
                                        <h4>{bookingEditingId ? 'Edit Booking' : 'Add New Booking'}</h4>
                                        <form onSubmit={handleBookingSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                                        Customer Name *
                                                    </label>
                                                    <input
                                                        name="name"
                                                        placeholder="Full Name"
                                                        value={bookingFormData.name}
                                                        onChange={handleBookingInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                                        Email *
                                                    </label>
                                                    <input
                                                        name="email"
                                                        type="email"
                                                        placeholder="Email Address"
                                                        value={bookingFormData.email}
                                                        onChange={handleBookingInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="row" style={{ marginTop: '15px' }}>
                                                <div className="col-md-6">
                                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                                        Phone *
                                                    </label>
                                                    <input
                                                        name="phone"
                                                        type="tel"
                                                        placeholder="Phone Number"
                                                        value={bookingFormData.phone}
                                                        onChange={handleBookingInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                                        Address
                                                    </label>
                                                    <input
                                                        name="address"
                                                        placeholder="Customer Address"
                                                        value={bookingFormData.address}
                                                        onChange={handleBookingInputChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row" style={{ marginTop: '15px' }}>
                                                <div className="col-md-6">
                                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                                        Check-in Date *
                                                    </label>
                                                    <input
                                                        name="checkin"
                                                        type="date"
                                                        value={bookingFormData.checkin}
                                                        onChange={handleBookingInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                                        Check-out Date *
                                                    </label>
                                                    <input
                                                        name="checkout"
                                                        type="date"
                                                        value={bookingFormData.checkout}
                                                        onChange={handleBookingInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="row" style={{ marginTop: '15px' }}>
                                                <div className="col-md-12">
                                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                                        Destination *
                                                    </label>
                                                    <input
                                                        name="destination"
                                                        placeholder="Tour Destination"
                                                        value={bookingFormData.destination}
                                                        onChange={handleBookingInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="row" style={{ marginTop: '15px' }}>
                                                <div className="col-md-6">
                                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                                        Adults *
                                                    </label>
                                                    <input
                                                        name="adults"
                                                        type="number"
                                                        min="1"
                                                        placeholder="Number of Adults"
                                                        value={bookingFormData.adults}
                                                        onChange={handleBookingInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                                        Children
                                                    </label>
                                                    <input
                                                        name="children"
                                                        type="number"
                                                        min="0"
                                                        placeholder="Number of Children"
                                                        value={bookingFormData.children}
                                                        onChange={handleBookingInputChange}
                                                    />
                                                </div>
                                            </div>

                                            <div style={{ marginTop: '15px' }}>
                                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                                    Booking Status
                                                </label>
                                                <select
                                                    name="status"
                                                    value={bookingFormData.status}
                                                    onChange={handleBookingInputChange}
                                                    required
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>

                                            <div style={{ marginTop: '15px' }}>
                                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                                    Special Requests
                                                </label>
                                                <textarea
                                                    name="request"
                                                    placeholder="Any special requests or notes..."
                                                    value={bookingFormData.request}
                                                    onChange={handleBookingInputChange}
                                                    rows="4"
                                                />
                                            </div>

                                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                                <button type="submit">
                                                    {bookingEditingId ? 'Update Booking' : 'Create Booking'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setBookingEditingId(null);
                                                        setBookingFormData({
                                                            name: '',
                                                            phone: '',
                                                            email: '',
                                                            address: '',
                                                            checkin: '',
                                                            checkout: '',
                                                            destination: '',
                                                            adults: 1,
                                                            children: 0,
                                                            request: '',
                                                            status: 'pending'
                                                        });
                                                        setShowBookingForm(false);
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Bookings Table Section */}
                                <div className="users-table-section" style={{ marginTop: '20px' }}>
                                    <div className="table-header">
                                        <h4>All Bookings ({filteredBookings.length})</h4>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <input
                                                type="text"
                                                placeholder="Search bookings..."
                                                value={bookingSearch}
                                                onChange={(e) => setBookingSearch(e.target.value)}
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: '5px',
                                                    border: '1px solid #ddd',
                                                    minWidth: '200px'
                                                }}
                                            />
                                            <select
                                                value={bookingStatusFilter}
                                                onChange={(e) => setBookingStatusFilter(e.target.value)}
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: '5px',
                                                    border: '1px solid #ddd'
                                                }}
                                            >
                                                <option value="all">All Status</option>
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    setShowBookingForm(true);
                                                    setBookingEditingId(null);
                                                    setBookingFormData({
                                                        name: '',
                                                        phone: '',
                                                        email: '',
                                                        address: '',
                                                        checkin: '',
                                                        checkout: '',
                                                        destination: '',
                                                        adults: 1,
                                                        children: 0,
                                                        request: '',
                                                        status: 'pending'
                                                    });
                                                }}
                                            >
                                                Add New Booking
                                            </button>
                                        </div>
                                    </div>
                                    <div className="users-table">
                                        {filteredBookings.length === 0 ? (
                                            <div style={{
                                                textAlign: 'center',
                                                padding: '40px',
                                                color: '#64748b',
                                                background: '#f8fafc',
                                                borderRadius: '10px'
                                            }}>
                                                <i className="fas fa-calendar-times" style={{ fontSize: '3rem', marginBottom: '15px', opacity: 0.3 }}></i>
                                                <p style={{ fontSize: '1.1rem' }}>No bookings found</p>
                                                <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                                                    {bookingSearch || bookingStatusFilter !== 'all'
                                                        ? 'Try adjusting your filters'
                                                        : 'Add your first booking above'}
                                                </p>
                                            </div>
                                        ) : (
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Customer</th>
                                                        <th>Destination</th>
                                                        <th>Check-in</th>
                                                        <th>Check-out</th>
                                                        <th>Guests</th>
                                                        <th>Status</th>
                                                        <th>Created</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredBookings.map(booking => (
                                                        <tr key={booking._id}>

                                                            <td style={{ fontWeight: '600' }}>{booking.name}</td>

                                                            <td>{booking.destination}</td>
                                                            <td>{formatDateTime(booking.checkin)}</td>
                                                            <td>{formatDateTime(booking.checkout)}</td>
                                                            <td>
                                                                <div style={{ fontSize: '0.9rem' }}>
                                                                    {booking.adults} Adult{booking.adults !== 1 ? 's' : ''}
                                                                    {booking.children > 0 && `, ${booking.children} Child${booking.children !== 1 ? 'ren' : ''}`}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <select
                                                                    value={booking.status}
                                                                    onChange={(e) => handleBookingStatusChange(booking._id, e.target.value)}
                                                                    style={{
                                                                        padding: '6px 12px',
                                                                        borderRadius: '20px',
                                                                        border: 'none',
                                                                        cursor: 'pointer',
                                                                        fontWeight: '600',
                                                                        fontSize: '0.85rem',
                                                                        background:
                                                                            booking.status === 'confirmed' ? '#d4edda' :
                                                                                booking.status === 'cancelled' ? '#f8d7da' : '#fff3cd',
                                                                        color:
                                                                            booking.status === 'confirmed' ? '#155724' :
                                                                                booking.status === 'cancelled' ? '#721c24' : '#856404'
                                                                    }}
                                                                >
                                                                    <option value="pending">Pending</option>
                                                                    <option value="confirmed">Confirmed</option>
                                                                    <option value="cancelled">Cancelled</option>
                                                                </select>
                                                            </td>
                                                            <td>{formatDateTime(booking.createdAt)}</td>
                                                            <td>
                                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                                    <button
                                                                        className="btn-action edit"
                                                                        onClick={() => handleBookingEdit(booking)}
                                                                        title="Edit booking"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        className="btn-action delete"
                                                                        onClick={() => handleBookingDelete(booking._id)}
                                                                        title="Delete booking"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );


            case 'packages':
                return (
                    <div className="content-wrapper">
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">Tour Packages</h2>
                            </div>

                            <div className="package-form" style={{ marginTop: '20px' }}>
                                <h4>{vipPackageEditingId ? 'Edit Package' : 'Add New Package'}</h4>
                                <form onSubmit={handleVipPackageSubmit} encType="multipart/form-data">

                                    {/* Basic Information */}
                                    <div style={{
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '10px',
                                        padding: '20px',
                                        marginBottom: '25px',
                                        background: '#f8fafc'
                                    }}>
                                        <h5 style={{ color: '#475569', marginBottom: '15px', fontSize: '1.1rem', fontWeight: '600' }}>
                                            📝 Basic Information
                                        </h5>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                                    Package ID (for URL):
                                                </label>
                                                <input
                                                    name="packageId"
                                                    placeholder="e.g., pa1, colombo-tour"
                                                    value={vipPackageFormData.packageId}
                                                    onChange={handleVipPackageInputChange}
                                                    required
                                                    style={{ marginBottom: '15px' }}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                                    Display Order:
                                                </label>
                                                <input
                                                    name="displayOrder"
                                                    type="number"
                                                    placeholder="0"
                                                    value={vipPackageFormData.displayOrder}
                                                    onChange={handleVipPackageInputChange}
                                                    style={{ marginBottom: '15px' }}
                                                />
                                            </div>
                                        </div>

                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                            Package Title:
                                        </label>
                                        <input
                                            name="title"
                                            placeholder="e.g., 7 Day Sri Lanka Tour"
                                            value={vipPackageFormData.title}
                                            onChange={handleVipPackageInputChange}
                                            required
                                            style={{ marginBottom: '15px' }}
                                        />

                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                            Package Price:
                                        </label>
                                        <input
                                            name="price"
                                            placeholder=""
                                            value={vipPackageFormData.price}
                                            onChange={handleVipPackageInputChange}
                                            required
                                            style={{ marginBottom: '15px' }}
                                        />

                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                            Short Description (for card):
                                        </label>
                                        <textarea
                                            name="description"
                                            placeholder="Brief description for package card..."
                                            value={vipPackageFormData.description}
                                            onChange={handleVipPackageInputChange}
                                            required
                                            rows="3"
                                            style={{ marginBottom: '15px' }}
                                        />

                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569' }}>
                                                Main Package Image:
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleVipPackageImageChange}
                                                style={{ marginBottom: '10px' }}
                                            />
                                            {vipPackagePreview && (
                                                <img
                                                    src={vipPackagePreview}
                                                    alt="Preview"
                                                    style={{ maxWidth: '300px', height: 'auto', borderRadius: '8px', border: '2px solid #e2e8f0' }}
                                                />
                                            )}
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    name="isActive"
                                                    checked={vipPackageFormData.isActive}
                                                    onChange={handleVipPackageInputChange}
                                                    style={{ width: '20px', height: '20px' }}
                                                />
                                                <span style={{ fontSize: '1rem', color: '#475569' }}>
                                                    Display on website (Active)
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Detailed Content */}
                                    <div style={{
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '10px',
                                        padding: '20px',
                                        marginBottom: '25px',
                                        background: '#f8fafc'
                                    }}>
                                        <h5 style={{ color: '#475569', marginBottom: '15px', fontSize: '1.1rem', fontWeight: '600' }}>
                                            📖 Detailed Content (for detail page)
                                        </h5>

                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                            Detailed Title:
                                        </label>
                                        <input
                                            name="detailedTitle"
                                            placeholder="e.g., The Pearl of the Indian Ocean: Unlocking Sri Lanka's Ancient Heart"
                                            value={vipPackageDetailedData.detailedTitle}
                                            onChange={handleVipPackageDetailedInputChange}
                                            style={{ marginBottom: '15px' }}
                                        />

                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                            Detailed Introduction:
                                        </label>
                                        <textarea
                                            name="detailedIntro"
                                            placeholder="Detailed introduction paragraph..."
                                            value={vipPackageDetailedData.detailedIntro}
                                            onChange={handleVipPackageDetailedInputChange}
                                            rows="5"
                                            style={{ marginBottom: '15px' }}
                                        />
                                    </div>

                                    {/* Sections */}
                                    <div style={{
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '10px',
                                        padding: '20px',
                                        marginBottom: '25px',
                                        background: '#f8fafc'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <h5 style={{ color: '#475569', fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
                                                📍 Tour Sections
                                            </h5>
                                            <button
                                                type="button"
                                                onClick={addSection}
                                                style={{
                                                    padding: '8px 16px',
                                                    background: '#4fce5a',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                + Add Section
                                            </button>
                                        </div>

                                        {vipPackageSections.map((section, index) => (
                                            <div key={index} style={{
                                                background: 'white',
                                                padding: '20px',
                                                borderRadius: '8px',
                                                marginBottom: '15px',
                                                border: '1px solid #e2e8f0'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                                    <h6 style={{ margin: 0, color: '#1e293b' }}>Section {index + 1}</h6>
                                                    {vipPackageSections.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSection(index)}
                                                            style={{
                                                                padding: '5px 12px',
                                                                background: '#dc3545',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '5px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.9rem'
                                                            }}
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>

                                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                                    Section Title:
                                                </label>
                                                <input
                                                    placeholder="e.g., Sigiriya: The Eighth Wonder of the World"
                                                    value={section.sectionTitle}
                                                    onChange={(e) => handlevipSectionChange(index, 'sectionTitle', e.target.value)}
                                                    style={{ marginBottom: '15px', width: '100%' }}
                                                />

                                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                                    Section Content:
                                                </label>
                                                <textarea
                                                    placeholder="Detailed content for this section..."
                                                    value={section.sectionContent}
                                                    onChange={(e) => handlevipSectionChange(index, 'sectionContent', e.target.value)}
                                                    rows="5"
                                                    style={{ marginBottom: '15px', width: '100%' }}
                                                />

                                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569' }}>
                                                    Section Image (optional):
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleSectionImageChange(index, e.target.files[0])}
                                                    style={{ marginBottom: '10px' }}
                                                />
                                                {sectionPreviews[index] && (
                                                    <img
                                                        src={sectionPreviews[index]}
                                                        alt={`Section ${index + 1} Preview`}
                                                        style={{ maxWidth: '250px', height: 'auto', borderRadius: '8px', border: '2px solid #e2e8f0' }}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pro Tip */}
                                    <div style={{
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '10px',
                                        padding: '20px',
                                        marginBottom: '25px',
                                        background: '#f8fafc'
                                    }}>
                                        <h5 style={{ color: '#475569', marginBottom: '15px', fontSize: '1.1rem', fontWeight: '600' }}>
                                            💡 Pro Tip
                                        </h5>

                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                            Pro Tip for Travelers:
                                        </label>
                                        <textarea
                                            name="proTip"
                                            placeholder="Helpful tip or advice for travelers..."
                                            value={vipPackageDetailedData.proTip}
                                            onChange={handleVipPackageDetailedInputChange}
                                            rows="4"
                                        />
                                    </div>

                                    {/* Submit Buttons */}
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                        <button type="submit" style={{ flex: 1 }}>
                                            {vipPackageEditingId ? 'Update Package' : 'Create Package'}
                                        </button>
                                        {vipPackageEditingId && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setVipPackageEditingId(null);
                                                    setVipPackageFormData({ packageId: '', title: '', description: '', isActive: true, displayOrder: 0 });
                                                    setVipPackageDetailedData({ detailedTitle: '', detailedIntro: '', proTip: '' });
                                                    setVipPackageSections([{ sectionTitle: '', sectionContent: '', sectionImage: null }]);
                                                    setSectionPreviews([]);
                                                    setVipPackageImage(null);
                                                    setVipPackagePreview(null);
                                                }}
                                                style={{ background: '#6c757d' }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* VIP Packages List - Display the correct packages */}
                            <div style={{ marginTop: '40px' }}>
                                <h4 style={{ marginBottom: '20px', color: '#1e293b' }}>
                                    All Packages ({vipPackages.length})
                                </h4>

                                {vipPackages.length === 0 ? (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '40px',
                                        color: '#64748b',
                                        background: '#f8fafc',
                                        borderRadius: '10px'
                                    }}>
                                        <i className="fas fa-suitcase" style={{ fontSize: '3rem', marginBottom: '15px', opacity: 0.3 }}></i>
                                        <p style={{ fontSize: '1.1rem' }}>No packages available</p>
                                        <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>Add your first package above</p>
                                    </div>
                                ) : (
                                    <div className="packages-table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Image</th>
                                                    <th>Package ID</th>
                                                    <th>Title</th>
                                                    <th>Description</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {vipPackages.map((pkg) => (
                                                    <tr key={pkg._id}>

                                                        <td>
                                                            <img
                                                                src={`${process.env.REACT_APP_API_URL}/${pkg.image}`}
                                                                alt={pkg.title}
                                                                style={{
                                                                    width: '100px',
                                                                    height: '70px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '8px'
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <code style={{
                                                                background: '#f1f5f9',
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '0.9rem'
                                                            }}>
                                                                {pkg.packageId}
                                                            </code>
                                                        </td>
                                                        <td style={{ fontWeight: '600', maxWidth: '200px' }}>
                                                            {pkg.title}
                                                        </td>
                                                        <td style={{ maxWidth: '300px' }}>
                                                            <div style={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                lineHeight: '1.4'
                                                            }}>
                                                                {pkg.description}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <button
                                                                onClick={() => handleVipPackageToggle(pkg._id)}
                                                                style={{
                                                                    padding: '6px 12px',
                                                                    borderRadius: '20px',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    fontWeight: '600',
                                                                    fontSize: '0.85rem',
                                                                    background: pkg.isActive ? '#d4edda' : '#f8d7da',
                                                                    color: pkg.isActive ? '#155724' : '#721c24'
                                                                }}
                                                            >
                                                                {pkg.isActive ? '✓ Active' : '✗ Inactive'}
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                                                                <button
                                                                    className='btn-action edit'
                                                                    onClick={() => handleVipPackageEdit(pkg)}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    className='btn-action delete'
                                                                    onClick={() => handleVipPackageDelete(pkg._id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'website':
                return (
                    <div className="content-wrapper">

                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">Home Page Content Management</h2>
                            </div>

                            <div style={{ marginTop: '40px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
                                <h4>Home Page Content</h4>
                                <br /><br />
                                <div className="package-form" style={{ marginBottom: '20px' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <h5>
                                            {homeEditingId ? 'Edit Home Information' : 'Add Home Information'}
                                        </h5>

                                        
                                    </div>
                                    <form onSubmit={handleHomeSubmit}>

                                        <input
                                            name="topic"
                                            placeholder="Main Topic"
                                            value={homeFormData.topic}
                                            onChange={handleHomeInputChange}
                                            required
                                        />
                                        <input
                                            name="line"
                                            placeholder="Line"
                                            value={homeFormData.line}
                                            onChange={handleHomeInputChange}
                                            required
                                        />
                                        <input
                                            name="welcometopic"
                                            placeholder="Welcome Topic"
                                            value={homeFormData.welcometopic}
                                            onChange={handleHomeInputChange}
                                            required
                                        />
                                        <input
                                            name="welcomepara1"
                                            placeholder="Paragraph 1"
                                            value={homeFormData.welcomepara1}
                                            onChange={handleHomeInputChange}
                                            required
                                        />
                                        <input
                                            name="welcomepara2"
                                            placeholder="Paragraph 1"
                                            value={homeFormData.welcomepara2}
                                            onChange={handleHomeInputChange}
                                            required
                                        />
                                        <input
                                            name="servicetopic1"
                                            placeholder="Service Topic 1"
                                            value={homeFormData.servicetopic1}
                                            onChange={handleHomeInputChange}
                                            required
                                        />
                                        <input
                                            name="servicepara1"
                                            placeholder="Service Description 1"
                                            value={homeFormData.servicepara1}
                                            onChange={handleHomeInputChange}
                                            required
                                        />
                                        <input
                                            name="servicetopic2"
                                            placeholder="Service Topic 2"
                                            value={homeFormData.servicetopic2}
                                            onChange={handleHomeInputChange}
                                            required
                                        />
                                        <input
                                            name="servicepara2"
                                            placeholder="Service Description 2"
                                            value={homeFormData.servicepara2}
                                            onChange={handleHomeInputChange}
                                            required
                                        />
                                        <input
                                            name="servicetopic3"
                                            placeholder="Service Topic 3"
                                            value={homeFormData.servicetopic3}
                                            onChange={handleHomeInputChange}
                                            required
                                        />
                                        <input
                                            name="servicepara3"
                                            placeholder="Service Description 3"
                                            value={homeFormData.servicepara3}
                                            onChange={handleHomeInputChange}
                                            required
                                        />
                                        <input
                                            name="servicetopic4"
                                            placeholder="Service Topic 4"
                                            value={homeFormData.servicetopic4}
                                            onChange={handleHomeInputChange}
                                            required
                                        />
                                        <input
                                            name="servicepara4"
                                            placeholder="Service Description 4"
                                            value={homeFormData.servicepara4}
                                            onChange={handleHomeInputChange}
                                            required
                                        />

                                        <button type="submit">
                                            {homeEditingId ? 'Update Home Info' : 'Create Home Info'}
                                        </button>
                                        {homeEditingId && (
                                            <button type="button" onClick={() => {
                                                setHomeEditingId(null);
                                                setHomeFormData({ topic: '', line: '', welcometopic: '', welcomepara1: '', welcomepara2: '', servicetopic1: '', servicepara1: '', servicetopic2: '', servicepara2: '', servicetopic3: '', servicepara3: '', servicetopic4: '', servicepara4: '' });
                                            }}>Cancel</button>
                                        )}

                                        {homeInfo.length > 0 && !homeEditingId && (
                                            <button
                                                
                                                className='btn-action edit'
                                                onClick={() => handleHomeEdit(homeInfo[0])}
                                            >
                                                Edit Home Content
                                            </button>
                                        )}
                                    </form>
                                </div>

                                
                            </div>
                        </div>

                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">Contact Information Management</h2>
                            </div>

                            <div style={{ marginTop: '40px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
                                <h4>Contact Details</h4>
                                <br /><br />
                                <div className="package-form" style={{ marginBottom: '20px' }}>
                                    <h5>{contactEditingId ? 'Edit Contact Information' : 'Add New Contact Information'}</h5>
                                    <form onSubmit={handleContactSubmit}>

                                        <input
                                            name="mobile"
                                            placeholder="Mobile Number"
                                            value={contactFormData.mobile}
                                            onChange={handleContactInputChange}
                                            required
                                        />
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="Email Address"
                                            value={contactFormData.email}
                                            onChange={handleContactInputChange}
                                            required
                                        />

                                        <button type="submit">
                                            {contactEditingId ? 'Update Contact Info' : 'Create Contact Info'}
                                        </button>
                                        {contactEditingId && (
                                            <button type="button" onClick={() => {
                                                setContactEditingId(null);
                                                setContactFormData({ mobile: '', email: '' });
                                            }}>Cancel</button>
                                        )}
                                    </form>
                                </div>

                                <div className="packages-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Mobile</th>
                                                <th>Email</th>


                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contactInfo.map(contact => (
                                                <tr key={contact._id}>
                                                    <td>{contact.mobile}</td>
                                                    <td>{contact.email}</td>


                                                    <td>
                                                        <button className='btn-action edit' onClick={() => handleContactEdit(contact)}>Edit</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>


                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">About Page Content Management</h2>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '5px 0 0 0' }}>
                                    Manage your About page sections, paragraphs, and images
                                </p>
                            </div>

                            <div style={{ marginTop: '30px' }}>
                                <div className="package-form" style={{ marginBottom: '30px' }}>
                                    <h4 style={{ marginBottom: '20px', color: '#1e293b' }}>
                                        {aboutEditingId ? 'Edit About Content' : 'Add About Content'}
                                    </h4>

                                    <form onSubmit={handleAboutSubmit}>
                                        {/* Section 1 */}
                                        <div style={{
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '10px',
                                            padding: '20px',
                                            marginBottom: '25px',
                                            background: '#f8fafc'
                                        }}>
                                            <h5 style={{
                                                color: '#475569',
                                                marginBottom: '15px',
                                                fontSize: '1.1rem',
                                                fontWeight: '600'
                                            }}>
                                                📝 Section 1 - Introduction
                                            </h5>

                                            <input
                                                name="section1Heading"
                                                placeholder="Section Heading (e.g., About VIP Tours)"
                                                value={aboutFormData.section1Heading}
                                                onChange={handleAboutInputChange}
                                                style={{ marginBottom: '15px' }}
                                            />

                                            <textarea
                                                name="section1Para1"
                                                placeholder="First Paragraph - Introduce your company"
                                                value={aboutFormData.section1Para1}
                                                onChange={handleAboutInputChange}
                                                required
                                                rows="4"
                                                style={{ marginBottom: '15px' }}
                                            />

                                            <textarea
                                                name="section1Para2"
                                                placeholder="Second Paragraph - Mission and vision"
                                                value={aboutFormData.section1Para2}
                                                onChange={handleAboutInputChange}
                                                required
                                                rows="4"
                                                style={{ marginBottom: '15px' }}
                                            />

                                            <div style={{ marginTop: '15px' }}>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    fontWeight: '600',
                                                    color: '#475569'
                                                }}>
                                                    Section 1 Image:
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleAboutImageChange(e, 'section1Image')}
                                                    style={{ marginBottom: '10px' }}
                                                />
                                                {aboutPreviews.section1 && (
                                                    <div style={{ marginTop: '10px' }}>
                                                        <img
                                                            src={aboutPreviews.section1}
                                                            alt="Section 1 Preview"
                                                            style={{
                                                                maxWidth: '300px',
                                                                height: 'auto',
                                                                borderRadius: '8px',
                                                                border: '2px solid #e2e8f0'
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Section 2 */}
                                        <div style={{
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '10px',
                                            padding: '20px',
                                            marginBottom: '25px',
                                            background: '#f8fafc'
                                        }}>
                                            <h5 style={{
                                                color: '#475569',
                                                marginBottom: '15px',
                                                fontSize: '1.1rem',
                                                fontWeight: '600'
                                            }}>
                                                📝 Section 2 - Details
                                            </h5>

                                            <textarea
                                                name="section2Para1"
                                                placeholder="First Paragraph - What makes you unique"
                                                value={aboutFormData.section2Para1}
                                                onChange={handleAboutInputChange}
                                                required
                                                rows="4"
                                                style={{ marginBottom: '15px' }}
                                            />

                                            <textarea
                                                name="section2Para2"
                                                placeholder="Second Paragraph - Sustainability and values"
                                                value={aboutFormData.section2Para2}
                                                onChange={handleAboutInputChange}
                                                required
                                                rows="4"
                                                style={{ marginBottom: '15px' }}
                                            />

                                            <textarea
                                                name="section2Para3"
                                                placeholder="Third Paragraph - Commitment to travelers"
                                                value={aboutFormData.section2Para3}
                                                onChange={handleAboutInputChange}
                                                required
                                                rows="4"
                                                style={{ marginBottom: '15px' }}
                                            />

                                            <div style={{ marginTop: '15px' }}>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    fontWeight: '600',
                                                    color: '#475569'
                                                }}>
                                                    Section 2 Image:
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleAboutImageChange(e, 'section2Image')}
                                                    style={{ marginBottom: '10px' }}
                                                />
                                                {aboutPreviews.section2 && (
                                                    <div style={{ marginTop: '10px' }}>
                                                        <img
                                                            src={aboutPreviews.section2}
                                                            alt="Section 2 Preview"
                                                            style={{
                                                                maxWidth: '300px',
                                                                height: 'auto',
                                                                borderRadius: '8px',
                                                                border: '2px solid #e2e8f0'
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Submit Buttons */}
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                            <button
                                                type="submit"
                                                style={{
                                                    flex: 1,
                                                    padding: '12px 24px',
                                                    background: 'linear-gradient(135deg, #c51616 0%, #bd0505 100%)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: '600',
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                {aboutEditingId ? '✓ Update Content' : '+ Create Content'}
                                            </button>

                                            {aboutEditingId && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setAboutEditingId(null);
                                                        setAboutFormData({
                                                            section1Heading: '',
                                                            section1Para1: '',
                                                            section1Para2: '',
                                                            section2Para1: '',
                                                            section2Para2: '',
                                                            section2Para3: ''
                                                        });
                                                        setAboutImages({ section1Image: null, section2Image: null });
                                                        setAboutPreviews({ section1: null, section2: null });
                                                    }}
                                                    style={{
                                                        padding: '12px 24px',
                                                        background: '#64748b',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                {/* Current Content Display */}
                                <div className="packages-table">
                                    <h4 style={{ marginBottom: '20px', color: '#1e293b' }}>
                                        Current About Content
                                    </h4>

                                    {abouts.length === 0 ? (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '40px',
                                            color: '#64748b',
                                            background: '#f8fafc',
                                            borderRadius: '10px'
                                        }}>
                                            <i className="fas fa-file-alt" style={{ fontSize: '3rem', marginBottom: '15px', opacity: 0.3 }}></i>
                                            <p style={{ fontSize: '1.1rem' }}>No content available</p>
                                            <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>Create your first About page content above</p>
                                        </div>
                                    ) : (
                                        abouts.map(about => (
                                            <div key={about._id} style={{
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '10px',
                                                overflow: 'hidden',
                                                marginBottom: '20px'
                                            }}>
                                                {/* Section 1 Display */}
                                                <div style={{
                                                    padding: '25px',
                                                    background: '#ffffff',
                                                    borderBottom: '1px solid #e2e8f0'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                                        <h5 style={{ color: '#1e293b', fontSize: '1.2rem', margin: 0 }}>
                                                            {about.section1?.heading || 'Section 1'}
                                                        </h5>
                                                        <span style={{
                                                            background: '#e0e7ff',
                                                            color: '#4338ca',
                                                            padding: '4px 12px',
                                                            borderRadius: '20px',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            Section 1
                                                        </span>
                                                    </div>

                                                    {about.section1?.image && (
                                                        <div style={{ marginBottom: '15px' }}>
                                                            <img
                                                                src={`${process.env.REACT_APP_API_URL}/${about.section1.image}`}
                                                                alt="Section 1"
                                                                style={{
                                                                    maxWidth: '100%',
                                                                    maxHeight: '200px',
                                                                    borderRadius: '8px',
                                                                    objectFit: 'cover'
                                                                }}
                                                            />
                                                        </div>
                                                    )}

                                                    <div style={{ color: '#475569', lineHeight: '1.6' }}>
                                                        <p style={{ marginBottom: '12px' }}>{about.section1?.paragraph1}</p>
                                                        <p>{about.section1?.paragraph2}</p>
                                                    </div>
                                                </div>

                                                {/* Section 2 Display */}
                                                <div style={{
                                                    padding: '25px',
                                                    background: '#f8fafc'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                                        <h5 style={{ color: '#1e293b', fontSize: '1.2rem', margin: 0 }}>
                                                            Section 2
                                                        </h5>
                                                        <span style={{
                                                            background: '#dbeafe',
                                                            color: '#1e40af',
                                                            padding: '4px 12px',
                                                            borderRadius: '20px',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            Section 2
                                                        </span>
                                                    </div>

                                                    {about.section2?.image && (
                                                        <div style={{ marginBottom: '15px' }}>
                                                            <img
                                                                src={`${process.env.REACT_APP_API_URL}/${about.section2.image}`}
                                                                alt="Section 2"
                                                                style={{
                                                                    maxWidth: '100%',
                                                                    maxHeight: '200px',
                                                                    borderRadius: '8px',
                                                                    objectFit: 'cover'
                                                                }}
                                                            />
                                                        </div>
                                                    )}

                                                    <div style={{ color: '#475569', lineHeight: '1.6' }}>
                                                        <p style={{ marginBottom: '12px' }}>{about.section2?.paragraph1}</p>
                                                        <p style={{ marginBottom: '12px' }}>{about.section2?.paragraph2}</p>
                                                        <p>{about.section2?.paragraph3}</p>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div style={{
                                                    padding: '20px',
                                                    background: '#ffffff',
                                                    borderTop: '1px solid #e2e8f0',
                                                    display: 'flex',
                                                    gap: '10px',
                                                    justifyContent: 'flex-end'
                                                }}>
                                                    <button
                                                        className='btn-action edit'
                                                        onClick={() => handleAboutEdit(about)}

                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className='btn-action delete'
                                                        onClick={() => handleAboutDelete(about._id)}

                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>


                );

            case 'gallery':
                return (
                    <div className="content-wrapper">
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">Gallery Management</h2>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '5px 0 0 0' }}>
                                    Manage your destination gallery images
                                </p>
                            </div>

                            {/* Gallery Form */}
                            <div className="package-form" style={{ marginTop: '20px' }}>
                                <h4>{galleryEditingId ? 'Edit Gallery Item' : 'Add New Gallery Item'}</h4>
                                <form onSubmit={handleGallerySubmit} encType="multipart/form-data">
                                    <input
                                        name="name"
                                        placeholder="Destination Name (e.g., Nuwara Eliya)"
                                        value={galleryFormData.name}
                                        onChange={handleGalleryInputChange}
                                        required
                                    />

                                    <div style={{ marginTop: '15px' }}>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#475569'
                                        }}>
                                            Gallery Image:
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleGalleryImageChange}
                                            style={{ marginBottom: '10px' }}
                                        />
                                        {galleryPreview && (
                                            <div style={{ marginTop: '10px' }}>
                                                <img
                                                    src={galleryPreview}
                                                    alt="Preview"
                                                    style={{
                                                        maxWidth: '300px',
                                                        height: 'auto',
                                                        borderRadius: '8px',
                                                        border: '2px solid #e2e8f0'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                        <button type="submit">
                                            {galleryEditingId ? 'Update Gallery Item' : 'Create Gallery Item'}
                                        </button>
                                        {galleryEditingId && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setGalleryEditingId(null);
                                                    setGalleryFormData({ name: '' });
                                                    setGalleryImage(null);
                                                    setGalleryPreview(null);
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Gallery Items Grid Display */}
                            <div style={{ marginTop: '40px' }}>
                                <h4 style={{ marginBottom: '20px', color: '#1e293b' }}>
                                    Gallery Items ({galleryItems.length})
                                </h4>

                                {galleryItems.length === 0 ? (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '40px',
                                        color: '#64748b',
                                        background: '#f8fafc',
                                        borderRadius: '10px'
                                    }}>
                                        <i className="fas fa-images" style={{ fontSize: '3rem', marginBottom: '15px', opacity: 0.3 }}></i>
                                        <p style={{ fontSize: '1.1rem' }}>No gallery items available</p>
                                        <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>Add your first destination image above</p>
                                    </div>
                                ) : (
                                    <div className="row">
                                        {galleryItems.map((item) => (
                                            <div className="col-md-4" key={item._id} style={{ marginBottom: '20px' }}>
                                                <div style={{
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '10px',
                                                    overflow: 'hidden',
                                                    transition: 'all 0.3s ease',
                                                    height: '100%'
                                                }}>
                                                    <div style={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
                                                        <img
                                                            src={`${process.env.REACT_APP_API_URL}/${item.image}`}
                                                            alt={item.name}
                                                            style={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                    </div>
                                                    <div style={{ padding: '15px' }}>
                                                        <h5 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>
                                                            {item.name}
                                                        </h5>
                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                            <button
                                                                className='btn-action edit'
                                                                onClick={() => handleGalleryEdit(item)}
                                                                style={{ flex: 1 }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className='btn-action delete'
                                                                onClick={() => handleGalleryDelete(item._id)}
                                                                style={{ flex: 1 }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'testimonials':
                return (
                    <div className="content-wrapper">
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">Testimonials Management</h2>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '5px 0 0 0' }}>
                                    Manage customer testimonials and reviews
                                </p>
                            </div>

                            {/* Statistics */}
                            <div className="row" style={{ marginBottom: '30px' }}>
                                <div className="col-md-4">
                                    <div className="dashboard-card">
                                        <h5>Total Testimonials</h5>
                                        <h3 style={{ color: '#007bff' }}>{testimonialStats.total}</h3>
                                        <small>All testimonials</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="dashboard-card">
                                        <h5>Active</h5>
                                        <h3 style={{ color: '#28a745' }}>{testimonialStats.active}</h3>
                                        <small>Displayed on website</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="dashboard-card">
                                        <h5>Inactive</h5>
                                        <h3 style={{ color: '#6c757d' }}>{testimonialStats.inactive}</h3>
                                        <small>Hidden from website</small>
                                    </div>
                                </div>
                            </div>

                            {/* Testimonial Form */}
                            <div className="package-form" style={{ marginTop: '20px' }}>
                                <h4>{testimonialEditingId ? 'Edit Testimonial' : 'Add New Testimonial'}</h4>
                                <form onSubmit={handleTestimonialSubmit}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <input
                                                name="name"
                                                placeholder="Customer Name (e.g., John Matthews)"
                                                value={testimonialFormData.name}
                                                onChange={handleTestimonialInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                name="role"
                                                placeholder="Role/Location (e.g., Traveler from UK)"
                                                value={testimonialFormData.role}
                                                onChange={handleTestimonialInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <textarea
                                        name="quote"
                                        placeholder="Testimonial quote/review..."
                                        value={testimonialFormData.quote}
                                        onChange={handleTestimonialInputChange}
                                        required
                                        rows="5"
                                        style={{ marginTop: '15px' }}
                                    />

                                    <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={testimonialFormData.isActive}
                                                onChange={handleTestimonialInputChange}
                                                style={{ width: '20px', height: '20px' }}
                                            />
                                            <span style={{ fontSize: '1rem', color: '#475569' }}>
                                                Display on website (Active)
                                            </span>
                                        </label>
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                        <button type="submit">
                                            {testimonialEditingId ? 'Update Testimonial' : 'Create Testimonial'}
                                        </button>
                                        {testimonialEditingId && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setTestimonialEditingId(null);
                                                    setTestimonialFormData({ name: '', role: '', quote: '', isActive: true });
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Testimonials List */}
                            <div style={{ marginTop: '40px' }}>
                                <h4 style={{ marginBottom: '20px', color: '#1e293b' }}>
                                    All Testimonials ({testimonials.length})
                                </h4>

                                {testimonials.length === 0 ? (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '40px',
                                        color: '#64748b',
                                        background: '#f8fafc',
                                        borderRadius: '10px'
                                    }}>
                                        <i className="fas fa-comment-dots" style={{ fontSize: '3rem', marginBottom: '15px', opacity: 0.3 }}></i>
                                        <p style={{ fontSize: '1.1rem' }}>No testimonials available</p>
                                        <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>Add your first testimonial above</p>
                                    </div>
                                ) : (
                                    <div className="packages-table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Role</th>
                                                    <th>Quote</th>
                                                    <th>Status</th>
                                                    <th>Created</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {testimonials.map((testimonial) => (
                                                    <tr key={testimonial._id}>
                                                        <td style={{ fontWeight: '600' }}>{testimonial.name}</td>
                                                        <td>{testimonial.role}</td>
                                                        <td style={{ maxWidth: '300px' }}>
                                                            <div style={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                lineHeight: '1.4'
                                                            }}>
                                                                "{testimonial.quote}"
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <button
                                                                onClick={() => handleTestimonialToggle(testimonial._id)}
                                                                style={{
                                                                    padding: '6px 12px',
                                                                    borderRadius: '20px',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    fontWeight: '600',
                                                                    fontSize: '0.85rem',
                                                                    background: testimonial.isActive ? '#d4edda' : '#f8d7da',
                                                                    color: testimonial.isActive ? '#155724' : '#721c24'
                                                                }}
                                                            >
                                                                {testimonial.isActive ? '✓ Active' : '✗ Inactive'}
                                                            </button>
                                                        </td>
                                                        <td>
                                                            {new Date(testimonial.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <button
                                                                    className='btn-action edit'
                                                                    onClick={() => handleTestimonialEdit(testimonial)}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    className='btn-action delete'
                                                                    onClick={() => handleTestimonialDelete(testimonial._id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Preview Section */}
                            {testimonials.filter(t => t.isActive).length > 0 && (
                                <div style={{ marginTop: '40px', borderTop: '2px solid #e2e8f0', paddingTop: '30px' }}>
                                    <h4 style={{ marginBottom: '20px', color: '#1e293b' }}>
                                        Website Preview (Active Testimonials)
                                    </h4>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                        gap: '20px',
                                        background: '#f8fafc',
                                        padding: '30px',
                                        borderRadius: '10px'
                                    }}>
                                        {testimonials.filter(t => t.isActive).map((testimonial) => (
                                            <div key={testimonial._id} style={{
                                                background: 'white',
                                                padding: '25px',
                                                borderRadius: '10px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                position: 'relative'
                                            }}>
                                                <FaQuoteLeft style={{ color: '#4fce5a', fontSize: '2rem', marginBottom: '15px' }} />
                                                <p style={{
                                                    fontSize: '0.95rem',
                                                    lineHeight: '1.6',
                                                    color: '#475569',
                                                    marginBottom: '20px',
                                                    fontStyle: 'italic'
                                                }}>
                                                    "{testimonial.quote}"
                                                </p>
                                                <div>
                                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#1e293b' }}>
                                                        {testimonial.name}
                                                    </h4>
                                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                                                        {testimonial.role}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'vippackages':
                return (
                    <div className="content-wrapper">
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">Tour Packages Management</h2>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '5px 0 0 0' }}>
                                    Manage your tour packages, descriptions, and images
                                </p>
                            </div>

                            {/* Statistics */}
                            <div className="row" style={{ marginBottom: '30px' }}>
                                <div className="col-md-4">
                                    <div className="dashboard-card">
                                        <h5>Total Packages</h5>
                                        <h3 style={{ color: '#007bff' }}>{vipPackageStats.total}</h3>
                                        <small>All packages</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="dashboard-card">
                                        <h5>Active Packages</h5>
                                        <h3 style={{ color: '#28a745' }}>{vipPackageStats.active}</h3>
                                        <small>Displayed on website</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="dashboard-card">
                                        <h5>Inactive Packages</h5>
                                        <h3 style={{ color: '#6c757d' }}>{vipPackageStats.inactive}</h3>
                                        <small>Hidden from website</small>
                                    </div>
                                </div>
                            </div>

                            {/* Package Form */}
                            <div className="package-form" style={{ marginTop: '20px' }}>
                                <h4>{vipPackageEditingId ? 'Edit Package' : 'Add New Package'}</h4>
                                <form onSubmit={handleVipPackageSubmit} encType="multipart/form-data">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                                Package ID (for URL):
                                            </label>
                                            <input
                                                name="packageId"
                                                placeholder="e.g., pa1, pa2, colombo-tour"
                                                value={vipPackageFormData.packageId}
                                                onChange={handleVipPackageInputChange}
                                                required
                                                style={{ marginBottom: '15px' }}
                                            />
                                            <small style={{ display: 'block', marginTop: '-10px', marginBottom: '15px', color: '#64748b' }}>
                                                Used in the URL: yoursite.com/<strong>{vipPackageFormData.packageId || 'package-id'}</strong>
                                            </small>
                                        </div>
                                        <div className="col-md-6">
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                                Display Order:
                                            </label>
                                            <input
                                                name="displayOrder"
                                                type="number"
                                                placeholder="0"
                                                value={vipPackageFormData.displayOrder}
                                                onChange={handleVipPackageInputChange}
                                                style={{ marginBottom: '15px' }}
                                            />
                                            <small style={{ display: 'block', marginTop: '-10px', marginBottom: '15px', color: '#64748b' }}>
                                                Lower numbers appear first (0, 1, 2...)
                                            </small>
                                        </div>
                                    </div>

                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                        Package Title:
                                    </label>
                                    <input
                                        name="title"
                                        placeholder="e.g., 7 Day Sri Lanka Tour"
                                        value={vipPackageFormData.title}
                                        onChange={handleVipPackageInputChange}
                                        required
                                        style={{ marginBottom: '15px' }}
                                    />

                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                                        Description:
                                    </label>
                                    <textarea
                                        name="description"
                                        placeholder="Package description..."
                                        value={vipPackageFormData.description}
                                        onChange={handleVipPackageInputChange}
                                        required
                                        rows="4"
                                        style={{ marginBottom: '15px' }}
                                    />

                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#475569'
                                        }}>
                                            Package Image:
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleVipPackageImageChange}
                                            style={{ marginBottom: '10px' }}
                                        />
                                        {vipPackagePreview && (
                                            <div style={{ marginTop: '10px' }}>
                                                <img
                                                    src={vipPackagePreview}
                                                    alt="Preview"
                                                    style={{
                                                        maxWidth: '300px',
                                                        height: 'auto',
                                                        borderRadius: '8px',
                                                        border: '2px solid #e2e8f0'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={vipPackageFormData.isActive}
                                                onChange={handleVipPackageInputChange}
                                                style={{ width: '20px', height: '20px' }}
                                            />
                                            <span style={{ fontSize: '1rem', color: '#475569' }}>
                                                Display on website (Active)
                                            </span>
                                        </label>
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                        <button type="submit">
                                            {vipPackageEditingId ? 'Update Package' : 'Create Package'}
                                        </button>
                                        {vipPackageEditingId && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setVipPackageEditingId(null);
                                                    setVipPackageFormData({ packageId: '', title: '', description: '', isActive: true, displayOrder: 0 });
                                                    setVipPackageImage(null);
                                                    setVipPackagePreview(null);
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Packages List */}
                            <div style={{ marginTop: '40px' }}>
                                <h4 style={{ marginBottom: '20px', color: '#1e293b' }}>
                                    All Packages ({vipPackages.length})
                                </h4>

                                {vipPackages.length === 0 ? (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '40px',
                                        color: '#64748b',
                                        background: '#f8fafc',
                                        borderRadius: '10px'
                                    }}>
                                        <i className="fas fa-suitcase" style={{ fontSize: '3rem', marginBottom: '15px', opacity: 0.3 }}></i>
                                        <p style={{ fontSize: '1.1rem' }}>No packages available</p>
                                        <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>Add your first package above</p>
                                    </div>
                                ) : (
                                    <div className="packages-table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Order</th>
                                                    <th>Image</th>
                                                    <th>Package ID</th>
                                                    <th>Title</th>
                                                    <th>Description</th>
                                                    <th>Status</th>
                                                    <th>Created</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {vipPackages.map((pkg) => (
                                                    <tr key={pkg._id}>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                value={pkg.displayOrder}
                                                                onChange={(e) => handleVipPackageOrderChange(pkg._id, parseInt(e.target.value))}
                                                                style={{
                                                                    width: '60px',
                                                                    padding: '5px',
                                                                    border: '1px solid #ddd',
                                                                    borderRadius: '4px',
                                                                    textAlign: 'center'
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <img
                                                                src={`${process.env.REACT_APP_API_URL}/${pkg.image}`}
                                                                alt={pkg.title}
                                                                style={{
                                                                    width: '100px',
                                                                    height: '70px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '8px'
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <code style={{
                                                                background: '#f1f5f9',
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '0.9rem'
                                                            }}>
                                                                {pkg.packageId}
                                                            </code>
                                                        </td>
                                                        <td style={{ fontWeight: '600', maxWidth: '200px' }}>
                                                            {pkg.title}
                                                        </td>
                                                        <td style={{ maxWidth: '300px' }}>
                                                            <div style={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                lineHeight: '1.4'
                                                            }}>
                                                                {pkg.description}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <button
                                                                onClick={() => handleVipPackageToggle(pkg._id)}
                                                                style={{
                                                                    padding: '6px 12px',
                                                                    borderRadius: '20px',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    fontWeight: '600',
                                                                    fontSize: '0.85rem',
                                                                    background: pkg.isActive ? '#d4edda' : '#f8d7da',
                                                                    color: pkg.isActive ? '#155724' : '#721c24'
                                                                }}
                                                            >
                                                                {pkg.isActive ? '✓ Active' : '✗ Inactive'}
                                                            </button>
                                                        </td>
                                                        <td>
                                                            {new Date(pkg.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                                                                <button
                                                                    className='btn-action edit'
                                                                    onClick={() => handleVipPackageEdit(pkg)}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    className='btn-action delete'
                                                                    onClick={() => handleVipPackageDelete(pkg._id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Preview Section */}
                            {vipPackages.filter(p => p.isActive).length > 0 && (
                                <div style={{ marginTop: '40px', borderTop: '2px solid #e2e8f0', paddingTop: '30px' }}>
                                    <h4 style={{ marginBottom: '20px', color: '#1e293b' }}>
                                        Website Preview (Active Packages)
                                    </h4>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                        gap: '20px',
                                        background: '#f8fafc',
                                        padding: '30px',
                                        borderRadius: '10px'
                                    }}>
                                        {vipPackages.filter(p => p.isActive).map((pkg) => (
                                            <div key={pkg._id} style={{
                                                background: 'white',
                                                borderRadius: '10px',
                                                overflow: 'hidden',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                transition: 'transform 0.3s ease'
                                            }}>
                                                <img
                                                    src={`${process.env.REACT_APP_API_URL}/${pkg.image}`}
                                                    alt={pkg.title}
                                                    style={{
                                                        width: '100%',
                                                        height: '200px',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <div style={{ padding: '20px' }}>
                                                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#1e293b' }}>
                                                        {pkg.title}
                                                    </h3>
                                                    <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5' }}>
                                                        {pkg.description}
                                                    </p>
                                                    <button style={{
                                                        background: '#4fce5a',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '10px 20px',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                        fontWeight: '600',
                                                        width: '100%'
                                                    }}>
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="content-wrapper">
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">
                                    {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Management
                                </h2>
                            </div>
                            <p>This section is under development.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="admin-layout">
            {/* Mobile Menu Button */}
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
                <i className="fas fa-bars"></i>
            </button>

            {/* Sidebar */}
            <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <h3>VIP Tours Admin Panel</h3>
                    <p style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '8px' }}>
                        Welcome, {adminUser.name || 'Admin'}
                    </p>
                </div>

                <ul className="sidebar-nav">



                    <li>

                        <a href="#"
                            className={activeSection === 'packages' ? 'active' : ''}
                            onClick={(e) => {
                                e.preventDefault();
                                handleSectionChange('packages');
                            }}
                        >
                            <i className="fas fa-suitcase"></i>
                            <span>Tour Packages</span>
                        </a>
                    </li>

                    <li>
                        <a
                            href="#"
                            className={activeSection === 'users' ? 'active' : ''}
                            onClick={(e) => {
                                e.preventDefault();
                                handleSectionChange('users');
                            }}
                        >
                            <i className="fas fa-box"></i>
                            <span>Users</span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className={activeSection === 'bookings' ? 'active' : ''}
                            onClick={(e) => {
                                e.preventDefault();
                                handleSectionChange('bookings');
                            }}
                        >
                            <i className="fas fa-calendar-alt"></i>
                            <span>Bookings</span>
                        </a>
                    </li>

                    <li>
                        <a
                            href="#"
                            className={activeSection === 'website' ? 'active' : ''}
                            onClick={(e) => {
                                e.preventDefault();
                                handleSectionChange('website');
                            }}
                        >
                            <i className="fas fa-calendar-alt"></i>
                            <span>Website</span>
                        </a>
                    </li>



                    <li>

                        <a href="#"
                            className={activeSection === 'gallery' ? 'active' : ''}
                            onClick={(e) => {
                                e.preventDefault();
                                handleSectionChange('gallery');
                            }}
                        >
                            <i className="fas fa-images"></i>
                            <span>Gallery</span>
                        </a>
                    </li>

                    <li>

                        <a href="#"
                            className={activeSection === 'testimonials' ? 'active' : ''}
                            onClick={(e) => {
                                e.preventDefault();
                                handleSectionChange('testimonials');
                            }}
                        >
                            <i className="fas fa-comment-dots"></i>
                            <span>Testimonials</span>
                        </a>
                    </li>

                    <li>
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            handleLogout();
                        }}>
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                        </a>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;