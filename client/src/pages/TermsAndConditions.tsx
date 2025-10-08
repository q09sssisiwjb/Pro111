import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsAndConditions() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: [
        "By accessing and using Visionary AI, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.",
        "We reserve the right to modify these terms at any time. Your continued use of the service following any changes indicates your acceptance of the new terms.",
      ],
    },
    {
      title: "2. Description of Service",
      content: [
        "Visionary AI provides AI-powered image generation and manipulation tools, including:",
        "• Text-to-image generation",
        "• Image-to-image transformation",
        "• Background removal",
        "• Image upscaling",
        "• Custom art styles and effects",
        "• Community gallery features",
        "We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice.",
      ],
    },
    {
      title: "3. User Accounts",
      content: [
        "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
        "You must provide accurate, current, and complete information during registration.",
        "You must be at least 13 years old to use this service.",
        "We reserve the right to terminate accounts that violate these terms or engage in fraudulent activity.",
      ],
    },
    {
      title: "4. User Content and Conduct",
      content: [
        "You retain ownership of any content you create using our service.",
        "By using our service, you grant us a license to display, distribute, and use your content solely for the purpose of operating and improving the service.",
        "You agree not to use the service to create, upload, or share content that:",
        "• Violates any laws or regulations",
        "• Infringes on intellectual property rights",
        "• Contains harmful, offensive, or inappropriate material",
        "• Promotes violence, discrimination, or illegal activities",
        "• Contains malware or attempts to compromise system security",
      ],
    },
    {
      title: "5. Intellectual Property Rights",
      content: [
        "All service features, functionality, and content (excluding user-generated content) are owned by Visionary AI and protected by copyright, trademark, and other intellectual property laws.",
        "You may not copy, modify, distribute, or reverse engineer any part of our service without explicit permission.",
        "AI-generated images created using our service are subject to the capabilities and limitations of the underlying AI models.",
      ],
    },
    {
      title: "6. Service Usage Limitations",
      content: [
        "We may impose usage limits on our service, including but not limited to:",
        "• Number of images generated per day/month",
        "• Storage capacity for saved images",
        "• API request limits",
        "Excessive use or abuse of the service may result in temporary or permanent suspension of access.",
      ],
    },
    {
      title: "7. Disclaimers and Limitation of Liability",
      content: [
        'The service is provided "as is" without warranties of any kind, either express or implied.',
        "We do not guarantee that the service will be uninterrupted, error-free, or completely secure.",
        "AI-generated content may not always meet your expectations or be suitable for your intended use.",
        "We are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.",
      ],
    },
    {
      title: "8. Indemnification",
      content: [
        "You agree to indemnify and hold harmless Visionary AI, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:",
        "• Your use of the service",
        "• Your violation of these terms",
        "• Your violation of any rights of another party",
        "• Content you create or share using the service",
      ],
    },
    {
      title: "9. Third-Party Services",
      content: [
        "Our service may integrate with or link to third-party services (e.g., Google Gemini AI, Firebase).",
        "We are not responsible for the content, privacy policies, or practices of third-party services.",
        "Your use of third-party services is at your own risk and subject to their respective terms of service.",
      ],
    },
    {
      title: "10. Privacy",
      content: [
        "Your use of the service is also governed by our Privacy Policy.",
        "We collect and process your personal information as described in our Privacy Policy.",
        "By using the service, you consent to our collection and use of your information as outlined in the Privacy Policy.",
      ],
    },
    {
      title: "11. Termination",
      content: [
        "You may terminate your account at any time by contacting us or using the account settings.",
        "We may terminate or suspend your access to the service immediately, without prior notice, for any reason, including:",
        "• Violation of these terms",
        "• Fraudulent or illegal activity",
        "• Extended periods of inactivity",
        "Upon termination, your right to use the service will immediately cease.",
      ],
    },
    {
      title: "12. Governing Law and Dispute Resolution",
      content: [
        "These terms shall be governed by and construed in accordance with applicable laws.",
        "Any disputes arising from these terms or your use of the service shall be resolved through binding arbitration, except where prohibited by law.",
        "You waive any right to participate in class action lawsuits or class-wide arbitration.",
      ],
    },
    {
      title: "13. Contact Information",
      content: [
        "If you have any questions about these Terms and Conditions, please contact us through our Contact Us page or support system.",
      ],
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="terms-page-title">
              Terms and Conditions
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground text-lg" data-testid="terms-page-description">
          Last Updated: October 2025
        </p>
      </div>

      <Card className="p-8 mb-8" data-testid="terms-intro-card">
        <p className="text-muted-foreground leading-relaxed" data-testid="terms-intro-text">
          Welcome to Visionary AI. These Terms and Conditions ("Terms") govern your access to and use of our 
          AI-powered image generation and manipulation platform. Please read these Terms carefully before using 
          our service. By accessing or using Visionary AI, you agree to be bound by these Terms.
        </p>
      </Card>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <Card key={index} className="p-6" data-testid={`terms-section-${index}`}>
            <h2 className="text-2xl font-semibold mb-4" data-testid={`terms-section-title-${index}`}>
              {section.title}
            </h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed" data-testid={`terms-section-content-${index}`}>
              {section.content.map((paragraph, pIndex) => (
                <p key={pIndex} className={paragraph.startsWith("•") ? "ml-4" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-6 bg-primary/5" data-testid="terms-acceptance-card">
        <h3 className="text-xl font-semibold mb-3" data-testid="terms-acceptance-title">
          Agreement
        </h3>
        <p className="text-muted-foreground" data-testid="terms-acceptance-text">
          By using Visionary AI, you acknowledge that you have read, understood, and agree to be bound by these 
          Terms and Conditions. If you do not agree with any part of these terms, you must discontinue use of 
          the service immediately.
        </p>
      </Card>
    </div>
  );
}
