import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Trophy, Target, Plus, Trash2, Filter, Download, Upload, DollarSign, ShoppingBag, Coffee, Home, Car, Zap, Gift, Award, Star, Crown, Medal } from 'lucide-react';

const PaisoAa = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [balance, setBalance] = useState(45000);
  const [points, setPoints] = useState(1250);
  const [level, setLevel] = useState(5);

  const [transactions, setTransactions] = useState([
    { id: 1, type: 'expense', category: 'Gaadi', amount: 5000, description: 'Fuel - Pahanji Parado', date: '2025-10-19', emoji: '🚗' },
    { id: 2, type: 'income', category: 'Salary', amount: 50000, description: 'Ameerana Baar Hoon', date: '2025-10-18', emoji: '💰' },
    { id: 3, type: 'expense', category: 'Khana', amount: 1200, description: 'Sindhi Biryani te Sai', date: '2025-10-17', emoji: '🍛' },
    { id: 4, type: 'expense', category: 'Shopping', amount: 3500, description: 'Ajrak shopping', date: '2025-10-16', emoji: '🛍️' }
  ]);

  const [budgets, setBudgets] = useState([
    { category: 'Gaadi', limit: 10000, spent: 5000, emoji: '🚗' },
    { category: 'Khana', limit: 15000, spent: 8400, emoji: '🍛' },
    { category: 'Masti', limit: 5000, spent: 2500, emoji: '🎉' },
    { category: 'Ghar', limit: 20000, spent: 18000, emoji: '🏠' }
  ]);

  const [goals, setGoals] = useState([
    { id: 1, name: 'Nayi Gaadi - Pahanji Parado', target: 500000, current: 125000, emoji: '🚗' },
    { id: 2, name: 'Ajrak Collection', target: 50000, current: 35000, emoji: '🧣' },
    { id: 3, name: 'Sindh Tour - Baba Saeein', target: 100000, current: 45000, emoji: '🕌' }
  ]);

  const [achievements, setAchievements] = useState([
    { name: 'Paiso Jo Badshah', desc: 'Saved 50,000 PKR', unlocked: true, emoji: '👑' },
    { name: 'Budget Warrior', desc: 'Stayed under budget 5 times', unlocked: true, emoji: '⚔️' },
    { name: 'Saving Sardar', desc: 'Reached savings goal', unlocked: true, emoji: '🎯' },
    { name: 'Ameer Admi', desc: 'Save 100,000 PKR', unlocked: false, emoji: '💎' },
    { name: 'Ajrak Collector', desc: 'Complete Ajrak fund goal', unlocked: false, emoji: '🧣' }
  ]);

  const [leaderboard] = useState([
    { rank: 1, name: 'You - Paiso Jo Hero', points: 1250, level: 5, emoji: '👑' },
    { rank: 2, name: 'Ahmed - Saving Master', points: 1180, level: 5, emoji: '🥈' },
    { rank: 3, name: 'Fatima - Budget Queen', points: 1050, level: 4, emoji: '🥉' },
    { rank: 4, name: 'Ali - Thrifty Legend', points: 890, level: 4, emoji: '⭐' },
    { rank: 5, name: 'Sara - Money Maven', points: 750, level: 3, emoji: '💫' }
  ]);

  const sindhiPhrases = [
    "Paiso Aa! 💰",
    "Gaadi Pahanji Parado Aa 🚗",
    "Ameerana Baar Hoon 👑",
    "Baba Saeein Jo Aashirwad 🙏",
    "Mehnat Karo, Paiso Kamao 💪",
    "Sindhi Pride, Money Guide 🧣"
  ];

  const categories = ['Gaadi', 'Khana', 'Masti', 'Ghar', 'Shopping', 'Bills', 'Salary'];
  const categoryEmojis = { Gaadi: '🚗', Khana: '🍛', Masti: '🎉', Ghar: '🏠', Shopping: '🛍️', Bills: '⚡', Salary: '💰' };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, emoji }) => (
    <div className={`bg-white backdrop-blur-sm rounded-3xl p-6 border-4 ${color} shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-8 h-8 text-red-700" />
        <span className="text-4xl">{emoji}</span>
      </div>
      <div className="text-3xl font-black text-indigo-900">{value}</div>
      <div className="text-gray-700 font-bold mt-1">{title}</div>
      {subtitle && <div className="text-xs text-gray-600 mt-1">{subtitle}</div>}
    </div>
  );

  const DashboardView = () => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Balance" value={`₨${balance.toLocaleString()}`} icon={Wallet} color="border-red-600" emoji="💰" subtitle="Paiso Aa!" />
          <StatCard title="Ameer Points" value={points} icon={Trophy} color="border-indigo-600" emoji="👑" subtitle={`Level ${level}`} />
          <StatCard title="Income" value={`₨${totalIncome.toLocaleString()}`} icon={TrendingUp} color="border-green-600" emoji="📈" subtitle="Kamaayi" />
          <StatCard title="Expenses" value={`₨${totalExpense.toLocaleString()}`} icon={TrendingDown} color="border-orange-600" emoji="📉" subtitle="Kharch" />
        </div>

        <div className="bg-gradient-to-r from-red-600 via-indigo-700 to-red-600 rounded-3xl p-6 border-4 border-yellow-400 shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black mb-2">🎯 {sindhiPhrases[Math.floor(Math.random() * sindhiPhrases.length)]}</h2>
              <p className="text-lg font-semibold opacity-90">Keep saving and reach your goals, Baba Saeein Jo Aashirwad saan!</p>
            </div>
            <div className="text-6xl">🧣</div>
          </div>
        </div>

        <div className="bg-white backdrop-blur-sm rounded-3xl border-4 border-indigo-600 p-6 shadow-xl">
          <h2 className="text-2xl font-black text-indigo-800 mb-4 flex items-center gap-2">
            📊 Recent Lendan Dendan
          </h2>
          <div className="space-y-3">
            {transactions.slice(0, 5).map(trans => (
              <div key={trans.id} className={`bg-gradient-to-r ${trans.type === 'income' ? 'from-green-50 to-emerald-50' : 'from-red-50 to-orange-50'} rounded-2xl p-4 border-2 ${trans.type === 'income' ? 'border-green-300' : 'border-red-300'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{trans.emoji}</span>
                    <div>
                      <div className="font-bold text-gray-800">{trans.description}</div>
                      <div className="text-sm text-gray-600">{trans.category} • {trans.date}</div>
                    </div>
                  </div>
                  <div className={`text-2xl font-black ${trans.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
                    {trans.type === 'income' ? '+' : '-'}₨{trans.amount.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white backdrop-blur-sm rounded-3xl border-4 border-red-600 p-6 shadow-xl">
          <h2 className="text-2xl font-black text-red-700 mb-4 flex items-center gap-2">
            💰 Budget Tracking - Paiso Jo Hisaab
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map((budget, idx) => {
              const percentage = (budget.spent / budget.limit) * 100;
              return (
                <div key={idx} className="bg-gradient-to-r from-indigo-50 to-red-50 rounded-2xl p-4 border-2 border-indigo-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{budget.emoji}</span>
                      <span className="font-bold text-gray-800">{budget.category}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-700">
                      ₨{budget.spent.toLocaleString()} / ₨{budget.limit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden border-2 border-gray-300">
                    <div 
                      className={`h-full rounded-full transition-all ${percentage > 90 ? 'bg-red-600' : percentage > 70 ? 'bg-orange-500' : 'bg-green-600'}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1 text-right">{percentage.toFixed(0)}% used</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const TransactionsView = () => (
    <div className="space-y-6">
      <div className="bg-white backdrop-blur-sm rounded-3xl border-4 border-indigo-600 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-black text-indigo-800 flex items-center gap-2">
            💳 Lendan Dendan - All Transactions
          </h2>
          <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-indigo-700 rounded-full text-white font-bold hover:shadow-lg transition-all flex items-center gap-2 border-2 border-yellow-400">
            <Plus className="w-5 h-5" />
            Nayo Transaction
          </button>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-red-50 rounded-2xl p-6 border-2 border-yellow-400 mb-6">
          <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
            ✨ Nayo Lendan/Dendan Add Karo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input type="number" placeholder="Amount (₨)" className="px-4 py-3 border-2 border-indigo-300 rounded-xl focus:border-red-500 focus:outline-none bg-white" />
            <select className="px-4 py-3 border-2 border-indigo-300 rounded-xl focus:border-red-500 focus:outline-none bg-white">
              <option>Select Category</option>
              {categories.map(cat => <option key={cat}>{categoryEmojis[cat]} {cat}</option>)}
            </select>
            <input type="text" placeholder="Description" className="px-4 py-3 border-2 border-indigo-300 rounded-xl focus:border-red-500 focus:outline-none bg-white" />
            <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl text-white font-bold hover:shadow-lg transition-all border-2 border-green-800">
              ✅ Save Karo
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {transactions.map(trans => (
            <div key={trans.id} className={`bg-gradient-to-r ${trans.type === 'income' ? 'from-green-50 to-emerald-50' : 'from-red-50 to-orange-50'} rounded-2xl p-5 border-2 ${trans.type === 'income' ? 'border-green-300' : 'border-red-300'} hover:shadow-lg transition-all`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-4xl">{trans.emoji}</span>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-gray-800">{trans.description}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <span className="px-2 py-1 bg-white rounded-lg text-xs font-bold">{trans.category}</span>
                      <span>{trans.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`text-3xl font-black ${trans.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
                    {trans.type === 'income' ? '+' : '-'}₨{trans.amount.toLocaleString()}
                  </div>
                  <button className="p-2 bg-red-200 hover:bg-red-300 rounded-xl text-red-700 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const GoalsView = () => (
    <div className="space-y-6">
      <div className="bg-white backdrop-blur-sm rounded-3xl border-4 border-red-600 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-black text-red-700 flex items-center gap-2">
            🎯 Sapna - Savings Goals
          </h2>
          <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-indigo-700 rounded-full text-white font-bold hover:shadow-lg transition-all flex items-center gap-2 border-2 border-yellow-400">
            <Target className="w-5 h-5" />
            Nayo Sapno
          </button>
        </div>

        <div className="space-y-4">
          {goals.map(goal => {
            const percentage = (goal.current / goal.target) * 100;
            return (
              <div key={goal.id} className="bg-gradient-to-r from-indigo-50 via-red-50 to-yellow-50 rounded-3xl p-6 border-3 border-indigo-400 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-5xl">{goal.emoji}</span>
                    <div>
                      <h3 className="text-xl font-black text-gray-800">{goal.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">Target: ₨{goal.target.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-indigo-700">₨{goal.current.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{percentage.toFixed(1)}% Complete</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden border-3 border-gray-400">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-600 rounded-full transition-all"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm font-bold text-gray-700">₨{(goal.target - goal.current).toLocaleString()} remaining</span>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all">
                    💰 Add Money
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const GamificationView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-400 via-red-600 to-indigo-700 rounded-3xl p-8 border-4 border-yellow-500 shadow-2xl text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-6xl border-4 border-yellow-400 shadow-xl">
              👑
            </div>
            <div>
              <h2 className="text-4xl font-black mb-2">Paiso Jo Badshah!</h2>
              <p className="text-xl font-bold opacity-90">Level {level} • {points} Points</p>
              <p className="text-sm opacity-75 mt-1">Ameerana Baar Hoon 💰</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-6xl font-black">{points}</div>
            <div className="text-sm font-bold mt-2">Total Ameer Points</div>
          </div>
        </div>
      </div>

      <div className="bg-white backdrop-blur-sm rounded-3xl border-4 border-indigo-600 p-6 shadow-xl">
        <h2 className="text-2xl font-black text-indigo-800 mb-6 flex items-center gap-2">
          🏆 Kamyaabiyan - Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, idx) => (
            <div key={idx} className={`rounded-2xl p-6 border-3 ${achievement.unlocked ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-500' : 'bg-gray-100 border-gray-300 opacity-50'} hover:shadow-lg transition-all`}>
              <div className="flex flex-col items-center text-center">
                <span className="text-6xl mb-3">{achievement.emoji}</span>
                <h3 className="font-black text-lg text-gray-800 mb-2">{achievement.name}</h3>
                <p className="text-sm text-gray-600">{achievement.desc}</p>
                {achievement.unlocked && (
                  <div className="mt-3 px-4 py-2 bg-green-600 text-white rounded-full text-xs font-bold">
                    ✅ Unlocked!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white backdrop-blur-sm rounded-3xl border-4 border-red-600 p-6 shadow-xl">
        <h2 className="text-2xl font-black text-red-700 mb-6 flex items-center gap-2">
          📊 Leaderboard - Paiso Wara
        </h2>
        <div className="space-y-3">
          {leaderboard.map((player) => (
            <div key={player.rank} className={`rounded-2xl p-5 border-2 ${player.rank === 1 ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-500' : 'bg-gradient-to-r from-indigo-50 to-red-50 border-indigo-300'} hover:shadow-lg transition-all`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${player.rank === 1 ? 'bg-yellow-500 text-white' : player.rank === 2 ? 'bg-gray-400 text-white' : player.rank === 3 ? 'bg-orange-600 text-white' : 'bg-indigo-200 text-indigo-800'}`}>
                    #{player.rank}
                  </div>
                  <div>
                    <div className="font-black text-lg text-gray-800 flex items-center gap-2">
                      <span>{player.emoji}</span>
                      {player.name}
                    </div>
                    <div className="text-sm text-gray-600">Level {player.level}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-700">{player.points}</div>
                  <div className="text-xs text-gray-600">points</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-indigo-100 to-yellow-100 relative overflow-hidden">
      <div className="fixed inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23800020\' fill-opacity=\'1\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'3\'/%3E%3Ccircle cx=\'60\' cy=\'20\' r=\'3\'/%3E%3Ccircle cx=\'20\' cy=\'60\' r=\'3\'/%3E%3Ccircle cx=\'60\' cy=\'60\' r=\'3\'/%3E%3Ccircle cx=\'40\' cy=\'40\' r=\'4\'/%3E%3Cpath d=\'M20 20h40M20 60h40M20 20v40M60 20v40\' stroke=\'%23000080\' stroke-width=\'1\' fill=\'none\'/%3E%3C/g%3E%3C/svg%3E")',
        backgroundSize: '80px 80px'
      }}></div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>🧣</div>
        <div className="absolute top-20 right-20 text-3xl animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}>💰</div>
        <div className="absolute bottom-20 left-32 text-4xl animate-bounce" style={{animationDelay: '2s', animationDuration: '3.5s'}}>🚗</div>
        <div className="absolute top-1/3 right-10 text-3xl animate-bounce" style={{animationDelay: '0.5s', animationDuration: '4s'}}>👑</div>
        <div className="absolute bottom-32 right-1/4 text-4xl animate-bounce" style={{animationDelay: '1.5s', animationDuration: '3s'}}>🕌</div>
      </div>

      <div className="border-b-4 border-red-700 bg-gradient-to-r from-red-700 via-indigo-800 to-red-700 backdrop-blur-lg sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full flex items-center justify-center font-black text-3xl border-4 border-yellow-400 shadow-xl">
                💰
              </div>
              <div>
                <div className="text-3xl font-black text-white drop-shadow-lg">
                  Paiso Aa - Sindhi Finance
                </div>
                <div className="text-xs text-yellow-200 font-bold">Ameerana Baar Hoon - Baba Saeein Jo Aashirwad 🧣</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex bg-white rounded-full p-1 border-4 border-yellow-400 shadow-lg">
                {[
                  { id: 'dashboard', label: 'Dashboard', emoji: '🏠' },
                  { id: 'transactions', label: 'Lendan', emoji: '💳' },
                  { id: 'goals', label: 'Sapna', emoji: '🎯' },
                  { id: 'gamification', label: 'Kamyaabi', emoji: '🏆' }
                ].map(view => (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`px-4 sm:px-5 py-2 rounded-full font-black transition-all text-sm ${
                      activeView === view.id
                        ? 'bg-gradient-to-r from-red-600 to-indigo-700 text-white shadow-lg'
                        : 'text-gray-700 hover:text-red-700'
                    }`}
                  >
                    <span className="hidden sm:inline">{view.label}</span>
                    <span className="sm:hidden">{view.emoji}</span>
                  </button>
                ))}
              </div>
              
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full flex items-center justify-center font-black cursor-pointer hover:shadow-lg transition-all text-white border-2 border-white">
                👤
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 relative z-10">
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'transactions' && <TransactionsView />}
        {activeView === 'goals' && <GoalsView />}
        {activeView === 'gamification' && <GamificationView />}
      </div>

      <div className="border-t-4 border-red-700 bg-gradient-to-r from-red-700 via-indigo-800 to-red-700 backdrop-blur-lg mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 text-center text-white">
          <div className="font-black text-lg mb-2">🧣 Made with Sindhi Pride by LappuCodes 💰</div>
                  <div className="text-sm text-yellow-200 font-semibold">
            © 2025 Paiso Aa - Sindhi Finance Tracker | Baba Saeein Jo Aashirwad 🙏
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaisoAa;



