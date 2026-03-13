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
    if (val.length > 6) val =
