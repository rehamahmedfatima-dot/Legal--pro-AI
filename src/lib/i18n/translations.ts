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

/** Shared labels for case_timeline_events.event_type values. */
export interface EventTypeDictionary {
  created: string;
  document_added: string;
  court_session: string;
  deadline: string;
  evidence_added: string;
  note: string;
  decision: string;
  appeal: string;
  result: string;
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

export interface NewCaseDictionary {
  pageTitle: string;
  caseTitle: string;
  titlePlaceholder: string;
  category: string;
  categoryPlaceholder: string;
  client: string;
  selectClient: string;
  priority: string;
  court: string;
  judge: string;
  summary: string;
  createCase: string;
}

export interface CaseDetailDictionary {
  client: string;
  courtDetails: string;
  notAssigned: string;
  judge: string;
  summary: string;
  timeline: string;
  aiCaseAnalysis: string;
}

export interface AdminDashboardDictionary {
  title: string;
  subtitle: string;
  lawyers: string;
  clients: string;
  openCases: string;
  totalCases: string;
  appointments: string;
  manageLawyers: string;
  viewClients: string;
  recentCasesTitle: string;
  noCasesYet: string;
}

export interface AdminLawyersDictionary {
  title: string;
  promoteTitle: string;
  promoteDesc: string;
  clientEmail: string;
  makeLawyer: string;
  currentLawyers: string;
  noLawyersYet: string;
  joined: string;
}

export interface AdminClientsDictionary {
  title: string;
  noClientsYet: string;
  casesCount: string;
  joined: string;
}

export interface ContractAnalyzerDictionary {
  pageTitle: string;
  uploadTitle: string;
  uploadDesc: string;
  analyzeButton: string;
  uploading: string;
  analyzing: string;
  summaryTitle: string;
  risksTitle: string;
  obligationsTitle: string;
  rightsTitle: string;
  missingClausesTitle: string;
  recommendationsTitle: string;
  noneIdentified: string;
  recentAnalyses: string;
}

export interface DocumentTypeLabels {
  contract: string;
  legal_notice: string;
  power_of_attorney: string;
  declaration: string;
  court_request: string;
  legal_letter: string;
  employment_contract: string;
  rental_contract: string;
  purchase_agreement: string;
  company_formation: string;
}

export interface DocumentGeneratorDictionary {
  pageTitle: string;
  formTitle: string;
  documentType: string;
  titleLabel: string;
  titlePlaceholder: string;
  partyA: string;
  partyB: string;
  keyTerms: string;
  keyTermsPlaceholder: string;
  language: string;
  arabic: string;
  english: string;
  generateDraft: string;
  draftTitle: string;
  recentlyGenerated: string;
  types: DocumentTypeLabels;
}

export interface CaseAiWorkspaceDictionary {
  summaryCardTitle: string;
  summaryCardDesc: string;
  additionalTextPlaceholder: string;
  generateSummaryButton: string;
  summaryTitle: string;
  factsTitle: string;
  legalIssuesTitle: string;
  strengthsTitle: string;
  weaknessesTitle: string;
  missingInfoTitle: string;
  evidenceTitle: string;
  peopleTitle: string;
  noneIdentified: string;
  strategyCardTitle: string;
  strategyDisclaimer: string;
  generateStrategyButton: string;
  openQuestionsTitle: string;
  missingDocumentsTitle: string;
  researchFlagsTitle: string;
  discussionTopicsTitle: string;
  deadlineRemindersTitle: string;
}

export interface MessagingDictionary {
  title: string;
  noContacts: string;
  noMessagesYet: string;
  typePlaceholder: string;
  send: string;
  unreadSuffix: string;
  dashboardCardTitle: string;
  dashboardCardDesc: string;
}

export interface Dictionary {
  nav: NavDictionary;
  home: HomeDictionary;
  services: ServicesDictionary;
  auth: AuthDictionary;
  status: StatusDictionary;
  priority: PriorityDictionary;
  eventType: EventTypeDictionary;
  clientDashboard: ClientDashboardDictionary;
  lawyerDashboard: LawyerDashboardDictionary;
  aiAssistant: AiAssistantDictionary;
  newCase: NewCaseDictionary;
  caseDetail: CaseDetailDictionary;
  adminDashboard: AdminDashboardDictionary;
  adminLawyers: AdminLawyersDictionary;
  adminClients: AdminClientsDictionary;
  contractAnalyzer: ContractAnalyzerDictionary;
  documentGenerator: DocumentGeneratorDictionary;
  caseAiWorkspace: CaseAiWorkspaceDictionary;
  messaging: MessagingDictionary;
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
    eventType: {
      created: "تم إنشاء القضية",
      document_added: "تمت إضافة مستند",
      court_session: "جلسة محكمة",
      deadline: "موعد نهائي",
      evidence_added: "تمت إضافة دليل",
      note: "ملاحظة",
      decision: "قرار المحكمة",
      appeal: "تم تقديم استئناف",
      result: "النتيجة النهائية"
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
    },
    newCase: {
      pageTitle: "فتح قضية جديدة",
      caseTitle: "عنوان القضية",
      titlePlaceholder: "مثال: نزاع تجاري — شركة ABC للتجارة",
      category: "التصنيف",
      categoryPlaceholder: "مثال: القانون التجاري",
      client: "العميل",
      selectClient: "اختر عميلًا",
      priority: "الأولوية",
      court: "المحكمة (اختياري)",
      judge: "القاضي (اختياري)",
      summary: "ملخص (اختياري)",
      createCase: "إنشاء القضية"
    },
    caseDetail: {
      client: "العميل",
      courtDetails: "تفاصيل المحكمة",
      notAssigned: "لم يتم التعيين بعد",
      judge: "القاضي",
      summary: "الملخص",
      timeline: "الخط الزمني للقضية",
      aiCaseAnalysis: "تحليل القضية بالذكاء الاصطناعي"
    },
    adminDashboard: {
      title: "لوحة تحكم الإدارة",
      subtitle: "نظرة عامة على المنصة بالكامل عبر جميع المحامين والعملاء.",
      lawyers: "المحامون",
      clients: "العملاء",
      openCases: "قضايا مفتوحة",
      totalCases: "إجمالي القضايا",
      appointments: "المواعيد",
      manageLawyers: "إدارة المحامين",
      viewClients: "عرض العملاء",
      recentCasesTitle: "القضايا الحديثة (كل المحامين)",
      noCasesYet: "لا توجد قضايا بعد."
    },
    adminLawyers: {
      title: "إدارة المحامين",
      promoteTitle: "ترقية عميل إلى محامٍ",
      promoteDesc: "أدخل بريد عميل موجود لمنحه صلاحيات محامٍ.",
      clientEmail: "بريد العميل الإلكتروني",
      makeLawyer: "تحويل إلى محامٍ",
      currentLawyers: "المحامون الحاليون",
      noLawyersYet: "لا يوجد محامون بعد.",
      joined: "انضم في"
    },
    adminClients: {
      title: "العملاء",
      noClientsYet: "لا يوجد عملاء بعد.",
      casesCount: "قضية/قضايا",
      joined: "انضم في"
    },
    contractAnalyzer: {
      pageTitle: "محلل العقود بالذكاء الاصطناعي",
      uploadTitle: "رفع عقد",
      uploadDesc:
        "ملف PDF أو DOCX، حتى 15 ميجابايت. هذا الذكاء الاصطناعي لا يغني عن الاستشارة القانونية المتخصصة.",
      analyzeButton: "تحليل العقد",
      uploading: "جارٍ الرفع…",
      analyzing: "جارٍ التحليل…",
      summaryTitle: "الملخص",
      risksTitle: "المخاطر",
      obligationsTitle: "الالتزامات",
      rightsTitle: "الحقوق",
      missingClausesTitle: "البنود الناقصة",
      recommendationsTitle: "التوصيات",
      noneIdentified: "لم يتم تحديد أي شيء.",
      recentAnalyses: "التحليلات الأخيرة"
    },
    documentGenerator: {
      pageTitle: "مولّد المستندات بالذكاء الاصطناعي",
      formTitle: "توليد مستند قانوني",
      documentType: "نوع المستند",
      titleLabel: "العنوان",
      titlePlaceholder: "مثال: عقد إيجار — مكتب وسط البلد",
      partyA: "الطرف الأول",
      partyB: "الطرف الثاني",
      keyTerms: "الشروط الأساسية",
      keyTermsPlaceholder: "المدة، شروط الدفع، الالتزامات، الاختصاص القضائي…",
      language: "اللغة",
      arabic: "العربية",
      english: "الإنجليزية",
      generateDraft: "توليد المسودة",
      draftTitle: "مسودة — للمراجعة من قبل محامٍ مرخّص قبل الاستخدام",
      recentlyGenerated: "المستندات المولّدة مؤخرًا",
      types: {
        contract: "عقد عام",
        legal_notice: "إنذار قانوني",
        power_of_attorney: "توكيل",
        declaration: "إقرار",
        court_request: "طلب للمحكمة",
        legal_letter: "خطاب قانوني",
        employment_contract: "عقد عمل",
        rental_contract: "عقد إيجار",
        purchase_agreement: "عقد بيع",
        company_formation: "مستند تأسيس شركة"
      }
    },
    caseAiWorkspace: {
      summaryCardTitle: "ملخص القضية بالذكاء الاصطناعي",
      summaryCardDesc:
        "يستخدم الملخص والخط الزمني الحاليين للقضية. يمكنك إضافة ملاحظات إضافية أدناه قبل التوليد.",
      additionalTextPlaceholder: "الصق ملاحظات أو نصوص مستندات إضافية عن القضية (اختياري)…",
      generateSummaryButton: "توليد ملخص بالذكاء الاصطناعي",
      summaryTitle: "الملخص",
      factsTitle: "الوقائع",
      legalIssuesTitle: "المسائل القانونية",
      strengthsTitle: "نقاط القوة",
      weaknessesTitle: "نقاط الضعف",
      missingInfoTitle: "معلومات ناقصة",
      evidenceTitle: "الأدلة",
      peopleTitle: "الأشخاص المعنيون",
      noneIdentified: "لم يتم تحديد أي شيء.",
      strategyCardTitle: "استراتيجية قانونية بالذكاء الاصطناعي — اقتراحات تنظيمية",
      strategyDisclaimer:
        "هذه اقتراحات تنظيمية فقط — وليست استشارة قانونية أو استراتيجية تقاضٍ.",
      generateStrategyButton: "توليد ملاحظات تنظيمية",
      openQuestionsTitle: "أسئلة مفتوحة",
      missingDocumentsTitle: "مستندات ناقصة",
      researchFlagsTitle: "مجالات تحتاج بحثًا إضافيًا",
      discussionTopicsTitle: "مواضيع للمناقشة مع العميل",
      deadlineRemindersTitle: "تذكيرات بالمواعيد الإجرائية النهائية"
    },
    messaging: {
      title: "الرسائل",
      noContacts: "لا يوجد أشخاص متاحون للمراسلة بعد.",
      noMessagesYet: "لا توجد رسائل بعد. ابدأ المحادثة.",
      typePlaceholder: "اكتب رسالة…",
      send: "إرسال",
      unreadSuffix: "غير مقروءة",
      dashboardCardTitle: "الرسائل",
      dashboardCardDesc: "تواصل مباشرة مع محاميك/عملائك بخصوص القضايا الجارية."
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
    eventType: {
      created: "Case Created",
      document_added: "Document Added",
      court_session: "Court Session",
      deadline: "Deadline",
      evidence_added: "Evidence Added",
      note: "Note",
      decision: "Court Decision",
      appeal: "Appeal Filed",
      result: "Final Result"
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
    },
    newCase: {
      pageTitle: "Open a New Case",
      caseTitle: "Case title",
      titlePlaceholder: "e.g. Commercial dispute — ABC Trading",
      category: "Category",
      categoryPlaceholder: "e.g. Commercial Law",
      client: "Client",
      selectClient: "Select a client",
      priority: "Priority",
      court: "Court (optional)",
      judge: "Judge (optional)",
      summary: "Summary (optional)",
      createCase: "Create Case"
    },
    caseDetail: {
      client: "Client",
      courtDetails: "Court Details",
      notAssigned: "Not assigned yet",
      judge: "Judge",
      summary: "Summary",
      timeline: "Case Timeline",
      aiCaseAnalysis: "AI Case Analysis"
    },
    adminDashboard: {
      title: "Admin Dashboard",
      subtitle: "Platform-wide overview across all lawyers and clients.",
      lawyers: "Lawyers",
      clients: "Clients",
      openCases: "Open Cases",
      totalCases: "Total Cases",
      appointments: "Appointments",
      manageLawyers: "Manage Lawyers",
      viewClients: "View Clients",
      recentCasesTitle: "Recent Cases (all lawyers)",
      noCasesYet: "No cases yet."
    },
    adminLawyers: {
      title: "Manage Lawyers",
      promoteTitle: "Promote a Client to Lawyer",
      promoteDesc: "Enter the email of an existing client account to give it lawyer access.",
      clientEmail: "Client email",
      makeLawyer: "Make Lawyer",
      currentLawyers: "Current Lawyers",
      noLawyersYet: "No lawyers yet.",
      joined: "Joined"
    },
    adminClients: {
      title: "Clients",
      noClientsYet: "No clients yet.",
      casesCount: "case(s)",
      joined: "Joined"
    },
    contractAnalyzer: {
      pageTitle: "AI Contract Analyzer",
      uploadTitle: "Upload a Contract",
      uploadDesc: "PDF or DOCX, up to 15MB. This AI does not replace professional legal advice.",
      analyzeButton: "Analyze Contract",
      uploading: "Uploading…",
      analyzing: "Analyzing…",
      summaryTitle: "Summary",
      risksTitle: "Risks",
      obligationsTitle: "Obligations",
      rightsTitle: "Rights",
      missingClausesTitle: "Missing Clauses",
      recommendationsTitle: "Recommendations",
      noneIdentified: "None identified.",
      recentAnalyses: "Recent Analyses"
    },
    documentGenerator: {
      pageTitle: "AI Document Generator",
      formTitle: "Generate a Legal Document",
      documentType: "Document type",
      titleLabel: "Title",
      titlePlaceholder: "e.g. Rental Agreement — Downtown Office",
      partyA: "Party A",
      partyB: "Party B",
      keyTerms: "Key terms",
      keyTermsPlaceholder: "Duration, payment terms, obligations, jurisdiction…",
      language: "Language",
      arabic: "Arabic",
      english: "English",
      generateDraft: "Generate Draft",
      draftTitle: "Draft — for review by a licensed lawyer before use",
      recentlyGenerated: "Recently Generated",
      types: {
        contract: "General Contract",
        legal_notice: "Legal Notice",
        power_of_attorney: "Power of Attorney",
        declaration: "Declaration",
        court_request: "Court Request",
        legal_letter: "Legal Letter",
        employment_contract: "Employment Contract",
        rental_contract: "Rental Contract",
        purchase_agreement: "Purchase Agreement",
        company_formation: "Company Formation Document"
      }
    },
    caseAiWorkspace: {
      summaryCardTitle: "AI Case Summary",
      summaryCardDesc:
        "Uses this case's existing summary and timeline. Optionally add extra notes below before generating.",
      additionalTextPlaceholder: "Paste additional case notes or documents text (optional)…",
      generateSummaryButton: "Generate AI Summary",
      summaryTitle: "Summary",
      factsTitle: "Facts",
      legalIssuesTitle: "Legal Issues",
      strengthsTitle: "Strengths",
      weaknessesTitle: "Weaknesses",
      missingInfoTitle: "Missing Information",
      evidenceTitle: "Evidence",
      peopleTitle: "People Involved",
      noneIdentified: "None identified.",
      strategyCardTitle: "AI Legal Strategy — Organizational Suggestions",
      strategyDisclaimer:
        "These are organizational suggestions only — not legal advice or litigation strategy.",
      generateStrategyButton: "Generate Strategy Notes",
      openQuestionsTitle: "Open Questions",
      missingDocumentsTitle: "Missing Documents",
      researchFlagsTitle: "Areas for Further Research",
      discussionTopicsTitle: "Topics to Discuss with Client",
      deadlineRemindersTitle: "Procedural Deadline Reminders"
    },
    messaging: {
      title: "Messages",
      noContacts: "No one available to message yet.",
      noMessagesYet: "No messages yet. Start the conversation.",
      typePlaceholder: "Type a message…",
      send: "Send",
      unreadSuffix: "unread",
      dashboardCardTitle: "Messages",
      dashboardCardDesc: "Message your lawyer/clients directly about ongoing cases."
    }
  }
};

export function getDictionary(locale: Locale): Dictionary {
  return translations[locale];
  }
