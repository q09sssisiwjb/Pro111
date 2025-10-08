import { Card } from "@/components/ui/card";
import { Info, Target, Zap, Heart, Globe } from "lucide-react";

export default function AboutUs() {
  const values = [
    {
      icon: Zap,
      title: "Innovation",
      description: "We push the boundaries of AI technology to create tools that empower creativity.",
    },
    {
      icon: Heart,
      title: "User-Centric",
      description: "Every feature we build is designed with our users' needs and feedback in mind.",
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "We believe powerful AI tools should be accessible to everyone, everywhere.",
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Info className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="about-page-title">
              About Visionary AI
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground text-lg" data-testid="about-page-description">
          Empowering creativity through artificial intelligence
        </p>
      </div>

      <div className="space-y-8 mb-12">
        <Card className="p-8" data-testid="about-mission-card">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3" data-testid="about-mission-title">
                Our Mission
              </h2>
            </div>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed" data-testid="about-mission-text">
            At Visionary AI, we're on a mission to democratize creative AI technology. We believe that everyone should have 
            access to powerful tools that help bring their imagination to life. Our platform combines cutting-edge AI models 
            with intuitive design to make image generation and manipulation accessible to creators of all skill levels.
          </p>
        </Card>

        <Card className="p-8" data-testid="about-story-card">
          <h2 className="text-2xl font-bold mb-4" data-testid="about-story-title">
            Our Story
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed" data-testid="about-story-text">
            <p>
              Visionary AI was founded with a simple vision: to make professional-quality AI image generation tools 
              accessible to everyone. What started as a passion project has grown into a comprehensive platform serving 
              creators, designers, and artists worldwide.
            </p>
            <p>
              We've built our platform on the latest AI technologies, including Google's Gemini AI, to provide users with 
              an extensive suite of creative tools. From text-to-image generation to advanced image manipulation, we're 
              constantly innovating to bring new features and capabilities to our users.
            </p>
            <p>
              Today, Visionary AI serves thousands of users who rely on our platform for their creative projects. Whether 
              you're a professional designer, a hobbyist artist, or someone exploring AI for the first time, we're here to 
              help you create amazing visuals.
            </p>
          </div>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center" data-testid="about-values-title">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="p-6" data-testid={`about-value-${index}`}>
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-lg mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3" data-testid={`about-value-title-${index}`}>
                  {value.title}
                </h3>
                <p className="text-muted-foreground" data-testid={`about-value-description-${index}`}>
                  {value.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-8 bg-primary/5" data-testid="about-technology-card">
        <h2 className="text-2xl font-bold mb-4" data-testid="about-technology-title">
          Our Technology
        </h2>
        <p className="text-muted-foreground leading-relaxed" data-testid="about-technology-text">
          Visionary AI is powered by state-of-the-art AI models, including Google Gemini AI (gemini-2.0-flash-exp). 
          We leverage advanced machine learning algorithms to deliver fast, high-quality image generation and manipulation. 
          Our infrastructure is designed for reliability and scalability, ensuring that our tools are always available when 
          you need them. We're committed to staying at the forefront of AI technology, continuously updating our platform 
          with the latest advancements in the field.
        </p>
      </Card>
    </div>
  );
}
