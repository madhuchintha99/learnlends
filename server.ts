import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

import { 
  UserProfileService, 
  FinanceKnowledgeService, 
  LearningService, 
  QuizService, 
  BudgetService, 
  InvestmentService, 
  RAGService 
} from "./src/mcpServices.js";
import { OrchestrationResult } from "./src/types.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize local services as mock MCP servers
const userProfileService = new UserProfileService();
const financeKnowledgeService = new FinanceKnowledgeService();
const learningService = new LearningService();
const quizService = new QuizService();
const budgetService = new BudgetService();
const investmentService = new InvestmentService();
const ragService = new RAGService();

// Lazy-initialize Gemini API
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "") {
      try {
        aiClient = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
      } catch (err) {
        console.error("Error initializing Gemini API Client:", err);
      }
    }
  }
  return aiClient;
}

// ==========================================
// API ENDPOINTS (MAPPED TO MCP SERVERS)
// ==========================================

// 1. User Profile Endpoints
app.get("/api/mcp/profile", (req, res) => {
  res.json(userProfileService.getProfile());
});

app.post("/api/mcp/profile/update", (req, res) => {
  const updated = userProfileService.updateProfile(req.body);
  res.json(updated);
});

app.post("/api/mcp/profile/add-xp", (req, res) => {
  const { amount } = req.body;
  const result = userProfileService.addXP(amount || 50);
  res.json({ profile: userProfileService.getProfile(), ...result });
});

// 2. Finance Knowledge Endpoints
app.get("/api/mcp/finance/terms", (req, res) => {
  res.json(financeKnowledgeService.getTerms());
});

app.get("/api/mcp/finance/explain", (req, res) => {
  const { term } = req.query;
  const explanation = financeKnowledgeService.explainTerm(String(term || ""));
  if (explanation) {
    res.json(explanation);
  } else {
    res.status(404).json({ error: "Term not found in knowledge base." });
  }
});

// 3. Learning Endpoints
app.get("/api/mcp/learning/lessons", (req, res) => {
  res.json(learningService.getLessons());
});

app.get("/api/mcp/learning/lesson/:id", (req, res) => {
  const lesson = learningService.getLessonById(req.params.id);
  if (lesson) {
    res.json(lesson);
  } else {
    res.status(404).json({ error: "Lesson not found." });
  }
});

// 4. Quiz Endpoints
app.get("/api/mcp/quiz/:lessonId", (req, res) => {
  const quiz = quizService.getQuizForLesson(req.params.lessonId);
  if (quiz) {
    res.json(quiz);
  } else {
    res.status(404).json({ error: "No quiz found for this lesson." });
  }
});

// 5. Budget Endpoints
app.post("/api/mcp/budget/analyze", (req, res) => {
  const { income, expenses } = req.body;
  const budgetPlan = budgetService.createBudget(Number(income || 30000), expenses || []);
  res.json(budgetPlan);
});

// 6. Investment Endpoints
app.post("/api/mcp/investment/simulate", (req, res) => {
  const { monthlyInvestment, rateOfReturn, years } = req.body;
  const simulation = investmentService.simulateSIP(
    Number(monthlyInvestment || 2000),
    Number(rateOfReturn || 12),
    Number(years || 10)
  );
  res.json(simulation);
});

// 7. RAG Endpoints
app.post("/api/mcp/rag/retrieve", (req, res) => {
  const { query } = req.body;
  const contexts = ragService.retrieveContext(String(query || ""));
  res.json(contexts);
});


// ==========================================
// CORE AI ORCHESTRATOR ENDPOINT
// ==========================================
app.post("/api/orchestrate", async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const profile = userProfileService.getProfile();
  const lowerQuery = query.toLowerCase();

  // Step 1: Detect intent and identify which agents to invoke
  const agentsTriggered: string[] = ["User Profile MCP"];
  let triggerInvestment = false;
  let triggerBudget = false;
  let triggerLearning = false;
  let triggerQuiz = false;
  let triggerRAG = false;
  let triggerFinance = false;

  // Simple keyword rules as backup & orchestration triggers
  if (lowerQuery.includes("invest") || lowerQuery.includes("sip") || lowerQuery.includes("return") || lowerQuery.includes("stock") || lowerQuery.includes("grow") || lowerQuery.includes("compounding") || lowerQuery.includes("wealth")) {
    triggerInvestment = true;
    triggerFinance = true;
    agentsTriggered.push("Investment MCP", "Finance Knowledge MCP");
  }
  if (lowerQuery.includes("budget") || lowerQuery.includes("salary") || lowerQuery.includes("earn") || lowerQuery.includes("expense") || lowerQuery.includes("save") || lowerQuery.includes("spend")) {
    triggerBudget = true;
    agentsTriggered.push("Budget MCP");
  }
  if (lowerQuery.includes("learn") || lowerQuery.includes("lesson") || lowerQuery.includes("path") || lowerQuery.includes("study") || lowerQuery.includes("road")) {
    triggerLearning = true;
    agentsTriggered.push("Learning MCP");
  }
  if (lowerQuery.includes("quiz") || lowerQuery.includes("test") || lowerQuery.includes("score") || lowerQuery.includes("evaluate")) {
    triggerQuiz = true;
    agentsTriggered.push("Quiz MCP");
  }
  if (lowerQuery.includes("sebi") || lowerQuery.includes("rbi") || lowerQuery.includes("regulation") || lowerQuery.includes("tax") || lowerQuery.includes("80c") || lowerQuery.includes("scheme") || lowerQuery.includes("gov") || lowerQuery.includes("government")) {
    triggerRAG = true;
    triggerFinance = true;
    agentsTriggered.push("RAG MCP", "Finance Knowledge MCP");
  }

  // Default fallback triggers to make responses comprehensive
  if (agentsTriggered.length === 1) {
    triggerInvestment = true;
    triggerBudget = true;
    triggerLearning = true;
    triggerRAG = true;
    agentsTriggered.push("Budget MCP", "Investment MCP", "Learning MCP", "RAG MCP");
  }

  // Step 2: Query triggered MCP Services
  const mcpOutputs: OrchestrationResult["mcpOutputs"] = { profile };

  if (triggerFinance) {
    // Attempt to explain any term in query
    const termInfo = financeKnowledgeService.explainTerm(query);
    if (termInfo) {
      mcpOutputs.finance = {
        termExplained: { term: termInfo.term, explanation: termInfo.definition, guide: termInfo.example }
      };
    } else {
      // Provide SIP by default
      const defaultTerm = financeKnowledgeService.explainTerm("sip");
      if (defaultTerm) {
        mcpOutputs.finance = {
          termExplained: { term: defaultTerm.term, explanation: defaultTerm.definition, guide: defaultTerm.example }
        };
      }
    }
  }

  if (triggerBudget) {
    // Generate custom budget plan
    const mockExpenses = [
      { category: "Rent", amount: Math.round(profile.income * 0.3) },
      { category: "Groceries", amount: Math.round(profile.income * 0.15) },
      { category: "Utilities", amount: Math.round(profile.income * 0.08) },
      { category: "Dining Out", amount: Math.round(profile.income * 0.12) },
      { category: "Subscriptions", amount: Math.round(profile.income * 0.05) }
    ];
    mcpOutputs.budget = budgetService.createBudget(profile.income, mockExpenses);
  }

  if (triggerInvestment) {
    // Calculate custom compound simulation
    // Standard investment equals remaining cash or 15% of income
    const monthlySaving = Math.round(profile.income * 0.15);
    mcpOutputs.investment = investmentService.simulateSIP(monthlySaving, 12, 10);
  }

  if (triggerLearning) {
    const lessons = learningService.getLessons();
    mcpOutputs.learning = {
      nextLesson: lessons[0],
      path: {
        userId: "user-1",
        title: "Personal Wealth Accelerator",
        lessons: lessons,
        currentLessonId: lessons[0].id,
        progressPercent: 20
      }
    };
  }

  if (triggerQuiz) {
    mcpOutputs.quiz = quizService.getQuizForLesson("lesson-1") || undefined;
  }

  if (triggerRAG) {
    mcpOutputs.rag = ragService.retrieveContext(query);
  } else {
    // Provide a relevant context by default
    mcpOutputs.rag = ragService.retrieveContext("risk");
  }

  // Extract citations
  const citations = (mcpOutputs.rag || []).map(ctx => ({
    source: ctx.source,
    url: ctx.url,
    snippet: ctx.content
  }));

  // Step 3: Run Gemini to generate orchestrated response
  const ai = getGeminiClient();
  let responseMarkdown = "";

  if (ai) {
    try {
      const promptContext = `
        User Query: "${query}"
        User Profile: Age: ${profile.age}, Income: ₹${profile.income}/month, Occupation: "${profile.occupation}", Risk Profile: "${profile.riskProfile}".
        
        Retrieved Tool Outputs from specialized MCP servers:
        ${mcpOutputs.finance ? `- Finance Knowledge: Term: ${mcpOutputs.finance.termExplained?.term}. Explanation: ${mcpOutputs.finance.termExplained?.explanation}` : ""}
        ${mcpOutputs.budget ? `- Budget Planner: Suggested Action: "${mcpOutputs.budget.suggestedAction}". Emergency Goal: ₹${mcpOutputs.budget.emergencyFundGoal}` : ""}
        ${mcpOutputs.investment ? `- Investment Simulator: Investing ₹${mcpOutputs.investment.monthlyInvestment}/month for ${mcpOutputs.investment.years} years at ${mcpOutputs.investment.rateOfReturn}% yields estimated future value of ₹${mcpOutputs.investment.futureValue.toLocaleString('en-IN')}` : ""}
        ${mcpOutputs.learning ? `- Learning Roadmap: Next recommended lesson: "${mcpOutputs.learning.nextLesson?.title}"` : ""}
        ${mcpOutputs.rag ? `- Trusted Citations (RBI/SEBI/Income Tax): ${mcpOutputs.rag.map(r => `[Source: ${r.source}] ${r.content}`).join(" | ")}` : ""}
        
        Task:
        Act as the LearnLends AI Orchestrator. Write a highly tailored, encouraging, and comprehensive financial planning response. 
        Structure your response with elegant sections:
        1. 🎯 Personal Financial Overview (refer to age, income and their goals)
        2. 📊 Budgeting Deep Dive (analyze their income, suggest exact allocations based on 50/30/20)
        3. 📈 Wealth Accumulation Projection (provide the compounding SIP numbers directly)
        4. 🎓 Step-by-Step Learning Recommendation (recommend a structured lesson and explain why)
        5. 🛡️ Regulatory and Risk Considerations (clearly cite the SEBI or RBI rules retrieved in the context)

        Use friendly professional formatting and bold typography.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptContext
      });

      responseMarkdown = response.text || "";
    } catch (err) {
      console.error("Gemini call failed, using high-quality local fallback:", err);
    }
  }

  // Step 4: High-Quality Fallback Generation if Gemini is offline/disabled
  if (!responseMarkdown) {
    const yearsStr = mcpOutputs.investment ? `${mcpOutputs.investment.years} years` : "10 years";
    const monthlySip = mcpOutputs.investment ? mcpOutputs.investment.monthlyInvestment : 3000;
    const fValue = mcpOutputs.investment ? mcpOutputs.investment.futureValue : 670000;
    const actionStr = mcpOutputs.budget ? mcpOutputs.budget.suggestedAction : "Automate 20% savings.";
    const emgGoal = mcpOutputs.budget ? mcpOutputs.budget.emergencyFundGoal : 90000;

    responseMarkdown = `### 🎯 Personal Financial Overview
Hello! As your **LearnLends AI Orchestrator**, I have coordinated several specialized MCP agents to map out a clear investment pathway for you. 

Being **${profile.age} years old** and earning **₹${profile.income.toLocaleString('en-IN')}/month** places you in an ideal phase of life. You have the ultimate asset on your side: **Time**. Your risk profile is **${profile.riskProfile}**, allowing you to balance steady growth with calculated wealth drivers.

---

### 📊 Budgeting Deep Dive (Power of 50/30/20)
The **Budget MCP Agent** analyzed your cash flow and recommends the following optimized structure:
*   **Needs (50% - Essential Rent, Utilities, Food):** Limit to **₹${(profile.income * 0.5).toLocaleString('en-IN')}/month**.
*   **Wants (30% - Lifestyle, Dining Out, Gadgets):** Limit to **₹${(profile.income * 0.3).toLocaleString('en-IN')}/month**.
*   **Savings & Debt (20% - Future Wealth):** Save at least **₹${(profile.income * 0.2).toLocaleString('en-IN')}/month**.

**⚠️ Live Assessment Rule:** 
*   *Action:* **${actionStr}**
*   *Emergency Fund Target:* Keep **₹${emgGoal.toLocaleString('en-IN')}** in high-yield liquid instruments before aggressive trading.

---

### 📈 Wealth Accumulation Projection (SIP Simulation)
By dedicating just **₹${monthlySip.toLocaleString('en-IN')}/month** (which represents your recommended 15-20% savings rate), the **Investment MCP Agent** projects the following compound interest outcome over **${yearsStr}** at an average return rate of **12% p.a.**:
*   **Your Total Principal Contributed:** ₹${(mcpOutputs.investment ? mcpOutputs.investment.totalInvestment : 360000).toLocaleString('en-IN')}
*   **Compound Interest Wealth Generated:** ₹${(mcpOutputs.investment ? mcpOutputs.investment.wealthGained : 310000).toLocaleString('en-IN')}
*   **Expected Future Portfolio Value:** **₹${fValue.toLocaleString('en-IN')}**

---

### 🎓 Step-by-Step Learning Recommendation
The **Learning MCP Agent** recommends starting immediately with:
1.  **Lesson 1:** *${mcpOutputs.learning?.nextLesson?.title || "Basics of Personal Finance & Budgeting"}*
    *   *Why:* To solidify your understanding of liquidity, inflation adjustments, and lock-in products.
2.  **Next Milestone:** Complete the **Compounding Quiz** to earn **+50 XP** and secure your **"Fin-Guru"** Badge.

---

### 🛡️ Regulatory and Risk Considerations (RBI & SEBI Citations)
*   **[SEBI Mutual Fund Circular]:** Direct investment plans yield up to **1% more annual compounding returns** compared to broker regular plans because broker commissions are completely bypassed.
*   **[SEBI Risk Disclosure]:** Remember, mutual funds do not offer guaranteed returns. Past performance is not a guarantee of future outcomes. Make sure to assess risk-o-meters before purchase.
`;
  }

  const result: OrchestrationResult = {
    query,
    analysis: {
      intentDetected: triggerRAG ? "Regulatory / Policy Inquiry" : "General Personal Financial Planning",
      agentsTriggered
    },
    mcpOutputs,
    responseMarkdown,
    citations
  };

  res.json(result);
});


// ==========================================
// VITE DEV SERVER AND PRODUCTION SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LearnLends Backend Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
