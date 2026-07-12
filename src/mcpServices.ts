import { 
  UserProfile, 
  Lesson, 
  Quiz, 
  Flashcard, 
  BudgetPlan, 
  SIPResult, 
  RAGContext 
} from "./types.js";

// ==========================================
// 1. USER PROFILE SERVICE
// ==========================================
export class UserProfileService {
  private profile: UserProfile = {
    age: 22,
    income: 30000,
    occupation: "Software Engineer Intern",
    goals: ["Start Investing", "Buy a laptop", "Build Emergency Fund"],
    riskProfile: "Moderate",
    learningHistory: [],
    quizScores: {},
    xp: 120,
    streak: 3,
    badges: ["Starter badge", "Quick Learner"],
    monthlyExpenses: 15000
  };

  getProfile(): UserProfile {
    return this.profile;
  }

  updateProfile(updates: Partial<UserProfile>): UserProfile {
    this.profile = { ...this.profile, ...updates };
    return this.profile;
  }

  addXP(amount: number): { xp: number; newBadges: string[] } {
    this.profile.xp += amount;
    const newBadges: string[] = [];
    
    // Check for new badges
    if (this.profile.xp >= 300 && !this.profile.badges.includes("Fin-Guru")) {
      this.profile.badges.push("Fin-Guru");
      newBadges.push("Fin-Guru");
    }
    if (this.profile.xp >= 200 && !this.profile.badges.includes("Quiz Whiz")) {
      this.profile.badges.push("Quiz Whiz");
      newBadges.push("Quiz Whiz");
    }
    
    return { xp: this.profile.xp, newBadges };
  }
}

// ==========================================
// 2. FINANCE KNOWLEDGE SERVICE
// ==========================================
export class FinanceKnowledgeService {
  private terms: { [key: string]: { term: string; definition: string; example: string; category: string } } = {
    sip: {
      term: "SIP (Systematic Investment Plan)",
      definition: "An investment vehicle offered by mutual funds where you invest a fixed amount regularly (monthly/quarterly) rather than a lump sum.",
      example: "Investing ₹2,000 every month on the 5th into an index mutual fund.",
      category: "Investment"
    },
    compounding: {
      term: "Power of Compounding",
      definition: "Earning interest on interest. The returns earned on your initial principal amount start generating their own returns over time.",
      example: "₹10,000 earning 10% annually becomes ₹11,000 in Year 1. In Year 2, you earn 10% on ₹11,000 (i.e. ₹1,100), not just on ₹10,000.",
      category: "Investment"
    },
    elss: {
      term: "ELSS (Equity Linked Savings Scheme)",
      definition: "A type of diversified equity mutual fund in India that offers tax deductions under Section 80C up to ₹1.5 Lakhs per year, with a lock-in period of 3 years.",
      example: "Investing ₹50,000 in an ELSS fund to save tax under 80C while enjoying stock market growth.",
      category: "Taxation"
    },
    emergencyfund: {
      term: "Emergency Fund",
      definition: "A pool of highly liquid savings reserved for unexpected events like job loss, medical emergencies, or repairs, typically holding 3-6 months of essential living expenses.",
      example: "If your monthly expenses are ₹15,000, keeping ₹45,000 to ₹90,000 safe in a savings account or high-yield liquid fund.",
      category: "Budgeting"
    },
    ltcg: {
      term: "LTCG (Long Term Capital Gains Tax)",
      definition: "Tax levied on the profits earned from selling capital assets (like stocks or real estate) held for a specified long-term duration (usually over 1 year for equity).",
      example: "For equity, long-term gains exceeding ₹1.25 Lakhs in a financial year are taxed at 12.5% (as per newest Indian Budget standards).",
      category: "Taxation"
    },
    rbi_direct: {
      term: "RBI Retail Direct",
      definition: "A government portal letting individual retail investors open a Gilt account directly with the Reserve Bank of India to buy Government Securities (G-Secs) without fees.",
      example: "Buying 91-day Government Treasury Bills directly through the RBI portal.",
      category: "Government Schemes"
    }
  };

  explainTerm(queryTerm: string): { term: string; definition: string; example: string; category: string } | null {
    const key = queryTerm.toLowerCase().replace(/[^a-z]/g, "");
    for (const termKey of Object.keys(this.terms)) {
      if (key.includes(termKey) || termKey.includes(key)) {
        return this.terms[termKey];
      }
    }
    return null;
  }

  getTerms(): typeof this.terms {
    return this.terms;
  }
}

// ==========================================
// 3. LEARNING SERVICE
// ==========================================
export class LearningService {
  private lessons: Lesson[] = [
    {
      id: "lesson-1",
      title: "Basics of Personal Finance & 50/30/20 Budgeting",
      summary: "Understand how money works, master the 50/30/20 rule, and start your financial journey with confidence.",
      difficulty: "Beginner",
      section: "Budgeting Basics",
      content: "Personal finance is 80% behavior and 20% knowledge. The absolute first step is separating your income into structured buckets. Under the 50/30/20 rule: 50% goes to Needs (rent, bills, groceries), 30% goes to Wants (dinners, subscriptions, gadgets), and 20% goes to Savings & Investments. Before starting any investment journey, ensure you build an Emergency Fund of 3-6 months of expenses.",
      keyPoints: [
        "Create an emergency fund before investing.",
        "Use 50/30/20 for simple expense tracking.",
        "Needs should never exceed 50% of take-home pay."
      ]
    },
    {
      id: "lesson-2",
      title: "The Magic of Compounding & SIP Investing",
      summary: "See how time, not timing, builds massive wealth. Learn how Systematic Investment Plans automate compounding.",
      difficulty: "Beginner",
      section: "Investing Fundamentals",
      content: "Compounding is what Albert Einstein allegedly called the 'Eighth Wonder of the World'. In compounding, you earn returns on your returns. A Systematic Investment Plan (SIP) is a method where you invest a fixed sum at regular intervals (e.g. ₹2,000 monthly). It brings discipline, utilizes Dollar-Cost Averaging (buying more units when prices are low, fewer when high), and avoids the stress of timing the market.",
      keyPoints: [
        "Compounding grows exponentially over time.",
        "SIP enforces monthly savings discipline.",
        "Dollar-cost averaging lowers average acquisition cost."
      ]
    },
    {
      id: "lesson-3",
      title: "Direct Equity vs. Mutual Funds",
      summary: "Demystify stock market vehicles. Compare buying individual stocks with professional mutual fund diversification.",
      difficulty: "Intermediate",
      section: "Investing Vehicles",
      content: "Direct Equity means purchasing individual shares of a company. It offers high potential returns but carries high risk and requires active research. Mutual Funds pool money from thousands of investors, managed by a professional Fund Manager to buy a diversified basket of stocks. Index Funds are passive mutual funds that track market indices (like Nifty 50) with ultra-low expense ratios.",
      keyPoints: [
        "Mutual funds provide instant diversification.",
        "Direct equity requires hours of fundamental research.",
        "Index funds are great for long-term passive investors."
      ]
    },
    {
      id: "lesson-4",
      title: "Indian Tax Optimization: Section 80C & Capital Gains",
      summary: "Navigate the Indian tax regime. Learn how to save tax under 80C with ELSS, PPF and manage capital gains taxes.",
      difficulty: "Intermediate",
      section: "Taxation",
      content: "Tax saved is tax earned. Section 80C allows a deduction of up to ₹1.5 Lakhs per year. Vehicles include ELSS (3-year lock-in, equity exposure), PPF (15-year lock-in, government-backed), and NPS (National Pension System). For tax on stock market gains, Short Term Capital Gains (STCG) is taxed at 20%, whereas Long Term Capital Gains (LTCG) over ₹1.25L is taxed at 12.5%.",
      keyPoints: [
        "ELSS has the shortest lock-in (3 years) among 80C options.",
        "PPF is fully risk-free and tax-exempt (EEE status).",
        "Be mindful of the ₹1.25L tax-free threshold for equity LTCG."
      ]
    },
    {
      id: "lesson-5",
      title: "Goal-Based Retirement Planning & Asset Allocation",
      summary: "Calculate your retirement target number and split your portfolio between equity, debt, and gold dynamically.",
      difficulty: "Advanced",
      section: "Advanced Planning",
      content: "Goal-based planning keeps you focused. Start by determining your retirement corpus (monthly expenses adjusted for inflation * 300). For asset allocation, use the thumb rule: Equity allocation % = '100 minus your age'. Keep the rest in Debt (PPF, G-Secs) and Gold. Rebalance your portfolio annually to maintain your target risk levels.",
      keyPoints: [
        "Inflation erodes purchasing power; calculate inflation-adjusted returns.",
        "Annual portfolio rebalancing locks in gains and manages risk.",
        "Diversify across equity, debt, gold, and international assets."
      ]
    }
  ];

  getLessons(): Lesson[] {
    return this.lessons;
  }

  getLessonById(id: string): Lesson | undefined {
    return this.lessons.find(l => l.id === id);
  }
}

// ==========================================
// 4. QUIZ SERVICE
// ==========================================
export class QuizService {
  private quizzes: { [lessonId: string]: Quiz } = {
    "lesson-1": {
      lessonId: "lesson-1",
      title: "Personal Finance & Budgeting Assessment",
      questions: [
        {
          id: "q1-1",
          question: "Under the 50/30/20 budgeting rule, which bucket should your restaurant dining and vacation spend fall into?",
          options: ["Needs (50%)", "Wants (30%)", "Savings & Debt (20%)", "Emergency Reserve"],
          correctAnswer: 1,
          explanation: "Restaurant dining and vacations are non-essential discretionary expenditures, which fall under the 'Wants (30%)' bucket."
        },
        {
          id: "q1-2",
          question: "Before diving into stock investments, what is the recommended size of an Emergency Fund?",
          options: ["1 month of salary", "3-6 months of essential living expenses", "12 months of wants", "No emergency fund is needed if you have a credit card"],
          correctAnswer: 1,
          explanation: "Keeping 3-6 months of essential expenses in liquid savings protects your long-term investments from being forced to sell during a crisis."
        },
        {
          id: "q1-3",
          question: "Which of the following is considered a 'Need' in the 50/30/20 framework?",
          options: ["Netflix subscription", "Premium gym membership", "Electricity bill and housing rent", "Buying a new gaming console"],
          correctAnswer: 2,
          explanation: "Rent and electricity are basic survival and operational necessities (Needs), while entertainment and subscriptions are Wants."
        }
      ]
    },
    "lesson-2": {
      lessonId: "lesson-2",
      title: "Compounding & SIP Assessment",
      questions: [
        {
          id: "q2-1",
          question: "What is the primary benefit of 'Dollar-Cost Averaging' when doing a monthly SIP?",
          options: [
            "It guarantees you never lose money.",
            "You automatically buy more mutual fund units when prices are low and fewer when prices are high.",
            "It guarantees that you double your money in under 3 years.",
            "It eliminates taxes completely."
          ],
          correctAnswer: 1,
          explanation: "Dollar-cost averaging balances market fluctuations by automatically acquiring more units at lower NAVs (Net Asset Values) and fewer units during peaks."
        },
        {
          id: "q2-2",
          question: "How does compounding interest behave over long periods of time?",
          options: ["It grows linearly (flat rate)", "It grows exponentially (accelerates over time)", "It decreases as inflation rises", "It stays completely constant"],
          correctAnswer: 1,
          explanation: "Compounding is exponential. As interest accumulates, the base upon which interest is earned grows larger every period."
        }
      ]
    },
    "lesson-3": {
      lessonId: "lesson-3",
      title: "Stocks vs Mutual Funds Assessment",
      questions: [
        {
          id: "q3-1",
          question: "What type of mutual fund passively tracks an index like the Nifty 50 and features very low management costs?",
          options: ["Active Equity Fund", "Index Fund", "Sector Fund", "Balanced Debt Fund"],
          correctAnswer: 1,
          explanation: "Index Funds passively copy the holdings of a market index, meaning they require no active manager trading, resulting in ultra-low expense ratios."
        }
      ]
    },
    "lesson-4": {
      lessonId: "lesson-4",
      title: "Tax Planning Assessment",
      questions: [
        {
          id: "q4-1",
          question: "Among tax-saving instruments under Section 80C, which one has the shortest lock-in period of 3 years?",
          options: ["PPF (Public Provident Fund)", "Tax-Saving Fixed Deposit", "ELSS (Equity Linked Savings Scheme)", "NPS (National Pension System)"],
          correctAnswer: 2,
          explanation: "ELSS has a 3-year lock-in period, which is the shortest among all tax-saving investments under Section 80C (PPF is 15 years, tax-saving FDs are 5 years)."
        }
      ]
    }
  };

  getQuizForLesson(lessonId: string): Quiz | null {
    return this.quizzes[lessonId] || null;
  }
}

// ==========================================
// 5. BUDGET MCP SERVICE
// ==========================================
export class BudgetService {
  createBudget(income: number, expenses: { category: string; amount: number }[]): BudgetPlan {
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const savings = income - totalExpenses;
    
    // Core logic
    const needsLimit = income * 0.5;
    const wantsLimit = income * 0.3;
    const savingsLimit = income * 0.2;

    const actualNeeds = expenses
      .filter(e => ["Rent", "Groceries", "Utilities", "Bills", "Insurance"].includes(e.category))
      .reduce((s, i) => s + i.amount, 0);
    const actualWants = expenses
      .filter(e => ["Entertainment", "Dining Out", "Shopping", "Travel", "Subscriptions"].includes(e.category))
      .reduce((s, i) => s + i.amount, 0);

    let suggestedAction = "Your expenses are well distributed. Keep it up!";
    if (actualNeeds > needsLimit) {
      suggestedAction = `Warning: Your essential Needs (₹${actualNeeds}) exceed 50% of your income (₹${needsLimit}). Try reducing monthly bills or lifestyle creep.`;
    } else if (savings < savingsLimit) {
      suggestedAction = `Action Needed: You are only saving ₹${savings} (about ${Math.round((savings/income)*100)}%). Aim to save at least ₹${savingsLimit} (20%) monthly.`;
    }

    const monthlyEssential = actualNeeds > 0 ? actualNeeds : 15000;
    const emergencyGoal = monthlyEssential * 6;

    return {
      income,
      expenses,
      savingsPlan: `Based on your metrics, you save ₹${savings} per month. We suggest automating ₹${Math.max(0, savingsLimit)} directly into mutual funds at the start of the month.`,
      emergencyFundGoal: emergencyGoal,
      suggestedAction,
      expensePrediction: `With current expenditure, your year-end lifestyle savings corpus will be ₹${savings * 12}. Inflation of 6% next year means your essential expenses will rise by ₹${Math.round(actualNeeds * 0.06)}/month.`
    };
  }
}

// ==========================================
// 6. INVESTMENT MCP SERVICE
// ==========================================
export class InvestmentService {
  simulateSIP(monthlyInvestment: number, rateOfReturn: number, years: number): SIPResult {
    const monthlyRate = (rateOfReturn / 100) / 12;
    const months = years * 12;
    
    let futureValue = 0;
    const totalInvestment = monthlyInvestment * months;

    // Formula: FV = P * [ ((1 + i)^n - 1) / i ] * (1 + i)
    futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const wealthGained = Math.max(0, futureValue - totalInvestment);

    const yearlyBreakdown: { year: number; investment: number; interest: number; total: number }[] = [];
    for (let y = 1; y <= years; y++) {
      const curMonths = y * 12;
      const curInvested = monthlyInvestment * curMonths;
      const curTotal = monthlyInvestment * ((Math.pow(1 + monthlyRate, curMonths) - 1) / monthlyRate) * (1 + monthlyRate);
      yearlyBreakdown.push({
        year: y,
        investment: Math.round(curInvested),
        interest: Math.round(Math.max(0, curTotal - curInvested)),
        total: Math.round(curTotal)
      });
    }

    return {
      monthlyInvestment,
      rateOfReturn,
      years,
      totalInvestment: Math.round(totalInvestment),
      wealthGained: Math.round(wealthGained),
      futureValue: Math.round(futureValue),
      yearlyBreakdown
    };
  }
}

// ==========================================
// 7. RAG KNOWLEDGE BASE SERVICE
// ==========================================
export class RAGService {
  private sources: RAGContext[] = [
    {
      id: "rag-1",
      title: "SEBI Master Circular on Mutual Funds",
      source: "Securities and Exchange Board of India (SEBI)",
      url: "https://www.sebi.gov.in",
      category: "Regulation",
      content: "SEBI enforces standard disclosure limits for mutual funds. Expense ratios for Direct plans must be lower than Regular plans since Direct plans do not pay broker commissions. This difference of 0.5% - 1% annually can lead to massive differences in long-term compounding corpus."
    },
    {
      id: "rag-2",
      title: "RBI Retail Direct Scheme Handbook",
      source: "Reserve Bank of India (RBI)",
      url: "https://www.rbi.org.in",
      category: "Government Bonds",
      content: "The RBI Retail Direct Scheme allows retail investors to open and maintain an online 'Retail Direct Gilt Account' directly with the RBI. This enables buying Government Securities (Treasury Bills, G-Secs, and Sovereign Gold Bonds) in the primary auction market with zero portal fees."
    },
    {
      id: "rag-3",
      title: "Income Tax Act, 1961 - Deductions under Section 80C",
      source: "Income Tax Department of India",
      url: "https://www.incometax.gov.in",
      category: "Taxation",
      content: "Taxpayers can claim deductions up to ₹1,50,000 annually under Section 80C of the Income Tax Act. Approved investments include PPF (15yr lock-in), ELSS Mutual Funds (3yr lock-in), Employee Provident Fund (EPF), National Savings Certificates (NSC), and Principal repayment of housing loans."
    },
    {
      id: "rag-4",
      title: "SEBI Guidelines on Financial Risk & Warnings",
      source: "Securities and Exchange Board of India (SEBI)",
      url: "https://www.sebi.gov.in",
      category: "Investor Protection",
      content: "SEBI mandates 'Risk-o-meters' on all mutual fund advertising sheets. Products range from Low, Low-to-Moderate, Moderate, Moderately High, High, to Very High risk. Mutual funds do not offer guaranteed returns. Past performance is not indicative of future returns."
    }
  ];

  retrieveContext(query: string): RAGContext[] {
    const qLower = query.toLowerCase();
    // Simple keyword/semantic simulated matching
    const results = this.sources.filter(source => {
      const matchInContent = source.content.toLowerCase().includes(qLower);
      const matchInTitle = source.title.toLowerCase().includes(qLower);
      const matchInCategory = source.category.toLowerCase().includes(qLower);
      
      // Look for individual key words like 'sebi', 'rbi', 'tax', 'bond', 'sip', 'mutual'
      const keywords = ["sebi", "rbi", "tax", "bond", "direct", "80c", "government", "risk", "discl", "fund"];
      let keywordMatch = false;
      for (const kw of keywords) {
        if (qLower.includes(kw) && (source.content.toLowerCase().includes(kw) || source.title.toLowerCase().includes(kw))) {
          keywordMatch = true;
          break;
        }
      }

      return matchInContent || matchInTitle || matchInCategory || keywordMatch;
    });

    // Fallback to all if no specific keyword match
    return results.length > 0 ? results : this.sources.slice(0, 2);
  }
}
