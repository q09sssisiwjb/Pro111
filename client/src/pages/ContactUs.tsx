import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export default function ContactUs() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="contact-page-title">
              Contact Us
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground text-lg" data-testid="contact-page-description">
          Have questions or feedback? We'd love to hear from you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Card className="p-6" data-testid="contact-support-card">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2" data-testid="contact-support-title">
                Chat Support
              </h3>
              <p className="text-muted-foreground text-sm mb-3" data-testid="contact-support-description">
                Get instant help from our AI-powered support assistant
              </p>
              <Button asChild variant="outline" size="sm" data-testid="button-support-chat">
                <a href="/support">Open Support Chat</a>
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6" data-testid="contact-whatsapp-card">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <SiWhatsapp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2" data-testid="contact-whatsapp-title">
                WhatsApp
              </h3>
              <p className="text-muted-foreground text-sm mb-3" data-testid="contact-whatsapp-description">
                Chat with us directly on WhatsApp
              </p>
              <Button asChild variant="outline" size="sm" data-testid="button-whatsapp">
                <a href="https://wa.me/917319294420" target="_blank" rel="noopener noreferrer">
                  Open WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
