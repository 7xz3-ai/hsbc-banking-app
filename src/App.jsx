import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Menu, 
  Star, 
  MoreVertical, 
  Eye,
  MessageSquare,
  ArrowRight,
  User,
  ArrowRightLeft,
  FileText,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Globe,
  Layers,
  BarChart2,
  Search,
  ArrowDown,
  MoreHorizontal,
  CreditCard as CreditCardIcon
} from 'lucide-react';

const SnowflakeSVG = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <line x1="12" y1="2" x2="12" y2="22"></line>
    <line x1="20" y1="4" x2="4" y2="20"></line>
    <line x1="4" y1="4" x2="20" y2="20"></line>
    <line x1="16" y1="8" x2="20" y2="4"></line>
    <line x1="8" y1="8" x2="4" y2="4"></line>
    <line x1="16" y1="16" x2="20" y2="20"></line>
    <line x1="8" y1="16" x2="4" y2="20"></line>
  </svg>
);

const HSBCLogo = () => (
  <svg viewBox="0 0 200 100" className="w-[44px] h-[22px] shrink-0">
    <polygon points="0,50 50,0 50,100" fill="#db0011" />
    <polygon points="200,50 150,0 150,100" fill="#db0011" />
    <polygon points="50,0 150,0 100,50" fill="#db0011" />
    <polygon points="50,100 150,100 100,50" fill="#db0011" />
  </svg>
);

const HSBCLogoSmall = () => (
  <svg viewBox="0 0 200 100" className="w-[28px] h-[14px] shrink-0">
    <polygon points="0,50 50,0 50,100" fill="#db0011" />
    <polygon points="200,50 150,0 150,100" fill="#db0011" />
    <polygon points="50,0 150,0 100,50" fill="#db0011" />
    <polygon points="50,100 150,100 100,50" fill="#db0011" />
  </svg>
);

const formatBalance = (amount) => {
  const num = Number(amount) || 0;
  const isNegative = num < 0;
  const absAmount = Math.abs(num);
  const parts = absAmount.toFixed(2).split('.');
  return (
    <span className="flex items-baseline">
      {isNegative && <span className="text-[16px] mr-1 font-bold">-</span>}
      <span className="text-[14px] mr-0.5 font-bold">£</span>
      <span className="text-xl font-bold">{parseInt(parts[0]).toLocaleString('en-GB')}</span>
      <span className="text-[14px] font-bold">.{parts[1]}</span>
    </span>
  );
};

const formatLargeNumber = (num) => {
  const n = Number(num) || 0;
  const parts = Math.abs(n).toFixed(2).split('.');
  return {
    int: parseInt(parts[0]).toLocaleString('en-GB'),
    frac: parts[1]
  };
};

const TxIcon = ({ type, desc }) => {
  switch(type) {
    case 'sainsburys':
      return <div className="w-11 h-11 rounded-[12px] bg-[#e35205] text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">S</div>;
    case 'adobe':
      return <div className="w-11 h-11 rounded-[12px] bg-[#ff0000] text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">A</div>;
    case 'nike':
      return <div className="w-11 h-11 rounded-[12px] bg-black text-white flex items-center justify-center font-serif italic font-bold text-xl shadow-sm shrink-0">N</div>;
    case 'uber':
      return <div className="w-11 h-11 rounded-[12px] bg-black text-white flex items-center justify-center font-medium text-[11px] shadow-sm shrink-0">Uber</div>;
    case 'deliveroo':
      return <div className="w-11 h-11 rounded-[12px] bg-[#00ccbc] text-white flex items-center justify-center font-bold text-xl shadow-sm shrink-0">D</div>;
    case 'tfl':
      return <div className="w-11 h-11 rounded-[12px] bg-[#0019a8] text-white flex items-center justify-center font-bold text-[14px] shadow-sm shrink-0">TfL</div>;
    case 'amazon':
      return <div className="w-11 h-11 rounded-[12px] bg-[#232f3e] text-[#ff9900] flex items-center justify-center font-bold text-xl shadow-sm shrink-0">a</div>;
    case 'spotify':
      return <div className="w-11 h-11 rounded-[12px] bg-[#1db954] text-white flex items-center justify-center font-bold text-[10px] shadow-sm shrink-0">Spotify</div>;
    case 'tesco':
      return <div className="w-11 h-11 rounded-[12px] bg-[#00539f] text-white flex items-center justify-center font-bold text-[10px] shadow-sm shrink-0">TESCO</div>;
    case 'income':
      return <div className="w-11 h-11 rounded-[12px] bg-[#dcf4e6] text-[#00a651] flex items-center justify-center shadow-sm shrink-0"><ArrowDown size={22} strokeWidth={3}/></div>;
    default:
      const initials = (desc || 'T').split(' ').map(n => n[0]).filter(Boolean).join('').substring(0,2).toUpperCase();
      return <div className="w-11 h-11 rounded-[12px] bg-[#e2e8f0] text-[#334155] flex items-center justify-center font-bold text-lg shadow-sm shrink-0">{initials}</div>;
  }
};

export default function App() {
  const [activeNav, setActiveNav] = useState('accounts');
  const [activeTopTab, setActiveTopTab] = useState('Home');
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [activePaymentView, setActivePaymentView] = useState('menu');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showBalances, setShowBalances] = useState(true);

  const [accounts, setAccounts] = useState([
    { id: 'acc_1', name: "Current Account", details: "40-47-59 12345678", balance: 21321.77, type: 'current' },
    { id: 'acc_2', name: 'Online Bonus Saver', details: "40-47-59 87654321", balance: 0.00, type: 'savings' },
    { id: 'acc_3', name: 'Rewards Credit Card', details: "**** **** **** 5432", balance: -500.00, type: 'credit', creditLimit: 3000.00 }
  ]);

  const [transactions, setTransactions] = useState([
    { id: 'tx_1', date: 'Today', time: '14:30', desc: "Sainsbury's", category: 'Groceries', amount: -30.00, iconType: 'sainsburys' },
    { id: 'tx_2', date: 'Today', time: '08:15', desc: "TFL Travel Charge", category: 'Travel', amount: -6.80, iconType: 'tfl' },
    { id: 'tx_3', date: 'Yesterday', time: '19:45', desc: "Deliveroo", category: 'Dining', amount: -24.50, iconType: 'deliveroo' },
    { id: 'tx_4', date: 'Mar 10', time: '21:00', desc: "Adobe", category: 'Subscription', amount: -15.00, iconType: 'adobe' },
    { id: 'tx_5', date: 'Mar 10', time: '15:00', desc: "Joanne", category: 'Income', amount: 100.00, iconType: 'income' },
    { id: 'tx_6', date: 'Mar 10', time: '12:00', desc: "Nike", category: 'Apparel', amount: -150.00, iconType: 'nike' },
    { id: 'tx_7', date: 'Mar 8', time: '18:30', desc: "Uber", category: 'Travel', amount: -12.00, iconType: 'uber' },
    { id: 'tx_8', date: 'Mar 8', time: '13:00', desc: "Tesco Extra", category: 'Groceries', amount: -45.20, iconType: 'tesco' },
  ]);

  const groupedTransactions = (transactions || []).reduce((acc, tx) => {
    let group = acc.find(g => g.date === tx.date);
    if (!group) {
      group = { date: tx.date, items: [], total: 0 };
      acc.push(group);
    }
    group.items.push(tx);
    group.total += (Number(tx.amount) || 0);
    return acc;
  }, []);

  const [payeeName, setPayeeName] = useState('');
  const [sortCode, setSortCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payRef, setPayRef] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([
    { id: 'msg_1', sender: 'bot', text: 'Hi, I am your HSBC digital assistant. How can I help you today?', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);

  const handleSortCodeChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 6) val = val.slice(0, 6);
    let formatted = val;
    if (val.length > 2) formatted = `${val.slice(0, 2)}-${val.slice(2)}`;
    if (val.length > 4) formatted = `${val.slice(0, 2)}-${val.slice(2, 4)}-${val.slice(4)}`;
    setSortCode(formatted);
  };

  const handleAccountNumChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    setAccountNumber(val);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setPaymentError('');
    const amountNum = parseFloat(payAmount);
    if (!payeeName.trim()) return setPaymentError('Please enter a payee name.');
    if (sortCode.length !== 8) return setPaymentError('Please enter a valid 6-digit sort code.');
    if (accountNumber.length !== 8) return setPaymentError('Please enter a valid 8-digit account number.');
    if (isNaN(amountNum) || amountNum <= 0) return setPaymentError('Please enter a valid amount.');
    const sourceAcc = accounts[0];
    if (sourceAcc.balance < amountNum) return setPaymentError("You don't have enough funds to make this payment.");
    const newAccounts = [...accounts];
    newAccounts[0].balance -= amountNum;
    setAccounts(newAccounts);
    const now = new Date();
    const newTx = {
      id: Date.now().toString(),
      date: 'Today',
      time: now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      desc: payeeName,
      category: 'Transfer',
      amount: -amountNum,
      iconType: 'transfer'
    };
    setTransactions([newTx, ...transactions]);
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setActiveNav('accounts');
      setActiveTopTab('Home');
      setActivePaymentView('menu');
      setPayeeName('');
      setSortCode('');
      setAccountNumber('');
      setPayAmount('');
      setPayRef('');
    }, 2500);
  };

  useEffect(() => {
    if (activeNav === 'support') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping, activeNav]);

  const getBotResponse = (input) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('payment') || lowerInput.includes('go through') || lowerInput.includes('gone through') || lowerInput.includes('sent') || lowerInput.includes('receive') || lowerInput.includes('transfer')) {
      return "Yes, I can confirm that the payment has gone through successfully. Please note that it can take up to 2 hours to reflect in the recipient's account.";
    }
    if (lowerInput.match(/\b(hi|hello|hey)\b/)) return "Hello! How can I help you with your banking today?";
    if (lowerInput.includes('balance')) return `Your Current Account balance is £${accounts[0].balance.toLocaleString('en-GB', {minimumFractionDigits: 2})}.`;
    return "I can help confirm if your recent payments have gone through, or answer general account questions. What would you like to check?";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const newUserMsg = { id: Date.now().toString(), sender: 'user', text: chatInput, time: timeString };
    setChatMessages(prev => [...prev, newUserMsg]);
    const responseText = getBotResponse(chatInput);
    setChatInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botMsg = { id: (Date.now() + 1).toString(), sender: 'bot', text: responseText, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
      setChatMessages(prev => [...prev, botMsg]);
    }, 1200);
  };

  const sourceBalance = accounts[0].balance;
  const parsedAmount = parseFloat(payAmount) || 0;
  const reactiveBalance = sourceBalance - parsedAmount;

  const creditAccount = accounts[2] || { balance: 0, creditLimit: 3000 };
  const creditUsed = Math.abs(creditAccount.balance);
  const availableCredit = (creditAccount.creditLimit || 3000) - creditUsed;
  const progressPercent = (creditUsed / (creditAccount.creditLimit || 3000)) * 100;
  const availCreditFmt = formatLargeNumber(availableCredit);
  const creditLimitFmt = formatLargeNumber(creditAccount.creditLimit);

  return (
    <div className="flex justify-center items-start sm:items-center min-h-screen bg-[#e5e5e5] sm:p-8 font-sans">

      {/* On mobile: full screen. On desktop: phone frame */}
      <div className="w-full sm:max-w-[400px] h-screen sm:h-[850px] sm:max-h-[90vh] bg-[#f8f8f8] sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden flex flex-col relative sm:border-[12px] sm:border-[#222]">

        {/* Notch — desktop only */}
        <div className="hidden sm:block absolute top-0 inset-x-0 h-6 bg-[#222] rounded-b-3xl w-40 mx-auto z-50"></div>

        <main className="flex-1 overflow-y-auto hide-scrollbar relative pb-20 flex flex-col bg-[#f8f8f8]">

          {/* ACCOUNTS */}
          {activeNav === 'accounts' && (
            <div className="animate-fade-in flex-1">
              {selectedAccountId ? (
                <div className="animate-fade-in bg-white min-h-full pb-10">
                  <div className="flex items-center px-4 pt-14 pb-4 bg-white sticky top-0 z-40">
                    <button onClick={() => setSelectedAccountId(null)} className="p-2 -ml-2 text-[#db0011] flex items-center transition-opacity hover:opacity-70">
                      <ChevronLeft size={28} strokeWidth={3} />
                    </button>
                    <h1 className="text-[20px] font-bold text-[#222] ml-1">Transactions</h1>
                  </div>
                  <div className="px-5 mb-6 mt-1">
                    <div className="bg-[#f4f5f7] rounded-[14px] flex items-center px-4 py-3">
                      <Search size={20} className="text-gray-400 mr-3 shrink-0" />
                      <input type="text" placeholder="Search transactions" className="bg-transparent focus:outline-none w-full text-[15px] text-[#222] placeholder-gray-400 font-medium" />
                    </div>
                  </div>
                  <div>
                    {groupedTransactions.map(group => (
                      <div key={group.date} className="mb-6">
                        <div className="flex justify-between items-center px-5 mb-3">
                          <h2 className="font-bold text-[#222] text-[16px]">{group.date}</h2>
                          <span className="font-bold text-gray-500 text-[15px]">£{Math.abs(group.total).toFixed(2)}</span>
                        </div>
                        <div className="px-5 space-y-2">
                          {group.items.map(tx => (
                            <div key={tx.id} className="bg-[#f4f5f7] rounded-[18px] p-3.5 flex justify-between items-center transition-transform active:scale-[0.98] cursor-pointer">
                              <div className="flex items-center space-x-3.5">
                                <TxIcon type={tx.iconType} desc={tx.desc} />
                                <div>
                                  <p className="font-bold text-[#222] text-[15px]">{tx.desc}</p>
                                  <p className="text-[13px] text-gray-500 mt-0.5 tracking-tight">{tx.time} • {tx.category}</p>
                                </div>
                              </div>
                              <span className={`font-bold text-[15px] ${tx.amount > 0 ? 'text-[#00a651]' : 'text-[#222]'}`}>
                                {tx.amount > 0 ? '+' : ''}£{Math.abs(tx.amount || 0).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeTopTab === 'Cards' ? (
                <div className="animate-fade-in bg-[#f8f8f8] min-h-full pb-10">
                  <header className="flex items-center justify-between px-6 pt-14 pb-3 bg-[#f8f8f8]">
                    <div className="flex items-center">
                      <button onClick={() => setActiveTopTab('Home')} className="flex flex-col items-center relative mr-3">
                        <Home size={24} className="text-[#222]" strokeWidth={2.5} />
                      </button>
                      <div className="w-px h-5 bg-gray-300 mr-4 opacity-50"></div>
                      <div className="flex space-x-5 text-[15px] font-bold text-gray-500">
                        <button onClick={() => { setActiveNav('pay'); setActivePaymentView('menu'); }}>Pay</button>
                        <button className="relative text-[#222]">Cards<div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#db0011]"></div></button>
                        <button>Invest</button>
                      </div>
                    </div>
                    <button className="text-[#222]"><Menu size={26} strokeWidth={2} /></button>
                  </header>
                  <div className="mt-4 text-center">
                    <h2 className="text-[14px] font-bold text-[#222]">Rewards Credit Card</h2>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide mt-0.5">CHAN</p>
                    <div className="mt-4 relative flex items-center overflow-hidden w-full pl-6 pr-2">
                      <div className="w-[88%] shrink-0 h-[190px] rounded-2xl relative overflow-hidden shadow-xl" style={{ background: 'linear-gradient(135deg, #4a0000 0%, #200000 100%)' }}>
                        <div className="absolute inset-0 opacity-20">
                          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <polygon points="50,0 150,100 50,200 -50,100" fill="white" />
                            <polygon points="250,0 350,100 250,200 150,100" fill="white" />
                          </svg>
                        </div>
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-4 z-10">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-1.5">
                              <HSBCLogoSmall />
                              <span className="text-white text-[12px] font-bold tracking-tight">HSBC UK</span>
                            </div>
                            <span className="text-white/80 text-[10px] font-semibold">Rewards Credit</span>
                          </div>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <SnowflakeSVG size={36} className="text-white mb-1" />
                            <span className="text-white text-[13px] font-bold">Frozen</span>
                          </div>
                          <div className="flex justify-end">
                            <div className="flex">
                              <div className="w-8 h-8 rounded-full bg-[#eb001b] opacity-90 z-20"></div>
                              <div className="w-8 h-8 rounded-full bg-[#f79e1b] -ml-4 opacity-90 z-10"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-[15%] shrink-0 h-[170px] bg-gray-300 rounded-l-2xl ml-4 relative overflow-hidden flex items-center opacity-60">
                        <div className="absolute left-2 top-4"><HSBCLogoSmall /></div>
                      </div>
                    </div>
                    <div className="flex justify-center items-center space-x-3 mt-6">
                      <ChevronLeft size={16} className="text-gray-300" />
                      <div className="w-4 h-1.5 rounded-full bg-[#222]"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                      <ChevronRight size={16} className="text-[#222]" />
                    </div>
                  </div>
                  <div className="px-6 mt-6">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-[12px] font-bold text-[#222]">Current balance</p>
                        <div className="text-[#222]">{formatBalance(creditAccount.balance)}</div>
                      </div>
                      <div className="text-right">
                        <p className="text-[12px] font-bold text-[#222]">Available credit</p>
                        <div className="text-[#222]">
                          <span className="text-[14px] mr-0.5 font-bold">£</span>
                          <span className="text-xl font-bold">{availCreditFmt.int}</span>
                          <span className="text-[14px] font-bold">.{availCreditFmt.frac}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-300 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-[#005EB8]" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-[11px] text-gray-500 font-semibold">Updated 10 Mar 2025</p>
                      <p className="text-[11px] text-[#222] font-bold">Credit limit £{creditLimitFmt.int}.{creditLimitFmt.frac}</p>
                    </div>
                  </div>
                  <div className="flex justify-between px-6 mt-8">
                    <button className="flex flex-col items-center w-20">
                      <div className="w-12 h-12 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center mb-2 relative text-[#db0011]">
                        <CreditCardIcon size={20} />
                        <ArrowRightLeft size={12} className="absolute bottom-2 right-2 bg-white rounded-full p-[1px]" />
                      </div>
                      <span className="text-[10px] text-[#222] font-bold text-center leading-tight">Balance and<br/>money transfers</span>
                    </button>
                    <button className="flex flex-col items-center w-20">
                      <div className="w-12 h-12 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center mb-2 text-[#db0011]">
                        <Layers size={20} />
                      </div>
                      <span className="text-[10px] text-[#222] font-bold text-center leading-tight">Instalment<br/>plans</span>
                    </button>
                    <button className="flex flex-col items-center w-20">
                      <div className="w-12 h-12 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center mb-2 relative text-[#db0011]">
                        <CreditCardIcon size={20} />
                        <div className="absolute top-2 right-2 bg-white rounded-full p-[2px]">
                          <SnowflakeSVG size={10} className="text-[#db0011]" />
                        </div>
                      </div>
                      <span className="text-[10px] text-[#222] font-bold text-center leading-tight">Unfreeze card</span>
                    </button>
                    <button className="flex flex-col items-center w-16">
                      <div className="w-12 h-12 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center mb-2 text-[#222]">
                        <MoreHorizontal size={20} />
                      </div>
                      <span className="text-[10px] text-[#222] font-bold text-center leading-tight">More</span>
                    </button>
                  </div>
                  <div className="px-6 mt-8">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 relative overflow-hidden">
                      <h3 className="flex items-center text-[#222] font-bold text-[14px] mb-4">
                        <FileText size={18} className="text-[#db0011] mr-2" />
                        Credit card statement
                      </h3>
                      <div className="flex justify-between items-end pb-2">
                        <div>
                          <p className="text-[11px] text-gray-500 font-bold mb-0.5">Due date</p>
                          <p className="text-[16px] font-bold text-[#222]">1 Apr</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-gray-500 font-bold mb-0.5">Statement balance</p>
                          <p className="text-[16px] font-bold text-[#222]">£500.00</p>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-100 to-transparent"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="relative h-[300px] bg-cover bg-center"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80")' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-transparent to-black/80"></div>
                    <header className="relative z-10 flex items-center justify-between px-6 pt-14 pb-3">
                      <div className="flex items-center">
                        <button className="flex flex-col items-center relative mr-3">
                          <Home size={24} className="text-[#222]" strokeWidth={2.5} />
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#db0011]"></div>
                        </button>
                        <div className="w-px h-5 bg-gray-400 mr-4 opacity-50"></div>
                        <div className="flex space-x-5 text-[15px] font-bold text-[#333]">
                          <button onClick={() => { setActiveNav('pay'); setActivePaymentView('menu'); }}>Pay</button>
                          <button onClick={() => { setActiveTopTab('Cards'); setSelectedAccountId(null); }}>Cards</button>
                          <button>Invest</button>
                        </div>
                      </div>
                      <button className="text-[#222]"><Menu size={26} strokeWidth={2} /></button>
                    </header>
                    <div className="absolute bottom-6 left-0 w-full flex justify-center space-x-3 px-4 z-10">
                      <button onClick={() => { setActiveNav('pay'); setActivePaymentView('form'); }} className="flex flex-col items-center w-[75px]">
                        <div className="w-[56px] h-[56px] bg-white rounded-full shadow-lg flex items-center justify-center relative mb-2">
                          <User size={22} className="text-[#db0011]" strokeWidth={2.5} />
                          <div className="absolute top-0 right-0 w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center shadow-sm">
                            <div className="w-3.5 h-3.5 bg-[#db0011] rounded-full text-white flex items-center justify-center text-[8px] font-bold">↑</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-white font-medium text-center leading-tight tracking-wide drop-shadow-md">Pay someone<br/>in the UK</span>
                      </button>
                      <button onClick={() => { setActiveNav('pay'); setActivePaymentView('menu'); }} className="flex flex-col items-center w-[75px]">
                        <div className="w-[56px] h-[56px] bg-white rounded-full shadow-lg flex items-center justify-center relative mb-2">
                          <ArrowRightLeft size={20} className="text-[#db0011]" strokeWidth={2.5} />
                          <div className="absolute top-0 right-0 w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center shadow-sm">
                            <div className="w-3.5 h-3.5 bg-[#db0011] rounded-full text-white flex items-center justify-center text-[8px] font-bold">→</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-white font-medium text-center leading-tight tracking-wide drop-shadow-md">Transfer<br/>between...</span>
                      </button>
                      <button className="flex flex-col items-center w-[75px]">
                        <div className="w-[56px] h-[56px] bg-white rounded-full shadow-lg flex items-center justify-center relative mb-2">
                          <FileText size={20} className="text-[#db0011]" strokeWidth={2.5} />
                          <div className="absolute top-0 right-0 w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center shadow-sm">
                            <div className="w-3.5 h-3.5 bg-[#db0011] rounded-full text-white flex items-center justify-center text-[8px] font-bold">£</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-white font-medium text-center leading-tight tracking-wide drop-shadow-md">Pay a bill or<br/>company</span>
                      </button>
                      <button className="flex flex-col items-center w-[75px]">
                        <div className="w-[56px] h-[56px] bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center mb-2 border border-white">
                          <Plus size={26} className="text-[#222]" strokeWidth={2} />
                        </div>
                        <span className="text-[10px] text-white font-medium text-center leading-tight tracking-wide drop-shadow-md">Edit</span>
                      </button>
                    </div>
                  </div>
                  <div className="px-5 pt-6 pb-8 bg-[#f8f8f8]">
                    <div className="flex justify-between items-center mb-3 px-1">
                      <h2 className="text-[18px] font-semibold text-[#222]">Your products</h2>
                      <button onClick={() => setShowBalances(!showBalances)} className="p-1">
                        <Eye size={20} className="text-[#222]" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {accounts.map(acc => (
                        <div
                          key={acc.id}
                          onClick={() => setSelectedAccountId(acc.id)}
                          className="bg-white p-5 rounded-lg shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col cursor-pointer active:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <HSBCLogo />
                            <div className="flex space-x-3 text-gray-500">
                              <Star size={20} />
                              <MoreVertical size={20} />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-bold text-[#222] text-[15px]">{acc.name}</h3>
                            <p className="text-[13px] text-gray-500 mt-0.5">{acc.details}</p>
                          </div>
                          <div className="flex justify-end mt-2">
                            {showBalances ? formatBalance(acc.balance) : <span className="text-xl font-bold mt-1">***.**</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* PAY & TRANSFER */}
          {activeNav === 'pay' && (
            <div className="animate-fade-in bg-white min-h-full flex flex-col">
              <header className="flex items-center justify-center px-6 pt-12 pb-4 bg-white border-b border-gray-100 z-40 sticky top-0">
                <h1 className="font-bold text-[#222] text-lg">Pay & Transfer</h1>
              </header>
              {paymentSuccess ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#f8f8f8]">
                  <CheckCircle2 size={64} className="text-green-600 mb-6" strokeWidth={1.5} />
                  <h2 className="text-2xl font-bold text-[#222] mb-3">Payment Complete</h2>
                  <p className="text-gray-600 mb-8">You've successfully sent <strong className="text-[#222]">£{parsedAmount.toFixed(2)}</strong> to <strong className="text-[#222]">{payeeName}</strong>.</p>
                  <button onClick={() => { setActiveNav('accounts'); setActiveTopTab('Home'); setActivePaymentView('menu'); }} className="bg-[#222] text-white px-8 py-3 rounded-full font-bold w-full">Back to Accounts</button>
                </div>
              ) : activePaymentView === 'menu' ? (
                <div className="p-6 bg-[#f8f8f8] flex-1">
                  <h2 className="text-lg font-bold text-[#222] mb-4">Recent payees</h2>
                  <div className="flex space-x-6 overflow-x-auto pb-6 hide-scrollbar">
                    {['Jane Doe', 'Rita Cantasora', 'Mac Ui Rudai', 'John Smith'].map((name, i) => {
                      const initials = name.split(' ').map(n => n[0]).join('');
                      return (
                        <div key={i} className="flex flex-col items-center flex-shrink-0 cursor-pointer">
                          <div className="w-14 h-14 bg-[#333] text-white rounded-full flex items-center justify-center font-semibold text-lg mb-2 shadow-sm">{initials}</div>
                          <p className="text-[11px] text-center w-16 text-gray-700 leading-tight">{name}</p>
                        </div>
                      );
                    })}
                  </div>
                  <h2 className="text-lg font-bold text-[#222] mt-4 mb-4">Send money</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm text-center h-28 active:bg-gray-50">
                      <ArrowRightLeft size={24} className="text-[#db0011] mb-2" />
                      <span className="text-[12px] font-semibold text-[#222]">Transfer between your accounts</span>
                    </button>
                    <button onClick={() => setActivePaymentView('form')} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm text-center h-28 active:bg-gray-50">
                      <User size={24} className="text-[#db0011] mb-2" />
                      <span className="text-[12px] font-semibold text-[#222]">Pay someone in the UK</span>
                    </button>
                    <button className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm text-center h-28 active:bg-gray-50">
                      <FileText size={24} className="text-[#db0011] mb-2" />
                      <span className="text-[12px] font-semibold text-[#222]">Pay a bill or company</span>
                    </button>
                    <button className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm text-center h-28 active:bg-gray-50">
                      <Globe size={24} className="text-[#db0011] mb-2" />
                      <span className="text-[12px] font-semibold text-[#222]">International payments</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-white flex-1">
                  <div className="flex items-center mb-6">
                    <button onClick={() => setActivePaymentView('menu')} className="mr-3 text-[#db0011] font-bold">Back</button>
                    <h2 className="text-xl font-bold text-[#222] mx-auto">Pay someone</h2>
                    <div className="w-12"></div>
                  </div>
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <div className="bg-[#f8f8f8] border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-500 font-medium mb-1">Paying from: <span className="text-[#222] font-bold">Current Account</span></p>
                      <div className="flex justify-between items-end">
                        <span className="text-xs text-gray-500">Balance after payment</span>
                        <span className={`text-lg font-bold ${reactiveBalance < 0 ? 'text-[#db0011]' : 'text-[#222]'}`}>£{reactiveBalance.toLocaleString('en-GB', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                      </div>
                      {reactiveBalance < 0 && (
                        <p className="text-[#db0011] text-xs mt-2 flex items-center"><AlertCircle size={12} className="mr-1" /> Insufficient funds</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1">Payee Name</label>
                      <input type="text" className="w-full border-b-2 border-gray-300 rounded-none py-2 text-[#222] focus:outline-none focus:border-[#db0011] transition-colors bg-transparent" value={payeeName} onChange={(e) => setPayeeName(e.target.value)} />
                    </div>
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-[13px] font-bold text-gray-700 mb-1">Sort Code</label>
                        <input type="text" placeholder="00-00-00" className="w-full border-b-2 border-gray-300 rounded-none py-2 text-[#222] focus:outline-none focus:border-[#db0011] transition-colors font-mono bg-transparent" value={sortCode} onChange={handleSortCodeChange} />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[13px] font-bold text-gray-700 mb-1">Account Number</label>
                        <input type="text" placeholder="12345678" className="w-full border-b-2 border-gray-300 rounded-none py-2 text-[#222] focus:outline-none focus:border-[#db0011] transition-colors font-mono bg-transparent" value={accountNumber} onChange={handleAccountNumChange} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1">Amount (£)</label>
                      <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#222] font-bold text-xl">£</span>
                        <input type="number" step="0.01" className="w-full border-b-2 border-gray-300 rounded-none py-2 pl-6 text-[#222] font-bold text-xl focus:outline-none focus:border-[#db0011] transition-colors bg-transparent" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1">Reference</label>
                      <input type="text" className="w-full border-b-2 border-gray-300 rounded-none py-2 text-[#222] focus:outline-none focus:border-[#db0011] transition-colors bg-transparent" value={payRef} onChange={(e) => setPayRef(e.target.value)} />
                    </div>
                    {paymentError && <div className="text-[#db0011] text-sm font-bold text-center">{paymentError}</div>}
                    <div className="pt-4 pb-10">
                      <button type="submit" disabled={reactiveBalance < 0 || !payAmount} className="w-full bg-[#db0011] disabled:bg-gray-300 text-white font-bold py-4 rounded-full shadow-md transition-colors">Continue</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* SUPPORT */}
          {activeNav === 'support' && (
            <div className="animate-fade-in bg-[#f8f8f8] flex-1 flex flex-col h-full relative">
              <div className="flex items-center justify-center px-6 pt-12 pb-4 bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                <h1 className="font-bold text-[#222] text-lg flex items-center">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></span>
                  HSBC Support
                </h1>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-24">
                <div className="text-center text-xs text-gray-400 my-4">Today</div>
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-[#db0011] flex items-center justify-center mr-2 shrink-0"><span className="text-white text-xs font-bold">H</span></div>}
                    <div className={`max-w-[75%] rounded-2xl p-3.5 shadow-sm ${msg.sender === 'user' ? 'bg-[#222] text-white rounded-br-sm' : 'bg-white text-[#222] border border-gray-200 rounded-bl-sm'}`}>
                      <p className="text-[15px] leading-relaxed">{msg.text}</p>
                      <p className="text-[10px] mt-2 text-right text-gray-400">{msg.time}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start items-center">
                    <div className="w-8 h-8 rounded-full bg-[#db0011] flex items-center justify-center mr-2 shrink-0"><span className="text-white text-xs font-bold">H</span></div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm py-3 px-4 flex items-center space-x-1.5 shadow-sm">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-20">
                <form onSubmit={handleSendMessage} className="bg-[#f0f0f0] rounded-[2rem] flex items-center p-1.5">
                  <div className="flex-1 flex items-center px-3">
                    <input type="text" placeholder="Message support..." className="w-full bg-transparent text-[#222] focus:outline-none placeholder-gray-500 py-2 text-[15px]" value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
                  </div>
                  <button type="submit" className={`p-2 rounded-full flex items-center justify-center transition-colors ${chatInput.trim() ? 'bg-[#db0011] text-white' : 'bg-transparent text-gray-400'}`} disabled={!chatInput.trim()}>
                    <ArrowRight size={20} strokeWidth={2.5} />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* PLAN */}
          {activeNav === 'plan' && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-[#f8f8f8] animate-fade-in flex-1">
              <BarChart2 size={48} className="mx-auto mb-4 opacity-50 text-[#db0011]" />
              <p className="font-semibold text-[#222]">Financial Planning tools coming soon</p>
            </div>
          )}

        </main>

        {/* BOTTOM NAV */}
        <nav className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-200 pb-6 pt-2 px-2 z-50">
          <ul className="flex justify-between items-center">
            <li className="flex-1">
              <button onClick={() => { setActiveNav('accounts'); setSelectedAccountId(null); setActiveTopTab('Home'); }} className={`w-full flex flex-col items-center space-y-1 transition-colors ${activeNav === 'accounts' ? 'text-[#db0011]' : 'text-[#666] hover:text-[#222]'}`}>
                <Layers size={22} strokeWidth={activeNav === 'accounts' ? 2.5 : 2} />
                <span className={`text-[10px] ${activeNav === 'accounts' ? 'font-bold' : 'font-medium'}`}>Accounts</span>
              </button>
            </li>
            <li className="flex-1">
              <button onClick={() => setActiveNav('pay')} className={`w-full flex flex-col items-center space-y-1 transition-colors ${activeNav === 'pay' ? 'text-[#db0011]' : 'text-[#666] hover:text-[#222]'}`}>
                <ArrowRightLeft size={22} strokeWidth={activeNav === 'pay' ? 2.5 : 2} />
                <span className={`text-[10px] ${activeNav === 'pay' ? 'font-bold' : 'font-medium'}`}>Pay & Transfer</span>
              </button>
            </li>
            <li className="flex-1">
              <button onClick={() => setActiveNav('plan')} className={`w-full flex flex-col items-center space-y-1 transition-colors ${activeNav === 'plan' ? 'text-[#db0011]' : 'text-[#666] hover:text-[#222]'}`}>
                <BarChart2 size={22} strokeWidth={activeNav === 'plan' ? 2.5 : 2} />
                <span className={`text-[10px] ${activeNav === 'plan' ? 'font-bold' : 'font-medium'}`}>Plan</span>
              </button>
            </li>
            <li className="flex-1">
              <button onClick={() => setActiveNav('support')} className={`w-full flex flex-col items-center space-y-1 transition-colors ${activeNav === 'support' ? 'text-[#db0011]' : 'text-[#666] hover:text-[#222]'}`}>
                <MessageSquare size={22} strokeWidth={activeNav === 'support' ? 2.5 : 2} />
                <span className={`text-[10px] ${activeNav === 'support' ? 'font-bold' : 'font-medium'}`}>Support</span>
              </button>
            </li>
          </ul>
        </nav>

        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
          input[type=number] { -moz-appearance: textfield; }
        `}} />
      </div>
    </div>
  );
}
