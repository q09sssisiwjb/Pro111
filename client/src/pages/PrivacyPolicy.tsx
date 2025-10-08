import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        "When you use Visionary AI, we collect information that you provide directly to us, including:",
        "• Account information (name, email address, password)",
        "• Profile information (display name, bio, profile picture)",
        "• Content you create (generated images, custom art styles, favorites)",
        "• Communication data (support messages, feedback)",
      ],
    },
    {
      title: "How We Use Your Information",
      content: [
        "We use the information we collect to:",
        "• Provide, maintain, and improve our services",
        "• Process your requests",
        "• Send you technical notices, updates, and support messages",
        "• Respond to your comments and questions",
        "• Monitor and analyze trends, usage, and activities",
        "• Detect, prevent, and address technical issues and fraudulent activity",
        "• Personalize your experience on our platform",
      ],
    },
    {
      title: "Data Storage and Security",
      content: [
        "We take data security seriously and implement appropriate technical and organizational measures to protect your personal information:",
        "• All data is encrypted in transit and at rest",
        "• We use Firebase Authentication for secure user authentication",
        "• Generated images and user content are stored securely on Google Drive",
        "• We regularly review and update our security practices",
        "• Access to personal data is restricted to authorized personnel only",
      ],
    },
    {
      title: "Data Sharing and Disclosure",
      content: [
        "We do not sell your personal information to third parties. We may share your information only in the following circumstances:",
        "• With your consent or at your direction",
        "• With service providers who perform services on our behalf",
        "• To comply with legal obligations or respond to lawful requests",
        "• To protect the rights, property, or safety of Visionary AI, our users, or others",
        "• In connection with a merger, sale, or acquisition of our business",
      ],
    },
    {
      title: "Your Rights and Choices",
      content: [
        "You have certain rights regarding your personal information:",
        "• Access: You can request access to your personal data",
        "• Correction: You can update or correct your account information",
        "• Deletion: You can request deletion of your account and associated data",
        "• Export: You can request a copy of your data in a portable format",
        "• Opt-out: You can opt out of marketing communications at any time",
        "To exercise these rights, please contact us through our Contact Us page.",
      ],
    },
    {
      title: "Cookies and Tracking",
      content: [
        "We use cookies and similar tracking technologies to:",
        "• Keep you logged in to your account",
        "• Remember your preferences and settings",
        "• Understand how you use our service",
        "• Improve our platform's performance",
        "You can control cookies through your browser settings, but disabling cookies may affect your ability to use certain features.",
      ],
    },
    {
      title: "Children's Privacy",
      content: [
        "Visionary AI is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.",
      ],
    },
    {
      title: "International Data Transfers",
      content: [
        "Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our service, you consent to the transfer of your information to our facilities and service providers globally.",
      ],
    },
    {
      title: "Changes to This Policy",
      content: [
        "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date. You are advised to review this Privacy Policy periodically for any changes.",
      ],
    },
    {
      title: "Contact Us",
      content: [
        "If you have any questions about this Privacy Policy or our data practices, please contact us through our Contact Us page or via the support chat.",
      ],
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="privacy-page-title">
              Privacy Policy
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground text-lg" data-testid="privacy-page-description">
          Last Updated: October 2025
        </p>
      </div>

      <Card className="p-8 mb-8" data-testid="privacy-intro-card">
        <p className="text-muted-foreground leading-relaxed" data-testid="privacy-intro-text">
          At Visionary AI, we respect your privacy and are committed to protecting your personal information. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
          our platform and services. Please read this policy carefully to understand our practices regarding your 
          personal data.
        </p>
      </Card>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <Card key={index} className="p-6" data-testid={`privacy-section-${index}`}>
            <h2 className="text-2xl font-semibold mb-4" data-testid={`privacy-section-title-${index}`}>
              {section.title}
            </h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed" data-testid={`privacy-section-content-${index}`}>
              {section.content.map((paragraph, pIndex) => (
                <p key={pIndex} className={paragraph.startsWith("•") ? "ml-4" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
