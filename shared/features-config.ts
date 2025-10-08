/**
 * Centralized Features Configuration
 * 
 * This file serves as the single source of truth for all platform features.
 * When you add, update, or remove features here, the Gemini customer support
 * system automatically updates without manual intervention.
 * 
 * HOW TO USE:
 * 1. To add a new feature: Add it to the PLATFORM_FEATURES array
 * 2. To update a feature: Modify its details in the array
 * 3. To remove a feature: Delete it from the array
 * 4. Changes automatically propagate to the support chat endpoint
 * 
 * The generateSupportSystemMessage() function dynamically creates the
 * system prompt for the Gemini AI customer support assistant.
 */

export interface Feature {
  id: string;
  title: string;
  description: string;
  details: string[];
  category: 'core' | 'custom' | 'user' | 'community' | 'admin';
}

export const PLATFORM_FEATURES: Feature[] = [
  {
    id: 'text-to-image',
    title: 'TEXT-TO-IMAGE GENERATOR',
    description: 'Create stunning images from text descriptions',
    details: [
      'Powered by Google Gemini AI (gemini-2.0-flash-exp model)',
      'Supports multiple art styles: Realistic, Anime, 3D Render, Abstract, Fantasy, Cartoon',
      'Customizable dimensions and quality settings',
      'Negative prompts to exclude unwanted elements',
      'Prompt enhancement feature to improve descriptions'
    ],
    category: 'core'
  },
  {
    id: 'image-to-image',
    title: 'IMAGE-TO-IMAGE TRANSFORMATION',
    description: 'Transform existing images based on text prompts',
    details: [
      'Perfect for style transfers and variations',
      'Adjustable influence strength (how much to keep from original)',
      'Support for JPG and PNG formats',
      'Great for creating variations of existing artwork'
    ],
    category: 'core'
  },
  {
    id: 'background-remover',
    title: 'BACKGROUND REMOVER',
    description: 'Automatically detect and remove backgrounds using AI',
    details: [
      'Export with transparent background (PNG format)',
      'Works best with clear subjects, good contrast, well-lit photos',
      'Perfect for product photography and portraits'
    ],
    category: 'core'
  },
  {
    id: 'image-upscaler',
    title: 'IMAGE UPSCALER',
    description: 'Increase image resolution using AI',
    details: [
      'Increase resolution (2x, 4x options)',
      'Enhance quality without losing detail',
      'Noise reduction and sharpening options',
      'Perfect for preparing images for print or high-res displays'
    ],
    category: 'core'
  },
  {
    id: 'image-to-sketch',
    title: 'IMAGE-TO-SKETCH',
    description: 'Convert photos to artistic sketches',
    details: [
      'Multiple sketch styles: pencil, pen, charcoal',
      'Adjustable detail level and line intensity',
      'Great for creating artistic portraits and coloring pages'
    ],
    category: 'core'
  },
  {
    id: 'custom-art-styles',
    title: 'CUSTOM ART STYLES',
    description: 'Create and save personal art style presets',
    details: [
      'Define visual characteristics, keywords, and preferences',
      'Reusable across multiple generations',
      'Browse community art styles created by other users',
      'Share your custom styles with the community'
    ],
    category: 'custom'
  },
  {
    id: 'custom-effects',
    title: 'CUSTOM EFFECTS',
    description: 'Create custom visual effects and filters',
    details: [
      'Color grading, lighting adjustments, texture overlays',
      'Parameters: intensity, blend mode, color grading, texture, focus',
      'Save and reuse effects across different images'
    ],
    category: 'custom'
  },
  {
    id: 'custom-backgrounds',
    title: 'CUSTOM BACKGROUNDS',
    description: 'Create custom backgrounds for images with removed backgrounds',
    details: [
      'Types: Solid colors, gradients, patterns, AI-generated scenes',
      'Adjustable blur, brightness, contrast, opacity',
      'Shadow integration and perspective matching features'
    ],
    category: 'custom'
  },
  {
    id: 'custom-sky',
    title: 'CUSTOM SKY',
    description: 'Define custom sky atmospheres for image generation',
    details: [
      'Create any sky scenario: realistic weather conditions to fantastical celestial scenes',
      'Specify colors, time of day, weather, celestial elements, cloud types',
      'Include lighting qualities and atmospheric effects',
      'Integrates naturally with generated images'
    ],
    category: 'custom'
  },
  {
    id: 'custom-expression',
    title: 'CUSTOM EXPRESSION',
    description: 'Define specific facial expressions and emotions for generated images',
    details: [
      'Create any emotional expression from subtle to dramatic',
      'Specify facial features: eyes, mouth, eyebrows, head position',
      'Include intensity levels and emotional states',
      'Perfect for character portraits and storytelling'
    ],
    category: 'custom'
  },
  {
    id: 'custom-weather',
    title: 'CUSTOM WEATHER',
    description: 'Define unique weather conditions and atmospheric effects',
    details: [
      'Create any weather scenario: realistic conditions to fantastical phenomena',
      'Specify precipitation, wind, visibility, temperature feel',
      'Add atmospheric effects: rainbow, lightning, fog, mist',
      'Include environmental impact and time-of-day interactions',
      'Combines with custom sky for complete atmospheric scenes'
    ],
    category: 'custom'
  }
];

export const USER_FEATURES = [
  'Firebase Authentication (email/password and Google OAuth)',
  'User profiles with customizable bio, location, and website',
  'Save favorite images to personal collection',
  'Custom model configuration (Hugging Face models, custom API endpoints)',
  'Message system for admin communications',
  'Activity tracking and statistics'
];

export const COMMUNITY_FEATURES = [
  'Community gallery showcasing user-generated images',
  'Filter by art style and aspect ratio',
  'Like and interact with community creations',
  'Share custom art styles with others'
];

export const ADMIN_FEATURES = [
  'User management (ban/unban, delete users)',
  'Image moderation and deletion',
  'Art style management',
  'Platform statistics and analytics',
  'Send messages to users'
];

export const STORAGE_INFO = [
  'Primary storage: Google Drive (JSON files)',
  'Fallback: In-memory storage',
  'All user data, images, and settings are securely stored'
];

export const TECHNICAL_DETAILS = [
  'Frontend: React 18 with TypeScript, React Query, Wouter routing',
  'Backend: Express.js with TypeScript, RESTful API',
  'AI Integration: Google Gemini API for image generation',
  'UI: Modern dark theme, mobile-responsive design',
  'Fonts: Inter and Space Grotesk'
];

export const NAVIGATION_INFO = [
  'Sidebar menu for accessing all tools',
  'Pages: Home, Guides, Art Styles, My Art Style, Effects, Favorites, Profile, Settings, Admin (for admins), Messages',
  'Top bar with quick access to Tools, Guides, and Gallery sections'
];

export const TROUBLESHOOTING_TIPS = [
  'Image quality issues: Suggest using detailed prompts, trying different art styles',
  'Background removal not perfect: Recommend good contrast, well-lit images',
  'Upscaling blurry: Source image quality matters, some images may not upscale well',
  'Generation failures: Check internet connection, API availability, try different settings'
];

export function generateSupportSystemMessage(): string {
  const coreFeatures = PLATFORM_FEATURES.map((feature, index) => {
    const details = feature.details.map(d => `   - ${d}`).join('\n');
    return `${index + 1}. ${feature.title}\n   - ${feature.description}\n${details}`;
  }).join('\n\n');

  const userFeatures = USER_FEATURES.map(f => `- ${f}`).join('\n');
  const communityFeatures = COMMUNITY_FEATURES.map(f => `- ${f}`).join('\n');
  const adminFeatures = ADMIN_FEATURES.map(f => `- ${f}`).join('\n');
  const storage = STORAGE_INFO.map(f => `- ${f}`).join('\n');
  const technical = TECHNICAL_DETAILS.map(f => `- ${f}`).join('\n');
  const navigation = NAVIGATION_INFO.map(f => `- ${f}`).join('\n');
  const troubleshooting = TROUBLESHOOTING_TIPS.map(f => `- ${f}`).join('\n');

  return `You are a helpful customer support assistant for Visionary AI, a comprehensive AI-powered image generation and manipulation platform. Your role is to assist users with questions, troubleshooting, and guidance.

PLATFORM OVERVIEW:
Visionary AI is a full-stack TypeScript web application offering advanced AI tools for image creation and editing. It features a modern dark-themed UI built with React, Tailwind CSS, and shadcn/ui components.

CORE FEATURES & TOOLS:

${coreFeatures}

USER FEATURES:
${userFeatures}

COMMUNITY FEATURES:
${communityFeatures}

ADMIN PANEL (for administrators):
${adminFeatures}

STORAGE & DATA:
${storage}

TECHNICAL DETAILS:
${technical}

NAVIGATION:
${navigation}

HOW TO HELP USERS:
1. Answer questions about features, tools, and how to use them
2. Provide step-by-step guidance for tasks
3. Troubleshoot common issues
4. Explain technical concepts in simple terms
5. Direct users to relevant guides and documentation
6. Be friendly, patient, and supportive

COMMON TROUBLESHOOTING:
${troubleshooting}

Remember to be helpful, concise, and friendly. If you don't know something specific, acknowledge it and suggest checking the Guides page or contacting an administrator.`;
}
