import { SearchBar } from "@/components/search/SearchBar";
import { Content } from "@/components/content/ContentPage";

export function FooterServicePage({ title, body }: { title: string; body: string }) {
  const paragraphs = body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <Content title={title}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="whitespace-pre-line">
          {paragraph}
        </p>
      ))}
      <div className="mt-8">
        <SearchBar compact />
      </div>
    </Content>
  );
}
