import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell,
  Legend
} from "recharts";
import { 
  Search, 
  User, 
  Wallet, 
  TrendingUp, 
  BookOpen, 
  Award, 
  Sparkles, 
  Cpu, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Coins, 
  Flame, 
  ChevronRight, 
  Info, 
  ShieldAlert, 
  RefreshCw, 
  Sliders, 
  PieChart, 
  LogOut, 
  ExternalLink, 
  BookCheck, 
  RotateCcw, 
  Check, 
  Lock 
} from "lucide-react";
import { UserProfile, Lesson, Quiz, BudgetPlan, SIPResult, OrchestrationResult, RAGContext } from "./types.js";

export default function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<"copilot" | "simulator" | "academy">("copilot");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Co-Pilot / Orchestration States
  const [searchQuery, setSearchQuery] = useState("");
  const [orchestrationResult, setOrchestrationResult] = useState<OrchestrationResult | null>(null);
  const [isOrchestratorLoading, setIsOrchestratorLoading] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState<string>("");
  const [activeOrchestrationAgent, setActiveOrchestrationAgent] = useState<string>("");

  // Budget Modeler States
  const [budgetIncome, setBudgetIncome] = useState<number>(30000);
  const [rentExp, setRentExp] = useState<number>(9000);
  const [groceryExp, setGroceryExp] = useState<number>(4500);
  const [utilityExp, setUtilityExp] = useState<number>(2400);
  const [diningExp, setDiningExp] = useState<number>(3600);
  const [subsExp, setSubsExp] = useState<number>(1500);
  const [budgetPlan, setBudgetPlan] = useState<BudgetPlan | null>(null);

  // SIP Simulator States
  const [sipMonthly, setSipMonthly] = useState<number>(3000);
  const [sipRate, setSipRate] = useState<number>(12);
  const [sipYears, setSipYears] = useState<number>(10);
  const [sipResult, setSipResult] = useState<SIPResult | null>(null);

  // Academy & Quiz States
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState<number>(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [earnedXPMsg, setEarnedXPMsg] = useState<string | null>(null);

  // Sample prompt helpers
  const samplePrompts = [
    { text: "I'm 22, earn ₹30,000, and want to start investing.", category: "Starter Plan" },
    { text: "Explain compounding and show SIP returns.", category: "Investment" },
    { text: "What is Section 80C and how can I save Indian Income Tax?", category: "Tax Savings" },
    { text: "What are the SEBI rules on mutual fund disclosures and fees?", category: "Regulations" }
  ];

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, lessonsRes] = await Promise.all([
          fetch("/api/mcp/profile"),
          fetch("/api/mcp/learning/lessons")
        ]);
        
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
          setBudgetIncome(profileData.income);
        }
        if (lessonsRes.ok) {
          const lessonsData = await lessonsRes.json();
          setLessons(lessonsData);
        }
      } catch (err) {
        console.error("Error loading initial database values", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync state changes with simulators
  useEffect(() => {
    triggerBudgetAnalysis();
  }, [budgetIncome, rentExp, groceryExp, utilityExp, diningExp, subsExp]);

  useEffect(() => {
    triggerSIPSimulation();
  }, [sipMonthly, sipRate, sipYears]);

  // Trigger Budget Analysis
  async function triggerBudgetAnalysis() {
    try {
      const res = await fetch("/api/mcp/budget/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          income: budgetIncome,
          expenses: [
            { category: "Rent", amount: rentExp },
            { category: "Groceries", amount: groceryExp },
            { category: "Utilities", amount: utilityExp },
            { category: "Dining Out", amount: diningExp },
            { category: "Subscriptions", amount: subsExp }
          ]
        })
      });
      if (res.ok) {
        const plan = await res.json();
        setBudgetPlan(plan);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Trigger SIP simulation
  async function triggerSIPSimulation() {
    try {
      const res = await fetch("/api/mcp/investment/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlyInvestment: sipMonthly,
          rateOfReturn: sipRate,
          years: sipYears
        })
      });
      if (res.ok) {
        const result = await res.json();
        setSipResult(result);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Handle Orchestrated Search
  async function handleOrchestratedSearch(queryText: string) {
    if (!queryText.trim()) return;
    setIsOrchestratorLoading(true);
    setSearchQuery(queryText);
    
    // Simulate active agent orchestration pipeline states
    const steps = [
      { msg: "Mapping user intent & loading User Profile...", agent: "User Profile MCP" },
      { msg: "Retrieving official guidelines from SEBI & RBI databases...", agent: "RAG MCP" },
      { msg: "Querying financial terminology services...", agent: "Finance Knowledge MCP" },
      { msg: "Compiling cash flow and budget recommendation standards...", agent: "Budget MCP" },
      { msg: "Calculating compound returns and SIP wealth projection charts...", agent: "Investment MCP" },
      { msg: "Retrieving relevant lessons from financial curriculum index...", agent: "Learning MCP" },
      { msg: "Coordinating multi-agent context parameters for OpenAI GPT-5...", agent: "AI Orchestrator" }
    ];

    for (let i = 0; i < steps.length; i++) {
      setSimulatedProgress(steps[i].msg);
      setActiveOrchestrationAgent(steps[i].agent);
      await new Promise(r => setTimeout(r, 450));
    }

    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText })
      });
      if (res.ok) {
        const data = await res.json();
        setOrchestrationResult(data);
        
        // Sync simulator with query results if returned
        if (data.mcpOutputs?.budget) {
          setBudgetPlan(data.mcpOutputs.budget);
          setBudgetIncome(data.mcpOutputs.budget.income);
        }
        if (data.mcpOutputs?.investment) {
          setSipResult(data.mcpOutputs.investment);
          setSipMonthly(data.mcpOutputs.investment.monthlyInvestment);
          setSipYears(data.mcpOutputs.investment.years);
          setSipRate(data.mcpOutputs.investment.rateOfReturn);
        }
      }
    } catch (err) {
      console.error("Orchestration request failed", err);
    } finally {
      setIsOrchestratorLoading(false);
      setSimulatedProgress("");
      setActiveOrchestrationAgent("");
    }
  }

  // Profile update handler
  async function handleProfileUpdate(field: string, value: any) {
    if (!profile) return;
    try {
      const res = await fetch("/api/mcp/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value })
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        if (field === "income") {
          setBudgetIncome(Number(value));
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Load Quiz for a specific lesson
  async function handleStartQuiz(lessonId: string) {
    try {
      const res = await fetch(`/api/mcp/quiz/${lessonId}`);
      if (res.ok) {
        const quizData = await res.json();
        setActiveQuiz(quizData);
        setCurrentQuizQuestionIndex(0);
        setSelectedAnswerIndex(null);
        setIsAnswerSubmitted(false);
      }
    } catch (err) {
      console.error("No quiz available", err);
    }
  }

  // Handle quiz option select
  function handleSelectOption(optionIdx: number) {
    if (isAnswerSubmitted) return;
    setSelectedAnswerIndex(optionIdx);
  }

  // Submit Quiz Answer
  async function handleSubmitAnswer() {
    if (selectedAnswerIndex === null || !activeQuiz || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    
    const question = activeQuiz.questions[currentQuizQuestionIndex];
    const isCorrect = selectedAnswerIndex === question.correctAnswer;

    if (isCorrect) {
      // Award XP on successful correct answer
      try {
        const res = await fetch("/api/mcp/profile/add-xp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 50 })
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
          if (data.newBadges && data.newBadges.length > 0) {
            setEarnedXPMsg(`🎉 Correct! Earned +50 XP. Unlocked Badge: ${data.newBadges.join(", ")}`);
          } else {
            setEarnedXPMsg("🎉 Correct! Earned +50 XP.");
          }
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setEarnedXPMsg("❌ Incorrect answer. Review the explanation below to learn!");
    }
  }

  // Next Question
  function handleNextQuestion() {
    if (!activeQuiz) return;
    setEarnedXPMsg(null);
    if (currentQuizQuestionIndex + 1 < activeQuiz.questions.length) {
      setCurrentQuizQuestionIndex(currentQuizQuestionIndex + 1);
      setSelectedAnswerIndex(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished Quiz
      setActiveQuiz(null);
      setSelectedLesson(null);
      alert("✨ Congratulations! You completed the academy assessment!");
    }
  }

  // Reset Quiz
  function handleResetQuiz() {
    setCurrentQuizQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setIsAnswerSubmitted(false);
    setEarnedXPMsg(null);
  }

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0d0e12] text-slate-300">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-sm font-medium tracking-wider text-slate-400 uppercase">Booting LearnLends Sandbox Architecture...</p>
        </div>
      </div>
    );
  }

  // Format currencies in Indian Standard Format
  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#0b0c0f] text-slate-100 flex flex-col font-sans">
      
      {/* ========================================================
          HEADER WITH GAMIFICATION TRACKERS & PROFILE SUMMARY
          ======================================================== */}
      <header id="main-header" className="border-b border-[#1b1e25] bg-[#0d0e12] sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-indigo-900 rounded-xl border border-indigo-500/30 shadow-lg shadow-indigo-900/20">
              <Sparkles className="h-6 w-6 text-indigo-300" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                LearnLends
              </h1>
              <p className="text-[11px] text-slate-400 font-mono tracking-wider uppercase">
                Production-Grade Multi-Agent Orchestrator
              </p>
            </div>
          </div>

          {profile && (
            <div id="gamified-stats-panel" className="flex items-center flex-wrap gap-4 bg-[#14171f] px-4 py-2 rounded-xl border border-[#1e2330]">
              <div className="flex items-center gap-1.5" title="Streak tracker">
                <Flame className="h-5 w-5 text-amber-500 animate-pulse" />
                <span className="text-xs font-mono font-bold text-amber-400">{profile.streak} DAY STREAK</span>
              </div>
              <div className="w-px h-5 bg-[#252a3a]" />
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-mono font-bold text-indigo-300">{profile.xp} XP</span>
              </div>
              <div className="w-px h-5 bg-[#252a3a] hidden md:block" />
              <div className="hidden md:flex items-center gap-2">
                <div className="flex -space-x-1">
                  {profile.badges.map((badge, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center justify-center text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#1d2433] text-indigo-400 border border-indigo-500/20"
                      title="Earned achievement badge"
                    >
                      🏅 {badge}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-px h-5 bg-[#252a3a]" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-xs border border-white/10">
                  {profile.occupation.charAt(0)}
                </div>
                <div className="text-left text-xs">
                  <p className="font-semibold text-slate-300">{profile.occupation}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Age {profile.age}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ========================================================
          SUB-HERO CONTROL STRIP (USER RISK & TARGET GOALS ADJUSTER)
          ======================================================== */}
      <section id="profile-controls" className="bg-[#0f1117] border-b border-[#1b1e25] py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Sliders className="h-4 w-4 text-slate-400" />
            <span>Active Financial Sandbox Profile Context:</span>
          </div>

          {profile && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#14171f] p-1.5 rounded-lg border border-[#1d222e]">
                <span className="text-xs text-slate-400 px-2 font-mono">Monthly Salary:</span>
                <input 
                  type="number"
                  value={profile.income}
                  onChange={(e) => handleProfileUpdate("income", Number(e.target.value))}
                  className="w-24 bg-black/40 border border-[#2b3142] text-xs px-2 py-1 rounded text-white font-bold font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 bg-[#14171f] p-1.5 rounded-lg border border-[#1d222e]">
                <span className="text-xs text-slate-400 px-2 font-mono">Risk Tolerance:</span>
                <select 
                  value={profile.riskProfile}
                  onChange={(e) => handleProfileUpdate("riskProfile", e.target.value)}
                  className="bg-black/40 border border-[#2b3142] text-xs px-2 py-1 rounded text-indigo-300 font-bold focus:outline-none focus:border-indigo-500"
                >
                  <option value="Conservative">Conservative (Debt & Gilt)</option>
                  <option value="Moderate">Moderate (Index & Hybrid)</option>
                  <option value="Aggressive">Aggressive (Direct Equity & Smallcap)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-[#14171f] p-1.5 rounded-lg border border-[#1d222e]">
                <span className="text-xs text-slate-400 px-2 font-mono">Your Current Age:</span>
                <input 
                  type="number"
                  value={profile.age}
                  min={18}
                  max={80}
                  onChange={(e) => handleProfileUpdate("age", Number(e.target.value))}
                  className="w-14 bg-black/40 border border-[#2b3142] text-xs px-2 py-1 rounded text-white font-bold font-mono text-center focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          MAIN TAB COMPONENT ROUTER
          ======================================================== */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 flex flex-col gap-6">
        
        {/* Navigation Selector */}
        <div className="flex border-b border-[#1b1e25]">
          <button
            id="tab-btn-copilot"
            onClick={() => setActiveTab("copilot")}
            className={`px-5 py-3.5 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "copilot"
                ? "border-indigo-500 text-white bg-indigo-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/10"
            }`}
          >
            <Cpu className="h-4 w-4" />
            AI Orchestration Co-Pilot
            <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-mono font-bold">
              Multi-Agent
            </span>
          </button>
          
          <button
            id="tab-btn-simulator"
            onClick={() => setActiveTab("simulator")}
            className={`px-5 py-3.5 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "simulator"
                ? "border-indigo-500 text-white bg-indigo-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/10"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Interactive Wealth Lab
            <span className="text-[10px] bg-[#1d2d25] text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
              Simulators
            </span>
          </button>

          <button
            id="tab-btn-academy"
            onClick={() => setActiveTab("academy")}
            className={`px-5 py-3.5 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "academy"
                ? "border-indigo-500 text-white bg-indigo-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/10"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Gamified Academy
            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold">
              Learn & Quiz
            </span>
          </button>
        </div>

        {/* ========================================================
            TAB 1: AI CO-PILOT WITH REAL-TIME AGENT ORCHESTRATION PIPELINE
            ======================================================== */}
        {activeTab === "copilot" && (
          <div id="view-copilot" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Input Sandbox and Prompts */}
            <div className="lg:col-span-1 space-y-6">
              <div id="ai-prompts-card" className="bg-[#0d0e12] rounded-2xl border border-[#1b1e25] p-5 space-y-4">
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  Ask AI Co-Pilot
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your financial query. The Orchestrator will activate specialized mock MCP servers (User Profile, Finance, Budget, SIP Investment, RAG knowledge nodes) and compile a tailored response.
                </p>

                <div className="relative mt-2">
                  <textarea
                    id="orchestration-query-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="E.g., I earn ₹30,000, and want to save taxes while starting an SIP..."
                    rows={4}
                    className="w-full bg-[#12141c] border border-[#232836] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-sans"
                  />
                  <button
                    id="submit-orchestration-btn"
                    onClick={() => handleOrchestratedSearch(searchQuery)}
                    disabled={isOrchestratorLoading || !searchQuery.trim()}
                    className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    {isOrchestratorLoading ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Orchestrate
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2">
                  <p className="text-[11px] text-slate-500 font-mono tracking-wider uppercase mb-2">
                    Quick Sample Templates:
                  </p>
                  <div className="space-y-2">
                    {samplePrompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(p.text);
                          handleOrchestratedSearch(p.text);
                        }}
                        className="w-full text-left bg-[#141720] hover:bg-[#1b202e] border border-[#212635] hover:border-slate-600 rounded-lg p-2.5 transition-all text-xs cursor-pointer group"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-300 group-hover:text-indigo-300 transition-colors">
                            {p.text}
                          </span>
                          <span className="text-[9px] bg-[#1e2436] text-slate-400 px-1.5 py-0.5 rounded font-mono">
                            {p.category}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Profile Snapshot Widget */}
              {profile && (
                <div className="bg-[#0d0e12] rounded-2xl border border-[#1b1e25] p-5 space-y-4">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="h-4 w-4 text-indigo-400" />
                    Target Goals Context
                  </h3>
                  <div className="space-y-3">
                    {profile.goals.map((goal, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-[#12141a] p-2.5 rounded-lg border border-[#1e2330]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-xs font-semibold text-slate-300">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Columns: Active Pipeline Tracker + AI Markdown Output */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* ORCHESTRATION PIPELINE MONITOR VISUALIZER */}
              <div id="orchestrator-status-panel" className="bg-[#0d0e12] rounded-2xl border border-[#1b1e25] p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-indigo-400" />
                      Multi-Agent Pipeline Graph
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Real-time monitor tracking mock MCP servers activated during orchestrations
                    </p>
                  </div>
                  {isOrchestratorLoading && (
                    <div className="flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-500/20 text-xs animate-pulse font-mono">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
                      Agent Stream Engaged
                    </div>
                  )}
                </div>

                {/* Pipeline Nodes View */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: "User Profile MCP", desc: "Aggregates age, salary, goals", icon: User },
                    { name: "RAG MCP", desc: "Retrieves RBI & SEBI circulars", icon: FileText },
                    { name: "Finance Knowledge MCP", desc: "Explains standard definitions", icon: Info },
                    { name: "Budget MCP", desc: "Analyzes 50/30/20 thresholds", icon: Wallet },
                    { name: "Investment MCP", desc: "Computes compound growth", icon: TrendingUp },
                    { name: "Learning MCP", desc: "Suggests curated lessons", icon: BookOpen },
                    { name: "Quiz MCP", desc: "Fetches custom assessments", icon: BookCheck },
                    { name: "AI Orchestrator", desc: "Gemini coordinates outputs", icon: Sparkles }
                  ].map((node, i) => {
                    const isTriggered = orchestrationResult?.analysis.agentsTriggered.includes(node.name) || (isOrchestratorLoading && activeOrchestrationAgent === node.name);
                    const isActiveLoad = isOrchestratorLoading && activeOrchestrationAgent === node.name;
                    
                    return (
                      <div 
                        key={i}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isActiveLoad 
                            ? "bg-[#181c2e] border-indigo-500 ring-1 ring-indigo-500/40" 
                            : isTriggered 
                            ? "bg-[#12161f] border-emerald-500/30" 
                            : "bg-[#0f1015] border-[#1c1e26] opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <node.icon className={`h-4 w-4 ${isActiveLoad ? "text-indigo-400 animate-pulse" : isTriggered ? "text-emerald-400" : "text-slate-500"}`} />
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isActiveLoad 
                              ? "bg-indigo-500/20 text-indigo-400 animate-pulse"
                              : isTriggered 
                              ? "bg-emerald-500/15 text-emerald-400" 
                              : "bg-slate-800/40 text-slate-500"
                          }`}>
                            {isActiveLoad ? "BUSY" : isTriggered ? "CALLED" : "IDLE"}
                          </span>
                        </div>
                        <p className={`text-xs font-bold ${isTriggered || isActiveLoad ? "text-slate-200" : "text-slate-400"}`}>{node.name}</p>
                        <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">{node.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {isOrchestratorLoading && (
                  <div className="mt-4 p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-xl flex items-center gap-2.5">
                    <RefreshCw className="h-4 w-4 text-indigo-400 animate-spin flex-shrink-0" />
                    <span className="text-xs text-slate-300 font-mono">{simulatedProgress}</span>
                  </div>
                )}
              </div>

              {/* ANSWER CONSOLE CARD */}
              <div id="ai-response-display" className="bg-[#0d0e12] rounded-2xl border border-[#1b1e25] overflow-hidden">
                <div className="border-b border-[#1b1e25] bg-[#12141c] px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                      Orchestrated Strategy Console
                    </span>
                  </div>
                  {orchestrationResult && (
                    <span className="text-[10px] font-mono text-slate-400">
                      Intent: {orchestrationResult.analysis.intentDetected}
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-6">
                  {orchestrationResult ? (
                    <>
                      {/* Markdown display */}
                      <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                        <ReactMarkdown>{orchestrationResult.responseMarkdown}</ReactMarkdown>
                      </div>

                      {/* Citations block */}
                      {orchestrationResult.citations && orchestrationResult.citations.length > 0 && (
                        <div id="citations-block" className="pt-6 border-t border-[#1b1e25] space-y-3">
                          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Info className="h-4 w-4 text-indigo-400" />
                            Policy & Regulation Citations (RAG MCP)
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {orchestrationResult.citations.map((cite, cIdx) => (
                              <div key={cIdx} className="bg-[#12151e] border border-slate-800/40 p-3 rounded-xl space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-extrabold text-slate-200 line-clamp-1">{cite.source}</span>
                                  <a 
                                    href={cite.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[10px] text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-0.5 font-bold"
                                  >
                                    Verify <ExternalLink className="h-2.5 w-2.5" />
                                  </a>
                                </div>
                                <p className="text-[11px] text-slate-400 italic line-clamp-3 leading-snug">
                                  "{cite.snippet}"
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-12 text-center text-slate-500 space-y-3">
                      <Sparkles className="h-10 w-10 mx-auto text-slate-700 animate-pulse" />
                      <p className="text-sm">Orchestration Console Idle.</p>
                      <p className="text-xs max-w-sm mx-auto text-slate-600">
                        Click one of the quick templates above or input a custom scenario to activate specialized agents.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: INTERACTIVE WEALTH LAB (COMPREHENSIVE BUDGET & SIP PLANS)
            ======================================================== */}
        {activeTab === "simulator" && (
          <div id="view-simulator" className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Slider Control Panel (Lg 4 cols) */}
              <div className="lg:col-span-4 bg-[#0d0e12] rounded-2xl border border-[#1b1e25] p-5 space-y-6">
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-[#1b1e25] pb-3">
                  <Sliders className="h-5 w-5 text-indigo-400" />
                  Simulation Inputs
                </h2>

                {/* Sub Tab: Budget Configuration */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Wallet className="h-4 w-4 text-indigo-400" />
                    1. Monthly Expenses Builder
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-mono">
                        <span className="text-slate-400">Monthly Post-Tax Salary</span>
                        <span className="text-emerald-400 font-bold">{formatINR(budgetIncome)}</span>
                      </div>
                      <input 
                        type="range"
                        min={15000}
                        max={200000}
                        step={5000}
                        value={budgetIncome}
                        onChange={(e) => {
                          setBudgetIncome(Number(e.target.value));
                          if (profile) handleProfileUpdate("income", Number(e.target.value));
                        }}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-mono">
                        <span className="text-slate-400">Rent & Bills (Essential Needs)</span>
                        <span className="text-slate-200 font-bold">{formatINR(rentExp)}</span>
                      </div>
                      <input 
                        type="range"
                        min={5000}
                        max={80000}
                        step={1000}
                        value={rentExp}
                        onChange={(e) => setRentExp(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-mono">
                        <span className="text-slate-400">Groceries & Utilities</span>
                        <span className="text-slate-200 font-bold">{formatINR(groceryExp + utilityExp)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>
                          <label className="text-[10px] text-slate-500">Groceries</label>
                          <input 
                            type="number"
                            value={groceryExp}
                            onChange={(e) => setGroceryExp(Number(e.target.value))}
                            className="w-full bg-black/40 border border-[#2b3142] text-xs px-2 py-1 rounded text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500">Utilities</label>
                          <input 
                            type="number"
                            value={utilityExp}
                            onChange={(e) => setUtilityExp(Number(e.target.value))}
                            className="w-full bg-black/40 border border-[#2b3142] text-xs px-2 py-1 rounded text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-mono">
                        <span className="text-slate-400">Dining, Shopping & Subs (Wants)</span>
                        <span className="text-slate-200 font-bold">{formatINR(diningExp + subsExp)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>
                          <label className="text-[10px] text-slate-500">Dining Out</label>
                          <input 
                            type="number"
                            value={diningExp}
                            onChange={(e) => setDiningExp(Number(e.target.value))}
                            className="w-full bg-black/40 border border-[#2b3142] text-xs px-2 py-1 rounded text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500">Subscriptions</label>
                          <input 
                            type="number"
                            value={subsExp}
                            onChange={(e) => setSubsExp(Number(e.target.value))}
                            className="w-full bg-black/40 border border-[#2b3142] text-xs px-2 py-1 rounded text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Sub Tab: SIP Simulator */}
                <div className="space-y-4 pt-4 border-t border-[#1b1e25]">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-indigo-400" />
                    2. SIP Compound Machine
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-mono">
                        <span className="text-slate-400">Monthly SIP Contribution</span>
                        <span className="text-indigo-400 font-bold">{formatINR(sipMonthly)}</span>
                      </div>
                      <input 
                        type="range"
                        min={500}
                        max={50000}
                        step={500}
                        value={sipMonthly}
                        onChange={(e) => setSipMonthly(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-mono">
                        <span className="text-slate-400">Expected Annual Returns</span>
                        <span className="text-indigo-300 font-bold">{sipRate}% p.a.</span>
                      </div>
                      <input 
                        type="range"
                        min={4}
                        max={24}
                        step={1}
                        value={sipRate}
                        onChange={(e) => setSipRate(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-mono">
                        <span className="text-slate-400">Investment Period</span>
                        <span className="text-indigo-300 font-bold">{sipYears} Years</span>
                      </div>
                      <input 
                        type="range"
                        min={1}
                        max={30}
                        step={1}
                        value={sipYears}
                        onChange={(e) => setSipYears(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Output Panels (Lg 8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* 1. BUDGET RECOMMENDATIONS & ALIGNMENT BAR */}
                {budgetPlan && (
                  <div className="bg-[#0d0e12] rounded-2xl border border-[#1b1e25] p-5 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Wallet className="h-5 w-5 text-indigo-400" />
                      50/30/20 Budgeting Alignment Analysis (Budget Agent)
                    </h3>

                    {/* Comparative Visual Bars */}
                    <div className="space-y-4 pt-2">
                      {/* Wants bar */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                          <span className="font-semibold">Essential Needs (Target Max: 50%)</span>
                          <span className="font-mono text-slate-400">
                            Spent: {Math.round(((rentExp + groceryExp + utilityExp) / budgetIncome) * 100)}% 
                            ({formatINR(rentExp + groceryExp + utilityExp)})
                          </span>
                        </div>
                        <div className="h-3 w-full bg-slate-800/60 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              ((rentExp + groceryExp + utilityExp) / budgetIncome) > 0.5 
                                ? "bg-rose-500" 
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(100, ((rentExp + groceryExp + utilityExp) / budgetIncome) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Wants bar */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                          <span className="font-semibold">Lifestyle Wants (Target Max: 30%)</span>
                          <span className="font-mono text-slate-400">
                            Spent: {Math.round(((diningExp + subsExp) / budgetIncome) * 100)}% 
                            ({formatINR(diningExp + subsExp)})
                          </span>
                        </div>
                        <div className="h-3 w-full bg-slate-800/60 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              ((diningExp + subsExp) / budgetIncome) > 0.3 
                                ? "bg-rose-500" 
                                : "bg-indigo-500"
                            }`}
                            style={{ width: `${Math.min(100, ((diningExp + subsExp) / budgetIncome) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Remaining Savings bar */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                          <span className="font-semibold">Investments & Savings (Target Min: 20%)</span>
                          {/* Saved amount */}
                          {(() => {
                            const totalSpent = rentExp + groceryExp + utilityExp + diningExp + subsExp;
                            const actualSaved = budgetIncome - totalSpent;
                            return (
                              <span className="font-mono text-slate-400">
                                Surplus: {Math.round((actualSaved / budgetIncome) * 100)}% 
                                ({formatINR(actualSaved)})
                              </span>
                            );
                          })()}
                        </div>
                        <div className="h-3 w-full bg-slate-800/60 rounded-full overflow-hidden">
                          {(() => {
                            const totalSpent = rentExp + groceryExp + utilityExp + diningExp + subsExp;
                            const actualSaved = budgetIncome - totalSpent;
                            const percent = Math.max(0, Math.round((actualSaved / budgetIncome) * 100));
                            return (
                              <div 
                                className={`h-full rounded-full transition-all duration-300 ${
                                  percent < 20 ? "bg-amber-500" : "bg-emerald-500"
                                }`}
                                style={{ width: `${Math.min(100, percent)}%` }}
                              />
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#1b1e25]">
                      <div className="bg-[#12141c] p-3 rounded-xl border border-slate-800/30">
                        <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider block">
                          Budget Action Plan
                        </span>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {budgetPlan.suggestedAction}
                        </p>
                      </div>

                      <div className="bg-[#12141c] p-3 rounded-xl border border-slate-800/30">
                        <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider block">
                          Target Emergency Fund
                        </span>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          Keep **{formatINR(budgetPlan.emergencyFundGoal)}** safe in high-yield debt schemes (representing 6 months of essential survival expenses) before escalating high-risk trading.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SIP WEALTH ACCUMULATION GRAPH & BREAKDOWN */}
                {sipResult && (
                  <div className="bg-[#0d0e12] rounded-2xl border border-[#1b1e25] p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <TrendingUp className="h-5 w-5 text-indigo-400" />
                        Compounded SIP Wealth Projections (Investment Agent)
                      </h3>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-500 font-mono">Future Value (at {sipRate}%)</p>
                        <p className="text-base font-extrabold text-emerald-400 font-mono">
                          {formatINR(sipResult.futureValue)}
                        </p>
                      </div>
                    </div>

                    {/* Numeric breakdown cards */}
                    <div className="grid grid-cols-3 gap-3 bg-[#12141c] p-3.5 rounded-xl border border-[#1d222e]">
                      <div className="text-center sm:text-left">
                        <span className="text-[10px] text-slate-500 font-mono block uppercase">Total Principal</span>
                        <span className="text-sm font-bold text-slate-200 font-mono">
                          {formatINR(sipResult.totalInvestment)}
                        </span>
                      </div>
                      <div className="text-center sm:text-left border-l border-[#1e2330] pl-3">
                        <span className="text-[10px] text-indigo-400 font-mono block uppercase">Compounded Gained</span>
                        <span className="text-sm font-bold text-indigo-300 font-mono">
                          {formatINR(sipResult.wealthGained)}
                        </span>
                      </div>
                      <div className="text-center sm:text-left border-l border-[#1e2330] pl-3">
                        <span className="text-[10px] text-emerald-400 font-mono block uppercase">Total Wealth</span>
                        <span className="text-sm font-bold text-emerald-300 font-mono">
                          {formatINR(sipResult.futureValue)}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Chart */}
                    <div className="h-64 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart 
                          data={sipResult.yearlyBreakdown}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="year" 
                            stroke="#475569" 
                            fontSize={10} 
                            tickLine={false}
                            tickFormatter={(v) => `Yr ${v}`}
                          />
                          <YAxis 
                            stroke="#475569" 
                            fontSize={10} 
                            tickLine={false}
                            tickFormatter={(v) => `₹${v/1000}k`}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: "#0f111a", borderColor: "#1e2433" }}
                            labelStyle={{ color: "#94a3b8", fontSize: "11px", fontWeight: "bold" }}
                            itemStyle={{ fontSize: "12px", color: "#f1f5f9" }}
                            formatter={(v: any) => formatINR(v)}
                          />
                          <Area 
                            name="Total Portfolio Value"
                            type="monotone" 
                            dataKey="total" 
                            stroke="#10b981" 
                            fillOpacity={1} 
                            fill="url(#colorTotal)" 
                            strokeWidth={2}
                          />
                          <Area 
                            name="Cumulative Investment"
                            type="monotone" 
                            dataKey="investment" 
                            stroke="#6366f1" 
                            fillOpacity={1} 
                            fill="url(#colorPrincipal)" 
                            strokeWidth={1.5}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Simple projections footer warning */}
                    <div className="flex items-center gap-2 bg-[#12151e] border border-slate-800/40 p-3 rounded-xl">
                      <ShieldAlert className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      <span className="text-[10px] text-slate-400 font-sans leading-snug">
                        Calculations are simulated at {sipRate}% p.a. compounded monthly. In reality, equity returns are highly volatile. SEBI advises checking risk profiles and historical standard deviations before launching mutual funds.
                      </span>
                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* ========================================================
            TAB 3: GAMIFIED CURRICULUM & ADAPTIVE QUIZ CONSOLE
            ======================================================== */}
        {activeTab === "academy" && (
          <div id="view-academy" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Lesson Modules */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-[#0d0e12] rounded-2xl border border-[#1b1e25] p-5">
                <div className="flex items-center justify-between gap-3 border-b border-[#1b1e25] pb-3.5 mb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-indigo-400" />
                      Personal Wealth Masterclass
                    </h2>
                    <p className="text-xs text-slate-400">
                      Select a syllabus curriculum module designed by our Learning MCP Agent
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20 font-bold">
                    {lessons.length} LESSONS
                  </span>
                </div>

                <div className="space-y-3">
                  {lessons.map((lesson) => {
                    const isCompleted = profile?.learningHistory.includes(lesson.id);
                    const isSelected = selectedLesson?.id === lesson.id;
                    
                    return (
                      <div 
                        id={`lesson-card-${lesson.id}`}
                        key={lesson.id}
                        onClick={() => {
                          setSelectedLesson(lesson);
                          setActiveQuiz(null); // Clear active quiz on lesson change
                        }}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-[#141724] border-indigo-500" 
                            : "bg-[#0d0e12] border-[#1b1e25] hover:border-slate-700"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-mono font-bold bg-[#141a24] text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 w-fit">
                            {lesson.section}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              lesson.difficulty === "Beginner" 
                                ? "bg-emerald-500/10 text-emerald-400" 
                                : lesson.difficulty === "Intermediate" 
                                ? "bg-indigo-500/10 text-indigo-400" 
                                : "bg-amber-500/10 text-amber-400"
                            }`}>
                              {lesson.difficulty}
                            </span>
                            {isCompleted && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                                <Check className="h-2.5 w-2.5" /> PASSED
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {lesson.summary}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Immersive Content Reader or Active Assessment Console */}
            <div className="lg:col-span-1">
              
              {selectedLesson ? (
                <div id="academy-interactive-container" className="bg-[#0d0e12] rounded-2xl border border-[#1b1e25] overflow-hidden sticky top-24">
                  
                  {/* Lesson Reading Header */}
                  <div className="bg-[#12141c] border-b border-[#1b1e25] p-4 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                      Module Viewer
                    </span>
                    <button 
                      onClick={() => {
                        setSelectedLesson(null);
                        setActiveQuiz(null);
                      }}
                      className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                    >
                      Close ×
                    </button>
                  </div>

                  {/* ACTIVE ASSESSMENT INTERACTIVE INTERFACE */}
                  {activeQuiz ? (
                    <div id="quiz-assessment-panel" className="p-5 space-y-5">
                      <div className="flex items-center justify-between border-b border-[#1b1e25] pb-3">
                        <div>
                          <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider block w-fit mb-1">
                            Live Assessment
                          </span>
                          <h4 className="text-xs font-bold text-slate-200 line-clamp-1">
                            {activeQuiz.title}
                          </h4>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          {currentQuizQuestionIndex + 1} of {activeQuiz.questions.length}
                        </span>
                      </div>

                      {/* Question */}
                      <div className="space-y-4">
                        <p className="text-sm font-semibold text-slate-200 leading-relaxed">
                          {activeQuiz.questions[currentQuizQuestionIndex].question}
                        </p>

                        {/* Interactive Selection Options */}
                        <div className="space-y-2">
                          {activeQuiz.questions[currentQuizQuestionIndex].options.map((opt, oIdx) => {
                            const isSelected = selectedAnswerIndex === oIdx;
                            const isCorrectAnswer = oIdx === activeQuiz.questions[currentQuizQuestionIndex].correctAnswer;
                            
                            let optStyle = "bg-[#13151c] hover:bg-[#1a1d26] border-[#222736] text-slate-300";
                            if (isAnswerSubmitted) {
                              if (isCorrectAnswer) {
                                optStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-300";
                              } else if (isSelected) {
                                optStyle = "bg-rose-950/40 border-rose-500 text-rose-300";
                              } else {
                                optStyle = "bg-[#13151c] border-[#1e2330] opacity-50 text-slate-500";
                              }
                            } else if (isSelected) {
                              optStyle = "bg-[#1a233b] border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/20";
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleSelectOption(oIdx)}
                                disabled={isAnswerSubmitted}
                                className={`w-full text-left p-3 rounded-xl border text-xs font-medium leading-relaxed transition-all cursor-pointer flex items-start gap-2 ${optStyle}`}
                              >
                                <span className="font-mono text-slate-500 font-bold bg-black/20 w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Earned XP or result banner */}
                      {earnedXPMsg && (
                        <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                          earnedXPMsg.includes("Correct") 
                            ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400" 
                            : "bg-rose-950/30 border-rose-500/30 text-rose-400"
                        }`}>
                          {earnedXPMsg}
                        </div>
                      )}

                      {/* Explanation box */}
                      {isAnswerSubmitted && (
                        <div className="p-4 bg-[#12141c] rounded-xl border border-[#1e2330] space-y-1.5 animate-fadeIn">
                          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block font-bold">
                            Financial Rationale
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {activeQuiz.questions[currentQuizQuestionIndex].explanation}
                          </p>
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="flex items-center gap-3 pt-3 border-t border-[#1b1e25]">
                        {!isAnswerSubmitted ? (
                          <button
                            onClick={handleSubmitAnswer}
                            disabled={selectedAnswerIndex === null}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow"
                          >
                            Submit Answer
                          </button>
                        ) : (
                          <button
                            onClick={handleNextQuestion}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow flex items-center justify-center gap-1"
                          >
                            {currentQuizQuestionIndex + 1 < activeQuiz.questions.length ? "Next Question" : "Complete Assessment"}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                    </div>
                  ) : (
                    /* Lesson Study Mode */
                    <div className="p-5 space-y-5">
                      <div>
                        <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider block w-fit mb-1.5">
                          Lesson Material
                        </span>
                        <h3 className="text-base font-bold text-white leading-tight">
                          {selectedLesson.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-mono mt-1">
                          Curriculum Section: {selectedLesson.section}
                        </p>
                      </div>

                      <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p className="whitespace-pre-line">
                          {selectedLesson.content}
                        </p>

                        <div className="p-4 bg-[#12141c] rounded-xl border border-slate-800/40 space-y-2.5">
                          <h4 className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-extrabold flex items-center gap-1">
                            <BookCheck className="h-4 w-4" /> Key Takeaways
                          </h4>
                          <ul className="space-y-2">
                            {selectedLesson.keyPoints.map((pt, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2 text-slate-300 text-[11px]">
                                <span className="text-emerald-400 font-bold font-mono text-xs mt-0.5">•</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Take Assessment Button */}
                      <button
                        onClick={() => handleStartQuiz(selectedLesson.id)}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-900/20 flex items-center justify-center gap-1.5"
                      >
                        <Award className="h-4 w-4 text-indigo-200" />
                        Take Assessment (+50 XP)
                      </button>
                    </div>
                  )}

                </div>
              ) : (
                <div className="bg-[#0d0e12] rounded-2xl border border-[#1b1e25] p-6 text-center text-slate-500 space-y-3 sticky top-24">
                  <BookOpen className="h-10 w-10 mx-auto text-slate-700 animate-pulse" />
                  <p className="text-sm">Immersive Reader Idle.</p>
                  <p className="text-xs max-w-sm mx-auto text-slate-600 leading-relaxed">
                    Select any syllabus curriculum module on the left. The Learning Agent will compile the text guidelines, key takeaways, and adaptive quiz assessment instantly.
                  </p>
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* ========================================================
          FOOTER WITH DEPLOYMENT LABELS & SYSTEM CREDENTIALS
          ======================================================== */}
      <footer id="main-footer" className="bg-[#0a0b0e] border-t border-[#1b1e25] py-5 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 LearnLends Platform. Fully sandboxed mock server nodes active.</p>
          <div className="flex items-center gap-4 font-mono">
            <span>PORT: 3000 (HTTPS Node Gateway)</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-400">ENGINE SECURE</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
