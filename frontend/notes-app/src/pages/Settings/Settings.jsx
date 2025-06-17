import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { 
    PageHeader, 
    Card, 
    Button, 
    Input, 
    Badge, 
    LoadingSpinner,
    EmptyState 
} from '../../components/UI/DesignSystem';
import { 
    FaCog, 
    FaUsers, 
    FaBell, 
    FaLock, 
    FaBuilding,
    FaUserPlus,
    FaTrash,
    FaEdit,
    FaUpload,
    FaImage,
    FaPalette,
    FaEnvelope,
    FaUserTie,
    FaHandshake,
    FaMedkit,
    FaKey,
    FaShieldAlt,
    FaEye,
    FaEyeSlash
} from 'react-icons/fa';
import { getClubSettings, updateClubSettings, uploadClubLogo } from '../../utils/clubSettingsService';
import { getTeamMembers, inviteTeamMember, removeTeamMember } from '../../utils/teamMembersService';
import axiosInstance from '../../utils/axiosInstance';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('club');
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [clubSettings, setClubSettings] = useState({
        name: '',
        logo: null,
        primaryColor: '#3b82f6',
        secondaryColor: '#10b981',
        founded: '',
        address: '',
        phone: '',
        email: ''
    });const [teamMembers, setTeamMembers] = useState([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('assistant');    // Password Reset States
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Email Change States
    const [emailForm, setEmailForm] = useState({
        newEmail: '',
        currentPassword: ''
    });
    const [showEmailPassword, setShowEmailPassword] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);const tabs = [
        { id: 'club', label: 'Vereinseinstellungen', icon: FaBuilding },
        { id: 'team', label: 'Team-Management', icon: FaUsers },
        { id: 'notifications', label: 'Benachrichtigungen', icon: FaBell },
        { id: 'security', label: 'Sicherheit', icon: FaLock }
    ];

    const roles = [
        { value: 'assistant', label: 'Co-Trainer', icon: FaUserTie, color: 'blue' },
        { value: 'caretaker', label: 'Betreuer', icon: FaHandshake, color: 'green' },
        { value: 'physiotherapist', label: 'Physiotherapeut', icon: FaMedkit, color: 'purple' },
        { value: 'analyst', label: 'Analyst', icon: FaCog, color: 'yellow' }
    ];    useEffect(() => {
        // Load settings from API
        fetchUserInfo();
        fetchSettings();
        fetchTeamMembers();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await axiosInstance.get('/get-user');
            setUserInfo(response.data.user);
        } catch (error) {
            console.error('Fehler beim Laden der Benutzerinfo:', error);
        }
    };const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await getClubSettings();
            setClubSettings(response.settings || {
                name: '',
                logo: null,
                primaryColor: '#3b82f6',
                secondaryColor: '#10b981',
                founded: '',
                address: '',
                phone: '',
                email: ''
            });
        } catch (error) {
            console.error('Fehler beim Laden der Einstellungen:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeamMembers = async () => {
        try {
            const response = await getTeamMembers();
            setTeamMembers(response.teamMembers || []);
        } catch (error) {
            console.error('Fehler beim Laden der Team-Mitglieder:', error);
        }
    };    const handleClubSettingsSave = async () => {
        try {
            setLoading(true);
            await updateClubSettings(clubSettings);
            console.log('Vereinseinstellungen gespeichert:', clubSettings);
            // Optional: Show success message
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInviteMember = async () => {
        if (!inviteEmail || !inviteRole) return;

        try {
            setLoading(true);
            const response = await inviteTeamMember({ 
                email: inviteEmail, 
                role: inviteRole,
                name: inviteEmail.split('@')[0] 
            });
            
            setTeamMembers([...teamMembers, response.teamMember]);
            setInviteEmail('');
            setInviteRole('assistant');
            // Optional: Show success message
        } catch (error) {
            console.error('Fehler beim Einladen:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (memberId) => {
        try {
            await removeTeamMember(memberId);
            setTeamMembers(teamMembers.filter(m => m._id !== memberId));
        } catch (error) {
            console.error('Fehler beim Entfernen:', error);
        }
    };    const handleLogoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setClubSettings({ ...clubSettings, logo: e.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePasswordChange = async () => {
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            alert('Bitte füllen Sie alle Felder aus.');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('Die neuen Passwörter stimmen nicht überein.');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            alert('Das neue Passwort muss mindestens 6 Zeichen lang sein.');
            return;
        }

        try {
            setPasswordLoading(true);
            
            // API-Call zum Passwort ändern
            const response = await axiosInstance.put('/change-password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });

            if (response.data.success) {
                alert('Passwort erfolgreich geändert!');
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (error) {
            console.error('Fehler beim Ändern des Passworts:', error);
            alert('Fehler beim Ändern des Passworts. Überprüfen Sie Ihr aktuelles Passwort.');
        } finally {
            setPasswordLoading(false);
        }
    };    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleEmailChange = async () => {
        if (!emailForm.newEmail || !emailForm.currentPassword) {
            alert('Bitte füllen Sie alle Felder aus.');
            return;
        }

        // Email-Validierung
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailForm.newEmail)) {
            alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
            return;
        }

        try {
            setEmailLoading(true);
            
            const response = await axiosInstance.put('/change-email', {
                newEmail: emailForm.newEmail,
                currentPassword: emailForm.currentPassword
            });

            if (response.data.success) {
                alert('E-Mail-Adresse erfolgreich geändert! Bitte melden Sie sich mit Ihrer neuen E-Mail-Adresse an.');
                setEmailForm({
                    newEmail: '',
                    currentPassword: ''
                });
                // Optional: User ausloggen und zur Login-Seite weiterleiten
                // localStorage.removeItem('token');
                // navigate('/login');
            }
        } catch (error) {
            console.error('Fehler beim Ändern der E-Mail:', error);
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Fehler beim Ändern der E-Mail-Adresse. Überprüfen Sie Ihr Passwort.');
            }
        } finally {
            setEmailLoading(false);
        }
    };

    const getRoleInfo = (roleValue) => {
        return roles.find(r => r.value === roleValue) || roles[0];
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <Badge variant="success">Aktiv</Badge>;
            case 'pending':
                return <Badge variant="warning">Einladung ausstehend</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const renderClubSettings = () => (
        <div className="space-y-6">
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FaImage className="mr-2 text-blue-600" />
                        Vereinsidentität
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Logo Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Vereinslogo
                            </label>
                            <div className="flex items-center space-x-4">
                                {clubSettings.logo ? (
                                    <img 
                                        src={clubSettings.logo} 
                                        alt="Vereinslogo" 
                                        className="w-16 h-16 object-cover rounded-lg border"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
                                        <FaImage className="text-gray-400" />
                                    </div>
                                )}
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                        id="logo-upload"
                                    />
                                    <label 
                                        htmlFor="logo-upload"
                                        className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <FaUpload className="mr-2" />
                                        Logo hochladen
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Club Name */}
                        <div>
                            <Input
                                label="Vereinsname"
                                value={clubSettings.name}
                                onChange={(e) => setClubSettings({...clubSettings, name: e.target.value})}
                                placeholder="FC Beispiel"
                            />
                        </div>

                        {/* Colors */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Primärfarbe
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="color"
                                    value={clubSettings.primaryColor}
                                    onChange={(e) => setClubSettings({...clubSettings, primaryColor: e.target.value})}
                                    className="w-12 h-10 border border-gray-300 rounded-md"
                                />
                                <Input
                                    value={clubSettings.primaryColor}
                                    onChange={(e) => setClubSettings({...clubSettings, primaryColor: e.target.value})}
                                    className="flex-1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sekundärfarbe
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="color"
                                    value={clubSettings.secondaryColor}
                                    onChange={(e) => setClubSettings({...clubSettings, secondaryColor: e.target.value})}
                                    className="w-12 h-10 border border-gray-300 rounded-md"
                                />
                                <Input
                                    value={clubSettings.secondaryColor}
                                    onChange={(e) => setClubSettings({...clubSettings, secondaryColor: e.target.value})}
                                    className="flex-1"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Kontaktinformationen</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Gründungsjahr"
                            type="number"
                            value={clubSettings.founded}
                            onChange={(e) => setClubSettings({...clubSettings, founded: e.target.value})}
                            placeholder="1999"
                        />
                        <Input
                            label="E-Mail"
                            type="email"
                            value={clubSettings.email}
                            onChange={(e) => setClubSettings({...clubSettings, email: e.target.value})}
                            placeholder="info@fcbeispiel.de"
                        />
                        <Input
                            label="Telefon"
                            value={clubSettings.phone}
                            onChange={(e) => setClubSettings({...clubSettings, phone: e.target.value})}
                            placeholder="+49 123 456789"
                            className="md:col-span-1"
                        />
                        <Input
                            label="Adresse"
                            value={clubSettings.address}
                            onChange={(e) => setClubSettings({...clubSettings, address: e.target.value})}
                            placeholder="Musterstraße 123, 12345 Musterstadt"
                            className="md:col-span-1"
                        />
                    </div>
                </div>
            </Card>

            <div className="flex justify-end">
                <Button 
                    variant="primary" 
                    onClick={handleClubSettingsSave}
                    loading={loading}
                >
                    Einstellungen speichern
                </Button>
            </div>
        </div>
    );

    const renderTeamManagement = () => (
        <div className="space-y-6">
            {/* Invite Member */}
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FaUserPlus className="mr-2 text-blue-600" />
                        Teammitglied einladen
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="E-Mail-Adresse"
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="trainer@example.com"
                            icon={FaEnvelope}
                        />
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rolle
                            </label>
                            <select
                                value={inviteRole}
                                onChange={(e) => setInviteRole(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {roles.map(role => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="flex items-end">
                            <Button 
                                variant="primary"
                                onClick={handleInviteMember}
                                disabled={!inviteEmail || !inviteRole}
                                loading={loading}
                                className="w-full"
                            >
                                Einladen
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Team Members List */}
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Teammitglieder</h3>
                    
                    {teamMembers.length === 0 ? (
                        <EmptyState
                            icon={FaUsers}
                            title="Noch keine Teammitglieder"
                            description="Laden Sie Co-Trainer, Betreuer und andere Teammitglieder ein."
                        />
                    ) : (
                        <div className="space-y-3">
                            {teamMembers.map(member => {
                                const roleInfo = getRoleInfo(member.role);
                                return (
                                    <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-10 h-10 rounded-full bg-${roleInfo.color}-100 flex items-center justify-center`}>
                                                <roleInfo.icon className={`text-${roleInfo.color}-600`} />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{member.name}</h4>
                                                <p className="text-sm text-gray-500">{member.email}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-3">
                                            <Badge variant={roleInfo.color} className="flex items-center">
                                                <roleInfo.icon className="mr-1" />
                                                {roleInfo.label}
                                            </Badge>
                                            {getStatusBadge(member.status)}
                                            <div className="flex space-x-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={FaEdit}
                                                    title="Bearbeiten"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={FaTrash}
                                                    onClick={() => handleRemoveMember(member.id)}
                                                    title="Entfernen"
                                                    className="text-red-600 hover:text-red-700"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );

    const renderNotificationSettings = () => (
        <Card>
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Benachrichtigungseinstellungen</h3>
                <p className="text-gray-500">Benachrichtigungseinstellungen werden in einer zukünftigen Version implementiert.</p>
            </div>
        </Card>
    );    const renderSecuritySettings = () => (
        <div className="space-y-6">
            {/* Email Change */}
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FaEnvelope className="mr-2 text-green-600" />
                        E-Mail-Adresse ändern
                    </h3>
                    
                    <div className="space-y-4 max-w-md">
                        {/* Current Email Display */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Aktuelle E-Mail-Adresse
                            </label>
                            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-600">
                                {userInfo?.email || 'Nicht verfügbar'}
                            </div>
                        </div>

                        {/* New Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Neue E-Mail-Adresse *
                            </label>
                            <input
                                type="email"
                                value={emailForm.newEmail}
                                onChange={(e) => setEmailForm({...emailForm, newEmail: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="neue.email@example.com"
                            />
                        </div>

                        {/* Password Confirmation for Email Change */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Aktuelles Passwort zur Bestätigung *
                            </label>
                            <div className="relative">
                                <input
                                    type={showEmailPassword ? 'text' : 'password'}
                                    value={emailForm.currentPassword}
                                    onChange={(e) => setEmailForm({...emailForm, currentPassword: e.target.value})}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Passwort zur Bestätigung"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowEmailPassword(!showEmailPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showEmailPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Hinweis:</strong> Nach der Änderung Ihrer E-Mail-Adresse müssen Sie sich mit der neuen E-Mail-Adresse anmelden.
                            </p>
                        </div>

                        <Button 
                            variant="primary" 
                            onClick={handleEmailChange}
                            loading={emailLoading}
                            disabled={!emailForm.newEmail || !emailForm.currentPassword}
                            className="w-full"
                        >
                            E-Mail-Adresse ändern
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Password Change */}
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FaKey className="mr-2 text-blue-600" />
                        Passwort ändern
                    </h3>
                    
                    <div className="space-y-4 max-w-md">
                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Aktuelles Passwort *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Aktuelles Passwort eingeben"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('current')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Neues Passwort *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Neues Passwort eingeben"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Mindestens 6 Zeichen</p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Passwort bestätigen *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Passwort erneut eingeben"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {/* Password Strength Indicator */}
                        {passwordForm.newPassword && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Passwort-Stärke:</p>
                                <div className="space-y-1">
                                    <div className={`text-xs ${passwordForm.newPassword.length >= 6 ? 'text-green-600' : 'text-red-600'}`}>
                                        ✓ Mindestens 6 Zeichen
                                    </div>
                                    <div className={`text-xs ${/[A-Z]/.test(passwordForm.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                        ✓ Großbuchstabe (empfohlen)
                                    </div>
                                    <div className={`text-xs ${/[0-9]/.test(passwordForm.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                        ✓ Zahl (empfohlen)
                                    </div>
                                    <div className={`text-xs ${/[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                        ✓ Sonderzeichen (empfohlen)
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button 
                            variant="primary" 
                            onClick={handlePasswordChange}
                            loading={passwordLoading}
                            disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                            className="w-full"
                        >
                            Passwort ändern
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Security Information */}
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FaShieldAlt className="mr-2 text-green-600" />
                        Sicherheitshinweise
                    </h3>
                    
                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-start space-x-2">
                            <FaLock className="text-green-600 mt-0.5 flex-shrink-0" />
                            <p>Ihre Daten werden verschlüsselt übertragen und sicher gespeichert.</p>
                        </div>
                        <div className="flex items-start space-x-2">
                            <FaKey className="text-blue-600 mt-0.5 flex-shrink-0" />
                            <p>Verwenden Sie ein starkes, einzigartiges Passwort für Ihr Konto.</p>
                        </div>
                        <div className="flex items-start space-x-2">
                            <FaEnvelope className="text-purple-600 mt-0.5 flex-shrink-0" />
                            <p>Die Änderung der E-Mail-Adresse erfordert eine erneute Anmeldung.</p>
                        </div>
                        <div className="flex items-start space-x-2">
                            <FaShieldAlt className="text-orange-600 mt-0.5 flex-shrink-0" />
                            <p>Melden Sie sich immer ab, wenn Sie einen geteilten Computer verwenden.</p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2">Tipp für sichere Passwörter:</h4>
                        <p className="text-sm text-yellow-700">
                            Verwenden Sie eine Kombination aus Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen. 
                            Vermeiden Sie persönliche Informationen wie Ihren Namen oder Geburtsdatum.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                <PageHeader
                    title="Einstellungen"
                    subtitle="Vereinseinstellungen und Team-Management"
                    icon={FaCog}
                />

                {/* Tab Navigation */}
                <div className="mb-8">
                    <nav className="flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`${
                                        isActive
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
                                >
                                    <tab.icon className="mr-2" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'club' && renderClubSettings()}
                    {activeTab === 'team' && renderTeamManagement()}
                    {activeTab === 'notifications' && renderNotificationSettings()}
                    {activeTab === 'security' && renderSecuritySettings()}
                </div>
            </div>
        </Layout>
    );
};

export default Settings;
