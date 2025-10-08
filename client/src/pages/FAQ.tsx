import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "What is Visionary AI?",
          answer: "Visionary AI is a comprehensive AI-powered image generation and manipulation platform that offers text-to-image generation, image transformations, background removal, upscaling, custom art styles, effects, and various customization options."
        },
        {
          question: "How do I create my first image?",
          answer: "Navigate to the 'Generate' tool in the sidebar, enter a detailed description of what you want to create, select your preferred art style and settings, then click 'Generate'. Your AI-generated image will appear within seconds."
        },
        {
          question: "Is there a limit to how many images I can generate?",
          answer: "Visionary AI is completely free to use! You can generate unlimited images using our AI tools."
        },
        {
          question: "What image formats are supported?",
          answer: "We support JPG and PNG formats for uploads. Generated images can be downloaded in PNG format with optional transparency for backgrounds that have been removed."
        }
      ]
    },
    {
      category: "AI Tools & Features",
      questions: [
        {
          question: "What AI tools are available?",
          answer: "Visionary AI offers 11 core features including: Text-to-Image Generation, Image-to-Image Transformation, Background Remover, Image Upscaler, Image-to-Sketch, Custom Art Styles, Custom Effects, Custom Backgrounds, Custom Sky, Custom Expression, and Custom Weather creation."
        },
        {
          question: "How does the Text-to-Image generator work?",
          answer: "Our Text-to-Image generator uses Google Gemini AI (gemini-2.0-flash-exp model) to create images from your text descriptions. Simply describe what you want to see, choose an art style, and the AI will generate unique artwork based on your prompt."
        },
        {
          question: "What are Custom Art Styles?",
          answer: "Custom Art Styles allow you to create and save your own art style presets. Define visual characteristics, keywords, and preferences that can be reused across multiple generations. You can also browse and use community-created art styles."
        },
        {
          question: "How do I use the Background Remover?",
          answer: "Upload an image with a clear subject, and our AI will automatically detect and remove the background. The result can be exported with a transparent background in PNG format. It works best with well-lit photos and clear subjects."
        },
        {
          question: "What is Image Upscaling?",
          answer: "Image Upscaling uses AI to increase image resolution (2x or 4x) while enhancing quality and maintaining detail. It includes noise reduction and sharpening options, perfect for preparing images for print or high-resolution displays."
        }
      ]
    },
    {
      category: "Custom Creation Tools",
      questions: [
        {
          question: "What is Custom Sky?",
          answer: "Custom Sky allows you to define custom sky atmospheres for your images. Create any sky scenario from realistic weather conditions to fantastical celestial scenes. Set time of day, weather, cloud patterns, celestial objects, atmospheric effects, and color palettes."
        },
        {
          question: "What is Custom Expression?",
          answer: "Custom Expression lets you define character expressions for portraits and character art. Control emotional states, facial features, eye characteristics, mouth positions, body language, and intensity levels to create the perfect expression for your characters."
        },
        {
          question: "What is Custom Weather?",
          answer: "Custom Weather enables you to define specific weather conditions for your generated images. Create any atmospheric scenario including rain, snow, fog, storms, clear skies, and more. Control intensity, visibility, precipitation, wind effects, and atmospheric lighting."
        },
        {
          question: "Can I save and reuse my custom creations?",
          answer: "Yes! All custom creations (art styles, effects, backgrounds, skies, expressions, and weather presets) can be saved to your account and reused across different images. You can also share your custom styles with the community."
        }
      ]
    },
    {
      category: "Account & Settings",
      questions: [
        {
          question: "How do I save my favorite images?",
          answer: "Click the heart icon on any generated image to save it to your Favorites. You can access all your saved images from the 'Favorites' page in the sidebar."
        },
        {
          question: "Can I edit my profile?",
          answer: "Yes, go to the 'Profile' page from the sidebar to update your display name, profile picture, bio, and other account information."
        },
        {
          question: "How do I change my account settings?",
          answer: "Navigate to the 'Settings' page from the sidebar to customize your preferences, notification settings, privacy options, and more."
        },
        {
          question: "Is my data secure?",
          answer: "Yes, we take data security seriously. All images and user data are stored securely using Firebase Authentication and Google Drive storage with encryption. We never share your personal information or generated images without your permission."
        }
      ]
    },
    {
      category: "Community & Support",
      questions: [
        {
          question: "Can I share my art styles with others?",
          answer: "Absolutely! You can share your custom art styles with the community. Other users can discover and use your styles, and you can browse and use styles created by other artists."
        },
        {
          question: "How do I get help if I have a problem?",
          answer: "You can get help in several ways: Visit the 'Support' page for AI-powered customer support, check the 'Guides' page for tutorials and tips, or use the contact form on the 'Contact Us' page to reach our team directly."
        },
        {
          question: "Where can I find tutorials and guides?",
          answer: "Visit the 'Guides' page from the sidebar to access comprehensive tutorials for all AI tools, tips and tricks, and getting started guides."
        },
        {
          question: "How do I report a bug or suggest a feature?",
          answer: "Use the 'Contact Us' page to submit bug reports or feature suggestions. Our team reviews all feedback and uses it to continuously improve the platform."
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="faq-page-title">
              Frequently Asked Questions
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground text-lg" data-testid="faq-page-description">
          Find answers to common questions about Visionary AI
        </p>
      </div>

      <div className="space-y-8">
        {faqs.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="p-6" data-testid={`faq-category-${categoryIndex}`}>
            <h2 className="text-2xl font-semibold mb-4" data-testid={`faq-category-title-${categoryIndex}`}>
              {category.category}
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {category.questions.map((faq, index) => (
                <AccordionItem key={index} value={`item-${categoryIndex}-${index}`} data-testid={`faq-item-${categoryIndex}-${index}`}>
                  <AccordionTrigger className="text-left" data-testid={`faq-question-${categoryIndex}-${index}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground" data-testid={`faq-answer-${categoryIndex}-${index}`}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-6 bg-primary/5" data-testid="faq-help-card">
        <h3 className="text-xl font-semibold mb-2" data-testid="faq-help-title">
          Still have questions?
        </h3>
        <p className="text-muted-foreground" data-testid="faq-help-description">
          If you couldn't find the answer you were looking for, please visit our Support page for AI-powered assistance or contact us directly through the Contact Us page.
        </p>
      </Card>
    </div>
  );
}
