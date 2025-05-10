'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getToken, removeToken } from '@/lib/auth';
import Image from 'next/image'; // Use Next.js Image component

// Define types for profile and resume history items
interface ProfileData {
    first_name: string;
    last_name: string;
    title: string;
    email: string;
    city: string;
    country: string;
    bio: string;
}

interface ResumeHistoryItem {
    resume_id: number | string; // ID can be number or string
    resume_title: string;
    created_at: string; // Keep as string, format as needed
}

export default function ProfilePage() {
    const router = useRouter();

    const [profile, setProfile] = useState<ProfileData>({
        first_name: '', last_name: '', title: '', email: '', city: '', country: '', bio: ''
    });
    const [editedProfile, setEditedProfile] = useState<ProfileData>({ ...profile });
    const [resumeHistory, setResumeHistory] = useState<ResumeHistoryItem[]>([]);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Fetch Profile Data
    useEffect(() => {
        const getProfile = async () => {
            setIsLoadingProfile(true);
            setError(null);
            const jwtToken = getToken();
            if (!jwtToken || !API_URL) {
                setError('Configuration or authentication error.');
                setIsLoadingProfile(false);
                if (!jwtToken) router.push('/login'); // Redirect if no token
                return;
            }

            try {
                const response = await axios.get<{ data: { profile: ProfileData } }>(`${API_URL}/get_profile`, {
                    headers: { 'Authorization': `Bearer ${jwtToken}` }
                });
                if (response.status === 200 && response.data?.data?.profile) {
                    setProfile(response.data.data.profile);
                    setEditedProfile(response.data.data.profile); // Initialize edit form
                } else {
                    throw new Error('Failed to fetch profile data.');
                }
            } catch (err: any) {
                console.error('Error fetching profile:', err);
                setError(err.message || 'Could not load profile.');
                // Provide fallback data for UI testing if needed
                // setProfile({ first_name: 'John', last_name: 'Doe', title: 'Developer', email: 'j.doe@example.com', city: 'Anytown', country: 'USA', bio: 'Sample bio.' });
            } finally {
                setIsLoadingProfile(false);
            }
        };
        getProfile();
    }, [API_URL, router]); // Dependency array

    // Fetch Resume History
    useEffect(() => {
        const fetchResumeHistory = async () => {
            setIsLoadingHistory(true);
            setError(null);
            const jwtToken = getToken();
            if (!jwtToken || !API_URL) {
                setError('Configuration or authentication error.');
                setIsLoadingHistory(false);
                // Don't necessarily redirect here, maybe profile loads but history fails
                return;
            }

            try {
                const response = await axios.get<{ data: ResumeHistoryItem[] }>(`${API_URL}/get_resume_list`, {
                    headers: { 'Authorization': `Bearer ${jwtToken}` }
                });
                if (response.status === 200 && response.data?.data) {
                    // Format date immediately after fetching
                    const formattedHistory = response.data.data.map(resume => ({
                        ...resume,
                        created_at: new Date(resume.created_at).toLocaleString() // Format date
                    }));
                    setResumeHistory(formattedHistory);
                } else {
                    setResumeHistory([]); // Set empty if no data or error
                }
            } catch (error: any) {
                console.error('Failed to fetch resume history:', error);
                setError('Could not load resume history.');
                setResumeHistory([]);
            } finally {
                setIsLoadingHistory(false);
            }
        };
        fetchResumeHistory();
    }, [API_URL]); // Dependency array

    // Handle Profile Edit Modal
    const openEditModal = () => {
        setEditedProfile({ ...profile }); // Reset edit form to current profile
        setShowEditModal(true);
    };
    const closeEditModal = () => setShowEditModal(false);

    const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedProfile(prev => ({ ...prev, [name]: value }));
    };

    const saveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const jwtToken = getToken();
        if (!jwtToken || !API_URL) {
            setError('Cannot save profile due to configuration or auth error.');
            return;
        }

        try {
            // Use editedProfile for the PUT request payload
            const response = await axios.put(`${API_URL}/put_profile`, editedProfile, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                console.log('Profile updated successfully');
                setProfile({ ...editedProfile }); // Update main profile state
                closeEditModal();
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error: any) {
            console.error('Error updating profile:', error);
            setError(error.message || 'Could not save profile.');
        }
    };

    // Handle View Resume
    const viewResume = async (resumeId: number | string) => {
        setError(null);
        const jwtToken = getToken();
        if (!jwtToken || !API_URL) {
            setError('Configuration or authentication error.');
            if (!jwtToken) router.push('/login');
            return;
        }
        console.log(`Fetching resume with ID: ${resumeId}`);
        try {
            const response = await axios.get<{ data: { resume: any /* Use ResumeModel type */, resume_title: string } }>(
                `${API_URL}/get_resume/${resumeId}`,
                { headers: { 'Authorization': `Bearer ${jwtToken}` } }
            );

            if (response.status === 200 && response.data?.data?.resume) {
                console.log("Resume data fetched:", response.data.data.resume);
                // todo by tt 0510; 需要保存 简历json 到 localStorage
                router.push("/enterResume");
            } else {
                throw new Error('Failed to fetch resume data.');
            }
        } catch (error: any) {
            console.error('Failed to fetch resume:', error);
            setError(error.message || 'Could not load the selected resume.');
        }
    };


    // Handle Logout
    const handleLogout = () => setShowLogoutConfirmation(true);
    const closeLogoutModal = () => setShowLogoutConfirmation(false);
    const confirmLogout = () => {
        removeToken();
        // todo by tt 0510; 需要清除 localStorage 吗？
        router.push('/login');
        // Force reload might be needed if state isn't clearing properly across contexts/layouts
        // window.location.reload();
    };

    // Render Loading States
    if (isLoadingProfile || isLoadingHistory) {
        return <div className="flex justify-center items-center min-h-screen">Loading profile...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 profile-page"> {/* Added profile-page for potential styling */}
            {error && <div className="alert alert-danger mb-4">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Sidebar */}
                <div className="md:col-span-1">
                    <div className="card text-center">
                        <div className="card-body">
                            <Image
                                src="/Avatar.png" // Path relative to public folder
                                alt="Profile Picture"
                                width={150}
                                height={150}
                                className="rounded-full mx-auto mb-3 border-4 border-gray-100 shadow"
                            />
                            <h5 className="text-xl font-semibold mb-1">{profile.first_name} {profile.last_name}</h5>
                            <p className="text-gray-500 mb-3">{profile.title || 'No title set'}</p>
                            <div className="flex justify-center space-x-2 mb-2">
                                <button type="button" className="btn-primary btn-sm" onClick={openEditModal}>
                                    Edit Profile
                                </button>
                                <button type="button" className="btn-danger btn-sm" onClick={handleLogout}>
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details & History */}
                <div className="md:col-span-2 space-y-6">
                    {/* Details Card */}
                    <div className="card">
                        <div className="card-body">
                            <h5 className="text-lg font-semibold mb-4">Profile Details</h5>
                            <div className="space-y-3">
                                {/* Use grid for alignment */}
                                <div className="grid grid-cols-3 gap-4 items-center">
                                    <h6 className="col-span-1 font-medium text-gray-600">Full Name</h6>
                                    <p className="col-span-2 text-gray-800">{profile.first_name} {profile.last_name}</p>
                                </div>
                                <hr/>
                                <div className="grid grid-cols-3 gap-4 items-center">
                                    <h6 className="col-span-1 font-medium text-gray-600">Email</h6>
                                    <p className="col-span-2 text-gray-800">{profile.email}</p>
                                </div>
                                <hr/>
                                <div className="grid grid-cols-3 gap-4 items-center">
                                    <h6 className="col-span-1 font-medium text-gray-600">Location</h6>
                                    <p className="col-span-2 text-gray-800">
                                        {profile.city && profile.country ? `${profile.city}, ${profile.country}` : 'Not specified'}
                                    </p>
                                </div>
                                <hr/>
                                <div className="grid grid-cols-3 gap-4 items-start"> {/* Use items-start for bio */}
                                    <h6 className="col-span-1 font-medium text-gray-600">Bio</h6>
                                    <p className="col-span-2 text-gray-800 whitespace-pre-wrap">{profile.bio || 'No bio available.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resume History Card */}
                    <div className="card">
                        <div className="card-body">
                            <h5 className="text-lg font-semibold mb-4">Resume History</h5>
                            {isLoadingHistory ? (
                                <p className="text-gray-500">Loading history...</p>
                            ) : resumeHistory.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {resumeHistory.map((resume) => (
                                        <li key={resume.resume_id} className="py-3">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <strong className="text-gray-800">{resume.resume_title}</strong>
                                                    <br />
                                                    <small className="text-gray-500">Last Edit: {resume.created_at}</small>
                                                </div>
                                                <button
                                                    className="btn-primary btn-sm"
                                                    onClick={() => viewResume(resume.resume_id)}
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-gray-500 py-4">No resume history available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h5 className="text-xl font-semibold">Edit Profile</h5>
                            <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <form onSubmit={saveProfile} className="p-4 space-y-4">
                            {/* Form Fields */}
                            <div>
                                <label className="form-label">First Name</label>
                                <input type="text" name="first_name" className="form-control" value={editedProfile.first_name} onChange={handleProfileInputChange} />
                            </div>
                            <div>
                                <label className="form-label">Last Name</label>
                                <input type="text" name="last_name" className="form-control" value={editedProfile.last_name} onChange={handleProfileInputChange} />
                            </div>
                            <div>
                                <label className="form-label">Email</label>
                                <input type="email" name="email" className="form-control" value={editedProfile.email} onChange={handleProfileInputChange} />
                            </div>
                            <div>
                                <label className="form-label">City</label>
                                <input type="text" name="city" className="form-control" value={editedProfile.city} onChange={handleProfileInputChange} />
                            </div>
                            <div>
                                <label className="form-label">Country</label>
                                <input type="text" name="country" className="form-control" value={editedProfile.country} onChange={handleProfileInputChange} />
                            </div>
                            <div>
                                <label className="form-label">Bio</label>
                                <textarea name="bio" className="form-control" rows={3} value={editedProfile.bio} onChange={handleProfileInputChange}></textarea>
                            </div>
                            <div className="flex justify-end space-x-3 pt-3 border-t">
                                <button type="button" className="btn-secondary" onClick={closeEditModal}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Logout Confirmation Modal */}
            {showLogoutConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h5 className="text-lg font-semibold">Confirm Logout</h5>
                            <button onClick={closeLogoutModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                        </div>
                        <div className="p-4">
                            Are you sure you want to log out?
                        </div>
                        <div className="flex justify-end space-x-3 p-4 border-t">
                            <button type="button" className="btn-secondary" onClick={closeLogoutModal}>Cancel</button>
                            <button type="button" className="btn-danger" onClick={confirmLogout}>Log Out</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}