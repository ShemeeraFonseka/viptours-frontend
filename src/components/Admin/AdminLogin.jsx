// AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/travelaapi/auth/login`, formData);
            
    
            localStorage.setItem('adminToken', response.data.token);
            localStorage.setItem('adminUser', JSON.stringify(response.data.user));
            
            // Redirect to admin dashboard
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-card-left">
                    <div className="login-header">
                        <div className="admin-badge">VIP TOURS ADMIN</div>
                        <h2>Enterprise Command Center for Tour Operations</h2>
                        <p>Coordinate tour packages, manage user experiences, and safeguard financial operations — all from a zero-trust secured control hub.</p>
                    </div>
                </div>

                <div className="login-card">
                    <div className="login-header">
                        <div className="access-badge">ADMIN ACCESS ONLY</div>
                        <h2>Authenticate to continue</h2>
                        <p>Your session is encrypted and monitored. Use assigned enterprise credentials to enter.</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">WORK EMAIL</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@viptours.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">PASSWORD</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                disabled={loading}
                            />
                        </div>

                        

                        <button 
                            type="submit" 
                            className="login-button"
                            disabled={loading}
                        >
                            <span className="lock-icon">🔒</span>
                            {loading ? 'Signing in...' : 'Secure Sign In'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Encrypted via TLS 1.3 • ISO 27001 compliant • Continuous anomaly detection</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;