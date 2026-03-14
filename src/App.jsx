import React, { useState, useEffect, useRef } from 'react';
import {
  Home, Menu, Star, MoreVertical, Eye, MessageSquare, ArrowRight, User,
  ArrowRightLeft, FileText, Plus, ChevronLeft, ChevronRight, CheckCircle2,
  AlertCircle, Globe, Layers, BarChart2, Search, ArrowDown, MoreHorizontal,
  CreditCard as CreditCardIcon, ThumbsUp, ThumbsDown, PieChart, Bell,
  X, Shield, Smartphone, LogOut, Lock, Delete, Calendar, Repeat, Clock,
  HelpCircle, ChevronDown
} from 'lucide-react';

const SnowflakeSVG = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>
    <line x1="20" y1="4" x2="4" y2="20"/><line x1="4" y1="4" x2="20" y2="20"/>
    <line x1="16" y1="8" x2="20" y2="4"/><line x1="8" y1="8" x2="4" y2="4"/>
    <line x1="16" y1="16" x2="20" y2="20"/><line x1="8" y1="16" x2="4" y2="20"/>
  </svg>
);
const HSBCLogo = () => (
  <svg viewBox="0 0 200 100" className="w-[44px] h-[22px] shrink-0">
    <polygon points="0,50 50,0 50,100" fill="#db0011"/><polygon points="200,50 150,0 150,100" fill="#db0011"/>
    <polygon points="50,0 150,0 100,50" fill="#db0011"/><polygon points="50,100 150,100 100,50" fill="#db0011"/>
  </svg>
);
const HSBCLogoSmall = () => (
  <svg viewBox="0 0 200 100" className="w-[28px] h-[14px] shrink-0">
    <polygon points="0,50 50,0 50,100" fill="#db0011"/><polygon points="200,50 150,0 150,100" fill="#db0011"/>
    <polygon points="50,0 150,0 100,50" fill="#db0011"/><polygon points="50,100 150,100 100,50" fill="#db0011"/>
  </svg>
);
const HSBCLogoWhite = () => (
  <svg viewBox="0 0 200 100" className="w-[56px] h-[28px]">
    <polygon points="0,50 50,0 50,100" fill="white"/><polygon points="200,50 150,0 150,100" fill="white"/>
    <polygon points="50,0 150,0 100,50" fill="white"/><polygon points="50,100 150,100 100,50" fill="white"/>
  </svg>
);

const fmtBalance = (amount) => {
  const n = Number(amount) || 0; const neg = n < 0;
  const parts = Math.abs(n).toFixed(2).split('.');
  return (<span className="flex items-baseline">{neg && <span className="text-[15px] mr-0.5 font-bold">-</span>}<span className="text-[13px] mr-0.5 font-bold">£</span><span className="text-xl font-bold">{parseInt(parts[0]).toLocaleString('en-GB')}</span><span className="text-[13px] font-bold">.{parts[1]}</span></span>);
};
const fmtPlain = (n) => `£${Math.abs(Number(n)||0).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const fmtSigned = (n) => { const v=Number(n)||0; return `${v<0?'-':''}£${Math.abs(v).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2})}`; };

const merchantMap = {
  sainsburys:{ ref:'SAINSBURYS SUPERMARKETS', web:'sainsburys.co.uk', method:'Contactless' },
  tfl:       { ref:'TFL TRAVEL CHARGE LONDON', web:'tfl.gov.uk', method:'Contactless' },
  deliveroo: { ref:'DELIVEROO ORDER', web:'deliveroo.co.uk', method:'Online' },
  adobe:     { ref:'ADOBE SYSTEMS INC', web:'adobe.com', method:'Direct Debit' },
  nike:      { ref:'NIKE RETAIL UK LTD', web:'nike.com', method:'Contactless' },
  uber:      { ref:'UBER TRIP CHARGE', web:'uber.com', method:'In-App' },
  tesco:     { ref:'TESCO STORES LTD', web:'tesco.com', method:'Contactless' },
  amazon:    { ref:'AMAZON.CO.UK RETAIL', web:'amazon.co.uk', method:'Online' },
  spotify:   { ref:'SPOTIFY AB', web:'spotify.com', method:'Direct Debit' },
};
const getMerchant = (type, desc) => merchantMap[type] || { ref:(desc||'').toUpperCase(), web:null, method: type==='income'?'Bank Transfer':'Transfer' };
const displayDate = (d) => {
  if(d==='Today'){const n=new Date();return `${n.getDate()} ${n.toLocaleString('en-GB',{month:'short'})} ${n.getFullYear()}`;}
  if(d==='Yesterday'){const n=new Date();n.setDate(n.getDate()-1);return `${n.getDate()} ${n.toLocaleString('en-GB',{month:'short'})} ${n.getFullYear()}`;}
  return `${d} 2026`;
};

const TxIcon = ({ type, desc, large=false }) => {
  const base = large ? 'w-20 h-20 rounded-[24px]' : 'w-11 h-11 rounded-[12px]';
  const lg = large ? 'text-4xl' : 'text-2xl';
  const sm = large ? 'text-base' : 'text-[10px]';
  switch(type){
    case 'sainsburys': return <div className={`${base} bg-[#e35205] text-white flex items-center justify-center font-bold ${lg} shadow-sm shrink-0`}>S</div>;
    case 'adobe':      return <div className={`${base} bg-[#ff0000] text-white flex items-center justify-center font-bold ${lg} shadow-sm shrink-0`}>A</div>;
    case 'nike':       return <div className={`${base} bg-black text-white flex items-center justify-center font-serif italic font-bold ${lg} shadow-sm shrink-0`}>N</div>;
    case 'uber':       return <div className={`${base} bg-black text-white flex items-center justify-center font-medium shadow-sm shrink-0 ${large?'text-xl':'text-[11px]'}`}>Uber</div>;
    case 'deliveroo':  return <div className={`${base} bg-[#00ccbc] text-white flex items-center justify-center font-bold ${lg} shadow-sm shrink-0`}>D</div>;
    case 'tfl':        return <div className={`${base} bg-[#0019a8] text-white flex items-center justify-center font-bold shadow-sm shrink-0 ${sm}`}>TfL</div>;
    case 'amazon':     return <div className={`${base} bg-[#232f3e] text-[#ff9900] flex items-center justify-center font-bold ${lg} shadow-sm shrink-0`}>a</div>;
    case 'spotify':    return <div className={`${base} bg-[#1db954] text-white flex items-center justify-center font-bold shadow-sm shrink-0 ${sm}`}>Spotify</div>;
    case 'tesco':      return <div className={`${base} bg-[#00539f] text-white flex items-center justify-center font-bold shadow-sm shrink-0 ${sm}`}>TESCO</div>;
    case 'income':     return <div className={`${base} bg-[#dcf4e6] text-[#00a651] flex items-center justify-center shadow-sm shrink-0`}><ArrowDown size={large?36:22} strokeWidth={3}/></div>;
    default:
      const ini=(desc||'T').split(' ').map(n=>n[0]).filter(Boolean).join('').substring(0,2).toUpperCase();
      return <div className={`${base} bg-[#e2e8f0] text-[#334155] flex items-center justify-center font-bold ${large?'text-3xl':'text-lg'} shadow-sm shrink-0`}>{ini}</div>;
  }
};

const CORRECT_PIN = '1234';
const STANDING_ORDERS = [
  { id:'so_1', payee:'Monthly Rent',  amount:1200.00, frequency:'Monthly', nextDate:'1 Apr 2026',  ref:'RENT APR' },
  { id:'so_2', payee:'Council Tax',   amount:142.00,  frequency:'Monthly', nextDate:'5 Apr 2026',  ref:'COUNCIL TAX' },
  { id:'so_3', payee:'Jane Doe',      amount:250.00,  frequency:'Monthly', nextDate:'15 Apr 2026', ref:'SAVINGS' },
];
const DIRECT_DEBITS = [
  { id:'dd_1', payee:'Adobe Systems',  amount:15.00,  frequency:'Monthly', nextDate:'10 Apr 2026', iconType:'adobe' },
  { id:'dd_2', payee:'Spotify',        amount:11.99,  frequency:'Monthly', nextDate:'15 Apr 2026', iconType:'spotify' },
  { id:'dd_3', payee:'Netflix',        amount:17.99,  frequency:'Monthly', nextDate:'22 Apr 2026', iconType:null },
  { id:'dd_4', payee:'Home Insurance', amount:34.50,  frequency:'Monthly', nextDate:'28 Apr 2026', iconType:null },
];
const REASON_OPTIONS = ['Pay friends or family','Pay a business','Pay rent','Loan repayment','Other'];
const QUICK_CHIPS = ['Confirm my payment','Check my balance','Card queries','Recent transactions'];

const genConfirmId = (id) => 'CNF'+(parseInt(id||'0',36)%1000000000).toString().padStart(9,'0');
const genPaymentId = (id) => 'PID'+(parseInt(id||'0',36)%10000000).toString().padStart(7,'0')+'V';
const genSortCode  = (id) => { const n=(parseInt(id||'0',36)%999999).toString().padStart(6,'0'); return `${n.slice(0,2)}-${n.slice(2,4)}-${n.slice(4)}`; };
const genAccNum    = (id) => ((parseInt(id||'0',36)%99999999)+10000000).toString();

/* ── localStorage-backed state hook ── */
function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch { return defaultValue; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); }
    catch { /* storage full or unavailable */ }
  }, [key, state]);
  return [state, setState];
}

export default function App() {
  const [appState,setAppState] = useState('login');
  const [faceIdPhase,setFaceIdPhase] = useState('idle'); // idle | scanning | done
  const [pin,setPin] = useState('');
  const [pinError,setPinError] = useState(false);
  const [pinShake,setPinShake] = useState(false);
  const [activeNav,setActiveNav] = useState('accounts');
  const [activeTopTab,setActiveTopTab] = useState('Home');
  const [selectedAccountId,setSelectedAccountId] = useState(null);
  const [selectedTx,setSelectedTx] = useState(null);
  const [payView,setPayView] = useState('menu');
  const [showBalances,setShowBalances] = useState(true);
  const [showProfile,setShowProfile] = useState(false);
  const [showNotifs,setShowNotifs] = useState(false);
  const [showSO,setShowSO] = useState(false);
  const [cardFrozen,setCardFrozen] = useState(true);
  const [txFeedback,setTxFeedback] = useState({});
  const [txSearch,setTxSearch] = useState('');
  const [showTxSearch,setShowTxSearch] = useState(false);
  const [notifOn,setNotifOn] = useState(true);
  const [faceIdOn,setFaceIdOn] = useState(true);
  const [marketingOn,setMarketingOn] = useState(false);

  const [accounts,setAccounts] = usePersistedState('hsbc_accounts',[
    { id:'acc_1', name:'Current Account',     details:'40-47-59  12345678',  balance:21321.77, type:'current', overdraft:350 },
    { id:'acc_2', name:'Online Bonus Saver',  details:'40-47-59  87654321',  balance:0.00,     type:'savings', overdraft:0 },
    { id:'acc_3', name:'Rewards Credit Card', details:'**** **** **** 5432', balance:-500.00,  type:'credit',  creditLimit:3000 },
  ]);

  const [transactions,setTransactions] = usePersistedState('hsbc_transactions',[
    { id:'tx_1', date:'Today',     time:'14:30', desc:"Sainsbury's",      category:'Groceries',    amount:-30.00,  iconType:'sainsburys', status:'pending',   sortCode:'40-47-10', accountNum:'12345678' },
    { id:'tx_2', date:'Today',     time:'08:15', desc:'TFL Travel Charge',category:'Travel',       amount:-6.80,   iconType:'tfl',        status:'pending',   sortCode:'20-00-00', accountNum:'56781234' },
    { id:'tx_3', date:'Yesterday', time:'19:45', desc:'Deliveroo',        category:'Dining',       amount:-24.50,  iconType:'deliveroo',  status:'completed', sortCode:'04-00-75', accountNum:'87654321' },
    { id:'tx_4', date:'Mar 10',    time:'21:00', desc:'Adobe',            category:'Subscription', amount:-15.00,  iconType:'adobe',      status:'completed', sortCode:'23-14-70', accountNum:'11223344' },
    { id:'tx_5', date:'Mar 10',    time:'15:00', desc:'Joanne',           category:'Income',       amount:100.00,  iconType:'income',     status:'completed', sortCode:'30-96-20', accountNum:'99887766' },
    { id:'tx_6', date:'Mar 10',    time:'12:00', desc:'Nike',             category:'Apparel',      amount:-150.00, iconType:'nike',       status:'completed', sortCode:'40-47-84', accountNum:'55667788' },
    { id:'tx_7', date:'Mar 8',     time:'18:30', desc:'Uber',             category:'Travel',       amount:-12.00,  iconType:'uber',       status:'completed', sortCode:'60-83-71', accountNum:'44332211' },
    { id:'tx_8', date:'Mar 8',     time:'13:00', desc:'Tesco Extra',      category:'Groceries',    amount:-45.20,  iconType:'tesco',      status:'completed', sortCode:'40-47-22', accountNum:'66778899' },
  ]);

  const [scheduled,setScheduled] = useState([
    { id:'sp_1', payee:'John Smith', amount:50.00, date:'2026-04-01', ref:'Lunch', sortCode:'20-00-00', accountNum:'12345678' },
  ]);

  // Pay step 1
  const [payAmount,setPayAmount] = useState('');
  const [payReason,setPayReason] = useState('Pay friends or family');
  const [showReasonDrop,setShowReasonDrop] = useState(false);
  const [payRef,setPayRef] = useState('');
  const [createSO,setCreateSO] = useState(false);
  const [payDateNow,setPayDateNow] = useState(true);
  const [payDate,setPayDate] = useState('');
  // Pay step 2
  const [payeeName,setPayeeName] = useState('');
  const [sortCode,setSortCode] = useState('');
  const [accountNum,setAccountNum] = useState('');
  const [isBusiness,setIsBusiness] = useState(false);
  const [savePayeeAs,setSavePayeeAs] = useState('');
  const [step2Ref,setStep2Ref] = useState('');
  const [payError,setPayError] = useState('');
  const [paySuccess,setPaySuccess] = useState(false);
  const [schedSuccess,setSchedSuccess] = useState(false);
  // Transfer
  const [fromId,setFromId] = useState('acc_1');
  const [toId,setToId] = useState('acc_2');
  const [xferAmount,setXferAmount] = useState('');
  const [xferRef,setXferRef] = useState('');
  const [xferError,setXferError] = useState('');
  const [xferSuccess,setXferSuccess] = useState(false);
  // Chat
  const [chatInput,setChatInput] = useState('');
  const [isTyping,setIsTyping] = useState(false);
  const msgEnd = useRef(null);
  const [chatMsgs,setChatMsgs] = useState([
    { id:'m1', sender:'bot', type:'text', text:"Hi! I'm Cora, your HSBC digital assistant. How can I help you today?", time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) }
  ]);
  // Notifications — persisted
  const [readIds,setReadIds] = usePersistedState('hsbc_readNotifIds',[]);

  /* Derived */
  const selectedAccount = accounts.find(a=>a.id===selectedAccountId);
  const creditAcc = accounts[2];
  const creditUsed = Math.abs(creditAcc.balance);
  const availCredit = creditAcc.creditLimit - creditUsed;
  const creditPct = (creditUsed/creditAcc.creditLimit)*100;
  const currentAccBal = accounts[0].balance;
  const parsedPayAmt = parseFloat(payAmount)||0;
  const availAfterPay = currentAccBal - parsedPayAmt;
  const fromAcc = accounts.find(a=>a.id===fromId);
  const toAcc = accounts.find(a=>a.id===toId);
  const parsedXfer = parseFloat(xferAmount)||0;
  const xferAfter = (fromAcc?.balance||0)-parsedXfer;
  const upcomingTotal = DIRECT_DEBITS.reduce((s,d)=>s+d.amount,0)+STANDING_ORDERS.reduce((s,o)=>s+o.amount,0);
  const forecastBal = selectedAccount ? Math.max(0,selectedAccount.balance-upcomingTotal) : 0;

  const notifs = transactions.slice(0,6).map(tx=>({
    id:tx.id, title:tx.amount>0?'Money received':'Payment made',
    body:tx.amount>0?`${fmtPlain(tx.amount)} received from ${tx.desc}`:`${fmtPlain(tx.amount)} paid to ${tx.desc}`,
    time:`${tx.date}, ${tx.time}`, iconType:tx.iconType, desc:tx.desc
  }));
  const unread = notifs.filter(n=>!readIds.includes(n.id)).length;

  const q = txSearch.toLowerCase();
  const filteredTx = transactions.filter(tx=>!q||tx.desc.toLowerCase().includes(q)||tx.category.toLowerCase().includes(q)||Math.abs(tx.amount).toFixed(2).includes(q));
  const pendingTx = filteredTx.filter(t=>t.status==='pending');
  const completedTx = filteredTx.filter(t=>t.status==='completed');
  const completedGrouped = completedTx.reduce((acc,tx)=>{
    let g=acc.find(x=>x.date===tx.date);
    if(!g){g={date:tx.date,items:[],total:0};acc.push(g);}
    g.items.push(tx); g.total+=Number(tx.amount)||0; return acc;
  },[]);

  /* PIN */
  const pressPin = (d) => {
    navigator.vibrate?.(50); // haptic on every keypress
    if(pin.length>=4) return;
    const np=pin+d; setPin(np);
    if(np.length===4){
      if(np===CORRECT_PIN){setTimeout(()=>{setAppState('app');setPin('');},300);}
      else{setPinShake(true);setTimeout(()=>{setPin('');setPinShake(false);setPinError(true);},600);setTimeout(()=>setPinError(false),2200);}
    }
  };

  /* Face ID trigger — runs once when we arrive at login screen */
  useEffect(() => {
    if(appState==='login' && faceIdOn && faceIdPhase==='idle') {
      setFaceIdPhase('scanning');
      setTimeout(() => setFaceIdPhase('done'), 1500);
    }
    if(appState==='login' && !faceIdOn) setFaceIdPhase('done');
    if(appState!=='login') setFaceIdPhase('idle');
  }, [appState]); // eslint-disable-line

  const handleSortCode = (e)=>{
    let v=e.target.value.replace(/\D/g,'').slice(0,6);
    let f=v; if(v.length>2)f=`${v.slice(0,2)}-${v.slice(2)}`; if(v.length>4)f=`${v.slice(0,2)}-${v.slice(2,4)}-${v.slice(4)}`;
    setSortCode(f);
  };
  const handleAccNum = (e)=>setAccountNum(e.target.value.replace(/\D/g,'').slice(0,8));

  const resetPayForm = ()=>{
    setPayAmount('');setPayReason('Pay friends or family');setPayRef('');setCreateSO(false);setPayDateNow(true);setPayDate('');
    setPayeeName('');setSortCode('');setAccountNum('');setIsBusiness(false);setSavePayeeAs('');setStep2Ref('');setPayError('');
  };

  const submitPay = ()=>{
    setPayError('');
    const amt=parseFloat(payAmount);
    if(!payeeName.trim()) return setPayError('Please enter the payee full name.');
    if(sortCode.length!==8) return setPayError('Please enter a valid 6-digit sort code.');
    if(accountNum.length!==8) return setPayError('Please enter a valid 8-digit account number.');
    if(isNaN(amt)||amt<=0) return setPayError('Please enter a valid amount.');
    if(!payDateNow&&!payDate) return setPayError('Please select a payment date.');
    if(!payDateNow){
      setScheduled(p=>[...p,{id:Date.now().toString(),payee:payeeName,amount:amt,date:payDate,ref:step2Ref||payRef,sortCode,accountNum}]);
      setSchedSuccess(true);
      setTimeout(()=>{setSchedSuccess(false);resetPayForm();setPayView('menu');},2800);
      return;
    }
    if(currentAccBal<amt) return setPayError('Insufficient funds.');
    const newTx={id:Date.now().toString(),date:'Today',time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),desc:payeeName,category:'Transfer',amount:-amt,iconType:'transfer',status:'completed',sortCode,accountNum};
    setAccounts(a=>{const n=[...a];n[0]={...n[0],balance:n[0].balance-amt};return n;});
    setTransactions(p=>[newTx,...p]);
    navigator.vibrate?.([100,50,100]); // success haptic
    setPaySuccess(true);
    setTimeout(()=>{setPaySuccess(false);resetPayForm();setActiveNav('accounts');setPayView('menu');},2800);
  };

  const submitXfer = (e)=>{
    e.preventDefault(); setXferError('');
    if(fromId===toId) return setXferError('Please choose two different accounts.');
    if(!parsedXfer||parsedXfer<=0) return setXferError('Please enter a valid amount.');
    if((fromAcc?.balance||0)<parsedXfer) return setXferError('Insufficient funds.');
    setAccounts(a=>a.map(ac=>{
      if(ac.id===fromId) return{...ac,balance:ac.balance-parsedXfer};
      if(ac.id===toId) return{...ac,balance:ac.balance+parsedXfer};
      return ac;
    }));
    setTransactions(p=>[{id:Date.now().toString(),date:'Today',time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),desc:`Transfer to ${toAcc?.name}`,category:'Transfer',amount:-parsedXfer,iconType:'transfer',status:'completed',sortCode:'',accountNum:''},...p]);
    setXferSuccess(true);
    navigator.vibrate?.([100,50,100]); // success haptic
    setTimeout(()=>{setXferSuccess(false);setPayView('menu');setXferAmount('');setXferRef('');},2500);
  };

  /* Chat */
  const sendMsg = (text)=>{
    const t=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    setChatMsgs(p=>[...p,{id:Date.now().toString(),sender:'user',type:'text',text,time:t}]);
    setChatInput(''); setIsTyping(true);
    setTimeout(()=>{
      setIsTyping(false);
      const l=text.toLowerCase();
      const id=(Date.now()+1).toString();
      const time=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
      let msg;
      if(l.includes('confirm')||l.includes('payment')||l.includes('gone through')||l.includes('sent')||l.includes('transfer')){
        const rt=transactions.find(tx=>tx.iconType==='transfer'||tx.category==='Transfer');
        if(rt){
          msg={id,sender:'bot',type:'payment_card',time,card:{payee:rt.desc,amount:Math.abs(rt.amount),sortCode:rt.sortCode||genSortCode(rt.id),accountNum:rt.accountNum||genAccNum(rt.id),ref:rt.ref||'Transfer',date:displayDate(rt.date),txTime:rt.time,confirmId:genConfirmId(rt.id),paymentId:genPaymentId(rt.id)}};
        } else {
          msg={id,sender:'bot',type:'text',text:"I don't see any recent transfers on your account.",time};
        }
      } else if(l.match(/\b(hi|hello|hey)\b/)) {
        msg={id,sender:'bot',type:'text',text:'Hello! How can I help you today?',time};
      } else if(l.includes('balance')) {
        msg={id,sender:'bot',type:'text',text:`Your Current Account balance is ${fmtPlain(accounts[0].balance)}. Your Online Bonus Saver balance is ${fmtPlain(accounts[1].balance)}.`,time};
      } else if(l.includes('card')||l.includes('frozen')) {
        msg={id,sender:'bot',type:'text',text:cardFrozen?'Your Rewards Credit Card is currently frozen. You can unfreeze it in the Cards section.':'Your Rewards Credit Card is active and ready to use.',time};
      } else if(l.includes('transaction')||l.includes('recent')) {
        msg={id,sender:'bot',type:'text',text:`Your most recent transaction was ${transactions[0].desc} for ${fmtPlain(transactions[0].amount)} on ${transactions[0].date}.`,time};
      } else {
        msg={id,sender:'bot',type:'text',text:"I can help with payments, balances, card queries and recent transactions. What would you like to check?",time};
      }
      setChatMsgs(p=>[...p,msg]);
      setTimeout(()=>msgEnd.current?.scrollIntoView({behavior:'smooth'}),50);
    },1200);
  };

  /* ── Shared header ── */
  const TopNav = () => (
    <header className="relative z-10 flex items-center justify-between px-6 pt-14 pb-3">
      <div className="flex items-center">
        <button className="flex flex-col items-center relative mr-3">
          <Home size={24} className="text-[#222]" strokeWidth={2.5}/>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#db0011]"/>
        </button>
        <div className="w-px h-5 bg-gray-400 mr-4 opacity-40"/>
        <div className="flex space-x-5 text-[15px] font-bold text-[#333]">
          <button onClick={()=>{setActiveNav('pay');setPayView('menu');}}>Pay</button>
          <button onClick={()=>{setActiveTopTab('Cards');setSelectedAccountId(null);}}>Cards</button>
          <button>Invest</button>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button onClick={()=>setShowNotifs(true)} className="relative text-[#222]">
          <Bell size={22} strokeWidth={2}/>
          {unread>0&&<span className="absolute -top-1 -right-1 w-4 h-4 bg-[#db0011] rounded-full text-white text-[9px] font-bold flex items-center justify-center">{unread}</span>}
        </button>
        <button onClick={()=>setShowProfile(true)} className="text-[#222]"><Menu size={26} strokeWidth={2}/></button>
      </div>
    </header>
  );

  const TxRow = ({tx})=>(
    <div onClick={()=>setSelectedTx(tx)} className="flex justify-between items-center px-5 py-3.5 cursor-pointer active:bg-gray-50 border-b border-gray-50 last:border-0">
      <div className="flex items-center space-x-3.5">
        <TxIcon type={tx.iconType} desc={tx.desc}/>
        <div>
          <p className="font-bold text-[#222] text-[15px]">{tx.desc}</p>
          <p className="text-[12px] text-gray-500 mt-0.5">{tx.time} · {tx.category}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`font-bold text-[15px] ${tx.amount>0?'text-[#00a651]':'text-[#222]'}`}>{tx.amount>0?'+':''}£{Math.abs(tx.amount).toFixed(2)}</span>
        <ChevronRight size={16} className="text-gray-300"/>
      </div>
    </div>
  );

  const TxDetail = ({tx,onBack})=>{
    const m=getMerchant(tx.iconType,tx.desc); const fb=txFeedback[tx.id];
    return(
      <div className="animate-fade-in bg-white min-h-full pb-10">
        <div className="flex items-center justify-between px-4 pt-14 pb-4 bg-white sticky top-0 z-40 border-b border-gray-100">
          <button onClick={onBack} className="p-2 -ml-2"><ChevronLeft size={28} strokeWidth={2.5} className="text-[#222]"/></button>
          <h1 className="text-[18px] font-bold text-[#222]">Transaction details</h1>
          <button className="p-2"><Menu size={22} strokeWidth={2} className="text-[#222]"/></button>
        </div>
        <div className="flex flex-col items-center pt-8 pb-6 px-6 border-b border-gray-100">
          <TxIcon type={tx.iconType} desc={tx.desc} large/>
          <h2 className="text-[22px] font-bold text-[#222] mt-4">{tx.desc}</h2>
          <div className="flex items-baseline mt-2">
            <span className="text-[18px] font-bold text-[#222] mr-1">{tx.amount>0?'+':'-'} £</span>
            <span className="text-[48px] font-bold text-[#222] leading-none">{Math.floor(Math.abs(tx.amount))}</span>
            <span className="text-[22px] font-bold text-[#222]">.{Math.abs(tx.amount).toFixed(2).split('.')[1]}</span>
          </div>
          <div className="flex items-center space-x-2 mt-3">
            {tx.status==='pending'&&<span className="bg-orange-100 text-orange-600 text-[11px] font-bold px-2.5 py-1 rounded-full">Pending</span>}
            <p className="text-[13px] text-gray-500 font-medium">{displayDate(tx.date)} · {m.method}</p>
          </div>
        </div>
        <div className="mx-5 mt-4 bg-[#f8f8f8] rounded-2xl flex items-center justify-between px-4 py-4 cursor-pointer">
          <div className="flex items-center space-x-4"><div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm"><PieChart size={20} className="text-[#db0011]"/></div><div><p className="font-bold text-[#222] text-[15px]">Spending insights</p><p className="text-[12px] text-gray-500 mt-0.5">Get a better overview of your spending.</p></div></div>
          <ArrowRight size={20} className="text-gray-400"/>
        </div>
        <div className="mx-5 mt-5 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
          {[{l:'Transaction reference',v:m.ref},{l:'Transaction date',v:displayDate(tx.date)},{l:'Time',v:tx.time},{l:'Category',v:tx.category}].map(r=>(
            <div key={r.l} className="px-5 py-4 border-b border-gray-100 last:border-0"><p className="text-[12px] text-gray-500 font-medium mb-1">{r.l}</p><p className="text-[15px] font-bold text-[#222]">{r.v}</p></div>
          ))}
          {m.web&&(<div className="px-5 py-4 flex items-center justify-between"><div><p className="text-[12px] text-gray-500 font-medium mb-1">Merchant website</p><p className="text-[14px] font-bold text-[#222]">{m.web}</p></div><button className="text-[12px] font-bold text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5">Copy</button></div>)}
        </div>
        {tx.iconType!=='transfer'&&tx.iconType!=='income'&&(
          <div className="mx-5 mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
            <p className="text-[15px] font-bold text-[#222]">Are the merchant details correct?</p>
            <div className="flex space-x-4">
              <button onClick={()=>setTxFeedback(p=>({...p,[tx.id]:'up'}))} className={`p-2 rounded-full ${fb==='up'?'text-[#00a651]':'text-gray-400'}`}><ThumbsUp size={22} strokeWidth={2}/></button>
              <button onClick={()=>setTxFeedback(p=>({...p,[tx.id]:'down'}))} className={`p-2 rounded-full ${fb==='down'?'text-[#db0011]':'text-gray-400'}`}><ThumbsDown size={22} strokeWidth={2}/></button>
            </div>
          </div>
        )}
        <div className="mx-5 mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between cursor-pointer active:bg-gray-50">
          <div className="flex items-center space-x-4"><div className="w-12 h-12 rounded-full bg-[#fff0f0] flex items-center justify-center relative"><FileText size={20} className="text-[#222]"/><div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#db0011] rounded-full flex items-center justify-center"><span className="text-white text-[10px] font-bold">!</span></div></div><p className="text-[15px] font-bold text-[#222]">Query this transaction</p></div>
          <ArrowRight size={20} className="text-gray-400"/>
        </div>
      </div>
    );
  };

  const AccountInfoScreen = ({acc,onBack})=>(
    <div className="animate-fade-in bg-white min-h-full pb-16">
      <div className="flex items-center justify-between px-5 pt-14 pb-4 bg-white sticky top-0 z-40 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2"><ChevronLeft size={26} strokeWidth={2.5} className="text-[#222]"/></button>
        <h1 className="font-bold text-[#222] text-[17px]">Account information</h1>
        <button className="p-2"><Menu size={22} strokeWidth={2} className="text-[#222]"/></button>
      </div>
      <div className="px-6 pt-5 pb-6 bg-white border-b border-gray-100">
        <p className="font-bold text-[#222] text-[20px]">{acc.type==='current'?'Bank A/C':acc.type==='savings'?'Savings A/C':'Credit Card'}</p>
        <p className="text-[14px] text-gray-500 mt-1">{acc.details}</p>
        <div className="mt-5 flex items-baseline"><span className="text-[18px] font-bold text-[#222] mr-1">£</span><span className="text-[42px] font-bold text-[#222] leading-none">{parseInt(Math.abs(acc.balance)).toLocaleString('en-GB')}</span><span className="text-[22px] font-bold text-[#222]">.{Math.abs(acc.balance).toFixed(2).split('.')[1]}</span></div>
        {acc.overdraft>0&&<p className="text-[14px] text-gray-600 mt-2">Arranged overdraft <span className="font-bold text-[#222]">£{acc.overdraft.toFixed(2)}</span></p>}
        {acc.type==='credit'&&<p className="text-[14px] text-gray-600 mt-2">Credit limit <span className="font-bold text-[#222]">£{acc.creditLimit?.toFixed(2)}</span></p>}
      </div>
      {acc.type!=='credit'&&(
        <div className="mx-5 mt-5 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-start space-x-3 mb-3"><div className="w-8 h-8 bg-[#fff0f0] rounded-lg flex items-center justify-center shrink-0"><FileText size={16} className="text-[#db0011]"/></div><div><p className="font-bold text-[#222] text-[15px]">Balance forecast</p><p className="text-[12px] text-gray-500">for 31 March</p></div></div>
          <div className="flex items-baseline ml-11"><span className="text-[16px] font-bold text-[#222] mr-0.5">£</span><span className="text-[32px] font-bold text-[#222] leading-none">{parseInt(forecastBal).toLocaleString('en-GB')}</span><span className="text-[16px] font-bold text-[#222]">.{forecastBal.toFixed(2).split('.')[1]}</span></div>
          <button className="mt-4 text-[#222] font-bold text-[14px] flex items-center space-x-1 ml-11"><span>View dashboard</span><ArrowRight size={16}/></button>
        </div>
      )}
      <div className="flex justify-between px-5 mt-6">
        {[{icon:<ArrowRight size={20}/>,label:'Pay or\ntransfer',bg:'bg-[#db0011]',white:true,action:()=>{setActiveNav('pay');setPayView('menu');}},{icon:<FileText size={20}/>,label:'View\nstatements',bg:'bg-[#f4f5f7]',white:false,action:()=>{}},{icon:<CreditCardIcon size={20}/>,label:'Current account\nswitch',bg:'bg-[#f4f5f7]',white:false,action:()=>{}},{icon:<MoreHorizontal size={20}/>,label:'More',bg:'bg-[#f4f5f7]',white:false,action:()=>{}}].map((b,i)=>(
          <button key={i} onClick={b.action} className="flex flex-col items-center w-[70px]"><div className={`w-14 h-14 rounded-full ${b.bg} flex items-center justify-center mb-2 shadow-sm ${b.white?'text-white':'text-[#222]'}`}>{b.icon}</div><span className="text-[10px] text-[#222] font-semibold text-center leading-tight">{b.label}</span></button>
        ))}
      </div>
      {acc.type==='current'&&(<button onClick={()=>{setActiveTopTab('Cards');setSelectedAccountId(null);}} className="mx-5 mt-5 w-[calc(100%-40px)] bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between active:bg-gray-50"><div className="flex items-center space-x-3"><div className="w-9 h-9 bg-[#db0011] rounded-lg flex items-center justify-center"><CreditCardIcon size={18} className="text-white"/></div><span className="font-bold text-[#222] text-[15px]">Manage cards</span></div><ArrowRight size={18} className="text-gray-400"/></button>)}
      <div className="mt-6">
        <div className="flex items-center justify-between px-5 mb-1"><h2 className="font-bold text-[#222] text-[18px]">Latest transactions</h2><button onClick={()=>setShowTxSearch(s=>!s)} className="p-1"><Search size={20} className="text-[#222]"/></button></div>
        {showTxSearch&&(<div className="px-5 mb-3"><div className="bg-[#f4f5f7] rounded-[14px] flex items-center px-4 py-3"><Search size={18} className="text-gray-400 mr-3 shrink-0"/><input autoFocus type="text" placeholder="Search transactions" className="bg-transparent focus:outline-none w-full text-[15px] text-[#222] placeholder-gray-400" value={txSearch} onChange={e=>setTxSearch(e.target.value)}/>{txSearch&&<button onClick={()=>setTxSearch('')}><X size={16} className="text-gray-400 ml-2"/></button>}</div></div>)}
        {pendingTx.length>0&&(<div className="mb-2"><div className="px-5 py-2 bg-[#f8f8f8] flex items-center space-x-2 border-t border-gray-100"><Clock size={13} className="text-orange-500"/><p className="text-[13px] font-bold text-gray-500">Pending</p></div><div className="bg-white">{pendingTx.map(tx=><TxRow key={tx.id} tx={tx}/>)}</div></div>)}
        {completedGrouped.length>0&&(<div><div className="px-5 py-2 bg-[#f8f8f8] border-t border-gray-100"><p className="text-[13px] font-bold text-gray-500">Completed</p></div>{completedGrouped.map(group=>(<div key={group.date}><div className="flex justify-between items-center px-5 py-2 bg-[#f8f8f8] border-t border-gray-50"><p className="text-[13px] font-semibold text-[#222]">{group.date}</p><p className="text-[13px] text-gray-500">£{Math.abs(group.total).toFixed(2)}</p></div><div className="bg-white">{group.items.map(tx=><TxRow key={tx.id} tx={tx}/>)}</div></div>))}</div>)}
        {filteredTx.length===0&&<div className="flex flex-col items-center py-16 px-8 text-center"><Search size={36} className="text-gray-200 mb-3"/><p className="font-bold text-[#222]">No transactions found</p><p className="text-gray-400 text-[13px] mt-1">Try a merchant, category or amount</p></div>}
      </div>
    </div>
  );

  const SOScreen = ()=>{
    const [tab,setTab]=useState('standing');
    return(
      <div className="absolute inset-0 z-[80] bg-[#f8f8f8] flex flex-col animate-fade-in">
        <div className="flex items-center justify-between px-5 pt-14 pb-4 bg-white border-b border-gray-100"><button onClick={()=>setShowSO(false)} className="p-2 -ml-2"><ChevronLeft size={26} strokeWidth={2.5} className="text-[#222]"/></button><h1 className="font-bold text-[#222] text-[17px]">Regular Payments</h1><div className="w-10"/></div>
        <div className="flex bg-white border-b border-gray-100">{[['standing','Standing Orders'],['direct','Direct Debits'],['scheduled','Scheduled']].map(([k,l])=>(<button key={k} onClick={()=>setTab(k)} className={`flex-1 py-3.5 text-[12px] font-bold border-b-2 transition-colors ${tab===k?'text-[#db0011] border-[#db0011]':'text-gray-400 border-transparent'}`}>{l}</button>))}</div>
        <div className="flex-1 overflow-y-auto hide-scrollbar pb-10 p-5">
          {tab==='standing'&&STANDING_ORDERS.map(so=>(<div key={so.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-3"><div className="flex items-start justify-between"><div className="flex items-center space-x-3"><div className="w-11 h-11 rounded-[12px] bg-[#e2e8f0] text-[#334155] flex items-center justify-center font-bold text-lg shrink-0">{so.payee[0]}</div><div><p className="font-bold text-[#222] text-[15px]">{so.payee}</p><p className="text-[12px] text-gray-400 mt-0.5">{so.frequency} · {so.ref}</p></div></div><p className="font-bold text-[#222]">£{so.amount.toFixed(2)}</p></div><div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between"><div className="flex items-center space-x-1.5 text-gray-400"><Calendar size={13}/><p className="text-[12px]">Next: <span className="font-bold text-[#222]">{so.nextDate}</span></p></div><button className="text-[12px] font-bold text-[#db0011]">Cancel</button></div></div>))}
          {tab==='direct'&&DIRECT_DEBITS.map(dd=>(<div key={dd.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-3"><div className="flex items-start justify-between"><div className="flex items-center space-x-3"><TxIcon type={dd.iconType} desc={dd.payee}/><div><p className="font-bold text-[#222] text-[15px]">{dd.payee}</p><p className="text-[12px] text-gray-400 mt-0.5">{dd.frequency}</p></div></div><p className="font-bold text-[#222]">£{dd.amount.toFixed(2)}</p></div><div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between"><div className="flex items-center space-x-1.5 text-gray-400"><Calendar size={13}/><p className="text-[12px]">Next: <span className="font-bold text-[#222]">{dd.nextDate}</span></p></div><button className="text-[12px] font-bold text-[#db0011]">Cancel</button></div></div>))}
          {tab==='scheduled'&&(scheduled.length===0?<div className="flex flex-col items-center py-20 text-center"><Calendar size={40} className="text-gray-200 mb-4"/><p className="font-bold text-[#222]">No scheduled payments</p></div>:scheduled.map(sp=>(<div key={sp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-3"><div className="flex items-start justify-between"><div className="flex items-center space-x-3"><div className="w-11 h-11 rounded-[12px] bg-[#e2e8f0] text-[#334155] flex items-center justify-center font-bold text-lg shrink-0">{sp.payee[0]}</div><div><p className="font-bold text-[#222] text-[15px]">{sp.payee}</p><p className="text-[12px] text-gray-400 mt-0.5">{sp.ref||'No reference'}</p></div></div><p className="font-bold text-[#222]">£{sp.amount.toFixed(2)}</p></div><div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between"><div className="flex items-center space-x-1.5 text-gray-400"><Calendar size={13}/><p className="text-[12px]">Date: <span className="font-bold text-[#222]">{new Date(sp.date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span></p></div><button onClick={()=>setScheduled(p=>p.filter(x=>x.id!==sp.id))} className="text-[12px] font-bold text-[#db0011]">Cancel</button></div></div>)))}
        </div>
      </div>
    );
  };

  /* ── PIN Screen ── */
  if(appState==='login'){
    const keys=['1','2','3','4','5','6','7','8','9','','0','del'];
    const letters=['','ABC','DEF','GHI','JKL','MNO','PQRS','TUV','WXYZ','','',''];
    return(
      <div className="flex justify-center items-start sm:items-center min-h-screen bg-[#e5e5e5] sm:p-8 font-sans">
        <div className="w-full sm:max-w-[400px] h-screen sm:h-[850px] sm:max-h-[90vh] bg-[#db0011] sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden flex flex-col relative sm:border-[12px] sm:border-[#222]">
          <div className="hidden sm:block absolute top-0 inset-x-0 h-6 bg-[#222] rounded-b-3xl w-40 mx-auto z-50"/>

          {/* ── Face ID scanning overlay ── */}
          {faceIdPhase==='scanning'&&(
            <div className="absolute inset-0 z-40 bg-black flex flex-col items-center justify-center space-y-8 animate-fade-in">
              <HSBCLogoWhite/>
              <div className="relative w-[160px] h-[160px]">
                {/* Corner brackets — iOS Face ID style */}
                {[['top-0 left-0','border-t-4 border-l-4 rounded-tl-2xl'],['top-0 right-0','border-t-4 border-r-4 rounded-tr-2xl'],['bottom-0 left-0','border-b-4 border-l-4 rounded-bl-2xl'],['bottom-0 right-0','border-b-4 border-r-4 rounded-br-2xl']].map(([pos,brd],i)=>(
                  <div key={i} className={`absolute ${pos} w-10 h-10 border-white ${brd}`}/>
                ))}
                {/* Animated scan line */}
                <div className="absolute left-3 right-3 h-[2px] bg-white/70 rounded-full animate-faceid-scan" style={{top:'50%'}}/>
                {/* Face outline dots */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="90" height="110" viewBox="0 0 90 110" fill="none">
                    <ellipse cx="45" cy="55" rx="34" ry="42" stroke="white" strokeWidth="1.5" strokeOpacity="0.35"/>
                    <circle cx="29" cy="44" r="4" fill="white" fillOpacity="0.5"/>
                    <circle cx="61" cy="44" r="4" fill="white" fillOpacity="0.5"/>
                    <path d="M33 68 Q45 78 57 68" stroke="white" strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round" fill="none"/>
                    <line x1="45" y1="52" x2="45" y2="62" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <p className="text-white text-[17px] font-semibold">Face ID</p>
                <p className="text-white/60 text-[13px] mt-1">Scanning…</p>
              </div>
            </div>
          )}
          <div className="flex flex-col items-center justify-center flex-1 pt-16 pb-4">
            <HSBCLogoWhite/>
            <p className="text-white/80 text-[13px] font-semibold mt-2 tracking-widest uppercase">Mobile Banking</p>
            <div className="mt-14 mb-3 text-center"><p className="text-white text-[17px] font-semibold">Good {new Date().getHours()<12?'morning':new Date().getHours()<18?'afternoon':'evening'}, Alex</p><p className="text-white/70 text-[13px] mt-1">Enter your PIN to continue</p></div>
            <div className={`flex space-x-5 mt-6 ${pinShake?'animate-shake':''}`}>{[0,1,2,3].map(i=>(<div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${pin.length>i?'bg-white border-white':'bg-transparent border-white/60'}`}/>))}</div>
            {pinError&&<p className="text-white/90 text-[13px] mt-3 bg-white/20 px-4 py-1.5 rounded-full">Incorrect PIN. Please try again.</p>}
            <p className="text-white/40 text-[11px] mt-2">Hint: 1234</p>
          </div>
          <div className="px-8 pb-12 pt-2">
            <div className="grid grid-cols-3 gap-3">
              {keys.map((k,i)=>{
                if(k==='') return <div key={i}/>;
                if(k==='del') return(<button key={i} onClick={()=>setPin(p=>p.slice(0,-1))} className="h-16 flex items-center justify-center text-white active:opacity-60"><Delete size={26} strokeWidth={1.5}/></button>);
                return(<button key={i} onClick={()=>pressPin(k)} className="h-16 rounded-2xl bg-white/15 active:bg-white/30 transition-colors flex flex-col items-center justify-center text-white"><span className="text-[24px] font-light leading-none">{k}</span><span className="text-[8px] tracking-widest text-white/50 mt-0.5">{letters[i]}</span></button>);
              })}
            </div>
            <button className="w-full mt-5 text-white/60 text-[13px] text-center">Forgotten your PIN?</button>
          </div>
          <style dangerouslySetInnerHTML={{__html:`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-8px)}80%{transform:translateX(4px)}}.animate-shake{animation:shake 0.5s ease-in-out}`}}/>
        </div>
      </div>
    );
  }

  /* ══════════════ MAIN APP ══════════════ */
  return(
    <div className="flex justify-center items-start sm:items-center min-h-screen bg-[#e5e5e5] sm:p-8 font-sans">
      <div className="w-full sm:max-w-[400px] h-screen sm:h-[850px] sm:max-h-[90vh] bg-[#f8f8f8] sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden flex flex-col relative sm:border-[12px] sm:border-[#222]">
        <div className="hidden sm:block absolute top-0 inset-x-0 h-6 bg-[#222] rounded-b-3xl w-40 mx-auto z-50"/>
        {showSO&&<SOScreen/>}

        {/* Notifications */}
        {showNotifs&&(<div className="absolute inset-0 z-[100] flex flex-col"><div className="absolute inset-0 bg-black/40" onClick={()=>setShowNotifs(false)}/><div className="relative mt-20 mx-3 bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in max-h-[75%] flex flex-col"><div className="flex items-center justify-between px-5 py-4 border-b border-gray-100"><h2 className="font-bold text-[#222] text-[17px]">Notifications</h2><button onClick={()=>{setShowNotifs(false);setReadIds(notifs.map(n=>n.id));}} className="text-[13px] font-bold text-[#db0011]">Mark all read</button></div><div className="overflow-y-auto hide-scrollbar">{notifs.map(n=>(<div key={n.id} onClick={()=>setReadIds(p=>[...new Set([...p,n.id])])} className={`flex items-start space-x-3 px-5 py-4 border-b border-gray-50 cursor-pointer ${!readIds.includes(n.id)?'bg-[#fff5f5]':'bg-white'}`}><div className="shrink-0 mt-0.5"><TxIcon type={n.iconType} desc={n.desc}/></div><div className="flex-1 min-w-0"><div className="flex items-center justify-between"><p className="font-bold text-[#222] text-[14px]">{n.title}</p>{!readIds.includes(n.id)&&<div className="w-2 h-2 rounded-full bg-[#db0011] ml-2 shrink-0"/>}</div><p className="text-[13px] text-gray-600 mt-0.5">{n.body}</p><p className="text-[11px] text-gray-400 mt-1">{n.time}</p></div></div>))}</div></div></div>)}

        {/* Profile */}
        {showProfile&&(<div className="absolute inset-0 z-[90] bg-[#f8f8f8] flex flex-col animate-fade-in"><div className="flex items-center justify-between px-5 pt-14 pb-4 bg-white border-b border-gray-100"><button onClick={()=>setShowProfile(false)} className="p-2 -ml-2"><ChevronLeft size={26} strokeWidth={2.5} className="text-[#222]"/></button><h1 className="font-bold text-[#222] text-[17px]">Profile & Settings</h1><div className="w-10"/></div><div className="flex-1 overflow-y-auto hide-scrollbar pb-10"><div className="bg-white px-6 py-6 flex items-center space-x-4 border-b border-gray-100"><div className="w-16 h-16 rounded-full bg-[#db0011] flex items-center justify-center text-white text-[22px] font-bold">AC</div><div><p className="font-bold text-[#222] text-[18px]">Alex Chan</p><p className="text-[13px] text-gray-500 mt-0.5">Personal Banking Customer</p><p className="text-[12px] text-[#db0011] font-bold mt-1">Premier Account</p></div></div><div className="mx-4 mt-5 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"><p className="px-5 pt-4 pb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Account Details</p>{[{l:'Sort code',v:'40-47-59'},{l:'Account number',v:'12345678'},{l:'Customer number',v:'••••••91'},{l:'Email',v:'a.chan@email.com'}].map((r,i,a)=>(<div key={r.l} className={`flex justify-between items-center px-5 py-3.5 ${i<a.length-1?'border-b border-gray-100':''}`}><span className="text-[14px] text-gray-500">{r.l}</span><span className="text-[14px] font-bold text-[#222]">{r.v}</span></div>))}</div><div className="mx-4 mt-5 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"><p className="px-5 pt-4 pb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Security & Preferences</p>{[{l:'Transaction notifications',s:'Get alerts for every payment',v:notifOn,fn:setNotifOn},{l:'Face ID / Fingerprint',s:'Log in using biometrics',v:faceIdOn,fn:setFaceIdOn},{l:'Marketing preferences',s:'Receive offers and updates',v:marketingOn,fn:setMarketingOn}].map((r,i,a)=>(<div key={r.l} className={`flex items-center justify-between px-5 py-3.5 ${i<a.length-1?'border-b border-gray-100':''}`}><div><p className="text-[14px] font-bold text-[#222]">{r.l}</p><p className="text-[12px] text-gray-400 mt-0.5">{r.s}</p></div><button onClick={()=>r.fn(!r.v)} className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${r.v?'bg-[#db0011]':'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${r.v?'translate-x-7':'translate-x-1'}`}/></button></div>))}</div><div className="mx-4 mt-5 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"><p className="px-5 pt-4 pb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Security</p>{[{icon:<Lock size={18} className="text-[#db0011]"/>,l:'Change PIN'},{icon:<Smartphone size={18} className="text-[#db0011]"/>,l:'Manage devices'},{icon:<Shield size={18} className="text-[#db0011]"/>,l:'Security centre'}].map((r,i,a)=>(<div key={r.l} className={`flex items-center justify-between px-5 py-4 cursor-pointer active:bg-gray-50 ${i<a.length-1?'border-b border-gray-100':''}`}><div className="flex items-center space-x-3"><div className="w-8 h-8 rounded-full bg-[#fff0f0] flex items-center justify-center">{r.icon}</div><span className="text-[14px] font-bold text-[#222]">{r.l}</span></div><ChevronRight size={18} className="text-gray-300"/></div>))}</div><div className="mx-4 mt-5"><button onClick={()=>{setShowProfile(false);setAppState('login');setPin('');}} className="w-full bg-white border border-gray-200 rounded-2xl py-4 flex items-center justify-center space-x-2 shadow-sm active:bg-gray-50"><LogOut size={18} className="text-[#db0011]"/><span className="text-[15px] font-bold text-[#db0011]">Log out</span></button></div><div className="mx-4 mt-3 mb-6"><button onClick={()=>{if(window.confirm('Reset all app data to defaults?')){['hsbc_accounts','hsbc_transactions','hsbc_readNotifIds'].forEach(k=>localStorage.removeItem(k));window.location.reload();}}} className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 flex items-center justify-center active:bg-gray-50"><span className="text-[13px] text-gray-400 font-medium">Reset app data</span></button></div></div></div>)}

        <main className="flex-1 overflow-y-auto hide-scrollbar relative pb-20 flex flex-col bg-[#f8f8f8]">

          {/* ══ ACCOUNTS ══ */}
          {activeNav==='accounts'&&(
            <div className="animate-fade-in flex-1">
              {selectedTx?(<TxDetail tx={selectedTx} onBack={()=>setSelectedTx(null)}/>)
              :selectedAccountId&&selectedAccount?(<AccountInfoScreen acc={selectedAccount} onBack={()=>{setSelectedAccountId(null);setTxSearch('');setShowTxSearch(false);}}/>)
              :activeTopTab==='Cards'?(
                <div className="animate-fade-in bg-[#f8f8f8] min-h-full pb-10">
                  <header className="flex items-center justify-between px-6 pt-14 pb-3 bg-[#f8f8f8]">
                    <div className="flex items-center"><button onClick={()=>setActiveTopTab('Home')} className="mr-3"><Home size={24} className="text-[#222]" strokeWidth={2.5}/></button><div className="w-px h-5 bg-gray-300 mr-4 opacity-50"/><div className="flex space-x-5 text-[15px] font-bold text-gray-500"><button onClick={()=>{setActiveNav('pay');setPayView('menu');}}>Pay</button><button className="relative text-[#222]">Cards<div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#db0011]"/></button><button>Invest</button></div></div>
                    <div className="flex items-center space-x-3"><button onClick={()=>setShowNotifs(true)} className="relative text-[#222]"><Bell size={22} strokeWidth={2}/>{unread>0&&<span className="absolute -top-1 -right-1 w-4 h-4 bg-[#db0011] rounded-full text-white text-[9px] font-bold flex items-center justify-center">{unread}</span>}</button><button onClick={()=>setShowProfile(true)} className="text-[#222]"><Menu size={26} strokeWidth={2}/></button></div>
                  </header>
                  <div className="mt-4 text-center">
                    <h2 className="text-[14px] font-bold text-[#222]">Rewards Credit Card</h2>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide mt-0.5">CHAN</p>
                    <div className="mt-4 relative flex items-center overflow-hidden w-full pl-6 pr-2">
                      <div className="w-[88%] shrink-0 h-[190px] rounded-2xl relative overflow-hidden shadow-xl transition-all duration-500" style={{background:cardFrozen?'linear-gradient(135deg,#4a0000 0%,#200000 100%)':'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)'}}>
                        <div className="absolute inset-0 opacity-20"><svg width="100%" height="100%"><polygon points="50,0 150,100 50,200 -50,100" fill="white"/><polygon points="250,0 350,100 250,200 150,100" fill="white"/></svg></div>
                        {cardFrozen&&<div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center pointer-events-none"><SnowflakeSVG size={40} className="text-white/90 mb-1"/><span className="text-white text-[14px] font-bold">Frozen</span></div>}
                        <div className="absolute inset-0 flex flex-col justify-between p-4 z-20">
                          <div className="flex justify-between items-start"><div className="flex items-center space-x-1.5"><HSBCLogoSmall/><span className="text-white text-[12px] font-bold">HSBC UK</span></div><span className="text-white/80 text-[10px] font-semibold">Rewards Credit</span></div>
                          {!cardFrozen&&<div className="flex flex-col items-start pl-1 mb-2"><div className="w-8 h-6 bg-yellow-300 rounded-sm opacity-90 mb-2"/><p className="text-white/70 text-[11px] font-mono tracking-widest">•••• •••• •••• 5432</p><p className="text-white/60 text-[10px] mt-1">ALEX CHAN</p></div>}
                          <div className="flex justify-end"><div className="w-8 h-8 rounded-full bg-[#eb001b] opacity-90"/><div className="w-8 h-8 rounded-full bg-[#f79e1b] -ml-4 opacity-90"/></div>
                        </div>
                      </div>
                      <div className="w-[15%] shrink-0 h-[170px] bg-gray-300 rounded-l-2xl ml-4 flex items-center opacity-60 relative"><div className="absolute left-2 top-4"><HSBCLogoSmall/></div></div>
                    </div>
                    <div className="flex justify-center items-center space-x-3 mt-4"><ChevronLeft size={16} className="text-gray-300"/><div className="w-4 h-1.5 rounded-full bg-[#222]"/><div className="w-1.5 h-1.5 rounded-full bg-gray-300"/><ChevronRight size={16} className="text-[#222]"/></div>
                  </div>
                  <div className="px-6 mt-5"><div className="flex justify-between items-end mb-2"><div><p className="text-[12px] font-bold text-[#222]">Current balance</p><div>{fmtBalance(creditAcc.balance)}</div></div><div className="text-right"><p className="text-[12px] font-bold text-[#222]">Available credit</p><div><span className="text-[13px] font-bold">£</span><span className="text-xl font-bold">{parseInt(availCredit).toLocaleString('en-GB')}</span><span className="text-[13px] font-bold">.{availCredit.toFixed(2).split('.')[1]}</span></div></div></div><div className="w-full h-1.5 bg-gray-300 rounded-full mt-2 overflow-hidden"><div className="h-full bg-[#005EB8] transition-all" style={{width:`${creditPct}%`}}/></div><div className="flex justify-between items-center mt-2"><p className={`text-[11px] font-semibold ${cardFrozen?'text-blue-500':'text-[#00a651]'}`}>{cardFrozen?'🔒 Card is frozen':'✓ Card is active'}</p><p className="text-[11px] text-[#222] font-bold">Limit £{creditAcc.creditLimit?.toLocaleString('en-GB')}.00</p></div></div>
                  <div className="flex justify-between px-6 mt-7">
                    <button className="flex flex-col items-center w-20"><div className="w-12 h-12 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center mb-2 relative text-[#db0011]"><CreditCardIcon size={20}/><ArrowRightLeft size={12} className="absolute bottom-2 right-2 bg-white rounded-full p-[1px]"/></div><span className="text-[10px] text-[#222] font-bold text-center leading-tight">Balance and<br/>money transfers</span></button>
                    <button className="flex flex-col items-center w-20"><div className="w-12 h-12 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center mb-2 text-[#db0011]"><Layers size={20}/></div><span className="text-[10px] text-[#222] font-bold text-center leading-tight">Instalment<br/>plans</span></button>
                    <button onClick={()=>setCardFrozen(!cardFrozen)} className="flex flex-col items-center w-20"><div className={`w-12 h-12 rounded-full border shadow-sm flex items-center justify-center mb-2 relative transition-all duration-300 ${cardFrozen?'bg-[#db0011] border-[#db0011] text-white':'bg-white border-gray-200 text-[#db0011]'}`}><CreditCardIcon size={20}/>{!cardFrozen&&<div className="absolute top-2 right-2 bg-white rounded-full p-[2px]"><SnowflakeSVG size={10} className="text-[#db0011]"/></div>}</div><span className="text-[10px] text-[#222] font-bold text-center leading-tight">{cardFrozen?'Unfreeze\ncard':'Freeze\ncard'}</span></button>
                    <button className="flex flex-col items-center w-16"><div className="w-12 h-12 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center mb-2 text-[#222]"><MoreHorizontal size={20}/></div><span className="text-[10px] text-[#222] font-bold text-center leading-tight">More</span></button>
                  </div>
                  <div className={`mx-6 mt-5 rounded-2xl px-5 py-4 flex items-start space-x-3 ${cardFrozen?'bg-blue-50 border border-blue-100':'bg-green-50 border border-green-100'}`}>{cardFrozen?<SnowflakeSVG size={20} className="text-blue-400 shrink-0 mt-0.5"/>:<CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5"/>}<div><p className="font-bold text-[#222] text-[13px]">{cardFrozen?'Your card is frozen':'Your card is active'}</p><p className="text-[12px] text-gray-500 mt-0.5">{cardFrozen?'All payments are blocked. Tap "Unfreeze card" to enable spending.':'Your card is ready to use for payments and withdrawals.'}</p></div></div>
                  <div className="px-6 mt-6"><div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 relative overflow-hidden"><h3 className="flex items-center text-[#222] font-bold text-[14px] mb-4"><FileText size={18} className="text-[#db0011] mr-2"/>Credit card statement</h3><div className="flex justify-between items-end pb-2"><div><p className="text-[11px] text-gray-500 font-bold mb-0.5">Due date</p><p className="text-[16px] font-bold text-[#222]">1 Apr</p></div><div className="text-right"><p className="text-[11px] text-gray-500 font-bold mb-0.5">Statement balance</p><p className="text-[16px] font-bold text-[#222]">£500.00</p></div></div><div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-100 to-transparent"/></div></div>
                </div>
              ):(
                <>
                  <div className="relative h-[300px] bg-cover bg-center" style={{backgroundImage:'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80")'}}>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-transparent to-black/80"/>
                    <TopNav/>
                    <div className="absolute bottom-6 left-0 w-full flex justify-center space-x-3 px-4 z-10">
                      {[{icon:<User size={22} className="text-[#db0011]" strokeWidth={2.5}/>,badge:'↑',label:'Pay someone\nin the UK',action:()=>{setActiveNav('pay');setPayView('step1');}},{icon:<ArrowRightLeft size={20} className="text-[#db0011]" strokeWidth={2.5}/>,badge:'→',label:'Transfer\nbetween...',action:()=>{setActiveNav('pay');setPayView('transfer');}},{icon:<FileText size={20} className="text-[#db0011]" strokeWidth={2.5}/>,badge:'£',label:'Pay a bill or\ncompany',action:()=>{}},{icon:<Plus size={26} className="text-[#222]" strokeWidth={2}/>,badge:null,label:'Edit',action:()=>{}}].map((b,i)=>(
                        <button key={i} onClick={b.action} className="flex flex-col items-center w-[75px]"><div className="w-[56px] h-[56px] bg-white rounded-full shadow-lg flex items-center justify-center relative mb-2">{b.icon}{b.badge&&<div className="absolute top-0 right-0 w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center shadow-sm"><div className="w-3.5 h-3.5 bg-[#db0011] rounded-full text-white flex items-center justify-center text-[8px] font-bold">{b.badge}</div></div>}</div><span className="text-[10px] text-white font-medium text-center leading-tight tracking-wide drop-shadow-md">{b.label}</span></button>
                      ))}
                    </div>
                  </div>
                  <div className="px-5 pt-6 pb-2 bg-[#f8f8f8]"><div className="flex justify-between items-center mb-3 px-1"><h2 className="text-[18px] font-semibold text-[#222]">Your products</h2><button onClick={()=>setShowBalances(!showBalances)} className="p-1"><Eye size={20} className="text-[#222]"/></button></div><div className="space-y-3">{accounts.map(acc=>(<div key={acc.id} onClick={()=>setSelectedAccountId(acc.id)} className="bg-white p-5 rounded-lg shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col cursor-pointer active:bg-gray-50 transition-colors"><div className="flex justify-between items-start mb-4"><HSBCLogo/><div className="flex space-x-3 text-gray-500"><Star size={20}/><MoreVertical size={20}/></div></div><div><h3 className="font-bold text-[#222] text-[15px]">{acc.name}</h3><p className="text-[13px] text-gray-500 mt-0.5">{acc.details}</p></div><div className="flex justify-end mt-2">{showBalances?fmtBalance(acc.balance):<span className="text-xl font-bold mt-1">***.**</span>}</div></div>))}</div></div>
                  <div className="px-5 pt-4 pb-8"><button onClick={()=>setShowSO(true)} className="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between active:bg-gray-50"><div className="flex items-center space-x-3"><div className="w-10 h-10 rounded-full bg-[#fff0f0] flex items-center justify-center"><Repeat size={18} className="text-[#db0011]"/></div><div className="text-left"><p className="font-bold text-[#222] text-[14px]">Standing orders & Direct debits</p><p className="text-[12px] text-gray-400 mt-0.5">{STANDING_ORDERS.length} standing orders · {DIRECT_DEBITS.length} direct debits</p></div></div><ChevronRight size={18} className="text-gray-300"/></button></div>
                </>
              )}
            </div>
          )}

          {/* ══ PAY & TRANSFER ══ */}
          {activeNav==='pay'&&(
            <div className="animate-fade-in bg-white min-h-full flex flex-col">
              {paySuccess&&(<div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#f8f8f8]"><CheckCircle2 size={64} className="text-green-600 mb-6" strokeWidth={1.5}/><h2 className="text-2xl font-bold text-[#222] mb-3">Payment Complete</h2><p className="text-gray-600">£{parseFloat(payAmount||0).toFixed(2)} sent to <strong>{payeeName}</strong>.</p></div>)}
              {schedSuccess&&(<div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#f8f8f8]"><Calendar size={64} className="text-[#db0011] mb-6" strokeWidth={1.5}/><h2 className="text-2xl font-bold text-[#222] mb-3">Payment Scheduled</h2><p className="text-gray-600">£{parseFloat(payAmount||0).toFixed(2)} to <strong>{payeeName}</strong> on <strong>{payDate&&new Date(payDate).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</strong>.</p></div>)}
              {xferSuccess&&(<div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#f8f8f8]"><CheckCircle2 size={64} className="text-green-600 mb-6" strokeWidth={1.5}/><h2 className="text-2xl font-bold text-[#222] mb-3">Transfer Complete</h2><p className="text-gray-600">£{parsedXfer.toFixed(2)} moved from <strong>{fromAcc?.name}</strong> to <strong>{toAcc?.name}</strong>.</p></div>)}

              {/* STEP 1 */}
              {!paySuccess&&!schedSuccess&&!xferSuccess&&payView==='step1'&&(
                <>
                  <header className="flex items-center px-5 pt-12 pb-4 bg-white border-b border-gray-100 sticky top-0 z-40">
                    <button onClick={()=>setPayView('menu')} className="p-2 -ml-2 text-[#222]"><ChevronLeft size={26} strokeWidth={2.5}/></button>
                    <h1 className="font-bold text-[#222] text-[17px] ml-2">Payment details</h1>
                  </header>
                  <div className="flex-1 overflow-y-auto hide-scrollbar pb-32 px-5 pt-6 space-y-6">
                    <div>
                      <label className="block text-[15px] font-semibold text-[#222] mb-2">Amount</label>
                      <div className="border border-gray-300 rounded-lg flex items-center px-4 py-3.5 focus-within:border-[#222] transition-colors bg-white">
                        <span className="text-[17px] font-semibold text-gray-400 mr-2">£</span>
                        <input type="number" step="0.01" placeholder="Enter amount" className="flex-1 text-[17px] font-semibold text-[#222] focus:outline-none bg-transparent placeholder-gray-400" value={payAmount} onChange={e=>setPayAmount(e.target.value)}/>
                        <HelpCircle size={20} className="text-gray-400 shrink-0 ml-2"/>
                      </div>
                      <p className="text-[13px] text-gray-500 mt-2 ml-1">Available balance: <span className={`font-semibold ${parsedPayAmt>0&&availAfterPay<0?'text-[#db0011]':'text-[#222]'}`}>{parsedPayAmt>0?fmtSigned(availAfterPay):fmtPlain(currentAccBal)}</span></p>
                      {parsedPayAmt===0&&(<div className="flex items-center space-x-2 mt-2"><div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center shrink-0"><span className="text-white text-[11px] font-bold">!</span></div><p className="text-[13px] text-gray-600">Minimum amount £0.01</p></div>)}
                      {parsedPayAmt>0&&availAfterPay<0&&(<div className="flex items-center space-x-2 mt-2"><div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shrink-0"><span className="text-white text-[11px] font-bold">!</span></div><p className="text-[13px] text-[#db0011] font-semibold">Insufficient funds</p></div>)}
                    </div>
                    <div>
                      <label className="block text-[15px] font-semibold text-[#222] mb-2">Reason for payment</label>
                      <div className="relative">
                        <button type="button" onClick={()=>setShowReasonDrop(!showReasonDrop)} className="w-full border border-gray-300 rounded-lg flex items-center justify-between px-4 py-3.5 bg-white text-left">
                          <span className="text-[16px] font-semibold text-[#222]">{payReason}</span>
                          <ChevronDown size={20} className={`text-gray-500 transition-transform ${showReasonDrop?'rotate-180':''}`}/>
                        </button>
                        {showReasonDrop&&(<div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden mt-1">{REASON_OPTIONS.map(opt=>(<button key={opt} onClick={()=>{setPayReason(opt);setShowReasonDrop(false);}} className={`w-full text-left px-4 py-3.5 text-[15px] border-b border-gray-50 last:border-0 transition-colors ${payReason===opt?'bg-[#fff5f5] font-bold text-[#db0011]':'text-[#222] hover:bg-gray-50'}`}>{opt}</button>))}</div>)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[15px] font-semibold text-[#222] mb-2">Reference</label>
                      <div className="border border-gray-300 rounded-lg bg-white focus-within:border-[#222] transition-colors"><input type="text" maxLength={18} className="w-full px-4 py-3.5 text-[16px] font-semibold text-[#222] focus:outline-none bg-transparent rounded-lg" value={payRef} onChange={e=>setPayRef(e.target.value)}/></div>
                      <p className="text-[12px] text-gray-400 text-right mt-1 mr-1">{payRef.length}/18</p>
                    </div>
                    <div className="border-t border-gray-100 pt-5">
                      <div className="flex items-center justify-between">
                        <span className="text-[15px] font-semibold text-[#222]">Create standing order?</span>
                        <button type="button" onClick={()=>setCreateSO(!createSO)} style={{width:'52px',height:'28px'}} className={`rounded-full transition-colors relative shrink-0 ${createSO?'bg-[#db0011]':'bg-gray-300'}`}><div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${createSO?'translate-x-6':'translate-x-1'}`}/></button>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-5">
                      <label className="block text-[15px] font-semibold text-[#222] mb-2">Payment date</label>
                      <div className="border border-gray-300 rounded-lg flex items-center justify-between px-4 py-3.5 bg-white cursor-pointer" onClick={()=>setPayDateNow(!payDateNow)}>
                        <span className="text-[16px] font-semibold text-[#222]">{payDateNow?'Now':payDate?new Date(payDate).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'Select date'}</span>
                        <Calendar size={20} className="text-gray-500"/>
                      </div>
                      {!payDateNow&&(<input type="date" min={new Date(Date.now()+86400000).toISOString().split('T')[0]} className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 text-[15px] text-[#222] focus:outline-none focus:border-[#222] bg-white" value={payDate} onChange={e=>setPayDate(e.target.value)}/>)}
                    </div>
                  </div>
                  <div className="absolute bottom-20 left-0 right-0 px-5 pb-4 bg-white border-t border-gray-100">
                    <button onClick={()=>{if(parsedPayAmt>0&&availAfterPay>=0)setPayView('step2');}} disabled={!parsedPayAmt||parsedPayAmt<=0||availAfterPay<0} className="w-full py-4 rounded-lg font-bold text-[16px] transition-all disabled:bg-gray-200 disabled:text-gray-400 bg-[#222] text-white">Continue</button>
                  </div>
                </>
              )}

              {/* STEP 2 */}
              {!paySuccess&&!schedSuccess&&!xferSuccess&&payView==='step2'&&(
                <>
                  <header className="flex items-center justify-between px-5 pt-12 pb-4 bg-white border-b border-gray-100 sticky top-0 z-40">
                    <button onClick={()=>setPayView('step1')} className="p-2 -ml-2 text-[#222]"><ChevronLeft size={26} strokeWidth={2.5}/></button>
                    <h1 className="font-bold text-[#222] text-[17px]">Payee's bank details</h1>
                    <button className="p-2 text-[#222]"><MoreHorizontal size={22}/></button>
                  </header>
                  <div className="flex-1 overflow-y-auto hide-scrollbar pb-32 px-5 pt-6 space-y-6">
                    <div>
                      <label className="block text-[15px] font-semibold text-[#222] mb-2">Payee full name</label>
                      <div className="border border-gray-300 rounded-lg bg-white focus-within:border-[#222] transition-colors"><input type="text" maxLength={138} placeholder="Enter payee full name" className="w-full px-4 py-3.5 text-[16px] text-[#222] focus:outline-none bg-transparent placeholder-gray-400 font-medium" value={payeeName} onChange={e=>setPayeeName(e.target.value)}/></div>
                      <p className="text-[12px] text-gray-400 text-right mt-1 mr-1">{payeeName.length}/138</p>
                    </div>
                    <div>
                      <label className="block text-[15px] font-semibold text-[#222] mb-2">Sort code</label>
                      <div className="border border-gray-300 rounded-lg bg-white focus-within:border-[#222] transition-colors"><input type="text" placeholder="Enter 6 digit sort code" className="w-full px-4 py-3.5 text-[16px] text-[#222] focus:outline-none bg-transparent placeholder-gray-400 font-medium font-mono" value={sortCode} onChange={handleSortCode}/></div>
                    </div>
                    <div>
                      <label className="block text-[15px] font-semibold text-[#222] mb-2">Account number</label>
                      <div className="border border-gray-300 rounded-lg bg-white focus-within:border-[#222] transition-colors"><input type="text" placeholder="Enter 8 digit account number" className="w-full px-4 py-3.5 text-[16px] text-[#222] focus:outline-none bg-transparent placeholder-gray-400 font-medium font-mono" value={accountNum} onChange={handleAccNum}/></div>
                    </div>
                    <div className="border-t border-gray-100 pt-5">
                      <div className="flex items-start justify-between">
                        <div><p className="text-[15px] font-semibold text-[#222]">Payee account type</p><p className="text-[13px] text-gray-400 mt-1">Is this transfer going to a business account?</p></div>
                        <button type="button" onClick={()=>setIsBusiness(!isBusiness)} style={{width:'52px',height:'28px'}} className={`rounded-full transition-colors relative shrink-0 ml-4 mt-1 ${isBusiness?'bg-[#db0011]':'bg-gray-300'}`}><div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${isBusiness?'translate-x-6':'translate-x-1'}`}/></button>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-5">
                      <label className="block text-[15px] font-semibold text-[#222] mb-2">Save payee as</label>
                      <div className="border border-gray-300 rounded-lg bg-white focus-within:border-[#222] transition-colors"><textarea maxLength={18} placeholder="The payee will appear with this name in your payees list" className="w-full px-4 py-3.5 text-[15px] text-[#222] focus:outline-none bg-transparent placeholder-gray-400 resize-none" rows={3} value={savePayeeAs} onChange={e=>setSavePayeeAs(e.target.value)}/></div>
                      <p className="text-[12px] text-gray-400 text-right mt-1 mr-1">{savePayeeAs.length}/18</p>
                    </div>
                    <div>
                      <label className="block text-[15px] font-semibold text-[#222] mb-2">Reference</label>
                      <div className="border border-gray-300 rounded-lg bg-white focus-within:border-[#222] transition-colors"><input type="text" placeholder="Enter reference" className="w-full px-4 py-3.5 text-[16px] text-[#222] focus:outline-none bg-transparent placeholder-gray-400 font-medium" value={step2Ref||payRef} onChange={e=>setStep2Ref(e.target.value)}/></div>
                    </div>
                    {payError&&<div className="text-[#db0011] text-[14px] font-bold text-center py-2">{payError}</div>}
                  </div>
                  <div className="absolute bottom-20 left-0 right-0 px-5 pb-4 bg-white border-t border-gray-100">
                    <button onClick={submitPay} disabled={!payeeName.trim()||sortCode.length!==8||accountNum.length!==8} className="w-full py-4 rounded-lg font-bold text-[16px] transition-all disabled:bg-gray-200 disabled:text-gray-400 bg-[#222] text-white">{!payDateNow?'Schedule payment':'Check payee details'}</button>
                  </div>
                </>
              )}

              {/* TRANSFER */}
              {!paySuccess&&!schedSuccess&&!xferSuccess&&payView==='transfer'&&(
                <>
                  <header className="flex items-center px-5 pt-12 pb-4 bg-white border-b border-gray-100 sticky top-0 z-40"><button onClick={()=>setPayView('menu')} className="p-2 -ml-2 text-[#222]"><ChevronLeft size={26} strokeWidth={2.5}/></button><h1 className="font-bold text-[#222] text-[17px] ml-2">Between your accounts</h1></header>
                  <div className="p-6 bg-white flex-1"><form onSubmit={submitXfer} className="space-y-5">
                    <div><label className="block text-[13px] font-bold text-gray-700 mb-2">From</label><div className="space-y-2">{accounts.map(acc=>(<button type="button" key={acc.id} onClick={()=>setFromId(acc.id)} className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${fromId===acc.id?'border-[#db0011] bg-[#fff5f5]':'border-gray-200 bg-white'}`}><div className="text-left"><p className="font-bold text-[#222] text-[14px]">{acc.name}</p><p className="text-[12px] text-gray-400">{acc.details}</p></div><p className={`font-bold text-[14px] ${fromId===acc.id?'text-[#db0011]':'text-[#222]'}`}>£{acc.balance.toLocaleString('en-GB',{minimumFractionDigits:2})}</p></button>))}</div></div>
                    <div><label className="block text-[13px] font-bold text-gray-700 mb-2">To</label><div className="space-y-2">{accounts.filter(a=>a.id!==fromId).map(acc=>(<button type="button" key={acc.id} onClick={()=>setToId(acc.id)} className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${toId===acc.id?'border-[#db0011] bg-[#fff5f5]':'border-gray-200 bg-white'}`}><div className="text-left"><p className="font-bold text-[#222] text-[14px]">{acc.name}</p><p className="text-[12px] text-gray-400">{acc.details}</p></div><p className="font-bold text-[14px] text-[#222]">£{acc.balance.toLocaleString('en-GB',{minimumFractionDigits:2})}</p></button>))}</div></div>
                    <div><label className="block text-[13px] font-bold text-gray-700 mb-1">Amount (£)</label><div className="relative"><span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#222] font-bold text-xl">£</span><input type="number" step="0.01" className="w-full border-b-2 border-gray-300 py-2 pl-6 text-[#222] font-bold text-xl focus:outline-none focus:border-[#db0011] bg-transparent" value={xferAmount} onChange={e=>setXferAmount(e.target.value)}/></div>{parsedXfer>0&&<p className={`text-[12px] mt-2 ${xferAfter<0?'text-[#db0011]':'text-gray-500'}`}>Balance after: £{xferAfter.toLocaleString('en-GB',{minimumFractionDigits:2})}</p>}</div>
                    <div><label className="block text-[13px] font-bold text-gray-700 mb-1">Reference (optional)</label><input type="text" className="w-full border-b-2 border-gray-300 py-2 text-[#222] focus:outline-none focus:border-[#db0011] bg-transparent" value={xferRef} onChange={e=>setXferRef(e.target.value)}/></div>
                    {xferError&&<div className="text-[#db0011] text-sm font-bold text-center">{xferError}</div>}
                    <div className="pt-4 pb-10"><button type="submit" disabled={!xferAmount||xferAfter<0} className="w-full bg-[#db0011] disabled:bg-gray-300 text-white font-bold py-4 rounded-full">Transfer now</button></div>
                  </form></div>
                </>
              )}

              {/* MENU */}
              {!paySuccess&&!schedSuccess&&!xferSuccess&&payView==='menu'&&(
                <>
                  <header className="flex items-center justify-center px-6 pt-12 pb-4 bg-white border-b border-gray-100 sticky top-0 z-40"><h1 className="font-bold text-[#222] text-lg">Pay & Transfer</h1></header>
                  <div className="p-6 bg-[#f8f8f8] flex-1">
                    <h2 className="text-lg font-bold text-[#222] mb-4">Recent payees</h2>
                    <div className="flex space-x-6 overflow-x-auto pb-6 hide-scrollbar">{['Jane Doe','Rita Cantasora','Mac Ui Rudai','John Smith'].map((name,i)=>{const ini=name.split(' ').map(n=>n[0]).join('');return(<div key={i} className="flex flex-col items-center flex-shrink-0 cursor-pointer"><div className="w-14 h-14 bg-[#333] text-white rounded-full flex items-center justify-center font-semibold text-lg mb-2">{ini}</div><p className="text-[11px] text-center w-16 text-gray-700 leading-tight">{name}</p></div>);})}</div>
                    <h2 className="text-lg font-bold text-[#222] mt-2 mb-4">Send money</h2>
                    <div className="grid grid-cols-2 gap-3">{[{icon:<ArrowRightLeft size={24} className="text-[#db0011] mb-2"/>,label:'Transfer between your accounts',action:()=>setPayView('transfer')},{icon:<User size={24} className="text-[#db0011] mb-2"/>,label:'Pay someone in the UK',action:()=>setPayView('step1')},{icon:<FileText size={24} className="text-[#db0011] mb-2"/>,label:'Pay a bill or company',action:()=>{}},{icon:<Globe size={24} className="text-[#db0011] mb-2"/>,label:'International payments',action:()=>{}}].map((b,i)=>(<button key={i} onClick={b.action} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm text-center h-28 active:bg-gray-50">{b.icon}<span className="text-[12px] font-semibold text-[#222]">{b.label}</span></button>))}</div>
                    {scheduled.length>0&&(<div className="mt-6"><div className="flex items-center justify-between mb-3"><h2 className="text-[16px] font-bold text-[#222]">Scheduled</h2><button onClick={()=>setShowSO(true)} className="text-[12px] font-bold text-[#db0011]">View all</button></div>{scheduled.slice(0,2).map(sp=>(<div key={sp.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between mb-2"><div className="flex items-center space-x-3"><div className="w-10 h-10 rounded-[10px] bg-[#f4f5f7] flex items-center justify-center font-bold text-[#334155]">{sp.payee[0]}</div><div><p className="font-bold text-[#222] text-[14px]">{sp.payee}</p><p className="text-[12px] text-gray-400">{new Date(sp.date).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</p></div></div><p className="font-bold text-[#222]">£{sp.amount.toFixed(2)}</p></div>))}</div>)}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══ PLAN ══ */}
          {activeNav==='plan'&&(<div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-[#f8f8f8] animate-fade-in flex-1"><BarChart2 size={48} className="mx-auto mb-4 opacity-50 text-[#db0011]"/><p className="font-semibold text-[#222]">Financial Planning tools coming soon</p></div>)}

          {/* ══ SUPPORT ══ */}
          {activeNav==='support'&&(
            <div className="animate-fade-in flex-1 flex flex-col h-full relative" style={{background:'#f8f8f8'}}>
              <div className="px-5 pt-14 pb-5 bg-[#db0011]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3"><div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><HSBCLogoSmall/></div><div><p className="font-bold text-white text-[17px]">Cora</p><p className="text-white/70 text-[12px]">AI Helper · Online</p></div></div>
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full"/>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-3 pb-4">
                <div className="text-center text-xs text-gray-400 my-2">Today</div>
                {chatMsgs.map(msg=>(
                  <div key={msg.id} className={`flex ${msg.sender==='user'?'justify-end':'justify-start'}`}>
                    {msg.sender==='bot'&&<div className="w-8 h-8 rounded-full bg-[#db0011] flex items-center justify-center mr-2 shrink-0 mt-1"><span className="text-white text-xs font-bold">C</span></div>}
                    <div className="max-w-[80%]">
                      {msg.type==='text'&&(<div className={`rounded-2xl px-4 py-3 shadow-sm ${msg.sender==='user'?'bg-[#db0011] text-white rounded-br-sm':'bg-white text-[#222] border border-gray-200 rounded-bl-sm'}`}><p className="text-[14px] leading-relaxed">{msg.text}</p><p className={`text-[10px] mt-1.5 text-right ${msg.sender==='user'?'text-white/60':'text-gray-400'}`}>{msg.time}</p></div>)}
                      {msg.type==='payment_card'&&(
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden rounded-bl-sm" style={{maxWidth:'280px'}}>
                          <div className="bg-[#db0011] px-4 py-3 flex items-center justify-between"><div className="flex items-center space-x-2"><CheckCircle2 size={16} className="text-white"/><p className="text-white font-bold text-[13px]">Payment Confirmed</p></div><p className="text-white/70 text-[10px]">{msg.time}</p></div>
                          <div className="px-4 py-4 space-y-2.5">
                            <div className="flex justify-between items-center"><p className="text-[12px] text-gray-500">Payee</p><p className="text-[13px] font-bold text-[#222]">{msg.card.payee}</p></div>
                            <div className="flex justify-between items-center"><p className="text-[12px] text-gray-500">Amount</p><p className="text-[14px] font-bold text-[#222]">£{msg.card.amount.toFixed(2)}</p></div>
                            <div className="flex justify-between items-center"><p className="text-[12px] text-gray-500">Sort code</p><p className="text-[13px] font-bold text-[#222] font-mono">{msg.card.sortCode}</p></div>
                            <div className="flex justify-between items-center"><p className="text-[12px] text-gray-500">Account no.</p><p className="text-[13px] font-bold text-[#222] font-mono">{msg.card.accountNum}</p></div>
                            <div className="flex justify-between items-center"><p className="text-[12px] text-gray-500">Date</p><p className="text-[13px] font-bold text-[#222]">{msg.card.date} at {msg.card.txTime}</p></div>
                            <div className="border-t border-gray-100 pt-2.5 space-y-1.5">
                              <div className="flex justify-between items-center"><p className="text-[11px] text-gray-400">Payment ID</p><p className="text-[11px] font-mono text-[#222]">{msg.card.paymentId}</p></div>
                              <div className="flex justify-between items-center"><p className="text-[11px] text-gray-400">Confirmation ID</p><p className="text-[11px] font-mono text-[#222]">{msg.card.confirmId}</p></div>
                            </div>
                            <div className="bg-[#f8f8f8] rounded-lg px-3 py-2 mt-1"><p className="text-[11px] text-gray-500 leading-relaxed">Payments may take up to 2 hours to appear in the recipient's account.</p></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping&&(<div className="flex justify-start items-center"><div className="w-8 h-8 rounded-full bg-[#db0011] flex items-center justify-center mr-2 shrink-0"><span className="text-white text-xs font-bold">C</span></div><div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm py-3 px-4 flex items-center space-x-1.5 shadow-sm"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}/><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}/><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}/></div></div>)}
                <div ref={msgEnd} className="h-2"/>
              </div>
              <div className="bg-[#f8f8f8] px-4 pb-2 pt-1 flex space-x-2 overflow-x-auto hide-scrollbar">
                {QUICK_CHIPS.map(chip=>(<button key={chip} onClick={()=>sendMsg(chip)} className="shrink-0 bg-white border border-gray-200 rounded-full px-4 py-2 text-[12px] font-semibold text-[#222] shadow-sm active:bg-gray-100 whitespace-nowrap">{chip}</button>))}
              </div>
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="bg-[#f0f0f0] rounded-[2rem] flex items-center px-4 py-2">
                  <input type="text" placeholder="Message Cora..." className="flex-1 bg-transparent text-[#222] focus:outline-none placeholder-gray-500 py-1.5 text-[14px]" value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&chatInput.trim())sendMsg(chatInput);}}/>
                  <button onClick={()=>{if(chatInput.trim())sendMsg(chatInput);}} className={`ml-2 p-2 rounded-full flex items-center justify-center transition-colors ${chatInput.trim()?'bg-[#db0011] text-white':'bg-transparent text-gray-400'}`} disabled={!chatInput.trim()}><ArrowRight size={18} strokeWidth={2.5}/></button>
                </div>
              </div>
            </div>
          )}
        </main>

        <nav className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-200 pb-6 pt-2 px-2 z-50">
          <ul className="flex justify-between items-center">
            {[{key:'accounts',icon:Layers,label:'Accounts',action:()=>{setActiveNav('accounts');setSelectedAccountId(null);setSelectedTx(null);setActiveTopTab('Home');setTxSearch('');setShowTxSearch(false);}},{key:'pay',icon:ArrowRightLeft,label:'Pay & Transfer',action:()=>setActiveNav('pay')},{key:'plan',icon:BarChart2,label:'Plan',action:()=>setActiveNav('plan')},{key:'support',icon:MessageSquare,label:'Support',action:()=>setActiveNav('support')}].map(({key,icon:Icon,label,action})=>(
              <li key={key} className="flex-1"><button onClick={action} className={`w-full flex flex-col items-center space-y-1 transition-colors ${activeNav===key?'text-[#db0011]':'text-[#666]'}`}><Icon size={22} strokeWidth={activeNav===key?2.5:2}/><span className={`text-[10px] ${activeNav===key?'font-bold':'font-medium'}`}>{label}</span></button></li>
            ))}
          </ul>
        </nav>

        <style dangerouslySetInnerHTML={{__html:`
          .hide-scrollbar::-webkit-scrollbar{display:none}
          .hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
          .animate-fade-in{animation:fadeIn 0.2s ease-out forwards}
          @keyframes fadeIn{from{opacity:0}to{opacity:1}}
          @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-8px)}80%{transform:translateX(4px)}}
          .animate-shake{animation:shake 0.5s ease-in-out}
          @keyframes faceidScan{0%{transform:translateY(-50px);opacity:0.3}50%{opacity:1}100%{transform:translateY(50px);opacity:0.3}}
          .animate-faceid-scan{animation:faceidScan 1.2s ease-in-out infinite}
          input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
          input[type=number]{-moz-appearance:textfield}
        `}}/>
      </div>
    </div>
  );
}
