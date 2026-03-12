import { TextLink } from "@/components/ui/text-link";

export default function Footer() {
  return (
    <footer className="border-t bg-mauve-100">
      <div className="flex text-xs gap-4 p-2">
        <span>
          © {new Date().getFullYear()} <span>STREET LENS</span>
        </span>

        <TextLink
          href="https://github.com/uxbyweng/street-lens"
          target="_blank"
        >
          GitHub
        </TextLink>

        <TextLink href="https://weng.eu/" target="_blank">
          WENG.EU
        </TextLink>

        <TextLink href="/impressum">Impressum</TextLink>
      </div>
    </footer>
  );
}
