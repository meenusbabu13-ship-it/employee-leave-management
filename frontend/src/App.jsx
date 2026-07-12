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
  Filter
} from 'lucide-react';

function App() {
  // State for requests
  const [requests, setRequests] = useState([
    { id: 1, type: 'Annual Leave', start: '2026-07-20', end: '2026-07-24', days: 5, status: 'Approved', reason: 'Family Summer Vacation' },
    { id: 2, type: 'Sick Leave', start: '2026-07-10', end: '2026-07-11', days: 1, status: 'Approved', reason: 'Dental appointment' },
    { id: 3, type: 'Personal Leave', start: '2026-08-05', end: '2026-08-06', days: 2, status: 'Pending', reason: 'Moving to new apartment' },
  ]);

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

  // Toast notification state
  const [toast, setToast] = useState(null);

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

    const request = {
      id: Date.now(),
      type: newRequest.type,
      start: newRequest.start,
      end: newRequest.end,
      days: diffDays,
      status: 'Pending',
      reason: newRequest.reason,
    };

    setRequests([request, ...requests]);
    setIsModalOpen(false);
    setNewRequest({ type: 'Annual Leave', start: '', end: '', reason: '' });

    // Show toast
    setToast(`Successfully requested ${diffDays} day(s) of ${newRequest.type}!`);
    setTimeout(() => {
      setToast(null);
    }, 4000);
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
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">TimeOff</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 tracking-wider uppercase">Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="h-9 w-9 rounded-lg border border-slate-800 hover:border-slate-700 flex items-center justify-center bg-slate-950/40 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors">
              <Bell className="h-4 w-4" />
            </button>
            <div className="h-px bg-slate-800 w-6 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400 p-0.5">
                <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white">AB</div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-200">Alex Bennett</p>
                <p className="text-[10px] text-slate-500">Software Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-grow w-full">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl flex items-center gap-2">
              Welcome back, Alex <span className="animate-pulse">👋</span>
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

        {/* Requests Table & Filter Section */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-400" />
                Leave Request History
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

export default App;
