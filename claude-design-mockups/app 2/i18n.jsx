/* Geera — i18n strings (EN + AR). Keep keys flat & namespaced. */

const STR = {
  // Brand & meta
  "brand.name":          { en: "Djera",                                   ar: "جيرا" },
  "brand.tag":           { en: "Drive your city.",                         ar: "قُد مدينتك." },
  "unit.currency":       { en: "LYD",                                      ar: "د.ل" },
  "unit.km":             { en: "km",                                       ar: "كم" },
  "unit.min":            { en: "min",                                      ar: "دق" },
  "unit.hr":             { en: "h",                                        ar: "س" },

  // Common
  "common.continue":     { en: "Continue",                                 ar: "متابعة" },
  "common.next":         { en: "Next",                                     ar: "التالي" },
  "common.back":         { en: "Back",                                     ar: "رجوع" },
  "common.cancel":       { en: "Cancel",                                   ar: "إلغاء" },
  "common.confirm":      { en: "Confirm",                                  ar: "تأكيد" },
  "common.done":         { en: "Done",                                     ar: "تم" },
  "common.skip":         { en: "Skip",                                     ar: "تخطّي" },
  "common.search":       { en: "Search",                                   ar: "بحث" },

  // Welcome
  "wel.title":           { en: "Drive your city,\nyour way.",              ar: "قُد مدينتك،\nبأسلوبك." },
  "wel.sub":             { en: "Earn on every trip, paid in cash, no middleman. Built for Libya's drivers.",
                           ar: "اربح من كل رحلة، نقدًا، دون وسيط. صُمّم لسائقي ليبيا." },
  "wel.cta":             { en: "Start driving",                            ar: "ابدأ القيادة" },
  "wel.signin":          { en: "I already have an account",                ar: "لديّ حساب بالفعل" },
  "wel.f1":              { en: "Drive when you want",                      ar: "قُد متى ما أردت" },
  "wel.f1.sub":          { en: "Go online with one tap.",                   ar: "ابدأ العمل بضغطة." },
  "wel.f2":              { en: "Cash at the end of every trip",             ar: "نقدًا في نهاية كل رحلة" },
  "wel.f2.sub":          { en: "Riders pay you directly.",                  ar: "الراكب يدفع لك مباشرةً." },
  "wel.f3":              { en: "Earnings, live",                            ar: "أرباحك مباشرةً" },
  "wel.f3.sub":          { en: "Track today, this week, this month.",       ar: "اطّلع على أرباح اليوم والأسبوع والشهر." },
  "wel.legal":           { en: "By continuing you agree to Djera's Terms & Privacy.",
                           ar: "بالمتابعة فأنت توافق على شروط جيرا وسياسة الخصوصية." },

  // Auth
  "auth.title":          { en: "Sign in",                                  ar: "تسجيل الدخول" },
  "auth.sub":            { en: "Enter your phone to get a code.",          ar: "أدخل رقم هاتفك لاستلام رمز التحقق." },
  "auth.phone":          { en: "Phone number",                             ar: "رقم الهاتف" },
  "auth.phone.ph":       { en: "9X XXX XXXX",                              ar: "9X XXX XXXX" },
  "auth.send":           { en: "Send code",                                ar: "إرسال الرمز" },
  "auth.alt":            { en: "Use email instead",                        ar: "استخدم البريد الإلكتروني" },
  "auth.help":           { en: "Trouble signing in?",                      ar: "تواجه مشكلة في الدخول؟" },

  // OTP
  "otp.title":           { en: "Enter the code",                           ar: "أدخل الرمز" },
  "otp.sub":             { en: "Sent to {phone}. Try 123456.",             ar: "أُرسل إلى {phone}. جرّب 123456." },
  "otp.resend":          { en: "Resend in {n}s",                           ar: "إعادة الإرسال خلال {n}ث" },
  "otp.resend.now":      { en: "Resend code",                              ar: "أعد إرسال الرمز" },
  "otp.verify":          { en: "Verify",                                   ar: "تحقّق" },
  "otp.verifying":       { en: "Verifying…",                               ar: "جارٍ التحقّق…" },
  "otp.change":          { en: "Change phone number",                      ar: "تغيير رقم الهاتف" },
  "otp.bad":             { en: "Wrong code, try again.",                   ar: "الرمز غير صحيح، حاول مجددًا." },

  // Auth success
  "auth.ok.title":       { en: "You're signed in",                         ar: "تم تسجيل دخولك" },
  "auth.ok.sub":         { en: "Welcome back, Ahmed.",                     ar: "أهلًا بعودتك، أحمد." },
  "auth.ok.cta":         { en: "Continue to dashboard",                    ar: "إلى لوحة التحكم" },

  // Enrollment
  "enr.title":           { en: "Driver enrollment",                        ar: "تسجيل السائق" },
  "enr.sub":             { en: "We'll review your details within 24 hours.",
                           ar: "سنراجع بياناتك خلال ٢٤ ساعة." },
  "enr.step":            { en: "Step {n} of {t}",                          ar: "الخطوة {n} من {t}" },
  "enr.fullname":        { en: "Full name",                                ar: "الاسم الكامل" },
  "enr.fullname.ph":     { en: "Ahmed Mohamed Al-Tarhouni",                ar: "أحمد محمد الترهوني" },
  "enr.phone":           { en: "Phone",                                    ar: "رقم الهاتف" },
  "enr.id":              { en: "National ID number",                       ar: "الرقم الوطني" },
  "enr.license":         { en: "Driver's license number",                  ar: "رقم رخصة القيادة" },
  "enr.plate":           { en: "Vehicle plate",                            ar: "لوحة السيارة" },
  "enr.id.photo":        { en: "National ID photo",                       ar: "صورة الرقم الوطني" },
  "enr.id.photo.sub":    { en: "Front side, clear & legible",              ar: "الوجه الأمامي، واضح ومقروء" },
  "enr.lic.photo":       { en: "Driver's license photo",                   ar: "صورة رخصة القيادة" },
  "enr.lic.photo.sub":   { en: "Both sides if double-sided",                ar: "الوجهان إن كانت مزدوجة" },
  "enr.submit":          { en: "Submit for review",                        ar: "إرسال للمراجعة" },

  // Enrollment pending
  "enr.pend.title":      { en: "Application submitted",                    ar: "تم استلام طلبك" },
  "enr.pend.sub":        { en: "We're reviewing your documents. You'll get a notification within 24 hours.",
                           ar: "نراجع مستنداتك حاليًا. سيصلك إشعار خلال ٢٤ ساعة." },
  "enr.pend.eta":        { en: "Estimated wait: under 24 hours",            ar: "وقت الانتظار المتوقّع: أقل من ٢٤ ساعة" },
  "enr.pend.home":       { en: "Back to home",                              ar: "العودة للرئيسية" },

  // Dashboard
  "dash.greet":          { en: "Salaam, Ahmed",                            ar: "السلام عليكم، أحمد" },
  "dash.greet.sub":      { en: "Tripoli · {temp}°",                        ar: "طرابلس · {temp}°" },
  "dash.online":         { en: "Go online",                                ar: "ابدأ العمل" },
  "dash.online.on":      { en: "You're online",                            ar: "أنت متّصل" },
  "dash.online.tap":     { en: "Tap to start receiving requests",          ar: "اضغط لاستقبال الطلبات" },
  "dash.online.lstn":    { en: "Listening for rides nearby",               ar: "جارٍ الاستماع للرحلات القريبة" },
  "dash.today":          { en: "Today",                                    ar: "اليوم" },
  "dash.commission":     { en: "Commission",                               ar: "العمولة" },
  "dash.due":            { en: "Due Sunday",                               ar: "تُستحق الأحد" },
  "dash.trips":          { en: "trips",                                    ar: "رحلة" },

  // Ride request
  "req.incoming":        { en: "Incoming request",                         ar: "طلب وارد" },
  "req.sub":             { en: "Confirm within the timer",                 ar: "أكّد قبل انتهاء المؤقّت" },
  "req.pickup":          { en: "Pickup",                                   ar: "نقطة الانطلاق" },
  "req.dest":            { en: "Destination",                              ar: "الوجهة" },
  "req.pickup.addr":     { en: "Hai al-Andalus, Tripoli",                  ar: "حي الأندلس، طرابلس" },
  "req.dest.addr":       { en: "Gargaresh, Tripoli",                       ar: "قرقارش، طرابلس" },
  "req.toRider":         { en: "To rider",                                 ar: "إلى الراكب" },
  "req.trip":            { en: "Trip",                                     ar: "الرحلة" },
  "req.fare":            { en: "Fare",                                     ar: "الأجرة" },
  "req.reject":          { en: "Reject",                                   ar: "رفض" },
  "req.accept":          { en: "Accept",                                   ar: "قبول الرحلة" },
  "req.rating":          { en: "Rider {r}★",                               ar: "تقييم الراكب {r}★" },

  // Active trip
  "trip.pickup.head":    { en: "Heading to pickup",                        ar: "في الطريق إلى الراكب" },
  "trip.pickup.eta":     { en: "{n} min",                                  ar: "{n} دق" },
  "trip.pickup.dist":    { en: "{n} m",                                    ar: "{n} م" },
  "trip.pickup.rider":   { en: "Khalid Al-Asmari",                         ar: "خالد العسماري" },
  "trip.call":           { en: "Call",                                     ar: "اتصال" },
  "trip.arrived":        { en: "I've arrived",                             ar: "وصلت" },
  "trip.start":          { en: "Start trip",                               ar: "بدء الرحلة" },
  "trip.intrip.head":    { en: "Trip in progress",                         ar: "الرحلة جارية" },
  "trip.end":            { en: "End trip",                                 ar: "إنهاء الرحلة" },
  "trip.done.title":     { en: "Trip complete",                            ar: "اكتملت الرحلة" },
  "trip.done.sub":       { en: "Safe trip, Ahmed.",                        ar: "رحلة موفّقة، أحمد." },
  "trip.due":            { en: "Collect from rider",                       ar: "استلام من الراكب" },
  "trip.cash":           { en: "Cash",                                     ar: "نقدًا" },
  "trip.distance":       { en: "Distance",                                 ar: "المسافة" },
  "trip.duration":       { en: "Duration",                                 ar: "المدة" },
  "trip.cash.received":  { en: "Confirm cash received",                    ar: "تأكيد استلام النقود" },
  "trip.home":           { en: "Back to home",                             ar: "العودة للرئيسية" },
  "trip.commission":     { en: "Djera commission (−15%)",                  ar: "عمولة جيرا (−15%)" },

  // Earnings
  "earn.title":          { en: "Earnings",                                 ar: "الأرباح" },
  "earn.today":          { en: "Today",                                    ar: "اليوم" },
  "earn.week":           { en: "This week",                                ar: "هذا الأسبوع" },
  "earn.month":          { en: "This month",                               ar: "هذا الشهر" },
  "earn.net":            { en: "Net earnings",                             ar: "صافي الأرباح" },
  "earn.delta.up":       { en: "+{n}% vs prev.",                           ar: "+{n}% عن السابق" },
  "earn.cash":           { en: "Cash collected",                           ar: "النقد المُحصّل" },
  "earn.online":         { en: "Online hours",                             ar: "ساعات العمل" },
  "earn.comm":           { en: "Commission",                               ar: "العمولة" },
  "earn.breakdown":      { en: "Trip breakdown",                           ar: "تفصيل الرحلات" },

  // Trip history
  "hist.title":          { en: "Trip history",                             ar: "سجل الرحلات" },
  "hist.search.ph":      { en: "Search rider, place…",                     ar: "ابحث عن راكب أو مكان…" },
  "hist.all":            { en: "All",                                      ar: "الكل" },
  "hist.today":          { en: "Today",                                    ar: "اليوم" },
  "hist.yesterday":      { en: "Yesterday",                                ar: "أمس" },
  "hist.empty":          { en: "No trips match",                           ar: "لا توجد رحلات مطابقة" },
  "hist.cancelled":      { en: "Cancelled",                                ar: "ملغاة" },
  "hist.detail.head":    { en: "Completed",                                ar: "مكتملة" },
  "hist.fare.trip":      { en: "Trip fare",                                ar: "أجرة الرحلة" },
  "hist.net":            { en: "Net to you",                               ar: "صافي لك" },
  "hist.timeline":       { en: "Trip timeline",                            ar: "خط زمن الرحلة" },
  "hist.tl.accept":      { en: "Request accepted",                         ar: "تم قبول الطلب" },
  "hist.tl.arrive":      { en: "Arrived at pickup",                        ar: "الوصول لنقطة الانطلاق" },
  "hist.tl.start":       { en: "Trip started",                             ar: "بدء الرحلة" },
  "hist.tl.end":         { en: "Trip ended",                               ar: "نهاية الرحلة" },

  // Commission
  "com.title":           { en: "Commission",                               ar: "العمولة" },
  "com.outstanding":     { en: "Outstanding balance",                      ar: "الرصيد المستحق" },
  "com.cap":             { en: "{c} of {m} LYD cap",                       ar: "{c} من سقف {m} د.ل" },
  "com.next":            { en: "Next settlement",                          ar: "التسوية القادمة" },
  "com.rate":            { en: "Rate · 15%",                               ar: "النسبة · ١٥٪" },
  "com.policy":          { en: "Auto-suspend after 200 LYD cap",            ar: "تعليق تلقائي عند تجاوز ٢٠٠ د.ل" },
  "com.recent":          { en: "Recent accruals",                          ar: "أحدث الاستحقاقات" },
  "com.settle":          { en: "Settle now",                               ar: "سدّد الآن" },
  "com.history":         { en: "Settlement history",                       ar: "سجل التسويات" },

  // Profile
  "prof.title":          { en: "Profile",                                  ar: "الملف الشخصي" },
  "prof.driver":         { en: "Driver",                                   ar: "السائق" },
  "prof.vehicle":        { en: "Vehicle",                                  ar: "المركبة" },
  "prof.docs":           { en: "Documents",                                ar: "المستندات" },
  "prof.id":             { en: "National ID",                              ar: "الرقم الوطني" },
  "prof.lic":            { en: "Driver's license",                         ar: "رخصة القيادة" },
  "prof.verified":       { en: "Verified",                                 ar: "مُوثّق" },
  "prof.expiring":       { en: "Expires in 32 days",                       ar: "تنتهي خلال ٣٢ يومًا" },
  "prof.settings":       { en: "Settings",                                 ar: "الإعدادات" },
  "prof.support":        { en: "Help & support",                           ar: "المساعدة والدعم" },
  "prof.logout":         { en: "Sign out",                                 ar: "تسجيل الخروج" },

  // Nav
  "nav.home":            { en: "Home",                                     ar: "الرئيسية" },
  "nav.trips":           { en: "Trips",                                    ar: "الرحلات" },
  "nav.earn":            { en: "Earnings",                                 ar: "الأرباح" },
  "nav.profile":         { en: "Profile",                                  ar: "الحساب" },
};

function t(key, vars) {
  const lang = window.__geera_lang || "en";
  const entry = STR[key];
  if (!entry) return key;
  let s = entry[lang] || entry.en;
  if (vars) Object.keys(vars).forEach(k => { s = s.replace("{" + k + "}", vars[k]); });
  return s;
}

window.STR = STR;
window.t = t;
