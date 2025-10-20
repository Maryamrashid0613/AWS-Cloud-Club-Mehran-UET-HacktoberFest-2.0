import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
    CreditCard,
    BarChart2,
    Target,
    Users,
    FileText,
    Lock,
    Award,
    Sparkles,
    ArrowRightCircle,
    User,
    LogOut,
    PlusCircle,
} from 'lucide-react'

// --- Helper: attach token to axios if exists
const token = typeof window !== 'undefined' ? localStorage.getItem('pfd_token') : null
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export default function HomePage() {
    const [authUser, setAuthUser] = useState(null)
    const [loadingUser, setLoadingUser] = useState(true)
    const [transactions, setTransactions] = useState([])
    const [balance, setBalance] = useState(0)
    const [points, setPoints] = useState(0)
    const [badges, setBadges] = useState([])
    const [quickAmount, setQuickAmount] = useState('')
    const [quickCategory, setQuickCategory] = useState('Food')
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [quickAddLoading, setQuickAddLoading] = useState(false);

    // Update Balance Modal State
    const [updateBalanceOpen, setUpdateBalanceOpen] = useState(false);
    const [addAmount, setAddAmount] = useState('');

    useEffect(() => {
        async function loadUser() {
            setLoadingUser(true)
            try {
                const raw = localStorage.getItem('pfd_user')
                if (raw) {
                    const user = JSON.parse(raw)
                    setAuthUser(user)
                    // Load balance from localStorage if exists
                    const savedBalance = localStorage.getItem('pfd_balance')
                    if (savedBalance) {
                        setBalance(parseFloat(savedBalance))
                    } else {
                        // Set initial balance if doesn't exist
                        setBalance(1200) // Default starting balance
                        localStorage.setItem('pfd_balance', '1200')
                    }
                }
            } catch (err) {
                console.warn('Error loading user', err)
            } finally {
                setLoadingUser(false)
            }
        }
        loadUser()
    }, [])

    // Update Balance Functionality - Only Add
    const handleAddBalance = async (e) => {
        e.preventDefault();

        const amount = parseFloat(addAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid positive number');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/api/balance/update', {
                amount: amount,
                type: 'add'
            });

            // Update balance from backend response
            const updatedBalance = response.data.balance;
            setBalance(updatedBalance);

            // Update localStorage as backup
            // localStorage.setItem('pfd_balance', updatedBalance.toString());

            // Reset form and close modal
            setAddAmount('');
            setUpdateBalanceOpen(false);

            alert(`Successfully added $${amount.toFixed(2)}! New balance: $${updatedBalance.toFixed(2)}`);
        } catch (error) {
            console.error('Error updating balance:', error);
            alert('Failed to update balance. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const addQuickTransaction = async (e) => {
        e.preventDefault();

        const amount = parseFloat(quickAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid positive number');
            return;
        }

        setQuickAddLoading(true);

        try {
            const response = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/api/transactions/quick-add', {
                amount: amount,
                category: quickCategory
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setBalance(response.data.newBalance);
                setPoints(response.data.newPoints);
                setBadges(response.data.badges);

                setTransactions(prevTransactions => [
                    {
                        id: response.data.transaction.id,
                        category: response.data.transaction.category,
                        amount: response.data.transaction.amount,
                        date: new Date(response.data.transaction.date).toLocaleDateString()
                    },
                    ...prevTransactions
                ]);

                setQuickAmount('');
                setQuickCategory('Food');
                alert(response.data.message);
            } else {
                alert(response.data.message || 'Failed to add transaction');
            }

        } catch (error) {
            console.error('Error adding transaction:', error);
            if (error.response) {
                alert(error.response.data.message || 'Failed to add transaction');
            } else if (error.request) {
                alert('Network error: Please check your connection');
            } else {
                alert('Error: ' + error.message);
            }
        } finally {
            setQuickAddLoading(false);
        }
    };

    // Demo data
    useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_SERVER_DOMAIN + '/api/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setBalance(response.data.balance);
        setPoints(response.data.points);
        setBadges(response.data.badges);
        setTransactions(response.data.recentTransactions);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // If there's an error, we can set the mock data as fallback? Or leave it empty?
      // For now, we'll leave it empty and let the user see the error?
      // Alternatively, we can set the mock data only in development?
      if (import.meta.env.DEV) {
        // Fallback to mock data in development
        const mockTransactions = [
          { id: 1, category: 'Food', amount: 25.50, date: '2024-01-15' },
          { id: 2, category: 'Transport', amount: 12.75, date: '2024-01-14' },
          { id: 3, category: 'Entertainment', amount: 45.00, date: '2024-01-13' },
        ];
        setTransactions(mockTransactions);
        setPoints(320);
        setBadges(['Getting Started', 'On Budget']);
      }
    }
  };

  if (authUser) {
    fetchDashboardData();
  }
}, [authUser]);

    function loggedInView() {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-slate-800">
                {/* Update Balance Modal */}
                {updateBalanceOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-80">
                            <h3 className="text-lg font-medium mb-4">Add to Balance</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Current Balance: <span className="font-semibold">${balance.toFixed(2)}</span>
                            </p>
                            <form onSubmit={handleAddBalance} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Amount to Add ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={addAmount}
                                        onChange={(e) => setAddAmount(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setUpdateBalanceOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                                    >
                                        Add Money
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Navbar */}
                <nav className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                            FP
                        </div>
                        <div className="font-semibold text-lg">FinPlay</div>
                    </div>

                    <div className="flex items-center gap-4 relative">
                        <button
                            onClick={() => setUpdateBalanceOpen(true)}
                            className="px-3 py-1 cursor-pointer rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                        >
                            Update Balance
                        </button>


                        {/* Avatar Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold focus:outline-none hover:bg-indigo-700"
                            >
                                {authUser?.name?.charAt(0).toUpperCase() || 'U'}
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border text-sm py-2 z-10">
                                    <div className="px-4 py-2 text-gray-700 border-b font-medium">
                                        {authUser?.name || 'User'}
                                    </div>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('pfd_token');
                                            localStorage.removeItem('pfd_user');
                                            localStorage.removeItem('pfd_balance');
                                            setAuthUser(null);
                                            setDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 flex items-center gap-2 text-gray-600 hover:bg-gray-100"
                                    >
                                        <LogOut size={14} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 pb-12">
                    {/* Top Summary */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-5 rounded shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-gray-400">Available balance</div>
                                    <div className="text-2xl font-semibold">${balance.toFixed(2)}</div>
                                </div>
                                <div className="text-sm text-gray-500">Account overview</div>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-gray-400">Points</div>
                                    <div className="text-2xl font-semibold">{points} pts</div>
                                </div>
                                <div className="text-sm text-gray-500">Level {Math.floor(points / 100) + 1}</div>
                            </div>

                            <div className="mt-4">
                                <div className="text-xs text-gray-400">Badges</div>
                                <div className="mt-2 flex gap-2 flex-wrap">
                                    {badges.map((b) => (
                                        <span key={b} className="px-2 py-1 bg-yellow-100 rounded text-xs">
                                            {b}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-gray-400">Goals progress</div>
                                    <div className="text-lg font-semibold">Emergency Fund</div>
                                </div>
                                <div className="text-sm text-gray-500">1 of 3 goals</div>
                            </div>

                            <div className="mt-4">
                                <div className="h-3 bg-gray-200 rounded overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: "25%" }} />
                                </div>
                                <div className="mt-2 text-xs text-gray-500">25% towards $1,000</div>
                            </div>
                        </div>
                    </section>

                    {/* Transactions + Quick Add */}
                    <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white p-5 rounded shadow">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">Recent transactions</h3>
                                <a href="/transactions" className="text-sm text-indigo-600 hover:text-indigo-800">
                                    View all
                                </a>
                            </div>

                            <div className="mt-4">
                                <ul className="space-y-2">
                                    {transactions.map((tx) => (
                                        <li key={tx.id} className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-medium">{tx.category}</div>
                                                <div className="text-xs text-gray-500">{tx.date}</div>
                                            </div>
                                            <div className="text-sm font-medium text-red-600">
                                                ${tx.amount}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <aside className="bg-white p-5 rounded shadow">
                            <h4 className="font-medium">Quick add</h4>
                            <p className="text-xs text-gray-500">Add a small expense quickly</p>

                            <form className="mt-3 space-y-3" onSubmit={addQuickTransaction}>
                                <div>
                                    <label className="block text-xs text-gray-600">Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={quickAmount}
                                        onChange={(e) => setQuickAmount(e.target.value)}
                                        className="w-full mt-1 p-2 border rounded"
                                        placeholder="0.00"
                                        required
                                        disabled={quickAddLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-600">Category</label>
                                    <select
                                        value={quickCategory}
                                        onChange={(e) => setQuickCategory(e.target.value)}
                                        className="w-full mt-1 p-2 border rounded"
                                        disabled={quickAddLoading}
                                    >
                                        <option>Food</option>
                                        <option>Transport</option>
                                        <option>Entertainment</option>
                                        <option>Utilities</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={quickAddLoading}
                                        className="w-full px-3 py-2 rounded bg-indigo-600 text-white flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {quickAddLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <PlusCircle size={16} /> Add
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </aside>
                    </section>
                </main>
            </div>
        );
    }

    // Minimalistic Public View
    function publicView() {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
                {/* Navigation */}
                <nav className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                            FP
                        </div>
                        <div className="font-semibold text-xl text-gray-900">FinPlay</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Sign In
                        </a>
                        <a 
                            href="/signup" 
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Get Started
                        </a>
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="max-w-7xl mx-auto px-4 py-16">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Make budgeting{' '}
                            <span className="text-indigo-600">fun</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Track your spending, earn rewards, and achieve your financial goals with our gamified budgeting app.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a 
                                href="/signup" 
                                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium"
                            >
                                Start Free Today
                            </a>
                            <a 
                                href="/features" 
                                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>

                    {/* Feature Highlights */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Award className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Earn Rewards</h3>
                            <p className="text-gray-600">Get points and badges for smart spending habits</p>
                        </div>
                        
                        <div className="text-center p-6">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <BarChart2 className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Everything</h3>
                            <p className="text-gray-600">Monitor your spending across all categories</p>
                        </div>
                        
                        <div className="text-center p-6">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Target className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Goals</h3>
                            <p className="text-gray-600">Achieve your financial targets with ease</p>
                        </div>
                    </div>

                    {/* Demo Preview */}
                    <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">See FinPlay in Action</h3>
                            <p className="text-gray-600">Get a glimpse of what you can achieve</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-xl p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Available Balance</p>
                                        <p className="text-2xl font-bold text-gray-900">$1,420.50</p>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                        +$220 this month
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Points Earned</span>
                                        <span className="font-semibold">320 pts</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Badges</span>
                                        <span className="font-semibold">3 earned</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h4 className="font-semibold text-gray-900 mb-4">Recent Activity</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-gray-900">Food & Dining</p>
                                            <p className="text-sm text-gray-500">Today</p>
                                        </div>
                                        <span className="text-red-600 font-semibold">-$25.50</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-gray-900">Transport</p>
                                            <p className="text-sm text-gray-500">Yesterday</p>
                                        </div>
                                        <span className="text-red-600 font-semibold">-$12.75</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-500">
                                Join thousands of users who have transformed their financial habits
                            </p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200 mt-20">
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center gap-3 mb-4 md:mb-0">
                                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                    FP
                                </div>
                                <div className="font-semibold text-gray-900">FinPlay</div>
                            </div>
                            <div className="flex gap-6 text-sm text-gray-600">
                                <a href="/privacy" className="hover:text-gray-900">Privacy</a>
                                <a href="/terms" className="hover:text-gray-900">Terms</a>
                                <a href="/contact" className="hover:text-gray-900">Contact</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }

    return loadingUser ? <div className="min-h-screen flex items-center justify-center">Loading…</div> : (authUser ? loggedInView() : publicView())
}