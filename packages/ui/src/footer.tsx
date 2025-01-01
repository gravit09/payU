import { CreditCard } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Security", "Updates"],
  Company: ["About", "Blog", "Careers", "Press Kit"],
  Resources: ["Documentation", "Help Center", "Contact", "Partners"],
  Legal: ["Privacy", "Terms", "Cookie Policy", "Licenses"],
};

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-primary">
            <CreditCard className="h-6 w-6" />
            <span className="text-xl font-bold">PayFlow</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">
              © 2024 PayFlow. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                LinkedIn
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
