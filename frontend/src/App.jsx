import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Plus, 
  Search, 
  Briefcase, 
  FileText, 
  TrendingUp,
  Sparkles,
  ChevronDown,
  Bell,
  Sun,
  Filter,
  Shield,
  Lock,
  Mail,
  LogOut,
  Users,
  Check
} from 'lucide-react';

function App() {
  // Global Request State (representing all requests in the organization)
  const [requests, setRequests] = useState([
    { id: 1, requester: 'Alex Bennett', email: 'alex@example.com', type: 'Annual Leave', start: '2026-07-20', end: '2026-07-24', days: 5, status: 'Approved', reason: 'Family Summer Vacation' },
    { id: 2, requester: 'Jane Cooper', email: 'jane@example.com', type: 'Sick Leave', start: '2026-07-10', end: '2026-07-11', days: 1, status: 'Approved', reason: 'Dental surgery recovery' },
    { id: 3, requester: 'Alex Bennett', email: 'alex@example.com', type: 'Personal Leave', start: '2026-08-05', end: '2026-08-06', days: 2, status: 'Pending', reason: 'Moving to new apartment' },
    { id: 4, requester: 'Marcus Brody', email: 'marcus@example.com', type: 'Annual Leave', start: '2026-09-12', end: '2026-09-19', days: 6, status: 'Pending', reason: 'Historical research expedition' },
  ]);

  // Auth User state: null (logged out) or { email, role, name }
  const [user, setUser] = useState(null);

  // Auth form input state
  const [loginRole, setLoginRole] = useState('Employee'); // 'Employee' or 'Administrator'
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [departmentInput, setDepartmentInput] = useState('');
  const [roleInput, setRoleInput] = useState('');

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Common Toast Trigger Helper
  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Handle Login / Registration submission
  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering) {
      if (!nameInput || !emailInput || !passwordInput || !departmentInput || !roleInput) {
        alert('Please fill in all registration fields.');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: nameInput,
            email: emailInput,
            password: passwordInput,
            department: departmentInput,
            role: roleInput,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed.');
        }

        alert('Account created successfully! Please sign in.');
        setIsRegistering(false);
        setNameInput('');
        setDepartmentInput('');
        setRoleInput('');
        setPasswordInput('');
      } catch (error) {
        alert(error.message || 'Registration failed.');
      }

      return;
    }

    if (!emailInput || !passwordInput) {
      alert('Please enter your email and password.');
      return;
    }

    if (loginRole === 'Administrator') {
      if (emailInput !== 'admin@timeoff.com' || passwordInput !== 'YourSuperSecretAdminPassword2026!') {
        alert('Unauthorized: Invalid Administrator Credentials.');
        return;
      }

      setUser({
        email: emailInput,
        role: 'Administrator',
        name: 'Admin Manager'
      });

      triggerToast('Logged in successfully as Administrator!');
      setEmailInput('');
      setPasswordInput('');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid employee credentials.');
      }

      setUser({
        email: data.employee?.email || emailInput,
        role: data.employee?.role || 'Employee',
        name: data.employee?.name || emailInput.split('@')[0]
      });

      triggerToast('Logged in successfully as Employee!');
      setEmailInput('');
      setPasswordInput('');
    } catch (error) {
      alert(error.message || 'Unable to sign in right now.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    triggerToast('Logged out successfully.');
  };

  // Approve Request (Admin only)
  const handleApproveRequest = (id) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        triggerToast(`Approved request for ${req.requester}!`);
        return { ...req, status: 'Approved' };
      }
      return req;
    }));
  };

  // Reject Request (Admin only)
  const handleRejectRequest = (id) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        triggerToast(`Rejected request for ${req.requester}.`);
        return { ...req, status: 'Rejected' };
      }
      return req;
    }));
  };

  // Add new request (Employee only)
  const handleAddRequest = (newReq) => {
    const request = {
      id: Date.now(),
      requester: user.name,
      email: user.email,
      ...newReq,
      status: 'Pending'
    };
    setRequests([request, ...requests]);
    triggerToast(`Requested ${newReq.days} day(s) of ${newReq.type}!`);
  };

  // RENDER CONTROLLER
  if (!user) {
    return (
      <LoginGateway 
        loginRole={loginRole}
        setLoginRole={setLoginRole}
        emailInput={emailInput}
        setEmailInput={setEmailInput}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        isRegistering={isRegistering}
        setIsRegistering={setIsRegistering}
        nameInput={nameInput}
        setNameInput={setNameInput}
        departmentInput={departmentInput}
        setDepartmentInput={setDepartmentInput}
        roleInput={roleInput}
        setRoleInput={setRoleInput}
        handleAuthSubmit={handleAuthSubmit}
      />
    );
  }

  if (user.role === 'Administrator') {
    return (
      <AdminPortal 
        user={user} 
        requests={requests} 
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
        onLogout={handleLogout}
        toast={toast}
      />
    );
  }

  return (
    <EmployeePortal 
      user={user} 
      requests={requests.filter(req => req.email === user.email)} 
      onAddRequest={handleAddRequest}
      onLogout={handleLogout}
      toast={toast}
    />
  );
}

// ----------------------------------------------------
// SUB-COMPONENT: LOGIN GATEWAY
// ----------------------------------------------------
function LoginGateway({ 
  loginRole, 
  setLoginRole, 
  emailInput, 
  setEmailInput, 
  passwordInput, 
  setPasswordInput, 
  isRegistering,
  setIsRegistering,
  nameInput,
  setNameInput,
  departmentInput,
  setDepartmentInput,
  roleInput,
  setRoleInput,
  handleAuthSubmit 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex items-center justify-center p-4 font-sans antialiased">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4 animate-pulse">
            <Calendar className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">TimeOff Management</h2>
          <p className="text-sm text-slate-400 mt-2">
            {isRegistering ? 'Create your employee account' : 'Sign in to access your dashboard'}
          </p>
        </div>

        {/* Role Selector Card */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">Select Your Role</label>
          <div className="grid grid-cols-2 gap-4">
            
            {/* Employee Option */}
            <button
              type="button"
              onClick={() => setLoginRole('Employee')}
              className={`relative overflow-hidden p-4 rounded-2xl border text-left transition-all duration-300 ${
                loginRole === 'Employee'
                  ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-lg shadow-indigo-500/15'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <User className={`h-5 w-5 ${loginRole === 'Employee' ? 'text-indigo-400' : 'text-slate-500'}`} />
                {loginRole === 'Employee' && (
                  <span className="h-4 w-4 bg-indigo-500 text-white rounded-full flex items-center justify-center text-[10px]">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </div>
              <p className="font-bold text-sm">Employee</p>
              <p className="text-[10px] text-slate-500 mt-1">Submit & view leave history</p>
            </button>

            {/* Admin Option */}
            <button
              type="button"
              onClick={() => setLoginRole('Administrator')}
              className={`relative overflow-hidden p-4 rounded-2xl border text-left transition-all duration-300 ${
                loginRole === 'Administrator'
                  ? 'border-fuchsia-500 bg-fuchsia-500/10 text-white shadow-lg shadow-fuchsia-500/15'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Shield className={`h-5 w-5 ${loginRole === 'Administrator' ? 'text-fuchsia-400' : 'text-slate-500'}`} />
                {loginRole === 'Administrator' && (
                  <span className="h-4 w-4 bg-fuchsia-500 text-white rounded-full flex items-center justify-center text-[10px]">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </div>
              <p className="font-bold text-sm">Administrator</p>
              <p className="text-[10px] text-slate-500 mt-1">Manage & approve requests</p>
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-100 placeholder-slate-650 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Department</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="HR / Engineering"
                    value={departmentInput}
                    onChange={(e) => setDepartmentInput(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-100 placeholder-slate-650 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Designation / Working Role</label>
                <div className="relative">
                  <Sparkles className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Software Engineer"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-100 placeholder-slate-650 outline-none transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="email"
                required
                placeholder={loginRole === 'Administrator' ? 'admin@example.com' : 'alex@example.com'}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-100 placeholder-slate-650 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-100 placeholder-slate-650 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] mt-6"
          >
            {isRegistering ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setIsRegistering((prev) => !prev)}
          className="mt-4 w-full text-sm text-indigo-300 hover:text-white transition-colors underline"
        >
          {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register here"}
        </button>

        {/* Info Box */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">
            {isRegistering ? 'Create an employee profile to access the leave portal.' : 'For testing, you can input any email and password.'}
          </p>
        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------
// SUB-COMPONENT: EMPLOYEE PORTAL
// ----------------------------------------------------
function EmployeePortal({ user, requests, onAddRequest, onLogout, toast }) {
  // State for filter
  const [filter, setFilter] = useState('All');

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for new request form
  const [newRequest, setNewRequest] = useState({
    type: 'Annual Leave',
    start: '',
    end: '',
    reason: '',
  });

  // Form handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newRequest.start || !newRequest.end || !newRequest.reason) {
      alert('Please fill out all fields.');
      return;
    }

    const startDate = new Date(newRequest.start);
    const endDate = new Date(newRequest.end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays <= 0 || isNaN(diffDays)) {
      alert('End date must be after or equal to start date.');
      return;
    }

    onAddRequest({
      type: newRequest.type,
      start: newRequest.start,
      end: newRequest.end,
      days: diffDays,
      reason: newRequest.reason,
    });

    setIsModalOpen(false);
    setNewRequest({ type: 'Annual Leave', start: '', end: '', reason: '' });
  };

  // Filter requests
  const filteredRequests = filter === 'All' 
    ? requests 
    : requests.filter(r => r.status === filter);

  // Balance calculation
  const totalAnnual = 25;
  const usedAnnual = requests.filter(r => r.type === 'Annual Leave' && r.status === 'Approved').reduce((acc, curr) => acc + curr.days, 0);
  const remainingAnnual = totalAnnual - usedAnnual;

  const totalSick = 10;
  const usedSick = requests.filter(r => r.type === 'Sick Leave' && r.status === 'Approved').reduce((acc, curr) => acc + curr.days, 0);
  const remainingSick = totalSick - usedSick;

  const totalPersonal = 5;
  const usedPersonal = requests.filter(r => r.type === 'Personal Leave' && r.status === 'Approved').reduce((acc, curr) => acc + curr.days, 0);
  const remainingPersonal = totalPersonal - usedPersonal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col font-sans antialiased pb-12">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-indigo-600/90 backdrop-blur-md border border-indigo-400/30 text-white px-5 py-4 rounded-xl shadow-2xl shadow-indigo-500/20 flex items-center gap-3 animate-bounce">
          <Sparkles className="h-5 w-5 text-indigo-200" />
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}

      {/* Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">TimeOff</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-900/50 text-indigo-300 tracking-wider uppercase border border-indigo-500/20">Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="h-9 w-9 rounded-lg border border-slate-800 hover:border-slate-700 flex items-center justify-center bg-slate-950/40 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors">
              <Bell className="h-4 w-4" />
            </button>
            <div className="h-px bg-slate-800 w-6 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400 p-0.5">
                <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white">
                  {user.name ? user.name.split(' ').map(n=>n[0]).join('') : 'EM'}
                </div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-200">{user.name}</p>
                <p className="text-[10px] text-slate-500">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="ml-2 text-xs font-semibold text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:bg-rose-500/10 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-grow w-full">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl flex items-center gap-2">
              Welcome back, {user.name.split(' ')[0]} <span className="animate-pulse">👋</span>
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Here is your leave dashboard. You can check your remaining balances or request new time off.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] self-start md:self-auto"
          >
            <Plus className="h-5 w-5" />
            Request Time Off
          </button>
        </div>

        {/* Leave Balances Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Annual Leave */}
          <div className="relative group overflow-hidden rounded-2xl border border-indigo-500/10 bg-slate-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/5">
            <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all duration-300"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Annual Leave</span>
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Sun className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-extrabold text-white tracking-tight">{remainingAnnual}</span>
              <span className="text-xs font-medium text-slate-500">days left</span>
            </div>
            <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden mb-4">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(remainingAnnual / totalAnnual) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>Used: {usedAnnual} days</span>
              <span>Total: {totalAnnual} days</span>
            </div>
          </div>

          {/* Card 2: Sick Leave */}
          <div className="relative group overflow-hidden rounded-2xl border border-indigo-500/10 bg-slate-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/5">
            <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-300"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Sick Leave</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-extrabold text-white tracking-tight">{remainingSick}</span>
              <span className="text-xs font-medium text-slate-500">days left</span>
            </div>
            <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden mb-4">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(remainingSick / totalSick) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>Used: {usedSick} days</span>
              <span>Total: {totalSick} days</span>
            </div>
          </div>

          {/* Card 3: Personal Leave */}
          <div className="relative group overflow-hidden rounded-2xl border border-indigo-500/10 bg-slate-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-fuchsia-500/20 hover:shadow-2xl hover:shadow-fuchsia-500/5">
            <div className="absolute top-0 right-0 h-24 w-24 bg-fuchsia-500/5 rounded-full blur-2xl group-hover:bg-fuchsia-500/10 transition-all duration-300"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-fuchsia-400 uppercase tracking-widest">Personal Leave</span>
              <div className="h-8 w-8 rounded-lg bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400">
                <User className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-extrabold text-white tracking-tight">{remainingPersonal}</span>
              <span className="text-xs font-medium text-slate-500">days left</span>
            </div>
            <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden mb-4">
              <div 
                className="bg-fuchsia-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(remainingPersonal / totalPersonal) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>Used: {usedPersonal} days</span>
              <span>Total: {totalPersonal} days</span>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-400" />
                My Leave Request History
              </h2>
              <p className="text-xs text-slate-500 mt-1">Track and filter all your leave request records</p>
            </div>
            {/* Filter buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Approved', 'Pending', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 shrink-0 ${
                    filter === status 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-3">
                  <Filter className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-300">No requests found</h3>
                <p className="text-xs text-slate-500 mt-1">Try changing your filters or request a new leave.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/20">
                    <th className="px-6 py-4">Leave Type</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-sm text-slate-200">{req.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-slate-800 text-slate-300 font-medium px-2 py-0.5 rounded-full">
                          {req.days} {req.days === 1 ? 'day' : 'days'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                          <span>{req.start}</span>
                          <span className="text-slate-500">→</span>
                          <span>{req.end}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate">
                        <span className="text-xs text-slate-400 font-medium">{req.reason}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          req.status === 'Approved' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : req.status === 'Pending' 
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {req.status === 'Approved' && <CheckCircle2 className="h-3.5 w-3.5" />}
                          {req.status === 'Pending' && <Clock className="h-3.5 w-3.5" />}
                          {req.status === 'Rejected' && <XCircle className="h-3.5 w-3.5" />}
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Modal Form Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <h3 className="text-lg font-bold text-white">Request Time Off</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Leave Type</label>
                <select
                  value={newRequest.type}
                  onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 font-medium outline-none transition-all"
                >
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Personal Leave">Personal Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newRequest.start}
                    onChange={(e) => setNewRequest({ ...newRequest, start: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 font-medium outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">End Date</label>
                  <input
                    type="date"
                    required
                    value={newRequest.end}
                    onChange={(e) => setNewRequest({ ...newRequest, end: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 font-medium outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reason for Leave</label>
                <textarea
                  rows="3"
                  required
                  placeholder="e.g. Family Summer Vacation"
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 font-medium outline-none transition-all"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-850 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850 font-semibold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white font-semibold text-sm transition-all"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// SUB-COMPONENT: ADMINISTRATOR PORTAL
// ----------------------------------------------------
function AdminPortal({ user, requests, onApprove, onReject, onLogout, toast }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Handle requests selection
  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === 'All' ? true : req.status === filter;
    const matchesSearch = req.requester.toLowerCase().includes(search.toLowerCase()) || 
                          req.type.toLowerCase().includes(search.toLowerCase()) ||
                          req.reason.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate admin stats
  const totalEmployees = new Set(requests.map(r => r.email)).size;
  const pendingRequestsCount = requests.filter(r => r.status === 'Pending').length;
  const approvedRequestsCount = requests.filter(r => r.status === 'Approved').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col font-sans antialiased pb-12">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-fuchsia-600/90 backdrop-blur-md border border-fuchsia-400/30 text-white px-5 py-4 rounded-xl shadow-2xl shadow-fuchsia-500/20 flex items-center gap-3 animate-bounce">
          <Sparkles className="h-5 w-5 text-fuchsia-200" />
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}

      {/* Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/30">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-fuchsia-200 to-fuchsia-400 bg-clip-text text-transparent">TimeOff</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-fuchsia-900/50 text-fuchsia-300 tracking-wider uppercase border border-fuchsia-500/20">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-fuchsia-400 to-indigo-400 p-0.5">
                <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white">AD</div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-200">{user.name}</p>
                <p className="text-[10px] text-slate-500">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="ml-2 text-xs font-semibold text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:bg-rose-500/10 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-grow w-full">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl flex items-center gap-2">
            Administrator Panel <span className="animate-pulse">🛡️</span>
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Review, approve, or reject employee leave requests and manage organization parameters.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Total Employees */}
          <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Active Members</span>
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white tracking-tight">{totalEmployees}</span>
              <span className="text-xs font-medium text-slate-500">registered</span>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Pending Approvals</span>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white tracking-tight">{pendingRequestsCount}</span>
              <span className="text-xs font-medium text-slate-500">needs review</span>
            </div>
          </div>

          {/* Approved Requests */}
          <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Approved Requests</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white tracking-tight">{approvedRequestsCount}</span>
              <span className="text-xs font-medium text-slate-500">completed</span>
            </div>
          </div>
        </div>

        {/* Requests Management Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by employee, leave type, or reason..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-850 focus:border-fuchsia-500/80 focus:ring-1 focus:ring-fuchsia-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {['All', 'Approved', 'Pending', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 shrink-0 ${
                    filter === status 
                      ? 'bg-fuchsia-500 text-white' 
                      : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-3">
                  <Filter className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-300">No matching requests</h3>
                <p className="text-xs text-slate-500 mt-1">Try altering filters or your search query.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/20">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Leave Type</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
                            {req.requester.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-slate-200 block">{req.requester}</span>
                            <span className="text-[10px] text-slate-500">{req.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-300 font-semibold">{req.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-slate-800 text-slate-300 font-medium px-2 py-0.5 rounded-full">
                          {req.days} {req.days === 1 ? 'day' : 'days'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                          <span>{req.start}</span>
                          <span className="text-slate-500">→</span>
                          <span>{req.end}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate">
                        <span className="text-xs text-slate-400 font-medium">{req.reason}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'Approved' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : req.status === 'Pending' 
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === 'Pending' ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => onReject(req.id)}
                              className="px-2.5 py-1 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-400 text-xs font-semibold transition-all"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => onApprove(req.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/10 transition-all"
                            >
                              Approve
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 font-medium italic">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
