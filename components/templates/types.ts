import type { PageContent } from "@/lib/page-content";

export type TemplateProps = {
  content: PageContent;
  business: { name: string; city: string | null; field: string | null };
};
