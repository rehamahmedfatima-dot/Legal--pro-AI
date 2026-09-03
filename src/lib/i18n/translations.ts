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

export interface Dictionary {
  nav: NavDictionary;
  home: HomeDictionary;
  services: ServicesDictionary;
  auth: AuthDictionary;
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
    }
  }
};

export function getDictionary(locale: Locale): Dictionary {
  return translations[locale];
}
