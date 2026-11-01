# CLAUDE.md

## המוצר
מחולל דפי נחיתה מבוסס AI לעסקים קטנים. כמה לקוחות במערכת אחת (multi-tenant).

## הטכנולוגיה
- Next.js
- Vercel (אחסון ופריסה)
- Supabase (מסד נתונים ואימות)
- Gemini API

## כללים
1. **RLS בכל טבלה** – כל טבלה ב-Supabase מופעלת עם Row Level Security.
2. **מפתחות סודיים לא עוזבים את השרת** – מפתחות סודיים (כמו מפתח ה-Gemini ומפתח ה-service role של Supabase) אף פעם לא נשלחים לצד הלקוח.
3. **Gemini מחזיר JSON בלבד** – כל תשובה מ-Gemini היא JSON בלבד, בלי שום פורמט אחר.
4. **ממשק בעברית, מימין לשמאל** – כל ממשק בעברית ובכיוון RTL.

## עיצוב
כל עבודת עיצוב בפרויקט (קומפוננטות, דפים, CSS, אנימציות, טיפוגרפיה, צבעים) מתבססת על שלושת ה-skills שב-`.claude/skills/`:

1. **לפני** שכותבים או משנים UI, קוראים את `.claude/skills/emil-design-eng/SKILL.md` ואת `.claude/skills/apple-design/SKILL.md` ופועלים לפיהם.
2. **אחרי** כל שינוי שכולל אנימציה, transition או אינטראקציה, עוברים על השינוי מול `.claude/skills/review-animations/SKILL.md` ו-`STANDARDS.md`, ומתקנים כל ממצא לפני commit.
3. הכללים של ה-skills חלים בתוך הכללים של הפרויקט: הכול בעברית וב-RTL. כיוונים פיזיים כמו "מימין" ו"משמאל" מתהפכים, אז משתמשים במאפיינים לוגיים (`ms-`/`me-`, `start`/`end`).

ברירות מחדל שנגזרות מה-skills ומוגדרות ב-`app/globals.css`:
- עקומות easing מותאמות: `--ease-out`, `--ease-in-out`, `--ease-drawer`. אף פעם לא `ease-in` ב-UI.
- אנימציות UI נמשכות פחות מ-300ms. משחררים כפתור ב-`scale(0.97)` עם 160ms.
- מנפישים רק `transform` ו-`opacity`. אף פעם לא `transition: all`.
- אפקטי hover רק בתוך `@media (hover: hover) and (pointer: fine)`. תמיד מכבדים `prefers-reduced-motion`.
- לא מוסיפים אנימציה לפעולות שחוזרות עשרות פעמים ביום או שמופעלות מהמקלדת.
