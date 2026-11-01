import type { Style } from "@/lib/brief";
import { BoldTemplate } from "./bold";
import { CalmTemplate } from "./calm";
import { PremiumTemplate } from "./premium";
import type { TemplateProps } from "./types";

// 3 תבניות קבועות, מספר דפים בלתי מוגבל: כל דף בוחר תבנית ומחזיק JSON משלו
export const TEMPLATES: Record<Style, (p: TemplateProps) => React.ReactNode> = {
  calm: CalmTemplate,
  bold: BoldTemplate,
  premium: PremiumTemplate,
};

export function PageRenderer({ template, ...props }: TemplateProps & { template: Style }) {
  const Template = TEMPLATES[template] ?? CalmTemplate;
  return <Template {...props} />;
}
