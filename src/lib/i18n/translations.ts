import type { Locale } from "./locale";

export interface NavDictionary {
  home: string;
  services: string;
  login: string;
  signUp: string;
  dashboard: string;
  signOut: string;
}

export interface HomeDictionary {
  title: string;
  subtitle: string;
  bookConsultation: string;
  ourServices: string;
  statCasesHandled: string;
  statSuccessRate: string;
  statYearsExperience: string;
  statClientsServed: string;
  practiceAreasTitle: string;
  practiceAreaDescription: string;
}

export interface ServicesDictionary {
  title: string;
  subtitle: string;
  benefits: string;
  process: string;
  duration: string;
  bookConsultation: string;
}

export interface AuthDictionary {
  welcomeBack: string;
  signInSubtitle: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  signIn: string;
  continueWithGoogle: string;
  dontHaveAccount: string;
  createOne: string;
  createAccountTitle: string;
  createAccountSubtitle: string;
  createAccount: string;
  alreadyHaveAccount: string;
  signInLink: string;
  checkInbox: string;
}

/** Shared labels for case/appointment status values stored in the database. */
export interface StatusDictionary {
  open: string;
  in_progress: string;
  pending_court: string;
  closed: string;
  appealed: string;
  pending: string;
  confirmed: string;
  completed: string;
  cancelled: string;
  rescheduled: string;
  in_person: string;
  video: string;
  phone: string;
}

/** Shared labels for the four case priority values. */
export interface PriorityDictionary {
  low: string;
  medium: string;
  high: string;
  urgent: string;
}

export interface ClientDashboardDictionary {
  welcomeBack: string;
  subtitle: string;
  yourCases: string;
  noCases: string;
  priority: string;
  upcomingAppointments: string;
  noAppointments: string;
  aiAssistantTitle: string;
}

export interface LawyerDashboardDictionary {
  title: string;
  newCase: string;
  openCases: string;
  activeClients: string;
  recentCases: string;
  aiToolsTitle: string;
  contractAnalyzerTitle: string;
  contractAnalyzerDesc: string;
  documentGeneratorTitle: string;
  documentGeneratorDesc: string;
  recentCasesTitle: string;
  noCasesYet: string;
}

export interface AiAssistantDictionary {
  title: string;
  disclaimer: string;
  thinking: string;
  placeholder: string;
  send: string;
}

export interface Dictionary {
  nav: NavDictionary;
  home: HomeDictionary;
  services: ServicesDictionary;
  auth: AuthDictionary;
  status: StatusDictionary;
  priority: PriorityDictionary;
  clientDashboard: ClientDashboardDictionary;
  lawyerDashboard: LawyerDashboardDictionary;
  aiAssistant: AiAssistantDictionary;
}

export const translations: Record<Locale, Dictionary> = {
  ar: {
    nav: {
      home: "الرئيسية",
      services: "خدماتنا",
      login: "تسجيل الدخول",
      signUp: "إنشاء حساب",
      dashboard: "لوحة التحكم",
      signOut: "تسجيل الخروج"
    },
    home: {
      title: "حلول قانونية ذكية. خدمة احترافية موثوقة.",
      subtitle:
        "منصة LegalPro AI تجمع إدارة القضايا، والتواصل مع العملاء، وأدوات الذكاء الاصطناعي القانونية في مكان واحد متكامل.",
      bookConsultation: "احجز استشارة",
      ourServices: "خدماتنا",
      statCasesHandled: "قضية تم التعامل معها",
      statSuccessRate: "نسبة النجاح",
      statYearsExperience: "سنوات الخبرة",
      statClientsServed: "عميل تم خدمته",
      practiceAreasTitle: "مجالات الممارسة",
      practiceAreaDescription: "استشارة وتمثيل قانوني احترافي."
    },
    services: {
      title: "خدماتنا",
      subtitle:
        "خدمات قانونية احترافية في كل مجالات الممارسة، مدعومة بمنصة إدارة قضايا حديثة.",
      benefits: "المزايا",
      process: "خطوات العمل",
      duration: "المدة التقديرية",
      bookConsultation: "احجز استشارة"
    },
    auth: {
      welcomeBack: "أهلًا بعودتك",
      signInSubtitle: "سجّل الدخول لحسابك في LegalPro AI.",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      fullName: "الاسم الكامل",
      signIn: "تسجيل الدخول",
      continueWithGoogle: "الدخول باستخدام Google",
      dontHaveAccount: "ليس لديك حساب؟",
      createOne: "أنشئ حساب جديد",
      createAccountTitle: "أنشئ حساب عميل جديد",
      createAccountSubtitle:
        "حسابات المحامين والإدارة يتم إنشاؤها من قبل المكتب — تواصل معنا لو محتاج واحد.",
      createAccount: "إنشاء الحساب",
      alreadyHaveAccount: "لديك حساب بالفعل؟",
      signInLink: "سجّل الدخول",
      checkInbox: "تحقق من بريدك الإلكتروني لتأكيد الحساب، ثم"
    },
    status: {
      open: "مفتوحة",
      in_progress: "جارٍ العمل عليها",
      pending_court: "بانتظار المحكمة",
      closed: "مغلقة",
      appealed: "مستأنفة",
      pending: "قيد الانتظار",
      confirmed: "مؤكد",
      completed: "مكتمل",
      cancelled: "ملغى",
      rescheduled: "تمت إعادة الجدولة",
      in_person: "حضوري",
      video: "عبر الفيديو",
      phone: "عبر الهاتف"
    },
    priority: {
      low: "منخفضة",
      medium: "متوسطة",
      high: "عالية",
      urgent: "عاجلة"
    },
    clientDashboard: {
      welcomeBack: "أهلًا بعودتك",
      subtitle: "إليك نظرة عامة على قضاياك ومواعيدك القادمة.",
      yourCases: "قضاياك",
      noCases: "لا توجد لديك قضايا نشطة بعد.",
      priority: "الأولوية",
      upcomingAppointments: "المواعيد القادمة",
      noAppointments: "لا توجد مواعيد قادمة.",
      aiAssistantTitle: "المساعد القانوني الذكي"
    },
    lawyerDashboard: {
      title: "لوحة تحكم المحامي",
      newCase: "+ قضية جديدة",
      openCases: "قضايا مفتوحة",
      activeClients: "عملاء نشطون",
      recentCases: "قضايا حديثة",
      aiToolsTitle: "أدوات الذكاء الاصطناعي",
      contractAnalyzerTitle: "محلل العقود بالذكاء الاصطناعي",
      contractAnalyzerDesc:
        "ارفع عقدًا للحصول على تحليل للمخاطر والالتزامات والحقوق والبنود الناقصة.",
      documentGeneratorTitle: "مولّد المستندات بالذكاء الاصطناعي",
      documentGeneratorDesc:
        "ولّد مسودة قابلة للتعديل لعقد أو إنذار أو توكيل أو مستند قانوني آخر من فورم بسيط.",
      recentCasesTitle: "القضايا الحديثة",
      noCasesYet: "لا توجد قضايا بعد — أنشئ أول قضية."
    },
    aiAssistant: {
      title: "المساعد القانوني الذكي",
      disclaimer: "هذا المساعد لا يغني عن الاستشارة القانونية المتخصصة.",
      thinking: "جارٍ التفكير…",
      placeholder: "اسأل سؤالًا قانونيًا عامًا…",
      send: "إرسال"
    }
  },
  en: {
    nav: {
      home: "Home",
      services: "Services",
      login: "Login",
      signUp: "Sign Up",
      dashboard: "Dashboard",
      signOut: "Sign out"
    },
    home: {
      title: "Smart Legal Solutions. Trusted Professional Service.",
      subtitle:
        "LegalPro AI brings case management, client collaboration, and AI-powered legal tools into a single premium platform.",
      bookConsultation: "Book a Consultation",
      ourServices: "Our Services",
      statCasesHandled: "Cases Handled",
      statSuccessRate: "Success Rate",
      statYearsExperience: "Years of Experience",
      statClientsServed: "Clients Served",
      practiceAreasTitle: "Practice Areas",
      practiceAreaDescription: "Professional consultation and representation."
    },
    services: {
      title: "Our Services",
      subtitle:
        "Professional legal services across every practice area, backed by a modern case management platform.",
      benefits: "Benefits",
      process: "Process",
      duration: "Estimated duration",
      bookConsultation: "Book a Consultation"
    },
    auth: {
      welcomeBack: "Welcome back",
      signInSubtitle: "Sign in to your LegalPro AI account.",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm password",
      fullName: "Full name",
      signIn: "Sign in",
      continueWithGoogle: "Continue with Google",
      dontHaveAccount: "Don't have an account?",
      createOne: "Create one",
      createAccountTitle: "Create your client account",
      createAccountSubtitle:
        "Lawyer and admin accounts are created by the firm — contact us if you need one.",
      createAccount: "Create account",
      alreadyHaveAccount: "Already have an account?",
      signInLink: "Sign in",
      checkInbox: "Check your inbox to confirm your email, then"
    },
    status: {
      open: "Open",
      in_progress: "In Progress",
      pending_court: "Pending Court",
      closed: "Closed",
      appealed: "Appealed",
      pending: "Pending",
      confirmed: "Confirmed",
      completed: "Completed",
      cancelled: "Cancelled",
      rescheduled: "Rescheduled",
      in_person: "In Person",
      video: "Video",
      phone: "Phone"
    },
    priority: {
      low: "Low",
      medium: "Medium",
      high: "High",
      urgent: "Urgent"
    },
    clientDashboard: {
      welcomeBack: "Welcome back",
      subtitle: "Here is an overview of your cases and upcoming appointments.",
      yourCases: "Your Cases",
      noCases: "You have no active cases yet.",
      priority: "Priority",
      upcomingAppointments: "Upcoming Appointments",
      noAppointments: "No upcoming appointments.",
      aiAssistantTitle: "AI Legal Assistant"
    },
    lawyerDashboard: {
      title: "Lawyer Dashboard",
      newCase: "+ New Case",
      openCases: "Open Cases",
      activeClients: "Active Clients",
      recentCases: "Recent Cases",
      aiToolsTitle: "AI Tools",
      contractAnalyzerTitle: "AI Contract Analyzer",
      contractAnalyzerDesc:
        "Upload a contract to get clause risks, obligations, rights, and missing-clause recommendations.",
      documentGeneratorTitle: "AI Document Generator",
      documentGeneratorDesc:
        "Generate an editable draft contract, notice, POA, or other legal document from a short form.",
      recentCasesTitle: "Recent Cases",
      noCasesYet: "No cases yet — create your first one."
    },
    aiAssistant: {
      title: "AI Legal Assistant",
      disclaimer: "This AI does not replace professional legal advice.",
      thinking: "Thinking…",
      placeholder: "Ask a general legal question…",
      send: "Send"
    }
  }
};

export function getDictionary(locale: Locale): Dictionary {
  return translations[locale];
    }
