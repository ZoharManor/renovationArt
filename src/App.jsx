import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Home, UtensilsCrossed, Bath, Grid3x3, Layers, Building2,
  Phone, MessageCircle, Menu, X, ChevronDown, Star,
  Shield, FileText, Users, PhoneCall, Award, Clock,
  Check, ArrowLeft
} from 'lucide-react'

const base = import.meta.env.BASE_URL

/* ─── Animation Variants ─── */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
}

/* ─── Counter Component ─── */
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ─── Before/After Slider ─── */
function BeforeAfterSlider({ title, tags, beforeImg, afterImg }) {
  const [pos, setPos] = useState(50)
  const containerRef = useRef(null)

  const handleMove = (clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setPos(pct)
  }

  return (
    <motion.div className="gallery-card" variants={fadeInUp}>
      <div
        className="ba-slider"
        ref={containerRef}
        onMouseMove={e => handleMove(e.clientX)}
        onTouchMove={e => handleMove(e.touches[0].clientX)}
      >
        <div className="ba-after" style={{ backgroundImage: `url(${afterImg})` }}>
          <span className="ba-label ba-label-after">אחרי</span>
        </div>
        <div className="ba-before" style={{ width: `${pos}%`, backgroundImage: `url(${beforeImg})` }}>
          <span className="ba-label ba-label-before">לפני</span>
        </div>
        <div className="ba-divider" style={{ left: `${pos}%` }}>
          <div className="ba-handle" />
        </div>
      </div>
      <div className="gallery-info">
        <h3>{title}</h3>
        <div className="gallery-tags">
          {tags.map((t, i) => <span key={i} className="tag">{t}</span>)}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Single Image Gallery Card ─── */
function GalleryImageCard({ title, tags, img, imgPos }) {
  return (
    <motion.div className="gallery-card" variants={fadeInUp}>
      <div className="gallery-img" style={{ backgroundImage: `url(${img})`, backgroundPosition: imgPos || 'center' }} />
      <div className="gallery-info">
        <h3>{title}</h3>
        <div className="gallery-tags">
          {tags.map((t, i) => <span key={i} className="tag">{t}</span>)}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Section Wrapper ─── */
function Section({ id, children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      id={id}
      ref={ref}
      className={`section ${className}`}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={staggerContainer}
    >
      {children}
    </motion.section>
  )
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', type: '', size: '' })
  const [formSent, setFormSent] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [serviceModal, setServiceModal] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const sections = ['services', 'gallery', 'process', 'testimonials', 'contact']
      for (const s of sections) {
        const el = document.getElementById(s)
        if (el && el.getBoundingClientRect().top < 200) setActiveSection(s)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = serviceModal !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [serviceModal])

  const handleSubmit = e => {
    e.preventDefault()
    setFormSent(true)
    setTimeout(() => setFormSent(false), 4000)
  }

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenu(false)
  }

  const navLinks = [
    { id: 'services', label: 'שירותים' },
    { id: 'gallery', label: 'גלריה' },
    { id: 'process', label: 'תהליך' },
    { id: 'testimonials', label: 'המלצות' },
    { id: 'contact', label: 'צור קשר' },
  ]

  const services = [
    {
      icon: Home, title: 'שיפוץ כללי', desc: 'שיפוץ דירה מקיף מהרצפה עד התקרה, כולל תכנון וביצוע',
      img: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&q=80',
      fullDesc: [
        'שיפוץ כללי הוא הפתרון המושלם כשהדירה צריכה שדרוג מקיף — מהרצפה ועד התקרה. אנחנו מתחילים בייעוץ מקצועי חינם שבו מבינים את הצרכים, החלומות והתקציב שלכם, ובונים תוכנית עבודה ברורה עם לוחות זמנים מדויקים.',
        'הצוות שלנו כולל אנשי מקצוע בכל התחומים: אינסטלציה, חשמל, טיח, צבע, ריצוף, נגרות ועוד. אנחנו מנהלים את כל הפרויקט מקצה לקצה כדי שאתם לא תצטרכו להתעסק עם תיאום בין בעלי מקצוע.',
        'אנחנו עובדים רק עם חומרים איכותיים ומותגים מובילים, ומקפידים על סטנדרטים גבוהים של אחריות ומקצועיות. כל פרויקט כולל אחריות מלאה על העבודה.',
      ],
      faq: [
        { q: 'כמה זמן לוקח שיפוץ כללי של דירה?', a: 'שיפוץ כללי של דירת 4 חדרים לוקח בדרך כלל בין 6 ל-10 שבועות, תלוי בהיקף העבודות. אנחנו מספקים לוח זמנים מפורט לפני תחילת העבודה.' },
        { q: 'האם אני יכול לגור בדירה במהלך השיפוץ?', a: 'בשיפוץ כללי מומלץ לא לגור בדירה. אנחנו עוזרים לתכנן את הפרויקט כך שיסתיים מהר ככל האפשר, וניתן לעבוד לפי חדרים במקרים מסוימים.' },
        { q: 'מה כולל המחיר של שיפוץ כללי?', a: 'המחיר כולל את כל העבודות: פירוק, בנייה, אינסטלציה, חשמל, טיח, צבע, ריצוף ונגרות. חומרים מתומחרים בנפרד לפי בחירתכם ותקציבכם.' },
      ],
    },
    {
      icon: UtensilsCrossed, title: 'שיפוץ מטבח', desc: 'חידוש מלא של המטבח: ארונות, משטחים, אינסטלציה וחשמל',
      img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      fullDesc: [
        'המטבח הוא הלב של הבית, והשיפוץ שלו יכול לשנות לחלוטין את חווית המגורים שלכם. אנחנו מתמחים בחידוש מלא של מטבחים — החל מעיצוב ותכנון ועד לביצוע מושלם.',
        'העבודה כוללת פירוק המטבח הישן, התקנת ארונות חדשים, משטחי עבודה (שיש, קוורץ, או גרניט), חיפוי קירות, אינסטלציה חדשה, נקודות חשמל ותאורה מתוכננת. אנחנו עובדים עם יצרני מטבחים מובילים בארץ.',
        'כל מטבח מתוכנן בהתאמה אישית לשטח, לצרכים ולסגנון שלכם. בין אם אתם מחפשים מטבח מודרני ומינימליסטי או מטבח כפרי וחם — נדע להתאים את הפתרון המושלם.',
      ],
      faq: [
        { q: 'כמה זמן לוקח שיפוץ מטבח?', a: 'שיפוץ מטבח מלא לוקח בדרך כלל 3-5 שבועות. הייצור של הארונות נעשה במקביל לעבודות התשתית, כך שחוסכים זמן.' },
        { q: 'האם אפשר לשנות את הפריסה של המטבח?', a: 'בהחלט! אנחנו יכולים לשנות את הפריסה לחלוטין, כולל הזזת נקודות מים, ביוב וגז. זה דורש תכנון מוקדם אבל התוצאה שווה את זה.' },
        { q: 'מה סוג המשטחים שאתם ממליצים?', a: 'אנחנו עובדים עם שיש טבעי, קוורץ וגרניט. קוורץ הוא הבחירה הפופולרית ביותר — עמיד מאוד, קל לתחזוקה ומגיע במגוון עיצובים.' },
      ],
    },
    {
      icon: Bath, title: 'שיפוץ אמבטיה', desc: 'שיפוץ חדרי רחצה עם חומרים איכותיים ועמידים',
      img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
      fullDesc: [
        'חדר האמבטיה הוא המקום שבו מתחיל ומסתיים כל יום, ולכן חשוב שירגיש נוח, נקי ומעוצב. אנחנו מציעים שיפוץ מלא של חדרי רחצה ושירותים, כולל אפשרות לשנות את כל הפריסה.',
        'העבודה כוללת פירוק חיפויים ישנים, החלפת אינסטלציה, איטום מקצועי (קריטי למניעת רטיבות!), ריצוף וחיפוי חדשים, והתקנת כלים סניטריים מודרניים — אסלות, כיורים, מקלחונים, אמבטיות וברזים.',
        'אנחנו מקפידים במיוחד על איטום מושלם, ניקוז נכון, ואוורור מתאים. כל עבודה כוללת אחריות מלאה ובדיקת לחץ מים לפני הסגירה.',
      ],
      faq: [
        { q: 'כמה עולה שיפוץ חדר אמבטיה?', a: 'העלות תלויה בגודל החדר ורמת הגימור. חדר אמבטיה סטנדרטי (5-8 מ"ר) מתחיל מ-25,000 ₪ לעבודה, ללא חומרים. נשמח לתת הצעת מחיר מדויקת.' },
        { q: 'האם האיטום באמת כל כך חשוב?', a: 'בהחלט! איטום לקוי הוא הגורם מספר אחת לנזקי רטיבות בבניינים. אנחנו עובדים עם חומרי איטום מהשורה הראשונה ומבצעים בדיקת מים של 48 שעות לפני הריצוף.' },
        { q: 'אפשר להוסיף מקלחון במקום אמבטיה?', a: 'כן, זו אחת הבקשות הנפוצות ביותר. אנחנו מתמחים בהתקנת מקלחונים מעוצבים, כולל מקלחונים walk-in ללא מסגרת.' },
      ],
    },
    {
      icon: Grid3x3, title: 'ריצוף וחיפוי', desc: 'הנחת קרמיקה, פורצלן ואבן טבעית בכל הבית',
      img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
      fullDesc: [
        'ריצוף הוא אחד האלמנטים המשמעותיים ביותר בעיצוב הבית — הוא קובע את האופי, מוסיף יוקרה ומשפיע על התחושה של כל חלל. אנחנו מתמחים בהנחת כל סוגי הריצוף ברמת דיוק גבוהה.',
        'אנחנו עובדים עם מגוון רחב של חומרים: קרמיקה, פורצלן, אבן טבעית, שיש, גרניט ואריחים דקורטיביים. בין אם מדובר בריצוף דירה שלמה, חיפוי קירות מטבח, או מדרגות מעוצבות — אנחנו יודעים להתאים את החומר הנכון.',
        'כל עבודת ריצוף כוללת הכנת משטח מושלמת (יישור, פילוס), הנחה מקצועית עם רווחים אחידים, חיתוך מדויק סביב פינות ומכשולים, ופיוגים איכותיים לתוצאה מושלמת.',
      ],
      faq: [
        { q: 'מה ההבדל בין קרמיקה לפורצלן?', a: 'פורצלן הוא חומר צפוף וחזק יותר מקרמיקה רגילה, עמיד יותר בפני מים ושחיקה. הוא מתאים במיוחד לאזורים עמוסים ולשימוש חיצוני. קרמיקה מצוינת לחיפוי קירות ולשימוש פנימי.' },
        { q: 'האם אפשר להניח ריצוף חדש על ריצוף ישן?', a: 'במקרים מסוימים כן, אם הריצוף הישן ישר ויציב. אנחנו בודקים כל מקרה לגופו. בדרך כלל מומלץ לפרק את הישן כדי לקבל תוצאה מושלמת ולהימנע מבעיות גובה.' },
        { q: 'כמה זמן לוקח לרצף דירה שלמה?', a: 'ריצוף דירת 4 חדרים (כ-100 מ"ר) לוקח בדרך כלל 5-7 ימי עבודה, כולל הכנת המשטח. אריחים גדולים או דוגמאות מורכבות עשויים להוסיף זמן.' },
      ],
    },
    {
      icon: Layers, title: 'עבודות גבס', desc: 'תקרות גבס, קירות, ניצולת שטח ועיצוב פנים',
      img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
      fullDesc: [
        'עבודות גבס מאפשרות לעצב את הבית בצורה יצירתית ומקצועית — מתקרות מעוצבות עם תאורה שקועה ועד קירות מחיצה שמייצרים חללים חדשים. גבס הוא חומר גמיש שפותח אפשרויות עיצוב בלתי מוגבלות.',
        'אנחנו מבצעים כל סוגי עבודות הגבס: תקרות צפות עם ספוטים, נישות מעוצבות, קירות הפרדה, הסתרת צנרת ומערכות מיזוג, ובניית ארונות גבס מובנים. כל עבודה מבוצעת בדיוק מילימטרי.',
        'הצוות שלנו מתמחה גם בעבודות שפכטל ברמה גבוהה — Q3 ו-Q4 — לקבלת משטח חלק ומושלם לצביעה. אנחנו משתמשים בחומרים של Knauf ו-Rigips, המותגים המובילים בתחום.',
      ],
      faq: [
        { q: 'האם תקרת גבס מורידה את גובה החדר?', a: 'תקרת גבס רגילה מורידה כ-7-10 ס"מ מגובה החדר. תקרות צפות (עם תאורה שקועה) מורידות כ-15-20 ס"מ. בחדרים עם גובה סטנדרטי (2.60 מ\') התוצאה עדיין נוחה מאוד.' },
        { q: 'מה היתרון של קירות גבס על פני בלוקים?', a: 'קירות גבס קלים יותר (פחות עומס על המבנה), מהירים יותר להתקנה, מאפשרים הסתרת צנרת בקלות, ומספקים בידוד אקוסטי טוב. הם גם קלים יותר לפירוק בעתיד.' },
        { q: 'אפשר לתלות דברים כבדים על קיר גבס?', a: 'בהחלט! עם דיבלים מתאימים לגבס (כמו Molly או Toggle) אפשר לתלות מדפים, טלוויזיות ואפילו ארונות. לעומסים כבדים במיוחד אנחנו מחזקים עם פרופילים נוספים בזמן הבנייה.' },
      ],
    },
    {
      icon: Building2, title: 'תוספות בנייה', desc: 'הרחבת דירה, ממ"ד, מרפסת — עם כל האישורים',
      img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
      fullDesc: [
        'תוספת בנייה היא ההשקעה המשתלמת ביותר בנדל"ן — היא מעלה את ערך הנכס ומשפרת משמעותית את איכות החיים. אנחנו מתמחים בכל סוגי תוספות הבנייה: ממ"ד, הרחבת סלון, סגירת מרפסת, ובנייה של קומה נוספת.',
        'התהליך מתחיל בייעוץ עם מהנדס ואדריכל, הגשת תוכניות לוועדה המקומית, וקבלת היתר בנייה. אנחנו מלווים אתכם לאורך כל התהליך הבירוקרטי ומטפלים בכל הניירת.',
        'הביצוע כולל עבודות שלד, בנייה, אינסטלציה, חשמל, איטום, טיח, ריצוף וגימורים. אנחנו עובדים לפי תקן ישראלי ועם פיקוח מהנדס צמוד, ומסיימים כל פרויקט עם טופס 4 ואישורי עירייה.',
      ],
      faq: [
        { q: 'האם צריך היתר בנייה לכל תוספת?', a: 'כן, כל תוספת בנייה דורשת היתר מהוועדה המקומית. אנחנו מטפלים בכל התהליך — תוכניות, הגשה, מעקב וקבלת ההיתר. בדרך כלל התהליך לוקח 3-6 חודשים.' },
        { q: 'כמה עולה בניית ממ"ד?', a: 'עלות ממ"ד ממוצע (12 מ"ר) נעה בין 120,000 ל-180,000 ₪, כולל כל העבודות והגימורים. המחיר משתנה לפי מורכבות הביצוע, הנגישות וסוג הגימור.' },
        { q: 'כמה זמן לוקח לבנות תוספת בנייה?', a: 'תוספת בנייה ממוצעת (ממ"ד, הרחבת חדר) לוקחת כ-3-4 חודשים מרגע תחילת העבודות. תוספת קומה שלמה יכולה לקחת 5-7 חודשים. היתר הבנייה הוא בנוסף לזמנים אלה.' },
      ],
    },
  ]

  const projects = [
    {
      title: 'שיפוץ דירת 4 חדרים — רמת גן',
      tags: ['95 מ"ר', 'שיפוץ כללי'],
      type: 'beforeAfter',
      beforeImg: `${base}before.jpg`,
      afterImg: `${base}after.jpg`,
    },
    {
      title: 'חידוש מטבח מודרני — תל אביב',
      tags: ['מטבח 18 מ"ר', 'שיפוץ מטבח'],
      type: 'single',
      img: `${base}kitchen.jpg`,
      imgPos: 'center 70%',
    },
    {
      title: 'שיפוץ אמבטיה יוקרתי — הרצליה',
      tags: ['8 מ"ר', 'אמבטיה'],
      type: 'single',
      img: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80',
    },
    {
      title: 'עיצוב סלון מודרני — פתח תקווה',
      tags: ['110 מ"ר', 'סלון'],
      type: 'single',
      img: `${base}livingRoom.jpeg`,
    },
  ]

  const steps = [
    { num: '01', title: 'ייעוץ חינם', desc: 'נגיע אליכם לבית, נסקור את הצרכים ונמדוד את השטח ללא עלות' },
    { num: '02', title: 'הצעת מחיר', desc: 'תוך 48 שעות תקבלו הצעת מחיר מפורטת ושקופה, ללא הפתעות' },
    { num: '03', title: 'ביצוע מקצועי', desc: 'צוות מנוסה עובד לפי לוח זמנים מוגדר עם עדכונים שוטפים' },
    { num: '04', title: 'מסירה ואחריות', desc: 'מסירת המפתח עם אחריות כתובה של 5 שנים על כל העבודות' },
  ]

  const whyUs = [
    { icon: Shield, title: 'תשלום בשלבים', desc: 'משלמים רק עם השלמת כל שלב. לא לפני.' },
    { icon: FileText, title: 'חוזה מפורט', desc: 'הכל בכתב: מחירים, לוחות זמנים, חומרים' },
    { icon: Users, title: 'צוות ישראלי', desc: 'עובדים שכירים קבועים, לא קבלני משנה אקראיים' },
    { icon: PhoneCall, title: 'זמינות מלאה', desc: 'זמינים בוואטסאפ 7 ימים בשבוע לכל שאלה' },
    { icon: Award, title: 'רישיון ג5', desc: 'רישיון הבנייה הגבוה ביותר במדינה' },
    { icon: Star, title: 'אחריות 5 שנים', desc: 'אחריות כתובה על כל עבודות הגמר' },
  ]

  const testimonials = [
    {
      text: 'היינו חוששים מהשיפוץ כי שמענו סיפורים, אבל כאן זה היה אחרת לגמרי. עמדו בכל מה שהבטיחו, סיימו לפני הזמן ובתקציב. הדירה נראית כמו חדשה.',
      name: 'מיכל ודוד לוי',
      city: 'תל אביב',
      project: 'שיפוץ כללי 4 חדרים',
      initials: 'מל'
    },
    {
      text: 'המטבח שלנו היה ישן מ-1995. עכשיו אנחנו מתביישים להגיד לאורחים שזו אותה דירה. עבודה מדהימה, מחיר הוגן, אנשים נחמדים.',
      name: 'רונית כהן',
      city: 'רמת גן',
      project: 'שיפוץ מטבח',
      initials: 'רכ'
    },
    {
      text: 'קבלן שמגיע בזמן, עונה לטלפון, ושומר על ניקיון באתר — זה לא מובן מאליו. מצאנו גולד!',
      name: 'אבי ושרה מזרחי',
      city: 'פתח תקווה',
      project: 'שיפוץ אמבטיה + ריצוף',
      initials: 'אמ'
    },
  ]

  return (
    <>
      <style>{`
        /* ═══ RESET & GLOBALS ═══ */
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html {
          scroll-behavior: smooth;
          direction: rtl;
          overflow-x: hidden;
        }
        body {
          font-family: 'Heebo', sans-serif;
          background: #0f0e0c;
          color: #f0ece3;
          line-height: 1.7;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        a { color: inherit; text-decoration: none; }
        button { cursor: pointer; border: none; font-family: inherit; }
        input, select { font-family: inherit; }

        /* ═══ NAVBAR ═══ */
        .navbar {
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          z-index: 100;
          padding: 0 40px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s ease;
        }
        .navbar.scrolled {
          background: rgba(15, 14, 12, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #2a2620;
        }
        .nav-logo { display: flex; flex-direction: column; }
        .nav-logo-title {
          font-size: 20px;
          font-weight: 700;
          color: #c9963a;
          line-height: 1.2;
        }
        .nav-logo-sub {
          font-size: 11px;
          color: #5a5040;
          font-weight: 400;
        }
        .nav-links {
          display: flex;
          gap: 32px;
          list-style: none;
        }
        .nav-links a {
          font-size: 14px;
          font-weight: 500;
          color: #9a8f7e;
          transition: color 0.2s;
          position: relative;
          cursor: pointer;
        }
        .nav-links a:hover,
        .nav-links a.active {
          color: #f0ece3;
        }
        .nav-links a.active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          right: 0;
          left: 0;
          height: 2px;
          background: #c9963a;
          border-radius: 1px;
        }
        .nav-cta {
          background: #c9963a;
          color: #0f0e0c;
          padding: 10px 24px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.2s;
        }
        .nav-cta:hover { background: #e8b96a; }
        .nav-hamburger {
          display: none;
          background: none;
          color: #f0ece3;
        }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          inset: 0;
          z-index: 99;
          background: rgba(15, 14, 12, 0.97);
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 28px;
        }
        .mobile-menu a {
          font-size: 22px;
          font-weight: 600;
          color: #f0ece3;
          transition: color 0.2s;
          cursor: pointer;
        }
        .mobile-menu a:hover { color: #c9963a; }
        .mobile-close {
          position: absolute;
          top: 20px;
          left: 20px;
          background: none;
          color: #f0ece3;
        }

        /* ═══ HERO ═══ */
        .hero-bg {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
        }
        .hero-bg-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.35;
          pointer-events: none;
        }
        .hero-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15,14,12,0.6) 0%, rgba(15,14,12,0.95) 100%);
          pointer-events: none;
        }
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 100px 40px 60px;
          gap: 60px;
          position: relative;
          overflow: hidden;
          max-width: 1300px;
          margin: 0 auto;
          z-index: 1;
        }
        .hero-content { flex: 6; position: relative; z-index: 1; }
        .hero-form-col { flex: 4; position: relative; z-index: 1; }

        .hero-badge {
          display: inline-block;
          background: rgba(201, 150, 58, 0.1);
          border: 1px solid rgba(201, 150, 58, 0.25);
          border-radius: 50px;
          padding: 6px 20px;
          font-size: 13px;
          color: #c9963a;
          margin-bottom: 24px;
          font-weight: 500;
        }
        .hero h1 {
          font-size: 68px;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 24px;
          letter-spacing: -0.5px;
        }
        .hero h1 .gold { color: #c9963a; }
        .hero-subtitle {
          font-size: 20px;
          color: #9a8f7e;
          max-width: 560px;
          margin-bottom: 48px;
          font-weight: 300;
          line-height: 1.8;
        }
        .hero-stats {
          display: flex;
          gap: 48px;
        }
        .hero-stat { text-align: center; }
        .hero-stat-num {
          display: block;
          font-size: 42px;
          font-weight: 800;
          color: #c9963a;
          font-family: 'DM Mono', monospace;
          line-height: 1.2;
        }
        .hero-stat-label {
          font-size: 14px;
          color: #9a8f7e;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #5a5040;
          font-size: 12px;
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }

        /* ═══ FORM ═══ */
        .form-card {
          background: #1a1814;
          border-radius: 8px;
          border-top: 4px solid #c9963a;
          padding: 32px;
        }
        .form-card h3 {
          color: #c9963a;
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .form-card .form-sub {
          color: #9a8f7e;
          font-size: 13px;
          margin-bottom: 24px;
        }
        .form-field {
          margin-bottom: 14px;
        }
        .form-field input,
        .form-field select {
          width: 100%;
          padding: 12px 16px;
          background: #0f0e0c;
          border: 1px solid #2a2620;
          border-radius: 4px;
          color: #f0ece3;
          font-size: 15px;
          transition: border-color 0.2s;
          direction: rtl;
        }
        .form-field input::placeholder { color: #5a5040; }
        .form-field select { appearance: none; cursor: pointer; }
        .form-field input:focus,
        .form-field select:focus {
          outline: none;
          border-color: #c9963a;
        }
        .form-submit {
          width: 100%;
          padding: 14px;
          background: #c9963a;
          color: #0f0e0c;
          font-size: 16px;
          font-weight: 700;
          border-radius: 4px;
          margin-top: 8px;
          transition: background 0.2s;
        }
        .form-submit:hover { background: #e8b96a; }
        .form-success {
          text-align: center;
          padding: 20px;
          color: #c9963a;
          font-size: 18px;
          font-weight: 600;
        }
        .whatsapp-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 12px;
          background: #25D366;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          border-radius: 4px;
          margin-top: 12px;
          transition: background 0.2s;
        }
        .whatsapp-btn:hover { background: #1ebe57; }
        .trust-signals {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 16px;
          font-size: 12px;
          color: #9a8f7e;
        }
        .trust-signals span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .trust-check { color: #c9963a; }

        /* ═══ SECTIONS ═══ */
        .section {
          padding: 100px 40px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-alt {
          background: #13120f;
        }
        .section-full {
          max-width: 100%;
          padding: 100px 40px;
        }
        .section-title {
          font-size: 38px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .section-subtitle {
          color: #9a8f7e;
          font-size: 17px;
          margin-bottom: 56px;
          font-weight: 300;
        }

        /* ═══ SERVICES ═══ */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .service-card {
          background: #1a1814;
          border: 1px solid #2a2620;
          border-radius: 8px;
          padding: 32px 28px;
          transition: all 0.3s ease;
        }
        .service-card:hover {
          transform: translateY(-4px);
          border-color: #c9963a;
          background: #221f19;
        }
        .service-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(201, 150, 58, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          color: #c9963a;
        }
        .service-card h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .service-card p {
          font-size: 14px;
          color: #9a8f7e;
          margin-bottom: 16px;
          line-height: 1.7;
        }
        .service-link {
          font-size: 13px;
          color: #c9963a;
          font-weight: 500;
          transition: color 0.2s;
          cursor: pointer;
        }
        .service-link:hover { color: #e8b96a; }

        /* ═══ GALLERY ═══ */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        .gallery-card {
          background: #1a1814;
          border: 1px solid #2a2620;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .gallery-card:hover {
          border-color: #c9963a;
          transform: translateY(-2px);
        }
        .gallery-img {
          height: 220px;
          background-size: cover;
          background-position: center;
          background-color: #1a1814;
        }
        .ba-slider {
          position: relative;
          height: 220px;
          cursor: col-resize;
          overflow: hidden;
          user-select: none;
        }
        .ba-after {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-color: #1a1814;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ba-before {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          background-size: cover;
          background-position: center;
          background-color: #1a1814;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .ba-before::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.15);
        }
        .ba-label {
          font-size: 16px;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 4px;
          pointer-events: none;
          position: relative;
          z-index: 3;
        }
        .ba-label-before {
          background: rgba(0,0,0,0.5);
          color: #9a8f7e;
        }
        .ba-label-after {
          background: rgba(0,0,0,0.4);
          color: #f0d080;
        }
        .ba-divider {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #f0ece3;
          z-index: 4;
          transform: translateX(-50%);
        }
        .ba-handle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 36px;
          height: 36px;
          background: #f0ece3;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        .ba-handle::before,
        .ba-handle::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 0;
          height: 0;
          border-style: solid;
        }
        .ba-handle::before {
          right: 6px;
          transform: translateY(-50%);
          border-width: 5px 0 5px 6px;
          border-color: transparent transparent transparent #0f0e0c;
        }
        .ba-handle::after {
          left: 6px;
          transform: translateY(-50%);
          border-width: 5px 6px 5px 0;
          border-color: transparent #0f0e0c transparent transparent;
        }
        .gallery-info {
          padding: 20px;
        }
        .gallery-info h3 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .gallery-tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .tag {
          background: rgba(201, 150, 58, 0.1);
          border: 1px solid rgba(201, 150, 58, 0.2);
          color: #c9963a;
          font-size: 12px;
          padding: 4px 12px;
          border-radius: 50px;
        }

        /* ═══ PROCESS ═══ */
        .process-wrap {
          background: #13120f;
          padding: 100px 40px;
        }
        .process-inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .process-timeline {
          display: flex;
          gap: 24px;
          position: relative;
          margin-top: 20px;
        }
        .process-timeline::before {
          content: '';
          position: absolute;
          top: 32px;
          right: 32px;
          left: 32px;
          height: 2px;
          border-top: 2px dashed rgba(201, 150, 58, 0.3);
        }
        .process-step {
          flex: 1;
          text-align: center;
          position: relative;
        }
        .process-num {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #1a1814;
          border: 2px solid #c9963a;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-family: 'DM Mono', monospace;
          font-size: 18px;
          font-weight: 700;
          color: #c9963a;
          position: relative;
          z-index: 2;
        }
        .process-step h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .process-step p {
          font-size: 14px;
          color: #9a8f7e;
          line-height: 1.7;
          max-width: 220px;
          margin: 0 auto;
        }

        /* ═══ WHY US ═══ */
        .why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .why-card {
          background: #1a1814;
          border: 1px solid #2a2620;
          border-radius: 8px;
          padding: 28px;
          transition: all 0.3s;
        }
        .why-card:hover {
          border-color: #c9963a;
          background: #221f19;
        }
        .why-icon {
          color: #c9963a;
          margin-bottom: 16px;
        }
        .why-card h3 {
          font-size: 17px;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .why-card p {
          font-size: 14px;
          color: #9a8f7e;
          line-height: 1.6;
        }

        /* ═══ TESTIMONIALS ═══ */
        .test-grid {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 8px;
        }
        .test-grid::-webkit-scrollbar { height: 4px; }
        .test-grid::-webkit-scrollbar-track { background: #1a1814; border-radius: 2px; }
        .test-grid::-webkit-scrollbar-thumb { background: #2a2620; border-radius: 2px; }
        .test-card {
          flex: 0 0 calc(33.333% - 16px);
          min-width: 300px;
          background: #1a1814;
          border: 1px solid #2a2620;
          border-radius: 8px;
          padding: 32px;
          scroll-snap-align: start;
          transition: all 0.3s;
        }
        .test-card:hover { border-color: #c9963a; }
        .test-quote-mark {
          font-size: 56px;
          color: #c9963a;
          font-family: serif;
          line-height: 0.6;
          margin-bottom: 16px;
          opacity: 0.6;
        }
        .test-text {
          font-size: 15px;
          line-height: 1.8;
          margin-bottom: 20px;
          color: #f0ece3;
        }
        .test-stars {
          display: flex;
          gap: 3px;
          margin-bottom: 12px;
          color: #c9963a;
        }
        .test-author-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .test-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #c9963a;
          color: #0f0e0c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .test-author {
          font-size: 15px;
          font-weight: 600;
        }
        .test-meta {
          font-size: 13px;
          color: #9a8f7e;
        }

        /* ═══ CTA STRIP ═══ */
        .cta-strip {
          background: linear-gradient(135deg, #1a1608 0%, #221b0a 50%, #1a1608 100%);
          border-top: 1px solid rgba(201, 150, 58, 0.2);
          border-bottom: 1px solid rgba(201, 150, 58, 0.2);
          padding: 72px 40px;
          text-align: center;
        }
        .cta-strip h2 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .cta-strip p {
          font-size: 17px;
          color: #9a8f7e;
          margin-bottom: 32px;
        }
        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .cta-btn-gold {
          background: #c9963a;
          color: #0f0e0c;
        }
        .cta-btn-gold:hover { background: #e8b96a; }
        .cta-btn-green {
          background: #25D366;
          color: #fff;
        }
        .cta-btn-green:hover { background: #1ebe57; }

        /* ═══ FOOTER ═══ */
        .footer {
          background: #0a0908;
          border-top: 1px solid #2a2620;
          padding: 60px 40px 30px;
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 48px;
        }
        .footer-logo-title {
          font-size: 22px;
          font-weight: 700;
          color: #c9963a;
          margin-bottom: 8px;
        }
        .footer-tagline {
          font-size: 14px;
          color: #9a8f7e;
          line-height: 1.7;
          max-width: 300px;
        }
        .footer h4 {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #f0ece3;
        }
        .footer ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer li {
          font-size: 14px;
          color: #9a8f7e;
          transition: color 0.2s;
          cursor: pointer;
        }
        .footer li:hover { color: #c9963a; }
        .footer-bottom {
          max-width: 1200px;
          margin: 40px auto 0;
          padding-top: 20px;
          border-top: 1px solid #2a2620;
          text-align: center;
          font-size: 13px;
          color: #5a5040;
        }

        /* ═══ RESPONSIVE ═══ */
        @media (max-width: 968px) {
          .nav-links, .nav-cta-desktop { display: none !important; }
          .nav-hamburger { display: block; }
          .navbar { padding: 0 20px; }

          .hero {
            flex-direction: column;
            padding: 100px 20px 40px;
            gap: 40px;
          }
          .hero h1 { font-size: 40px; }
          .hero-subtitle { font-size: 17px; }
          .hero-stats { gap: 24px; }
          .hero-stat-num { font-size: 32px; }
          .hero-content { order: 1; }
          .hero-form-col { order: 2; width: 100%; }

          .section { padding: 60px 20px; }
          .section-title { font-size: 28px; }

          .services-grid { grid-template-columns: 1fr; }
          .gallery-grid { grid-template-columns: 1fr; }
          .why-grid { grid-template-columns: 1fr; }

          .process-wrap { padding: 60px 20px; }
          .process-timeline {
            flex-direction: column;
            gap: 32px;
          }
          .process-timeline::before {
            top: 0;
            bottom: 0;
            right: 32px;
            left: auto;
            width: 2px;
            height: auto;
            border-top: none;
            border-right: 2px dashed rgba(201, 150, 58, 0.3);
          }
          .process-step { text-align: right; display: flex; gap: 20px; align-items: flex-start; }
          .process-num { margin: 0; flex-shrink: 0; }
          .process-step p { max-width: none; margin: 0; }
          .process-step-text { text-align: right; }

          .test-card { flex: 0 0 85%; }

          .cta-strip { padding: 48px 20px; }
          .cta-strip h2 { font-size: 28px; }

          .footer-inner { grid-template-columns: 1fr; gap: 32px; }
        }

        @media (max-width: 480px) {
          .hero h1 { font-size: 32px; }
          .hero-stats { flex-direction: column; gap: 16px; align-items: flex-start; }
          .trust-signals { flex-direction: column; }
          .modal-body { padding: 24px 18px; }
        }

        /* ═══ SERVICE MODAL ═══ */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .modal-container {
          position: relative;
          background: #1a1814;
          border: 1px solid #c9963a;
          border-radius: 12px;
          max-width: 720px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(201, 150, 58, 0.08);
        }
        .modal-container::-webkit-scrollbar { width: 6px; }
        .modal-container::-webkit-scrollbar-track { background: transparent; }
        .modal-container::-webkit-scrollbar-thumb { background: #c9963a44; border-radius: 3px; }
        .modal-close {
          position: sticky;
          top: 0;
          float: left;
          margin: 16px;
          background: rgba(15, 14, 12, 0.85);
          border: 1px solid #2a2620;
          color: #e8dcc8;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s;
        }
        .modal-close:hover {
          background: #c9963a;
          color: #0f0e0c;
          border-color: #c9963a;
        }
        .modal-hero-img {
          width: 100%;
          height: 280px;
          object-fit: cover;
          border-radius: 11px 11px 0 0;
          display: block;
        }
        .modal-hero-overlay {
          position: relative;
        }
        .modal-hero-overlay::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(transparent, #1a1814);
          pointer-events: none;
        }
        .modal-body {
          padding: 32px 40px 40px;
        }
        .modal-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(201, 150, 58, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c9963a;
          margin-bottom: 16px;
        }
        .modal-body h2 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 24px;
          color: #e8dcc8;
        }
        .modal-body p {
          font-size: 15px;
          line-height: 1.85;
          color: #9a8f7e;
          margin-bottom: 16px;
        }
        .modal-divider {
          border: none;
          border-top: 1px solid #2a2620;
          margin: 32px 0;
        }
        .modal-faq-title {
          font-size: 20px;
          font-weight: 600;
          color: #c9963a;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .faq-item {
          border: 1px solid #2a2620;
          border-radius: 8px;
          margin-bottom: 12px;
          overflow: hidden;
          transition: border-color 0.3s;
        }
        .faq-item.open {
          border-color: rgba(201, 150, 58, 0.4);
        }
        .faq-question {
          width: 100%;
          background: none;
          border: none;
          color: #e8dcc8;
          font-size: 15px;
          font-weight: 500;
          font-family: 'Heebo', sans-serif;
          padding: 16px 20px;
          text-align: right;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          transition: background 0.2s;
        }
        .faq-question:hover {
          background: rgba(201, 150, 58, 0.06);
        }
        .faq-chevron {
          flex-shrink: 0;
          color: #c9963a;
          transition: transform 0.3s;
        }
        .faq-chevron.open {
          transform: rotate(180deg);
        }
        .faq-answer {
          overflow: hidden;
        }
        .faq-answer-inner {
          padding: 0 20px 16px;
          font-size: 14px;
          line-height: 1.8;
          color: #9a8f7e;
        }
        .modal-cta-row {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }
        .modal-cta-btn {
          flex: 1;
          padding: 14px 20px;
          border-radius: 8px;
          font-family: 'Heebo', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .modal-cta-primary {
          background: #c9963a;
          color: #0f0e0c;
          border: none;
        }
        .modal-cta-primary:hover { background: #e8b96a; }
        .modal-cta-secondary {
          background: transparent;
          color: #c9963a;
          border: 1px solid #c9963a;
        }
        .modal-cta-secondary:hover { background: rgba(201, 150, 58, 0.1); }

        @media (max-width: 968px) {
          .modal-hero-img { height: 200px; }
          .modal-body { padding: 24px 24px 32px; }
          .modal-body h2 { font-size: 24px; }
          .modal-cta-row { flex-direction: column; }
        }
      `}</style>

      {/* ═══ NAVBAR ═══ */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">
          <span className="nav-logo-title">אומנות השיפוץ</span>
          <span className="nav-logo-sub">קבלן שיפוצים מורשה</span>
        </div>
        <ul className="nav-links">
          {navLinks.map(l => (
            <li key={l.id}>
              <a
                onClick={(e) => { e.preventDefault(); scrollTo(l.id) }}
                className={activeSection === l.id ? 'active' : ''}
                href={`#${l.id}`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <button className="nav-cta nav-cta-desktop" onClick={() => scrollTo('contact')}>
          קבל הצעת מחיר
        </button>
        <button className="nav-hamburger" onClick={() => setMobileMenu(true)}>
          <Menu size={28} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="mobile-close" onClick={() => setMobileMenu(false)}>
              <X size={32} />
            </button>
            {navLinks.map(l => (
              <a key={l.id} onClick={() => scrollTo(l.id)} href={`#${l.id}`}>{l.label}</a>
            ))}
            <button className="nav-cta" onClick={() => { scrollTo('contact'); setMobileMenu(false) }}>
              קבל הצעת מחיר
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ SERVICE MODAL ═══ */}
      <AnimatePresence>
        {serviceModal !== null && (() => {
          const s = services[serviceModal]
          return (
            <motion.div
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setServiceModal(null)}
            >
              <motion.div
                className="modal-container"
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 30 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onClick={e => e.stopPropagation()}
              >
                <div className="modal-hero-overlay">
                  <img className="modal-hero-img" src={s.img} alt={s.title} />
                </div>
                <button className="modal-close" onClick={() => setServiceModal(null)}>
                  <X size={20} />
                </button>
                <div className="modal-body">
                  <div className="modal-icon-wrap"><s.icon size={28} /></div>
                  <h2>{s.title}</h2>
                  {s.fullDesc.map((p, i) => <p key={i}>{p}</p>)}

                  <hr className="modal-divider" />

                  <div className="modal-faq-title">
                    <MessageCircle size={20} />
                    שאלות נפוצות
                  </div>
                  {s.faq.map((f, i) => (
                    <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                      <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                        <span>{f.q}</span>
                        <ChevronDown size={18} className={`faq-chevron ${openFaq === i ? 'open' : ''}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {openFaq === i && (
                          <motion.div
                            className="faq-answer"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                          >
                            <div className="faq-answer-inner">{f.a}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  <div className="modal-cta-row">
                    <button className="modal-cta-btn modal-cta-primary" onClick={() => { setServiceModal(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}>
                      <PhoneCall size={18} />
                      קבל הצעת מחיר
                    </button>
                    <a href="tel:0501234567" className="modal-cta-btn modal-cta-secondary">
                      <Phone size={18} />
                      התקשר עכשיו
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      {/* ═══ HERO ═══ */}
      <div className="hero-bg">
      <video className="hero-bg-video" autoPlay muted loop playsInline src={`${base}hero-bg.mp4`} />
      <div className="hero">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="hero-badge">קבלן שיפוצים מוסמך · 15 שנות ניסיון</span>
            <h1>
              שיפוץ הדירה שלכם
              <br />
              <span className="gold">בידיים הנכונות</span>
            </h1>
            <p className="hero-subtitle">
              מקצועיות, שקיפות ועמידה בלוח זמנים — מהייעוץ הראשון ועד מסירת המפתח
            </p>
          </motion.div>
          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="hero-stat">
              <span className="hero-stat-num"><Counter target={250} suffix="+" /></span>
              <span className="hero-stat-label">פרויקטים הושלמו</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num"><Counter target={15} /></span>
              <span className="hero-stat-label">שנות ניסיון</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num"><Counter target={98} suffix="%" /></span>
              <span className="hero-stat-label">לקוחות ממליצים</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="hero-form-col"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="form-card" id="contact">
            <h3>קבל הצעת מחיר חינם</h3>
            <p className="form-sub">ללא התחייבות · תוך 24 שעות</p>
            {formSent ? (
              <div className="form-success">
                <Check size={40} style={{ marginBottom: 8 }} />
                <div>פנייתך התקבלה בהצלחה!</div>
                <div style={{ fontSize: 14, color: '#9a8f7e', marginTop: 4 }}>ניצור איתך קשר תוך 24 שעות</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-field">
                  <input
                    type="text"
                    placeholder="שם מלא"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <input
                    type="tel"
                    placeholder="טלפון"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="" disabled>סוג עבודה</option>
                    <option value="general">שיפוץ דירה כללי</option>
                    <option value="kitchen">מטבח</option>
                    <option value="bathroom">אמבטיה</option>
                    <option value="tiling">ריצוף</option>
                    <option value="drywall">גבס</option>
                    <option value="addition">תוספת בנייה</option>
                    <option value="other">אחר</option>
                  </select>
                </div>
                <div className="form-field">
                  <select
                    value={formData.size}
                    onChange={e => setFormData({ ...formData, size: e.target.value })}
                    required
                  >
                    <option value="" disabled>גודל</option>
                    <option value="small">עד 60 מ"ר</option>
                    <option value="medium">60-100 מ"ר</option>
                    <option value="large">100-150 מ"ר</option>
                    <option value="xlarge">150+ מ"ר</option>
                  </select>
                </div>
                <button type="submit" className="form-submit">שלח פנייה ←</button>
              </form>
            )}
            <a href="https://wa.me/972525551234" target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
              <MessageCircle size={20} />
              שלח הודעה בוואטסאפ
            </a>
            <div className="trust-signals">
              <span><Check size={14} className="trust-check" /> רישיון קבלן ג5</span>
              <span><Check size={14} className="trust-check" /> ביטוח מלא</span>
              <span><Check size={14} className="trust-check" /> אחריות 5 שנים</span>
            </div>
          </div>
        </motion.div>

        <div className="scroll-indicator">
          <span>גלול למטה</span>
          <ChevronDown size={20} />
        </div>
      </div>
      </div>

      {/* ═══ SERVICES ═══ */}
      <Section id="services">
        <motion.h2 className="section-title" variants={fadeInUp}>השירותים שלנו</motion.h2>
        <motion.p className="section-subtitle" variants={fadeInUp}>פתרון מלא לכל צרכי השיפוץ</motion.p>
        <motion.div className="services-grid" variants={staggerContainer}>
          {services.map((s, i) => (
            <motion.div key={i} className="service-card" variants={fadeInUp} whileHover={{ scale: 1.02 }} onClick={() => { setServiceModal(i); setOpenFaq(null) }} style={{ cursor: 'pointer' }}>
              <div className="service-icon"><s.icon size={24} /></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <span className="service-link">למידע נוסף ←</span>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══ GALLERY ═══ */}
      <Section id="gallery">
        <motion.h2 className="section-title" variants={fadeInUp}>הפרויקטים שלנו</motion.h2>
        <motion.p className="section-subtitle" variants={fadeInUp}>לפני ואחרי — תוצאות אמיתיות</motion.p>
        <motion.div className="gallery-grid" variants={staggerContainer}>
          {projects.map((p, i) =>
            p.type === 'beforeAfter' ? (
              <BeforeAfterSlider key={i} title={p.title} tags={p.tags} beforeImg={p.beforeImg} afterImg={p.afterImg} />
            ) : (
              <GalleryImageCard key={i} title={p.title} tags={p.tags} img={p.img} imgPos={p.imgPos} />
            )
          )}
        </motion.div>
      </Section>

      {/* ═══ PROCESS ═══ */}
      <div className="process-wrap">
        <div className="process-inner">
          <Section id="process" className="section-full" style={{ padding: 0 }}>
            <motion.h2 className="section-title" variants={fadeInUp}>איך עובד התהליך</motion.h2>
            <motion.p className="section-subtitle" variants={fadeInUp}>ארבעה שלבים פשוטים מהייעוץ ועד המסירה</motion.p>
            <motion.div className="process-timeline" variants={staggerContainer}>
              {steps.map((s, i) => (
                <motion.div key={i} className="process-step" variants={fadeInUp}>
                  <div className="process-num">{s.num}</div>
                  <div className="process-step-text">
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Section>
        </div>
      </div>

      {/* ═══ WHY US ═══ */}
      <Section id="why">
        <motion.h2 className="section-title" variants={fadeInUp}>למה לבחור בנו</motion.h2>
        <motion.p className="section-subtitle" variants={fadeInUp}>היתרונות שלנו בקצרה</motion.p>
        <motion.div className="why-grid" variants={staggerContainer}>
          {whyUs.map((w, i) => (
            <motion.div key={i} className="why-card" variants={fadeInUp} whileHover={{ scale: 1.02 }}>
              <w.icon size={28} className="why-icon" />
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══ TESTIMONIALS ═══ */}
      <Section id="testimonials">
        <motion.h2 className="section-title" variants={fadeInUp}>מה אומרים הלקוחות שלנו</motion.h2>
        <motion.p className="section-subtitle" variants={fadeInUp}>ביקורות אמיתיות מלקוחות מרוצים</motion.p>
        <motion.div className="test-grid" variants={staggerContainer}>
          {testimonials.map((t, i) => (
            <motion.div key={i} className="test-card" variants={fadeInUp}>
              <div className="test-quote-mark">"</div>
              <p className="test-text">{t.text}</p>
              <div className="test-stars">
                {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="#c9963a" />)}
              </div>
              <div className="test-author-row">
                <div className="test-avatar">{t.initials}</div>
                <div>
                  <div className="test-author">{t.name}</div>
                  <div className="test-meta">{t.city} | {t.project}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══ CTA STRIP ═══ */}
      <div className="cta-strip">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp}>מוכנים להתחיל?</motion.h2>
          <motion.p variants={fadeInUp}>
            צרו קשר היום וקבלו ייעוץ חינם עם הצעת מחיר תוך 48 שעות
          </motion.p>
          <motion.div className="cta-buttons" variants={fadeInUp}>
            <a href="tel:0525551234" className="cta-btn cta-btn-gold">
              <Phone size={18} />
              התקשרו עכשיו 052-555-1234
            </a>
            <a href="https://wa.me/972525551234" target="_blank" rel="noopener noreferrer" className="cta-btn cta-btn-green">
              <MessageCircle size={18} />
              שלחו הודעה בוואטסאפ
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-logo-title">אומנות השיפוץ</div>
            <p className="footer-tagline">
              קבלן שיפוצים מורשה עם 15 שנות ניסיון. אנחנו מתמחים בשיפוצים ברמה הגבוהה ביותר, עם דגש על מקצועיות, שקיפות ושביעות רצון הלקוח.
            </p>
          </div>
          <div>
            <h4>שירותים</h4>
            <ul>
              <li>שיפוץ כללי</li>
              <li>שיפוץ מטבח</li>
              <li>שיפוץ אמבטיה</li>
              <li>ריצוף וחיפוי</li>
              <li>עבודות גבס</li>
              <li>תוספות בנייה</li>
            </ul>
          </div>
          <div>
            <h4>צור קשר</h4>
            <ul>
              <li>052-555-1234</li>
              <li>info@art-renovation.co.il</li>
              <li>תל אביב והמרכז</li>
              <li>ימים א׳-ה׳ 08:00-18:00</li>
              <li>שישי 08:00-13:00</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © 2025 אומנות השיפוץ · כל הזכויות שמורות · רישיון קבלן ג5
        </div>
      </footer>
    </>
  )
}
