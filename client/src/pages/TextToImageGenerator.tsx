import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import type { UserArtStyle, CustomModel, UserCustomEffect } from '@shared/schema';
import { 
  Send, 
  Download, 
  RefreshCw,
  Languages,
  FileText,
  Settings,
  Copy,
  Image as ImageIcon,
  Loader2,
  Video,
  Zap,
  Save,
  Edit,
  X,
  Sparkles,
  Shuffle,
  Check,
  ChevronsUpDown
} from "lucide-react";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  negativePrompt?: string;
  model: string;
  timestamp: Date;
  width: number;
  height: number;
}

const TextToImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [activeTab, setActiveTab] = useState('image');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);
  const [placeDropdownOpen, setPlaceDropdownOpen] = useState(false);
  const [effectDropdownOpen, setEffectDropdownOpen] = useState(false);
  const [backgroundDropdownOpen, setBackgroundDropdownOpen] = useState(false);
  const [skyDropdownOpen, setSkyDropdownOpen] = useState(false);
  const [weatherDropdownOpen, setWeatherDropdownOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const createdUrlsRef = useRef<string[]>([]);
  const isGeneratingRef = useRef(false);
  const savingRef = useRef<Set<string>>(new Set());

  // Art styles comprehensive list
  const artStyles = [
    "realistic", "cinematic", "cyberpunk", "anime", "manga", "ghibli", "comic", "impressionist", "pixel art", "abstract", "sketch", "fantasy", "3d render", "watercolor", "oil painting", "pop art", "steampunk", "digital painting", "cartoon", "gothic", "isometric", "sci-fi", "minimalist", "vaporwave", "synthwave", "dystopian", "utopian", "art deco", "art nouveau", "cubist", "surrealist", "futuristic", "retrowave", "neo-expressionist", "street art", "graffiti", "mural", "mosaic", "stained glass", "geometric", "abstract expressionism", "pointillism", "charcoal", "pencil sketch", "ink wash", "line art", "pop surrealism", "low poly", "voxel art", "vector art", "comic book", "cartoon modern", "traditional painting", "concept art", "matte painting", "photo realistic", "hdr photography", "vintage photograph", "blueprint", "schematic", "technical drawing", "infographic", "diagrammatic", "hieroglyphic", "cave painting", "tribal art", "african art", "asian art", "western art", "mythological", "horror", "gore", "macabre", "dark fantasy", "sci-fi horror", "post-apocalyptic", "urbex photography", "wildlife photography", "landscape photography", "portraiture", "still life", "botanical illustration", "zoological illustration", "anatomical drawing", "architectural sketch", "cityscape", "seascape", "space art", "astrophotography", "underwater art", "macro photography", "microscopic art", "infrared art", "light painting", "smoke art", "sand art", "watercolour sketch", "acrylic painting", "gouache", "pastel", "fauvism", "expressionism", "suprematism", "constructivism", "dadaism", "minimalism", "op art", "kinetic art", "photorealism", "hyperrealism", "romanticism", "baroque", "rococo", "neoclassicism", "pre-raphaelite", "symbolism", "divisionism", "luminism", "tonalism", "hudson river school", "ashcan school", "precisionism", "regionalism", "social realism", "magic realism", "fantastic realism", "naive art", "outsider art", "folk art", "self-taught art", "graffito", "body art", "land art", "environmental art", "performance art", "video art", "sound art", "bio art", "light art", "textile art", "glass art", "ceramic art", "jewelry design", "fashion illustration", "industrial design", "automotive art", "architectural visualization", "scientific illustration", "medical illustration", "forensic art", "color manga", "color sketch", "logo", "icon", "ads", "cyberpunk watercolor", "anime gothic", "pixel noir", "steampunk fantasy", "retro futurism", "sci-fi impressionism", "minimalist dystopian", "vaporwave botanical", "graffiti pop art", "mythological surrealism", "glitch art", "fractal art", "ai collage", "neon holographic", "augmented reality style", "liquid chrome", "synth organic", "bioluminescent art", "data visualization art", "dreamcore", "weirdcore", "celestial fantasy", "underwater cyberpunk", "dark fairytale", "post-apocalyptic nature", "interdimensional travel", "time-shifted art", "ethereal portraits", "frozen wasteland", "solar punk", "parallel universe art", "cyberpunk origami", "glass neon", "digital stained glass", "astral geometry", "chromatic smoke art", "dreamy pastel noir", "cyber samurai", "floating island fantasy", "frozen neon", "underwater steampunk", "shattered reality", "celestial watercolor", "paper cutout 3d", "neon tribal", "glass forest", "liquid metal", "mechanical nature", "holographic portraits", "luminous ink wash", "dark academia", "techno graffiti", "zero gravity cities", "fire & ice duality", "dreams in glass", "cosmic mosaic", "biomechanical horror", "cyberpunk jungle", "time fracture art", "rainbow mist", "ghost light", "fractal forest", "golden hour fantasy", "underwater cosmos", "tech bloom", "ancient tech ruins", "arcane circuits", "neon rain", "infinite spiral worlds", "shadow light contrast", "electric ice sculptures", "mythic bioluminescence", "paint splash universe", "shimmering desert", "firefly nights", "wired dreams", "ocean punk", "ai surrealism", "blood moon fantasy", "steam & stars", "ethereal silk art", "light beam architecture", "glass ocean", "rainbow circuitry", "toxic beauty", "shadow puppet art", "neon sandstorm", "crystal punk", "mirror world", "paint drip surrealism", "prismatic shadows", "stormlight fantasy", "electric aurora", "techno mythos", "molten core art", "lunar glass cities", "chromatic steampunk", "floating lantern realms", "laser horizon", "frozen galaxy", "quantum dreams", "eclipse realism", "bio-steel creatures", "woven light art", "retro arcade pixelism", "fogpunk", "prism rain", "cyber desert mirage", "blood crystal landscapes", "lava flow cities", "sky tunnels", "neon coral reef", "shattered moon", "starfall skies", "silver mist realism", "deep sea mecha", "aurora gothic", "cosmic origami", "jungle mech fusion", "electric feathered beasts", "hologram graffiti", "toxic jungle", "bioluminescent desert", "infinite mirror maze", "steamstorm skies", "pixel noir fantasy", "shattered light art", "solar flare city", "mecha samurai dreams", "icebound neon forest", "time loop art", "glass volcano", "mechanical butterfly garden", "asteroid colony realism", "shadow neon fusion", "blood rain dystopia", "luminous cave worlds", "neon storm ocean", "cloudpunk", "dragonpunk", "glitchpunk", "discpretion"
  ];

  // Places comprehensive list - curated and optimized (500+ unique places)
  const places = [
    // Natural Landscapes & Geographic Features
    "beach", "mountain", "forest", "desert", "ocean", "lake", "river", "waterfall", "cave", "valley", "hill", "meadow", "field", "island", "volcano", "canyon", "jungle", "rainforest", "savanna", "arctic", "tundra", "glacier", "cliff", "plateau", "gorge", "fjord", "bay", "lagoon", "marsh", "wetland", "swamp", "delta", "oasis", "dunes", "badlands", "mesa", "ridge", "peak", "crater", "geyser", "hot spring", "coral reef", "atoll", "peninsula", "cape", "inlet", "cove", "prairie", "steppe", "moor", "highlands", "lowlands", "headland", "escarpment", "ravine", "brook", "creek", "stream", "rapids", "cascade", "pond", "reservoir",

    // Major World Cities
    "new york", "london", "paris", "tokyo", "beijing", "moscow", "rome", "madrid", "berlin", "athens", "vienna", "prague", "budapest", "amsterdam", "copenhagen", "stockholm", "oslo", "helsinki", "dublin", "edinburgh", "barcelona", "lisbon", "milan", "florence", "venice", "zurich", "brussels", "warsaw", "cairo", "istanbul", "mumbai", "delhi", "bangalore", "bangkok", "singapore", "kuala lumpur", "jakarta", "manila", "seoul", "kyoto", "osaka", "hong kong", "shanghai", "sydney", "melbourne", "toronto", "vancouver", "montreal", "los angeles", "san francisco", "chicago", "boston", "miami", "las vegas", "seattle", "denver", "phoenix", "houston", "atlanta", "philadelphia", "washington dc", "mexico city", "sao paulo", "rio de janeiro", "buenos aires", "lima", "santiago", "bogota", "caracas", "dubai", "karachi", "lahore", "dhaka", "cape town", "johannesburg", "nairobi", "lagos", "marrakech", "casablanca", "jerusalem", "tel aviv", "beirut", "riyadh", "doha", "kuwait city", "tehran", "baghdad", "tashkent", "almaty", "tbilisi", "yerevan", "baku", "minsk", "kiev", "vilnius", "riga", "tallinn", "reykjavik",

    // Famous Landmarks & Monuments  
    "eiffel tower", "big ben", "colosseum", "taj mahal", "great wall of china", "machu picchu", "petra", "christ the redeemer", "chichen itza", "easter island", "stonehenge", "neuschwanstein castle", "sagrada familia", "notre dame", "louvre", "sistine chapel", "vatican", "buckingham palace", "tower of london", "statue of liberty", "empire state building", "golden gate bridge", "brooklyn bridge", "hollywood sign", "mount rushmore", "grand canyon", "yellowstone", "yosemite", "niagara falls", "antelope canyon", "uluru", "sydney opera house", "burj khalifa", "pyramids of giza", "sphinx", "angkor wat", "forbidden city", "kremlin", "red square", "acropolis", "parthenon", "mount olympus", "mount vesuvius", "pompeii", "victoria falls", "serengeti", "kilimanjaro", "everest base camp", "mont blanc", "matterhorn", "santorini", "mykonos", "bali", "phuket", "maldives", "seychelles", "mauritius", "fiji", "tahiti", "bora bora", "banff", "jasper", "grand teton", "zion", "bryce canyon", "arches", "death valley", "joshua tree", "sequoia", "redwood", "crater lake", "mount rainier", "glacier bay", "denali",

    // Architectural & Indoor Spaces
    "cathedral", "basilica", "chapel", "abbey", "monastery", "temple", "pagoda", "mosque", "synagogue", "castle", "palace", "fortress", "manor", "mansion", "villa", "cottage", "cabin", "lighthouse", "windmill", "barn", "greenhouse", "conservatory", "library", "museum", "gallery", "theater", "opera house", "concert hall", "stadium", "arena", "marketplace", "bazaar", "souk", "plaza", "courtyard", "garden", "park", "botanical garden", "zoo", "aquarium", "observatory", "planetarium", "university", "school", "hospital", "hotel", "restaurant", "cafe", "pub", "tavern", "inn", "living room", "bedroom", "kitchen", "dining room", "study", "office", "studio", "workshop", "attic", "basement", "cellar", "garage", "balcony", "terrace", "rooftop", "penthouse", "loft", "apartment", "suite", "lobby", "hallway", "staircase", "elevator", "bathroom", "spa", "sauna", "gym", "pool", "jacuzzi", "ballroom", "boardroom", "conference room", "classroom", "laboratory", "factory", "warehouse", "mall", "store", "boutique",

    // Transportation & Infrastructure
    "airport", "train station", "subway", "bus station", "harbor", "port", "pier", "dock", "marina", "bridge", "tunnel", "highway", "road", "street", "alley", "pathway", "sidewalk", "crossroads", "intersection", "roundabout", "parking lot", "gas station", "rest stop", "toll booth", "border crossing", "checkpoint", "airplane", "train", "subway car", "bus", "taxi", "ferry", "cruise ship", "yacht", "sailboat", "speedboat", "helicopter", "hot air balloon", "cable car", "gondola", "rickshaw", "bicycle", "motorcycle", "car interior", "truck", "rv", "camper van", "treehouse", "houseboat", "caravan", "tent", "igloo", "yurt", "tepee",

    // Fantasy & Fictional Places
    "atlantis", "el dorado", "shangri la", "avalon", "camelot", "valhalla", "asgard", "olympus", "wonderland", "neverland", "oz", "narnia", "middle earth", "shire", "rivendell", "gondor", "mordor", "hogwarts", "diagon alley", "hogsmeade", "winterfell", "kings landing", "dragonstone", "casterly rock", "braavos", "vaes dothrak", "meereen", "oldtown", "the wall", "beyond the wall", "westeros", "essos", "gotham city", "metropolis", "wakanda", "azeroth", "tamriel", "skyrim", "hyrule", "mushroom kingdom", "pandora", "naboo", "tatooine", "coruscant", "endor", "hoth", "dagobah", "mustafar", "kamino", "geonosis", "kashyyyk", "utapau", "mygeeto", "felucia", "cato neimoidia", "ryloth", "mandalore", "alderaan", "bespin", "jakku", "starkiller base", "crait", "exegol", "ahch to", "cantonica", "scarif", "erebor", "lonely mountain", "mirkwood", "fangorn forest", "helms deep", "edoras", "weathertop", "mount doom", "barad dur", "isengard", "minas tirith", "hobbiton", "bree", "lake town", "dale",

    // Sci-Fi & Futuristic Places
    "space station", "orbital platform", "moon base", "mars colony", "asteroid belt", "generation ship", "starship bridge", "engine room", "cargo bay", "hangar bay", "medical bay", "sci-fi laboratory", "command center", "observation deck", "teleporter room", "holodeck", "cryogenic chamber", "escape pod", "airlock", "docking bay", "reactor core", "artificial gravity", "zero gravity", "alien planet", "parallel universe", "alternate dimension", "time machine", "portal", "wormhole", "black hole", "nebula", "galaxy far far away", "dystopian city", "utopian society", "cyberpunk city", "steampunk world", "post apocalyptic wasteland", "underground bunker", "fallout shelter", "vault", "metro tunnels", "abandoned city", "ghost town", "ruins of civilization", "overgrown city", "floating city", "underwater city", "cloud city", "sky fortress", "orbital ring", "dyson sphere", "ringworld", "artificial world", "mining station", "research facility", "terraforming station", "solar array", "communications hub",

    // Historical & Time Periods
    "ancient egypt", "ancient greece", "ancient rome", "ancient china", "ancient india", "mesopotamia", "babylon", "pompeii", "viking village", "medieval castle", "medieval town", "renaissance italy", "elizabethan england", "colonial america", "wild west saloon", "wild west town", "victorian london", "victorian mansion", "industrial revolution", "roaring twenties", "great depression", "world war i trench", "world war ii bunker", "cold war era", "1950s diner", "1960s woodstock", "1970s disco", "1980s arcade", "1990s mall", "stone age cave", "bronze age settlement", "iron age fort", "roman forum", "greek agora", "egyptian tomb", "mayan temple", "aztec pyramid", "inca citadel", "samurai castle", "ninja village", "pirate ship", "pirate island", "treasure cave", "shipwreck", "lost city", "hidden temple", "secret chamber", "forgotten ruins", "native american village", "colonial fort", "pioneer settlement", "gold rush town", "plantation", "slave quarters", "civil war battlefield", "frontier town", "trading post",

    // Atmospheric & Weather Settings
    "sunny day", "cloudy sky", "stormy weather", "thunderstorm", "lightning", "rainbow", "sunrise", "sunset", "golden hour", "blue hour", "twilight", "dawn", "dusk", "midnight", "noon", "foggy morning", "misty evening", "snowy landscape", "winter wonderland", "spring garden", "summer beach", "autumn forest", "rainy day", "desert storm", "hurricane", "tornado", "blizzard", "aurora borealis", "northern lights", "shooting stars", "full moon", "crescent moon", "solar eclipse", "lunar eclipse", "meteor shower", "comet", "milky way", "starry night", "clear sky", "overcast", "partly cloudy", "heat wave", "drought", "flood", "avalanche", "volcanic eruption", "earthquake", "tsunami", "sandstorm", "dust devil", "whirlpool", "maelstrom", "geyser eruption", "forest fire", "wildfire", "smoke", "ash cloud", "ice storm", "hailstorm", "monsoon", "typhoon", "cyclone", "blowing snow", "ice fog", "dust storm", "haboob"
  ];

  // Effects comprehensive list - 400+ visual effects
  const effects = [
    // Lighting Effects
    "lens flare", "god rays", "volumetric lighting", "rim lighting", "backlighting", "soft lighting", "hard lighting", "studio lighting", "natural lighting", "dramatic lighting", "moody lighting", "atmospheric lighting", "cinematic lighting", "neon lighting", "bioluminescence", "phosphorescence", "fluorescent glow", "ambient occlusion", "global illumination", "ray tracing", "caustics", "light leak", "bloom effect", "chromatic aberration", "sunbeams", "moonlight", "candlelight", "firelight", "spotlight", "floodlight", "theatrical lighting", "stage lighting", "concert lighting", "disco ball", "strobe light", "laser lights", "blacklight", "ultraviolet", "infrared", "x-ray effect", "subsurface scattering", "translucency", "luminosity", "radiance", "incandescence", "iridescence", "opalescence", "pearlescent", "metallic sheen", "glossy finish",
    
    // Blur & Focus Effects
    "depth of field", "bokeh", "tilt-shift", "motion blur", "radial blur", "zoom blur", "gaussian blur", "directional blur", "lens blur", "defocus blur", "out of focus", "shallow depth", "deep focus", "rack focus", "selective focus", "macro focus", "soft focus", "dreamy blur", "portrait mode", "background blur", "foreground blur", "spiral bokeh", "hexagonal bokeh", "circular bokeh", "artistic blur", "painterly blur",
    
    // Color Effects
    "color grading", "color correction", "color splash", "duotone", "tritone", "monochrome", "sepia tone", "vintage color", "faded colors", "vibrant colors", "saturated", "desaturated", "high contrast", "low contrast", "color pop", "selective color", "color shift", "hue shift", "temperature shift", "cool tones", "warm tones", "split toning", "cross processing", "bleach bypass", "technicolor", "color inversion", "negative effect", "solarization", "posterization", "color quantization", "gradient map", "color lookup", "lut filter", "cinematic color", "film look", "analog color", "digital color", "neon colors", "pastel colors", "muted colors", "earthy tones", "jewel tones", "complementary colors", "analogous colors", "triadic colors",
    
    // Texture & Surface Effects
    "film grain", "noise texture", "paper texture", "canvas texture", "fabric texture", "leather texture", "wood grain", "marble texture", "stone texture", "metal texture", "rust texture", "weathered", "distressed", "aged", "vintage texture", "grunge texture", "scratches", "dust particles", "dirt overlay", "stains", "patina", "oxidation", "corrosion", "peeling paint", "cracked surface", "mosaic tiles", "pixel grid", "halftone pattern", "crosshatch", "stippling", "pointillism effect", "impasto", "thick paint", "glazing", "scumbling", "dry brush", "wet brush", "airbrush", "spray paint", "dripping paint", "paint splatter", "ink blots", "watercolor wash", "oil paint texture", "acrylic texture", "pastel texture", "charcoal texture", "pencil texture", "crayon texture",
    
    // Distortion Effects
    "fisheye", "barrel distortion", "pincushion distortion", "perspective warp", "spherize", "pinch", "twirl", "wave distortion", "ripple effect", "displacement map", "liquify", "smudge", "stretch", "squeeze", "bulge", "mirror effect", "kaleidoscope", "prism effect", "refraction", "diffraction", "reflection", "glass effect", "water ripple", "heat haze", "mirage", "warped reality", "glitch art", "datamosh", "pixel sort", "scan lines", "vhs effect", "crt screen", "tv static", "digital noise", "compression artifacts", "jpeg artifacts", "posterize", "threshold", "edge detection", "emboss", "relief", "engraving",
    
    // Atmospheric Effects
    "fog", "mist", "haze", "smoke", "steam", "dust", "particle effects", "sparkles", "glitter", "shimmer", "twinkle", "fireflies", "embers", "ash", "snow particles", "rain drops", "water droplets", "dew", "condensation", "frost", "ice crystals", "bubbles", "soap bubbles", "lens distortion", "atmospheric perspective", "aerial perspective", "depth haze", "distance fog", "ground fog", "volumetric fog", "god rays fog", "light shafts", "crepuscular rays", "anti-crepuscular rays", "corona effect", "halo effect", "glory", "iridescent clouds", "nacreous clouds", "lenticular clouds", "mammatus clouds", "anvil clouds", "shelf clouds",
    
    // Light & Shadow Effects
    "long shadows", "short shadows", "no shadows", "drop shadow", "inner shadow", "cast shadow", "contact shadow", "shadow play", "silhouette", "contre-jour", "chiaroscuro", "tenebrism", "rembrandt lighting", "butterfly lighting", "loop lighting", "split lighting", "high key", "low key", "dark and moody", "bright and airy", "harsh shadows", "soft shadows", "colored shadows", "multiple shadows", "shadow puppet", "x-ray shadow", "radiograph", "night vision", "thermal vision", "heat map", "false color",
    
    // Motion & Speed Effects
    "speed lines", "action lines", "motion trails", "ghost effect", "strobe effect", "time-lapse", "slow motion", "freeze frame", "bullet time", "360 rotation", "spinning", "whirling", "swirling", "vortex", "spiral motion", "centrifugal", "centripetal", "kinetic energy", "dynamic motion", "fluid dynamics", "wind effect", "flutter", "vibration", "shaking", "tremor", "oscillation", "wave motion", "pendulum", "rotation blur", "camera shake",
    
    // Special Effects
    "double exposure", "multiple exposure", "superimposition", "composite", "collage", "cutout", "paper craft", "origami", "pop-up book", "layered", "3d effect", "stereoscopic", "anaglyph", "red-cyan", "parallax", "holographic", "hologram", "laser hologram", "interference pattern", "diffraction grating", "prism spectrum", "rainbow dispersion", "light dispersion", "color fringe", "purple fringing", "green fringing", "lens flare rainbow", "star filter", "cross filter", "soft filter", "diffusion filter", "fog filter", "mist filter", "pro-mist", "black mist", "black pro-mist",
    
    // Digital & Glitch Effects
    "pixel art", "8-bit", "16-bit", "retro gaming", "vaporwave effect", "synthwave effect", "cyberpunk effect", "matrix effect", "digital rain", "binary code", "circuit board", "wireframe", "polygon mesh", "low poly", "faceted", "geometric", "abstract geometry", "procedural", "generative art", "algorithmic", "mathematical", "fractal", "mandelbrot", "julia set", "chaos theory", "strange attractor", "noise field", "perlin noise", "simplex noise", "cellular automata", "conway's life", "particle system", "swarm behavior", "flocking", "emergence",
    
    // Film & Photography Effects
    "film burn", "light leak", "vignette", "dark corners", "edge burn", "frame burn", "sprocket holes", "film perforation", "film strip", "contact sheet", "polaroid", "instant photo", "tintype", "daguerreotype", "wet plate", "albumen print", "cyanotype", "blueprint", "photogram", "rayograph", "chemigram", "lumen print", "anthotype", "gum bichromate", "bromoil", "oil print", "platinum print", "palladium print", "carbon print", "woodburytype", "collotype", "autochrome", "kodachrome", "ektachrome", "fujifilm", "ilford", "tri-x", "tmax", "hp5", "delta", "acros",
    
    // Weather & Natural Effects
    "rain effect", "drizzle", "downpour", "storm", "lightning strike", "thunderbolt", "snow effect", "snowfall", "blizzard effect", "ice effect", "frozen", "icicles", "frost pattern", "hoar frost", "rime ice", "wind effect", "breeze", "gust", "gale", "hurricane effect", "tornado effect", "dust storm effect", "sandstorm effect", "fog bank", "sea fog", "radiation fog", "advection fog", "valley fog", "freezing fog", "ice fog effect", "steam fog", "evaporation fog", "precipitation fog",
    
    // Abstract & Artistic Effects
    "abstract", "non-representational", "expressionist", "impressionist", "surreal", "psychedelic", "trippy", "kaleidoscopic", "fractal pattern", "mandala", "symmetrical", "radial symmetry", "bilateral symmetry", "tessellation", "escher-like", "impossible geometry", "optical illusion", "op art", "kinetic illusion", "moiré pattern", "interference pattern", "wave interference", "constructive interference", "destructive interference", "resonance", "harmonic", "frequency", "amplitude", "phase shift", "standing wave", "traveling wave", "sound wave visualization", "cymatics", "chladni patterns",
    
    // Advanced Lighting & Luminance Effects
    "edge lighting", "accent lighting", "fill lighting", "key lighting", "practical lighting", "motivated lighting", "unmotivated lighting", "three-point lighting", "golden hour lighting", "magic hour", "blue hour twilight", "noir lighting", "horror lighting", "mystery lighting", "volumetric shadows", "atmospheric scattering", "rayleigh scattering", "mie scattering", "subsurface glow", "inner light", "bioluminescent glow", "chemiluminescence", "triboluminescence", "electroluminescence", "photoluminescence", "radioluminescence", "cathodoluminescence", "sonoluminescence", "crystalloluminescence", "lyoluminescence", "fractoluminescence", "piezoluminescence", "candoluminescence", "thermoluminescence", "cryoluminescence", "light painting long exposure", "fiber optic lighting", "led strip lighting", "underglow", "uplighting", "downlighting", "wall washing", "wall grazing", "silhouette lighting", "butterfly shadow", "paramount lighting", "loop shadow lighting", "rembrandt triangle", "split face lighting", "broad lighting", "short lighting", "high contrast lighting", "low contrast lighting", "flat lighting", "dimensional lighting",
    
    // Material & Surface Textures
    "concrete texture", "brick texture", "cobblestone", "asphalt", "carbon fiber", "kevlar weave", "mesh pattern", "chain link", "wire mesh", "screen door effect", "burlap texture", "linen texture", "silk texture", "velvet texture", "satin finish", "matte finish", "eggshell finish", "semi-gloss", "high gloss", "mirror finish", "brushed metal", "hammered metal", "polished metal", "oxidized copper", "verdigris", "brass patina", "aged bronze", "tarnished silver", "rusted iron", "galvanized steel", "chrome plating", "gold leaf", "silver leaf", "copper leaf", "foil stamping", "embossing", "debossing", "letterpress", "screen printing texture", "risograph grain", "offset printing dots", "cmyk halftone", "newspaper print", "magazine gloss", "mimeograph", "ditto print", "thermal paper", "dot matrix", "inkjet texture", "laser print", "photocopier grain", "fax texture", "carbon copy", "typewriter impression",
    
    // Color Science & Grading
    "kelvin temperature", "daylight balance", "tungsten balance", "fluorescent tint", "shade adjustment", "cloudy white balance", "flash white balance", "custom kelvin", "color temperature shift", "magenta tint", "green tint", "cyan-red axis", "blue-yellow axis", "hue rotation", "hue isolation", "color isolation", "secondary color grade", "skin tone protection", "hsl adjustment", "hsv manipulation", "lab color space", "rgb curves", "luma curve", "contrast curve", "s-curve grade", "lift gamma gain", "offset printer wheels", "cdl color decision", "aces workflow", "rec709 standard", "rec2020 wide gamut", "dci-p3 color space", "adobe rgb", "prophoto rgb", "srgb standard", "linear color space", "log encoding", "log-c alexa", "s-log sony", "v-log panasonic", "canon log", "red log", "blackmagic film", "prores encoding", "dnxhr color", "film print emulation", "print film look", "bleach bypass silver retention", "eno flashing", "cross process e6-c41", "slide film look", "negative film look",
    
    // Distortion & Warping
    "anamorphic squeeze", "desqueeze effect", "wide screen crop", "letterbox bars", "pillarbox bars", "aspect ratio distortion", "horizontal squeeze", "vertical stretch", "diagonal shear", "trapezoid distortion", "keystone correction", "lens distortion correction", "mustache distortion", "complex distortion", "wave ripple", "zigzag pattern", "circular waves", "radial waves", "angular ripple", "frequency modulation", "amplitude modulation", "phase distortion", "harmonic distortion", "nonlinear distortion", "elastic deformation", "plastic deformation", "viscous flow", "fluid simulation", "cloth simulation", "soft body physics", "rigid body dynamics", "ragdoll physics", "spring physics", "rope physics", "hair dynamics", "fur dynamics", "feather simulation", "particle collision", "gravity well", "magnetic field lines", "electric field", "vector field flow", "turbulence field", "curl noise", "flow noise", "worley noise", "voronoi cells", "delaunay triangulation", "convex hull", "concave hull",
    
    // Cinematic & Camera Effects
    "anamorphic flare", "oval bokeh", "horizontal flare", "blue streak flare", "anamorphic bokeh", "squeezed bokeh", "cat eye bokeh", "swirly bokeh", "petzval swirl", "soap bubble bokeh", "mirror lens donut", "onion ring bokeh", "apodization filter", "starburst filter", "diffusion filter pro", "soft focus filter", "fog filter black", "mist filter white", "warming filter", "cooling filter", "nd filter darkening", "graduated nd filter", "polarizing filter", "circular polarizer", "linear polarizer", "infrared filter", "uv filter haze", "skylight filter", "haze filter", "color correction filter", "conversion filter", "neutral density gel", "color gel filter", "diffusion gel", "silk diffusion", "net diffusion", "frost diffusion", "opal diffusion", "light frost", "heavy frost", "full diffusion", "half diffusion", "quarter diffusion", "grid diffusion", "honeycomb grid", "egg crate grid", "barn doors light", "snoot lighting", "gobo pattern", "cucoloris shadow", "branch dapple", "leaf pattern", "window pattern", "venetian blind", "jail bar shadow", "geometric shadow pattern",
    
    // Particle & Physics Simulation
    "smoke simulation", "fire simulation", "explosion debris", "shockwave ripple", "dust cloud", "sand particles", "snow particles falling", "rain particles", "water droplets", "water splash", "liquid simulation", "fluid dynamics flow", "viscous liquid", "honey drip", "syrup pour", "melting effect", "freezing crystallization", "ice formation", "frost growth", "condensation buildup", "evaporation effect", "steam rising", "mist formation", "cloud formation", "tornado funnel", "whirlpool vortex", "spiral galaxy", "nebula cloud", "star formation", "supernova explosion", "black hole accretion", "wormhole tunnel", "quantum foam", "particle decay", "atomic structure", "molecular bonds", "crystal lattice", "dna helix", "protein folding", "cellular mitosis", "neural network", "synapse firing", "blood flow", "heart beat pulse", "sound wave propagation", "shock wave", "sonic boom", "doppler effect", "redshift blueshift", "gravitational lensing", "spacetime curvature", "quantum tunneling", "wave-particle duality",
    
    // Geometric & Mathematical
    "golden ratio spiral", "fibonacci sequence", "sacred geometry", "metatron's cube", "flower of life", "seed of life", "tree of life pattern", "vesica piscis", "sri yantra", "platonic solids", "archimedean solids", "catalan solids", "johnson solids", "deltahedron", "geodesic dome", "buckminster sphere", "truncated icosahedron", "rhombic dodecahedron", "pentagonal hexecontahedron", "stellated polyhedron", "compound polyhedra", "4d hypercube projection", "tesseract shadow", "klein bottle", "möbius strip", "penrose tiling", "quasicrystal pattern", "islamic geometric", "celtic knot", "maze pattern", "labyrinth design", "hexagonal grid", "triangular grid", "square grid", "isometric grid", "polar grid", "logarithmic spiral", "archimedean spiral", "hyperbolic spiral", "lituus spiral", "euler spiral", "cornu spiral", "fermat's spiral", "involute curve", "evolute curve", "catenary curve", "tractrix curve", "cycloid curve", "epicycloid", "hypocycloid", "cardioid shape", "nephroid curve", "astroid curve", "deltoid curve",
    
    // Digital Art & Modern Effects
    "data moshing", "compression glitch", "buffer overflow", "memory leak visual", "corrupt file aesthetic", "broken shader", "missing texture", "z-fighting flicker", "polygon tearing", "texture bleeding", "uv unwrap error", "normal map inversion", "bump map exaggeration", "displacement extreme", "parallax occlusion", "relief mapping", "cone step mapping", "steep parallax", "virtual displacement", "vector displacement", "true displacement", "subdivision surface", "catmull-clark subdivision", "loop subdivision", "doo-sabin subdivision", "mesh smoothing", "edge flow", "topology optimization", "retopology clean", "boolean operation", "csg modeling", "nurbs surface", "bezier curve", "spline interpolation", "curve fitting", "surface of revolution", "loft surface", "sweep surface", "extrude operation", "lathe operation", "array modifier", "mirror modifier", "lattice deformation", "shrinkwrap projection", "curve modifier", "hook modifier", "cast modifier", "simple deform", "warp modifier", "wave modifier",
    
    // Fantasy & Magical Effects
    "magic aura", "mystical glow", "ethereal light", "divine radiance", "celestial beam", "heavenly rays", "angelic glow", "demonic fire", "hellfire flames", "shadowfire", "darklight paradox", "voidlight", "astral projection", "spirit energy", "chi visualization", "chakra glow", "aura colors", "energy field", "force field", "shield bubble", "protection barrier", "magic circle runes", "arcane symbols", "mystic sigils", "enchantment glow", "spell effect", "transmutation circle", "alchemy formula", "philosopher's stone", "elixir shimmer", "potion bubbles", "crystal energy", "gem refraction", "prism magic", "rainbow energy", "elemental fire", "elemental water", "elemental earth", "elemental air", "elemental lightning", "elemental ice", "elemental nature", "elemental metal", "elemental light", "elemental shadow", "elemental void", "elemental chaos", "elemental order", "time distortion", "temporal anomaly", "chronological displacement", "dimensional rift", "portal vortex", "gateway shimmer", "teleportation flash", "invisibility shimmer", "cloaking device", "camouflage pattern", "adaptive camouflage", "active camouflage", "optical camouflage", "holographic disguise"
  ];

  // Backgrounds comprehensive list - 500+ unique backgrounds
  const backgrounds = [
    // Solid Colors
    "white background", "black background", "gray background", "red background", "blue background", "green background", "yellow background", "orange background", "purple background", "pink background", "brown background", "beige background", "cream background", "ivory background", "navy background", "teal background", "turquoise background", "cyan background", "magenta background", "maroon background", "burgundy background", "crimson background", "scarlet background", "vermillion background", "coral background", "salmon background", "peach background", "apricot background", "lavender background", "violet background", "indigo background", "plum background", "mauve background", "lilac background", "periwinkle background", "mint background", "sage background", "olive background", "lime background", "chartreuse background", "emerald background", "jade background", "forest green background", "sea green background", "aquamarine background", "gold background", "silver background", "bronze background", "copper background", "platinum background", "metallic background",
    
    // Gradient Backgrounds
    "gradient background", "linear gradient background", "radial gradient background", "sunset gradient background", "sunrise gradient background", "ocean gradient background", "sky gradient background", "rainbow gradient background", "pastel gradient background", "neon gradient background", "fire gradient background", "ice gradient background", "purple to pink gradient", "blue to green gradient", "red to yellow gradient", "orange to purple gradient", "teal to pink gradient", "gold to silver gradient", "dark to light gradient", "warm gradient background", "cool gradient background", "aurora gradient background", "galaxy gradient background", "cosmic gradient background", "underwater gradient background", "tropical gradient background", "autumn gradient background", "spring gradient background", "summer gradient background", "winter gradient background", "twilight gradient background", "dawn gradient background", "dusk gradient background", "midnight gradient background", "noon gradient background", "golden hour gradient", "blue hour gradient", "vibrant gradient background", "muted gradient background", "soft gradient background", "bold gradient background", "metallic gradient background", "holographic gradient background", "iridescent gradient background", "pearlescent gradient background", "chromatic gradient background",
    
    // Pattern Backgrounds
    "striped background", "polka dot background", "checkered background", "plaid background", "geometric pattern background", "hexagon pattern background", "triangle pattern background", "circle pattern background", "square pattern background", "diamond pattern background", "chevron pattern background", "herringbone pattern background", "zigzag pattern background", "wave pattern background", "spiral pattern background", "mosaic pattern background", "tessellation background", "honeycomb background", "lattice background", "grid pattern background", "dotted background", "crosshatch background", "houndstooth background", "argyle background", "paisley background", "damask background", "floral pattern background", "leaf pattern background", "flower pattern background", "botanical pattern background", "tropical pattern background", "palm leaf background", "fern pattern background", "vine pattern background", "branch pattern background", "tree pattern background", "forest pattern background", "stars pattern background", "constellation background", "galaxy pattern background", "nebula pattern background", "cloud pattern background", "wave pattern ocean", "ripple pattern background", "marble pattern background", "wood grain background", "brick pattern background", "stone pattern background", "concrete pattern background", "fabric texture background", "linen texture background", "canvas texture background", "paper texture background", "watercolor background", "ink wash background", "splatter pattern background", "abstract pattern background",
    
    // Texture Backgrounds
    "smooth background", "rough texture background", "grainy background", "sandy texture background", "rocky texture background", "wooden texture background", "metal texture background", "glass texture background", "ice texture background", "water texture background", "silk texture background", "velvet texture background", "satin texture background", "leather texture background", "suede texture background", "fur texture background", "feather texture background", "cotton texture background", "wool texture background", "denim texture background", "burlap texture background", "bamboo texture background", "rattan texture background", "wicker texture background", "ceramic texture background", "porcelain texture background", "crystal texture background", "diamond texture background", "gemstone texture background", "pearl texture background", "coral texture background", "shell texture background", "sand texture background", "gravel texture background", "pebble texture background", "cobblestone texture background", "slate texture background", "granite texture background", "limestone texture background", "sandstone texture background", "clay texture background", "terracotta texture background", "stucco texture background", "plaster texture background", "cement texture background", "asphalt texture background", "tar texture background", "rubber texture background", "plastic texture background", "foam texture background",
    
    // Nature Backgrounds
    "sky background", "cloudy sky background", "clear sky background", "starry sky background", "night sky background", "milky way background", "aurora borealis background", "ocean background", "sea background", "underwater background", "beach background", "sand dune background", "desert background", "mountain background", "hill background", "valley background", "canyon background", "cliff background", "forest background", "jungle background", "rainforest background", "woodland background", "meadow background", "grassland background", "field background", "prairie background", "savanna background", "tundra background", "arctic background", "glacier background", "iceberg background", "snow background", "winter landscape background", "spring meadow background", "summer field background", "autumn forest background", "sunset sky background", "sunrise sky background", "golden hour background", "blue hour background", "twilight background", "dawn background", "dusk background", "foggy background", "misty background", "rainy background", "stormy sky background", "lightning background", "rainbow background", "waterfall background", "river background", "lake background", "pond background", "marsh background", "swamp background", "wetland background", "garden background", "park background", "flower field background", "sunflower field background", "lavender field background", "tulip field background", "rose garden background", "cherry blossom background", "sakura background", "bamboo forest background", "palm tree background", "tropical island background", "coral reef background",
    
    // Abstract Backgrounds
    "bokeh background", "blur background", "soft focus background", "out of focus background", "light leak background", "lens flare background", "smoke background", "fog background", "mist background", "cloud background", "bubble background", "particle background", "sparkle background", "glitter background", "shimmer background", "glow background", "luminous background", "radiant background", "ethereal background", "dreamy background", "surreal background", "abstract background", "geometric abstract background", "organic abstract background", "fluid abstract background", "flowing background", "swirl background", "vortex background", "spiral background", "kaleidoscope background", "fractal background", "psychedelic background", "trippy background", "colorful abstract background", "monochrome abstract background", "minimalist background", "modern abstract background", "contemporary background", "artistic background", "painterly background", "brushstroke background", "impressionist background", "expressionist background", "cubist background", "pop art background", "art deco background", "art nouveau background",
    
    // Professional & Studio Backgrounds
    "white studio background", "black studio background", "gray studio background", "seamless background", "infinity background", "cyclorama background", "solid color backdrop", "portrait background", "professional background", "corporate background", "business background", "office background", "conference room background", "meeting room background", "workspace background", "clean background", "minimal background", "simple background", "plain background", "neutral background", "muted background", "soft background", "elegant background", "sophisticated background", "classy background", "luxury background", "premium background", "high-end background", "upscale background", "refined background", "tasteful background", "subtle background", "understated background", "classic background", "timeless background", "traditional background", "vintage background", "retro background", "nostalgic background", "old-fashioned background", "antique background", "aged background", "weathered background", "rustic background", "farmhouse background", "cottage background", "shabby chic background", "distressed background",
    
    // Urban & Architectural Backgrounds
    "brick wall background", "concrete wall background", "stone wall background", "wood wall background", "metal wall background", "glass wall background", "white wall background", "painted wall background", "graffiti wall background", "street art background", "industrial background", "warehouse background", "loft background", "urban background", "city background", "cityscape background", "skyline background", "building background", "architecture background", "modern architecture background", "contemporary architecture background", "brutalist background", "minimalist architecture background", "skyscraper background", "downtown background", "street background", "alley background", "sidewalk background", "pavement background", "road background", "highway background", "tunnel background", "subway background", "train station background", "airport background", "parking lot background", "garage background", "rooftop background", "balcony background", "terrace background", "patio background", "courtyard background", "plaza background", "town square background",
    
    // Interior Backgrounds
    "room background", "living room background", "bedroom background", "kitchen background", "dining room background", "bathroom background", "hallway background", "staircase background", "library background", "study background", "office background", "studio background", "workshop background", "gallery background", "museum background", "theater background", "stage background", "curtain background", "velvet curtain background", "drapes background", "window background", "door background", "wall background", "floor background", "ceiling background", "hardwood floor background", "tile floor background", "carpet background", "rug background", "marble floor background", "polished floor background", "wooden floor background", "stone floor background",
    
    // Themed Backgrounds
    "christmas background", "winter holiday background", "halloween background", "thanksgiving background", "easter background", "valentine background", "birthday background", "party background", "celebration background", "festive background", "wedding background", "anniversary background", "romantic background", "love background", "hearts background", "floral background", "botanical background", "tropical background", "beach theme background", "ocean theme background", "nautical background", "maritime background", "coastal background", "summer theme background", "spring theme background", "autumn theme background", "fall leaves background", "winter theme background", "seasonal background",
    
    // Digital & Tech Backgrounds
    "digital background", "tech background", "technology background", "circuit board background", "motherboard background", "computer background", "binary code background", "matrix background", "data background", "network background", "wireframe background", "grid background", "hexagonal grid background", "futuristic background", "sci-fi background", "cyberpunk background", "neon background", "neon lights background", "neon grid background", "synthwave background", "vaporwave background", "glitch background", "pixel background", "8-bit background", "16-bit background", "retro gaming background", "arcade background", "holographic background", "laser background", "led background", "digital art background",
    
    // Fantasy & Magical Backgrounds
    "fantasy background", "magical background", "mystical background", "enchanted background", "fairy tale background", "storybook background", "dreamlike background", "whimsical background", "celestial background", "cosmic background", "space background", "galaxy background", "nebula background", "star field background", "planets background", "moon background", "earth background", "universe background", "multiverse background", "parallel dimension background", "portal background", "vortex background", "time warp background", "dimensional rift background", "magical forest background", "enchanted garden background", "crystal cave background", "underwater palace background", "sky castle background", "floating islands background", "cloud kingdom background", "heaven background", "celestial realm background", "astral plane background",
    
    // Film & Cinematic Backgrounds
    "cinematic background", "movie background", "film background", "theatrical background", "dramatic background", "epic background", "action background", "adventure background", "thriller background", "mystery background", "horror background", "suspense background", "noir background", "vintage film background", "old movie background", "black and white background", "sepia tone background", "film grain background", "vignette background", "letterbox background", "anamorphic background", "wide screen background", "35mm background", "70mm background",
    
    // Additional Specialty Backgrounds
    "bokeh blur background", "depth of field background", "shallow depth background", "soft light background", "hard light background", "backlit background", "silhouette background", "shadow background", "highlight background", "high key background", "low key background", "bright background", "dark background", "moody background", "atmospheric background", "hazy background", "diffused background", "translucent background", "transparent background", "opaque background", "reflective background", "mirror background", "shiny background", "glossy background", "matte background", "frosted background", "crystalline background"
  ];

  // Sky comprehensive list - 700+ unique sky variations
  const skies = [
    // Basic Sky Types
    "clear blue sky", "partly cloudy sky", "overcast sky", "cloudy sky", "stormy sky", "dramatic sky", "moody sky", "peaceful sky", "serene sky", "calm sky", "bright sky", "vivid sky", "pale sky", "deep sky", "dark sky", "light sky", "azure sky", "cerulean sky", "cobalt sky", "sapphire sky", "turquoise sky", "aquamarine sky", "teal sky", "cyan sky", "sky blue", "powder blue sky", "baby blue sky", "robin egg blue sky", "cornflower blue sky", "steel blue sky", "slate blue sky", "periwinkle sky", "ultramarine sky", "navy sky", "midnight blue sky", "royal blue sky", "electric blue sky", "neon blue sky", "ice blue sky", "arctic blue sky", "glacier blue sky", "winter blue sky",
    
    // Sunrise & Sunset Skies
    "sunrise sky", "sunset sky", "golden sunrise", "pink sunrise", "orange sunrise", "red sunrise", "purple sunrise", "lavender sunrise", "coral sunrise", "peachy sunrise", "amber sunrise", "crimson sunrise", "magenta sunrise", "rose sunrise", "salmon sunrise", "golden sunset", "pink sunset", "orange sunset", "red sunset", "purple sunset", "lavender sunset", "coral sunset", "peachy sunset", "amber sunset", "crimson sunset", "magenta sunset", "rose sunset", "salmon sunset", "fiery sunset", "burning sunset", "blazing sunset", "glowing sunset", "radiating sunset", "vibrant sunset", "spectacular sunset", "majestic sunset", "epic sunset", "dramatic sunset", "colorful sunset", "multicolored sunset", "pastel sunset", "tropical sunset", "desert sunset", "ocean sunset", "mountain sunset", "prairie sunset", "savanna sunset",
    
    // Dawn & Dusk Skies
    "dawn sky", "predawn sky", "early morning sky", "morning sky", "daybreak sky", "first light sky", "twilight sky", "dusk sky", "evening sky", "late afternoon sky", "gloaming sky", "crepuscular sky", "civil twilight", "nautical twilight", "astronomical twilight", "purple twilight", "indigo twilight", "violet dusk", "mauve evening", "lavender dusk", "periwinkle twilight", "dusky pink sky", "dusty rose sky", "faded sunset", "lingering light", "last light sky", "fading daylight", "dimming sky", "darkening sky", "approaching night",
    
    // Golden & Blue Hour
    "golden hour sky", "magic hour sky", "warm golden sky", "honey colored sky", "amber glow sky", "golden yellow sky", "brass tone sky", "butterscotch sky", "caramel sky", "bronze sky", "copper sky", "russet sky", "ochre sky", "saffron sky", "mustard sky", "blue hour sky", "deep blue hour", "cool blue twilight", "sapphire dusk", "indigo blue hour", "cobalt evening", "prussian blue sky", "navy blue hour", "steel blue dusk", "slate twilight",
    
    // Colorful & Vibrant Skies
    "rainbow sky", "multicolor sky", "prismatic sky", "iridescent sky", "opalescent sky", "pearlescent sky", "pastel sky", "candy colored sky", "cotton candy sky", "watercolor sky", "painted sky", "artistic sky", "gradient sky", "ombre sky", "blended sky", "merged color sky", "transitioning sky", "shifting color sky", "changing hues sky", "evolving palette sky", "dynamic color sky", "living canvas sky", "nature's palette", "celestial canvas", "heaven's painting", "god's artwork", "divine brushstrokes",
    
    // Cloud Types & Formations
    "cumulus clouds sky", "cirrus clouds sky", "stratus clouds sky", "nimbus clouds sky", "cumulonimbus sky", "cirrocumulus sky", "cirrostratus sky", "altocumulus sky", "altostratus sky", "stratocumulus sky", "nimbostratus sky", "fluffy clouds sky", "wispy clouds sky", "puffy clouds sky", "billowing clouds", "towering clouds", "scattered clouds", "broken clouds", "few clouds sky", "isolated clouds", "fair weather clouds", "cotton ball clouds", "white clouds sky", "gray clouds sky", "dark clouds sky", "black clouds sky", "silver clouds sky", "golden clouds", "pink clouds sky", "orange clouds sky", "red clouds sky", "purple clouds sky", "lavender clouds", "violet clouds sky",
    
    // Weather-Based Skies
    "rainy sky", "pre-rain sky", "post-rain sky", "drizzle sky", "shower sky", "downpour sky", "thunderstorm sky", "lightning sky", "thunder clouds", "storm approaching", "storm clearing", "clearing sky", "breaking clouds", "parting clouds", "snowy sky", "snowfall sky", "blizzard sky", "winter storm sky", "sleet sky", "hail sky", "freezing sky", "icy sky", "foggy sky", "misty sky", "hazy sky", "humid sky", "muggy sky", "steamy sky", "dusty sky", "sandy sky", "dusty pink sky", "dust storm sky", "sandstorm approaching", "haboob sky", "windy sky", "breezy sky", "gusty sky", "gale sky", "hurricane sky", "typhoon sky", "cyclone sky", "tornado sky", "twister sky", "whirlwind sky", "turbulent sky",
    
    // Atmospheric Phenomena
    "aurora borealis sky", "northern lights sky", "aurora australis sky", "southern lights sky", "green aurora sky", "pink aurora sky", "purple aurora sky", "dancing lights", "aurora display", "solar storm sky", "geomagnetic storm", "airglow sky", "zodiacal light", "crepuscular rays", "anticrepuscular rays", "god rays sky", "sun rays sky", "light beams sky", "sun pillars", "light pillars", "halo phenomenon", "sun halo", "moon halo", "circular rainbow", "circumhorizon arc", "circumzenithal arc", "22 degree halo", "46 degree halo", "parhelic circle", "sun dogs", "mock sun", "parhelion sky", "moon dogs", "paraselene sky", "light pillar display", "ice crystal sky", "diamond dust sky", "glitter pillar", "nacreous clouds", "polar stratospheric", "mother of pearl clouds", "noctilucent clouds", "night shining clouds", "mesospheric clouds", "silver blue clouds",
    
    // Night Skies
    "night sky", "starry night", "star filled sky", "constellation sky", "celestial sphere", "cosmic sky", "deep space sky", "milky way sky", "galactic center", "stellar sky", "astronomical sky", "dark night sky", "pitch black sky", "moonless night", "new moon sky", "crescent moon sky", "half moon sky", "gibbous moon sky", "full moon sky", "supermoon sky", "blood moon sky", "blue moon sky", "harvest moon sky", "hunter's moon sky", "wolf moon sky", "pink moon sky", "strawberry moon", "buck moon sky", "sturgeon moon", "corn moon sky", "lunar eclipse sky", "solar eclipse sky", "total eclipse sky", "partial eclipse sky", "annular eclipse sky", "diamond ring effect", "baily's beads sky", "corona during eclipse", "shadow bands sky", "eclipse totality",
    
    // Celestial Events
    "meteor shower sky", "shooting stars", "falling stars sky", "perseid meteor", "leonid meteor", "geminid meteor", "quadrantid meteor", "meteor storm", "bolide sky", "fireball sky", "bright meteor", "meteorite trail", "comet sky", "comet tail sky", "neowise comet", "halley's comet sky", "great comet", "bright comet", "planetary conjunction", "venus and jupiter", "planetary alignment", "triple conjunction", "grand conjunction", "syzygy sky", "planet parade", "transit of venus", "transit of mercury", "occultation sky", "asteroid visible", "satellite trail", "space station pass", "iridium flare", "starlink train", "satellite streak",
    
    // Seasonal Skies
    "spring sky", "summer sky", "autumn sky", "fall sky", "winter sky", "vernal sky", "estival sky", "autumnal sky", "hibernal sky", "april sky", "may sky", "june sky", "july sky", "august sky", "september sky", "october sky", "november sky", "december sky", "january sky", "february sky", "march sky", "equinox sky", "solstice sky", "spring equinox", "autumn equinox", "summer solstice", "winter solstice", "longest day sky", "shortest day sky", "midnight sun", "polar day sky", "polar night sky", "arctic summer", "arctic winter", "tropical sky", "subtropical sky", "temperate sky", "mediterranean sky", "continental sky", "maritime sky", "monsoon sky", "dry season sky", "wet season sky",
    
    // Time of Day Variations
    "midnight sky", "predawn sky", "3am sky", "4am sky", "5am sky", "6am sky", "early morning", "mid morning sky", "late morning", "noon sky", "midday sky", "early afternoon", "mid afternoon", "late afternoon", "evening sky", "late evening", "9pm sky", "10pm sky", "11pm sky", "nocturnal sky", "diurnal sky", "crepuscular sky", "matutinal sky", "vespertine sky",
    
    // Mood & Atmosphere Skies
    "peaceful sky", "tranquil sky", "serene sky", "calm sky", "quiet sky", "still sky", "gentle sky", "soft sky", "delicate sky", "ethereal sky", "dreamy sky", "mystical sky", "magical sky", "enchanted sky", "fairy tale sky", "whimsical sky", "romantic sky", "nostalgic sky", "melancholic sky", "contemplative sky", "meditative sky", "spiritual sky", "divine sky", "heavenly sky", "celestial beauty", "angelic sky", "sublime sky", "transcendent sky", "otherworldly sky", "surreal sky", "dramatic sky", "intense sky", "powerful sky", "mighty sky", "epic sky", "majestic sky", "grand sky", "magnificent sky", "spectacular sky", "breathtaking sky", "stunning sky", "gorgeous sky", "beautiful sky", "lovely sky", "pretty sky", "charming sky", "delightful sky", "pleasant sky", "agreeable sky",
    
    // Color-Specific Skies
    "red sky", "scarlet sky", "crimson sky", "ruby sky", "burgundy sky", "maroon sky", "cherry sky", "rose sky", "pink sky", "hot pink sky", "magenta sky", "fuchsia sky", "coral sky", "salmon sky", "peach sky", "apricot sky", "orange sky", "tangerine sky", "mango sky", "pumpkin sky", "amber sky", "gold sky", "golden sky", "yellow sky", "lemon sky", "canary sky", "saffron sky", "green sky", "emerald sky", "jade sky", "mint sky", "lime sky", "olive sky", "forest green sky", "teal sky", "turquoise sky", "aqua sky", "cyan sky", "blue sky", "indigo sky", "purple sky", "violet sky", "lavender sky", "lilac sky", "mauve sky", "plum sky", "white sky", "ivory sky", "cream sky", "pearl sky", "gray sky", "silver sky", "charcoal sky", "black sky", "ebony sky", "onyx sky",
    
    // Texture & Pattern Skies
    "striped sky", "banded sky", "layered sky", "stratified sky", "marbled sky", "swirled sky", "mottled sky", "dappled sky", "speckled sky", "spotted sky", "patchy sky", "uneven sky", "textured sky", "smooth sky", "silky sky", "velvety sky", "soft focus sky", "blurred sky", "sharp sky", "crisp sky", "clear definition", "hazy definition", "diffused sky", "scattered light sky", "filtered light", "reflected sky", "mirrored sky", "inverted sky", "upside down sky", "distorted sky", "warped sky", "rippled sky", "wavy sky", "undulating sky", "rolling sky",
    
    // Pollution & Urban Skies
    "smoggy sky", "polluted sky", "hazy urban sky", "industrial sky", "city sky", "urban glow sky", "light pollution", "skyglow effect", "artificial light sky", "neon reflected sky", "city lights sky", "metropolitan sky", "downtown sky", "suburban sky", "rural sky", "countryside sky", "pristine sky", "unpolluted sky", "clean air sky", "pure sky", "natural sky",
    
    // Artistic & Stylized Skies
    "impressionist sky", "expressionist sky", "abstract sky", "cubist sky", "surrealist sky", "romantic sky", "baroque sky", "renaissance sky", "classical sky", "modern sky", "contemporary sky", "minimalist sky", "maximalist sky", "pop art sky", "psychedelic sky", "trippy sky", "kaleidoscopic sky", "fractal sky", "geometric sky", "pixelated sky", "low poly sky", "voxel sky", "cartoon sky", "anime sky", "manga sky", "comic book sky", "graphic novel sky", "illustration sky", "painted sky", "hand drawn sky", "digital art sky", "3d rendered sky", "photorealistic sky", "hyperrealistic sky", "stylized sky", "simplified sky", "exaggerated sky", "caricature sky", "fantastical sky",
    
    // Fantasy & Sci-Fi Skies
    "alien sky", "extraterrestrial sky", "exoplanet sky", "binary star sky", "twin sun sky", "three sun sky", "purple sun sky", "red giant sky", "blue supergiant", "ringed planet sky", "gas giant view", "moon visible sky", "multiple moons", "shattered moon", "ring system sky", "planetary rings", "nebula visible", "colorful nebula", "emission nebula", "reflection nebula", "dark nebula sky", "supernova remnant", "stellar nursery", "star cluster sky", "globular cluster", "open cluster sky", "andromeda visible", "magellanic clouds", "distant galaxy", "spiral galaxy sky", "elliptical galaxy", "irregular galaxy", "colliding galaxies", "galactic merger", "quasar sky", "pulsar sky", "neutron star sky", "black hole sky", "accretion disk", "event horizon", "wormhole sky", "space-time rift", "dimensional tear", "portal sky", "gateway sky", "vortex sky", "time warp sky", "alternate reality", "parallel universe", "multiverse sky", "cosmic web", "dark matter sky", "dark energy sky",
    
    // Apocalyptic & Dystopian Skies
    "apocalyptic sky", "post apocalyptic", "dystopian sky", "nuclear sky", "radioactive sky", "fallout sky", "ash cloud sky", "volcanic ash sky", "smoke filled sky", "fire sky", "burning sky", "inferno sky", "hellfire sky", "brimstone sky", "sulfur sky", "toxic sky", "poisonous sky", "chemical sky", "acid sky", "radiation sky", "contaminated sky", "diseased sky", "plague sky", "death sky", "doom sky", "destruction sky", "ruin sky", "devastation sky", "catastrophe sky", "cataclysm sky", "armageddon sky", "ragnarok sky", "end times sky", "judgment day sky", "revelation sky",
    
    // Mythological & Religious Skies
    "divine sky", "godly sky", "heavenly realm", "elysian sky", "paradise sky", "nirvana sky", "valhalla sky", "olympian sky", "asgardian sky", "celestial realm", "astral plane sky", "spiritual sky", "sacred sky", "holy sky", "blessed sky", "sanctified sky", "consecrated sky", "hallowed sky", "revered sky", "worship sky", "prayer sky", "meditation sky", "enlightenment sky", "ascension sky", "rapture sky", "salvation sky", "redemption sky", "grace sky", "mercy sky", "glory sky", "radiance sky", "splendor sky", "majesty sky",
    
    // Elemental Skies
    "fire sky", "flame sky", "ember sky", "coal sky", "furnace sky", "forge sky", "water sky", "ocean sky reflection", "sea mirror sky", "lake reflection", "river sky", "stream sky", "rain sky", "ice sky", "frost sky", "snow sky", "hail sky", "sleet sky", "earth sky", "dust sky", "sand sky", "soil sky", "clay sky", "stone sky", "rock sky", "mountain sky", "air sky", "wind sky", "breeze sky", "gale sky", "storm sky", "tempest sky", "hurricane force", "lightning sky", "thunder sky", "bolt sky", "electric sky", "static sky", "charge sky", "plasma sky", "energy sky", "force sky", "power sky", "essence sky", "quintessence sky", "aether sky", "void sky", "nothing sky", "emptiness sky", "vacuum sky", "space sky", "cosmos sky", "universe sky", "infinity sky", "eternity sky", "timeless sky", "endless sky", "boundless sky", "limitless sky", "immeasurable sky", "unfathomable sky", "incomprehensible sky", "ineffable sky", "indescribable sky", "unspeakable sky", "unnameable sky", "mysterious sky", "enigmatic sky", "cryptic sky", "arcane sky", "occult sky", "esoteric sky", "hidden sky", "secret sky", "concealed sky", "veiled sky", "shrouded sky", "cloaked sky", "masked sky", "obscured sky", "darkened sky", "shadowed sky", "eclipsed sky", "blocked sky", "covered sky", "overcast heavy", "thick clouds sky", "dense cloud cover", "impenetrable clouds", "solid overcast", "complete coverage", "total cloud cover", "wall to wall clouds", "blanket of clouds", "sea of clouds", "ocean of clouds", "cloudscape", "cloud panorama", "cloud vista", "cloud horizon", "cloud ceiling", "cloud base", "cloud top", "cloud layers", "cloud strata", "cloud bands", "cloud streams", "cloud ribbons", "cloud wisps", "cloud trails", "cloud shadows", "cloud patterns", "cloud formations", "cloud structures", "cloud architecture", "cloud cathedral", "cloud palace", "cloud castle", "cloud kingdom", "cloud realm", "cloud world", "cloud universe", "cloud dimension", "cloud reality", "cloud dream", "cloud vision", "cloud imagination", "cloud fantasy", "cloud wonder", "cloud marvel", "cloud miracle", "cloud phenomenon", "cloud spectacle", "cloud display", "cloud show", "cloud performance", "cloud drama", "cloud theater", "cloud stage", "cloud canvas", "cloud masterpiece", "cloud artwork", "cloud creation"
  ];

  // Weather comprehensive list - 1100+ weather conditions
  const weathers = [
    // Basic Weather Conditions
    "sunny", "clear", "fair weather", "bright", "cloudless", "blue sky weather", "perfect weather", "beautiful day", "lovely weather", "pleasant conditions", "mild weather", "temperate", "comfortable", "balmy", "warm", "hot", "very hot", "scorching", "sweltering", "sizzling", "baking", "roasting", "boiling", "blazing hot", "heat wave", "extreme heat", "oppressive heat", "stifling heat", "unbearable heat", "tropical heat", "desert heat", "humid heat", "dry heat", "arid", "parched", "cool", "chilly", "cold", "freezing", "frigid", "arctic", "polar", "subzero", "below freezing", "bone-chilling", "ice-cold", "bitterly cold", "extremely cold", "dangerously cold", "life-threatening cold", "deep freeze", "cold snap", "cold wave", "arctic blast", "polar vortex", "Siberian cold", "Antarctic conditions", "glacial", "frosty", "crisp", "brisk", "nippy", "fresh", "invigorating", "refreshing",
    
    // Cloud Conditions
    "cloudy", "overcast", "grey skies", "gray clouds", "cloud cover", "full cloud coverage", "total overcast", "completely cloudy", "heavy clouds", "thick clouds", "dense clouds", "low clouds", "high clouds", "mid-level clouds", "scattered clouds", "broken clouds", "partly cloudy", "partly sunny", "mostly sunny", "mostly cloudy", "few clouds", "isolated clouds", "variable cloudiness", "changing clouds", "increasing clouds", "decreasing clouds", "clearing clouds", "breaking clouds", "cloud development", "building clouds", "cumulus", "cirrus", "stratus", "nimbus", "cumulonimbus", "stratocumulus", "altocumulus", "altostratus", "cirrocumulus", "cirrostratus", "nimbostratus", "fair-weather cumulus", "towering cumulus", "cumulus congestus", "cumulus mediocris", "cumulus fractus", "stratus fractus", "fog clouds", "low stratus", "sheet clouds", "layer clouds", "cloud layers", "cloud deck", "cloud ceiling", "cloud base", "cloud tops", "anvil clouds", "mammatus", "lenticular", "wave clouds", "mountain wave clouds", "orographic clouds", "convective clouds", "storm clouds", "rain clouds", "thunder clouds", "dark clouds", "menacing clouds", "ominous clouds", "threatening clouds", "approaching storm", "storm building",
    
    // Rain
    "rainy", "raining", "rain", "rainfall", "precipitation", "wet weather", "drizzle", "light drizzle", "misting", "sprinkle", "sprinkling", "light rain", "light showers", "occasional rain", "intermittent rain", "passing showers", "brief showers", "scattered showers", "isolated showers", "moderate rain", "steady rain", "continuous rain", "constant rain", "persistent rain", "heavy rain", "heavy rainfall", "intense rain", "torrential rain", "downpour", "pouring rain", "pelting rain", "bucketing", "sheeting rain", "driving rain", "lashing rain", "pounding rain", "relentless rain", "monsoon", "monsoon rains", "tropical rain", "tropical downpour", "equatorial rain", "rain squall", "rain shower", "sun shower", "sunshower", "rainbow weather", "rain with sun", "cloudburst", "deluge", "flood-producing rain", "flash flood rain", "extreme rainfall", "record rainfall", "unprecedented rain", "biblical rain", "cats and dogs", "buckets of rain", "sheets of rain", "walls of rain", "curtains of rain", "freezing rain", "ice rain", "glaze", "glaze ice", "ice storm", "icing conditions", "freezing drizzle", "supercooled rain", "acid rain", "polluted rain", "contaminated rain",
    
    // Snow
    "snowy", "snowing", "snow", "snowfall", "snow shower", "snow squall", "flurries", "light snow", "light flurries", "snow flurries", "scattered flurries", "occasional snow", "intermittent snow", "moderate snow", "steady snow", "heavy snow", "heavy snowfall", "intense snow", "blinding snow", "whiteout", "complete whiteout", "zero visibility", "blizzard", "severe blizzard", "ground blizzard", "blowing snow", "drifting snow", "snow drifts", "deep snow", "deep snowpack", "powder snow", "fresh powder", "dry snow", "wet snow", "heavy wet snow", "packing snow", "sticky snow", "slushy snow", "snow pellets", "graupel", "soft hail", "small hail", "ice pellets", "sleet", "sleet shower", "wintry mix", "mixed precipitation", "rain and snow", "snow and rain", "freezing snow", "snow grains", "snow crystals", "snowflakes", "large flakes", "small flakes", "fat flakes", "feathery snow", "fluffy snow", "lake-effect snow", "orographic snow", "mountain snow", "upslope snow", "downslope snow", "convective snow", "thundersnow", "snow thunderstorm", "snow squall line", "snow band", "heavy snow band", "intense snow band", "arctic snow", "polar snow", "Antarctic snow", "diamond dust", "ice crystals", "ice fog with crystals", "snow devils", "snow whirlwind",
    
    // Storm Conditions
    "stormy", "storm", "severe weather", "extreme weather", "dangerous weather", "hazardous conditions", "thunderstorm", "electrical storm", "thunder", "lightning", "lightning storm", "severe thunderstorm", "supercell", "supercell thunderstorm", "rotating thunderstorm", "mesocyclone", "rotating storm", "squall line", "derecho", "bow echo", "macroburst", "microburst", "downburst", "wind shear", "gust front", "outflow boundary", "shelf cloud", "roll cloud", "wall cloud", "funnel cloud", "rotating wall cloud", "tornado", "twister", "cyclone", "waterspout", "landspout", "dust devil", "gustnado", "EF0 tornado", "EF1 tornado", "EF2 tornado", "EF3 tornado", "EF4 tornado", "EF5 tornado", "violent tornado", "wedge tornado", "multi-vortex tornado", "satellite tornado", "rope tornado", "stovepipe tornado", "elephant trunk", "cone tornado", "cylindrical tornado", "hurricane", "typhoon", "tropical cyclone", "tropical storm", "tropical depression", "category 1 hurricane", "category 2 hurricane", "category 3 hurricane", "category 4 hurricane", "category 5 hurricane", "major hurricane", "super typhoon", "intense hurricane", "extreme hurricane", "devastating hurricane", "catastrophic hurricane", "eye of hurricane", "eyewall", "rain bands", "feeder bands", "outer bands", "hurricane force winds", "tropical storm force", "extratropical storm", "nor'easter", "nor easter", "coastal storm", "ocean storm", "sea storm", "maritime storm", "bomb cyclone", "explosive cyclogenesis", "rapidly intensifying", "intense low pressure", "deep low", "pressure bomb",
    
    // Wind
    "windy", "breezy", "gusty", "blustery", "windswept", "wind", "light wind", "gentle breeze", "light breeze", "moderate wind", "fresh breeze", "strong wind", "strong breeze", "near gale", "gale", "gale force winds", "severe gale", "storm force winds", "violent storm", "hurricane force", "extreme wind", "damaging wind", "destructive wind", "catastrophic wind", "sustained wind", "wind gusts", "wind gust", "powerful gusts", "severe gusts", "extreme gusts", "northerly wind", "southerly wind", "easterly wind", "westerly wind", "north wind", "south wind", "east wind", "west wind", "northeast wind", "northwest wind", "southeast wind", "southwest wind", "polar easterlies", "westerlies", "trade winds", "northeast trades", "southeast trades", "doldrums", "horse latitudes", "roaring forties", "furious fifties", "screaming sixties", "chinook", "foehn", "Santa Ana winds", "mistral", "sirocco", "katabatic wind", "mountain wind", "valley wind", "sea breeze", "land breeze", "onshore wind", "offshore wind", "cross wind", "headwind", "tailwind", "variable wind", "shifting wind", "veering wind", "backing wind", "wind shear conditions", "low-level wind shear", "turbulent wind", "gusty wind", "erratic wind", "unpredictable wind", "calm", "dead calm", "light and variable", "nearly calm",
    
    // Fog and Mist
    "foggy", "fog", "dense fog", "thick fog", "heavy fog", "pea soup fog", "impenetrable fog", "visibility near zero", "low visibility", "reduced visibility", "poor visibility", "fog bank", "fog patches", "patchy fog", "scattered fog", "shallow fog", "ground fog", "valley fog", "radiation fog", "advection fog", "sea fog", "ocean fog", "coastal fog", "upslope fog", "freezing fog", "ice fog", "arctic fog", "steam fog", "evaporation fog", "precipitation fog", "frontal fog", "mist", "misty", "light mist", "heavy mist", "misting conditions", "haze", "hazy", "atmospheric haze", "pollution haze", "smog", "photochemical smog", "industrial smog", "urban haze", "visibility haze", "dust haze", "smoke haze", "volcanic haze", "vog", "ash haze", "pollen haze", "saharan dust", "desert dust", "dust suspension", "atmospheric dust", "particulate matter", "suspended particles", "murky", "murky conditions", "unclear atmosphere", "obscured visibility",
    
    // Frost and Ice
    "frosty", "frost", "hard frost", "killing frost", "light frost", "heavy frost", "ground frost", "air frost", "white frost", "hoar frost", "rime", "rime ice", "clear ice", "glaze ice", "ice accretion", "ice buildup", "icing", "heavy icing", "severe icing", "black ice", "glare ice", "sheet ice", "ice patches", "icy conditions", "slippery conditions", "treacherous conditions", "frozen", "frozen precipitation", "freezing conditions", "subfreezing", "below zero", "sub-zero conditions", "deep freeze conditions", "permafrost", "frozen ground", "ice crystals", "ice needles", "ice prisms", "diamond dust fog", "crystalline fog", "ice fog crystals",
    
    // Hail
    "hail", "hailstorm", "hail shower", "small hail", "large hail", "giant hail", "baseball-sized hail", "golf ball hail", "marble-sized hail", "pea-sized hail", "penny-sized hail", "quarter-sized hail", "tennis ball hail", "softball-sized hail", "grapefruit hail", "damaging hail", "destructive hail", "severe hail", "extreme hail", "record hail", "hail accumulation", "hail drifts", "hail cover", "graupel shower", "snow pellets", "ice pellets shower", "sleet pellets", "mixed hail and rain", "hail and snow", "hail core", "hail shaft", "hail swath", "hail streak",
    
    // Temperature Extremes
    "extreme heat", "record heat", "all-time high", "historic heat", "unprecedented warmth", "abnormal heat", "unusual warmth", "exceptionally warm", "remarkably warm", "unseasonably warm", "warm spell", "heat dome", "thermal dome", "hot dome", "ridge of high pressure", "blocking high", "extreme cold", "record cold", "all-time low", "historic cold", "unprecedented cold", "abnormal cold", "unusual cold", "exceptionally cold", "remarkably cold", "unseasonably cold", "cold spell", "arctic outbreak", "polar outbreak", "deep freeze", "severe freeze", "hard freeze", "temperature inversion", "thermal inversion", "warm layer aloft", "cold air damming", "cold air pooling", "frost pockets", "freeze warning conditions", "frost advisory conditions",
    
    // Atmospheric Phenomena
    "aurora", "northern lights", "southern lights", "auroral display", "auroral oval", "geomagnetic storm", "solar storm", "sun pillar", "light pillar", "ice crystal display", "halo", "sun halo", "moon halo", "22-degree halo", "46-degree halo", "sun dog", "parhelion", "mock sun", "moon dog", "paraselene", "circumhorizon arc", "circumzenithal arc", "tangent arc", "parhelic circle", "subsun", "glory", "specter of the brocken", "rainbow", "double rainbow", "triple rainbow", "supernumerary rainbow", "lunar rainbow", "moonbow", "fogbow", "white rainbow", "cloud iridescence", "corona", "bishop's ring", "volcanic sunset", "crepuscular rays", "anticrepuscular rays", "sun rays", "god rays", "light shafts", "shadow bands", "eclipse shadows", "green flash", "blue flash", "zodiacal light", "gegenschein", "airglow", "atmospheric glow", "noctilucent clouds", "polar mesospheric clouds", "nacreous clouds", "mother of pearl clouds", "lenticular clouds", "wave clouds", "kelvin-helmholtz clouds", "asperitas", "undulatus asperatus", "mammatus clouds", "bubble clouds", "pouch clouds", "roll clouds", "morning glory clouds", "arcus clouds", "shelf clouds", "wall clouds", "scud clouds", "fractus clouds", "pannus clouds", "virga", "fallstreak", "precipitation streaks", "jellyfish clouds", "pyrocumulus", "flammagenitus", "fire clouds", "volcanic clouds", "ash clouds", "eruption column", "pyroclastic clouds",
    
    // Tropical Weather
    "tropical conditions", "equatorial weather", "rainforest climate", "jungle weather", "humid tropical", "wet tropical", "tropical wet", "tropical monsoon", "tropical savanna", "trade wind weather", "ITCZ conditions", "intertropical convergence", "tropical wave", "easterly wave", "tropical disturbance", "invest", "potential tropical cyclone", "pre-tropical", "post-tropical", "subtropical", "subtropical storm", "hybrid storm", "remnants", "tropical remnants", "dissipating tropical", "weakening tropical system",
    
    // Desert Weather
    "desert conditions", "arid weather", "extreme aridity", "sand", "sandstorm", "dust storm", "haboob", "wall of dust", "wall of sand", "dust devil", "dust plume", "dust cloud", "dust haze", "blowing dust", "blowing sand", "drifting sand", "sand drifts", "desert wind", "desert heat", "radiational cooling", "desert cold night", "temperature extremes", "diurnal variation", "large daily range", "scorching day", "freezing night", "shamal", "simoom", "khamsin", "harmattan", "karaburan",
    
    // Mountain Weather
    "mountain weather", "alpine conditions", "summit conditions", "peak weather", "ridge conditions", "high elevation", "high altitude", "above tree line", "exposed conditions", "wind-scoured", "wind-loaded", "lee side conditions", "windward conditions", "orographic lift", "mountain wave", "rotor clouds", "banner clouds", "foehn wall", "chinook arch", "mountain fog", "upslope fog", "valley fog inversion", "cold pool", "frost hollow", "temperature inversion valley", "katabatic flow", "anabatic flow", "slope winds", "canyon winds", "gap winds", "mountain gap flow", "barrier jet", "mountain thunderstorm", "orographic thunderstorm", "mountain snow", "upslope snow", "lake-effect mountain", "terrain-enhanced", "elevation-dependent", "aspect-dependent", "snow level", "rain-snow line", "freezing level",
    
    // Coastal and Marine Weather
    "coastal weather", "maritime conditions", "oceanic weather", "sea conditions", "marine weather", "beach weather", "surf conditions", "swell", "heavy swell", "ocean swell", "sea state", "calm seas", "smooth seas", "slight seas", "moderate seas", "rough seas", "very rough seas", "high seas", "phenomenal seas", "sea fog", "marine fog", "coastal fog", "sea smoke", "arctic sea smoke", "steam devils", "waterspouts", "marine thunderstorm", "ocean thunderstorm", "squall", "white squall", "line squall", "tropical squall", "microburst over water", "downburst at sea", "rogue wave", "freak wave", "tsunami", "storm surge", "coastal flooding", "king tides", "spring tides", "tidal flooding", "wave action", "heavy surf", "dangerous surf", "small craft advisory", "gale warning", "storm warning", "hurricane warning", "tropical storm warning",
    
    // Seasonal Weather
    "spring weather", "vernal conditions", "spring transition", "spring warming", "spring melt", "snowmelt", "ice breakup", "river ice out", "thawing", "mud season", "spring storms", "spring rains", "april showers", "may flowers weather", "summer weather", "summertime conditions", "high summer", "midsummer", "peak summer heat", "summer solstice weather", "dog days", "Indian summer", "second summer", "autumn weather", "fall weather", "autumnal conditions", "fall transition", "autumn cooling", "fall colors weather", "leaf-peeping weather", "harvest weather", "autumn equinox conditions", "late autumn", "late fall", "pre-winter", "winter weather", "wintertime conditions", "deep winter", "midwinter", "winter solstice weather", "coldest time", "heart of winter", "late winter", "late season snow", "spring snow", "late-season cold",
    
    // Severe Weather
    "severe weather outbreak", "severe weather event", "multi-day outbreak", "widespread severe", "regional outbreak", "significant weather", "high-impact weather", "dangerous weather event", "life-threatening conditions", "emergency conditions", "disaster weather", "catastrophic weather", "extreme weather event", "unprecedented weather", "historic weather", "record-breaking weather", "anomalous weather", "abnormal weather", "unusual weather", "rare weather", "once-in-a-lifetime", "once-in-a-century", "100-year event", "500-year event", "thousand-year event", "biblical proportions", "worst in history", "worst on record", "never before seen", "extraordinary", "exceptional", "remarkable", "notable weather", "significant event", "major weather event",
    
    // Weather Combinations
    "sun and clouds", "mix of sun and clouds", "variable conditions", "changeable weather", "unsettled weather", "unstable conditions", "convective weather", "showery conditions", "scattered activity", "isolated activity", "widely scattered", "numerous storms", "widespread activity", "organized convection", "linear storms", "cluster of storms", "complex of storms", "mesoscale convective system", "MCS", "squall line complex", "multi-cell storms", "training storms", "back-building storms", "snow to rain", "rain to snow", "wintry mix transition", "ice to rain", "freezing to melting", "thawing conditions", "freeze-thaw cycle", "melting and refreezing", "day-night contrast", "overnight cooling", "daytime heating", "afternoon heating", "evening cooling", "nocturnal cooling", "radiational cooling night", "morning warming", "gradual warming", "gradual cooling", "slow improvement", "slow deterioration", "improving conditions", "deteriorating conditions", "clearing weather", "worsening weather",
    
    // Air Quality Related
    "air quality", "good air quality", "moderate air quality", "unhealthy air", "very unhealthy air", "hazardous air", "poor visibility air", "smoggy conditions", "ozone day", "high ozone", "ozone alert", "red flag conditions", "fire weather", "critical fire weather", "extreme fire danger", "wildfire smoke", "smoke haze", "smoke-filled air", "smoky conditions", "ash fall", "volcanic ash", "ash cloud", "dust in air", "dusty air", "pollen in air", "high pollen", "pollen advisory", "allergen conditions", "pollution event", "industrial pollution", "vehicle pollution", "transboundary pollution", "long-range transport", "saharan air layer", "smoke plume", "volcanic plume",
    
    // Drought and Dry Conditions
    "drought", "severe drought", "extreme drought", "exceptional drought", "flash drought", "agricultural drought", "hydrological drought", "meteorological drought", "multi-year drought", "prolonged drought", "persistent drought", "worsening drought", "developing drought", "expanding drought", "drought conditions", "abnormally dry", "very dry", "extremely dry", "critically dry", "dangerously dry", "bone dry", "parched conditions", "desiccated", "arid spell", "dry spell", "dry period", "rainfall deficit", "precipitation deficit", "below-normal precipitation", "subnormal rainfall", "lack of rain", "rain shortage", "water shortage weather", "low soil moisture", "depleted soil moisture",
    
    // Wet and Flood Conditions
    "wet weather", "wet spell", "wet period", "prolonged rain", "persistent rain", "continuous precipitation", "non-stop rain", "rain day after day", "wet pattern", "rainy pattern", "active pattern", "moisture surge", "tropical moisture", "atmospheric river", "pineapple express", "moisture plume", "firehose", "training storms", "excessive rainfall", "extreme rainfall", "flooding rain", "flood threat", "flood warning conditions", "flash flood threat", "flash flooding", "river flooding", "stream flooding", "creek flooding", "urban flooding", "street flooding", "ponding", "standing water", "water accumulation", "rainfall accumulation", "excessive water", "saturated ground", "waterlogged soil", "soggy conditions", "muddy conditions", "oversaturated", "above-normal precipitation", "surplus rainfall", "precipitation excess",
    
    // Transitional Weather
    "changing conditions", "transition weather", "pattern change", "regime change", "shift in pattern", "weather shift", "front approaching", "frontal passage", "cold front", "warm front", "stationary front", "occluded front", "triple point", "frontal zone", "boundary", "outflow boundary", "sea breeze front", "lake breeze front", "dryline", "moisture boundary", "convergence zone", "shear line", "trough", "upper trough", "shortwave trough", "longwave trough", "closed low", "cut-off low", "upper low", "surface low", "developing low", "deepening low", "intensifying system", "strengthening system", "weakening system", "filling high", "building high", "ridge", "upper ridge", "ridge axis", "ridge building", "high pressure building", "high pressure departing", "between systems", "in-between weather", "lull between storms", "break in weather", "temporary improvement", "brief improvement", "short-lived clearing", "temporary clearing", "eye of storm"
  ];

  // Expressions comprehensive list - 500+ expressions
  const expressions = [
    // Basic Facial Expressions
    "smiling", "laughing", "grinning", "beaming", "happy", "joyful", "cheerful", "delighted", "pleased", "content", "satisfied", "glad", "elated", "ecstatic", "euphoric", "blissful", "radiant", "glowing", "bright-eyed", "frowning", "sad", "unhappy", "sorrowful", "melancholic", "dejected", "downcast", "gloomy", "miserable", "crying", "weeping", "sobbing", "tearful", "teary-eyed", "angry", "furious", "enraged", "livid", "irate", "mad", "cross", "annoyed", "irritated", "frustrated", "aggravated", "surprised", "shocked", "astonished", "amazed", "astounded", "startled", "stunned", "dumbfounded", "flabbergasted", "awestruck", "scared", "frightened", "terrified", "horrified", "fearful", "afraid", "anxious", "worried", "nervous", "apprehensive", "uneasy", "tense", "stressed", "panicked", "disgusted", "repulsed", "revolted", "nauseated", "sickened", "contemptuous", "disdainful", "scornful",
    
    // Complex Emotions
    "neutral expression", "blank face", "expressionless", "stoic", "impassive", "poker face", "deadpan", "thoughtful", "pensive", "contemplative", "reflective", "meditative", "introspective", "brooding", "concerned", "troubled", "distressed", "anguished", "tormented", "agonized", "suffering", "pained", "hurt", "wounded", "betrayed", "heartbroken", "devastated", "shattered", "broken", "defeated", "hopeless", "despairing", "despondent", "forlorn", "wistful", "nostalgic", "longing", "yearning", "pining", "romantic", "loving", "affectionate", "tender", "caring", "compassionate", "sympathetic", "empathetic", "kind", "gentle", "warm", "sincere", "earnest", "serious", "solemn", "grave", "stern", "severe", "harsh", "cold", "icy", "distant", "aloof", "detached", "indifferent", "apathetic", "bored", "disinterested", "unimpressed", "skeptical", "doubtful", "suspicious", "distrustful", "wary", "cautious", "hesitant", "uncertain", "confused", "perplexed", "puzzled", "bewildered", "baffled", "mystified",
    
    // Intensity Levels
    "slightly smiling", "gently smiling", "softly smiling", "barely smiling", "hint of smile", "subtle smile", "faint smile", "weak smile", "half smile", "crooked smile", "lopsided smile", "wry smile", "ironic smile", "sarcastic smile", "mischievous smile", "playful smile", "teasing smile", "flirtatious smile", "seductive smile", "sultry smile", "knowing smile", "secret smile", "mysterious smile", "enigmatic smile", "ambiguous smile", "forced smile", "fake smile", "strained smile", "polite smile", "professional smile", "genuine smile", "authentic smile", "heartfelt smile", "beaming smile", "radiant smile", "dazzling smile", "brilliant smile", "luminous smile", "glowing smile", "ear-to-ear smile", "wide smile", "broad smile", "toothy smile", "showing teeth", "full smile",
    
    // Eye Expressions
    "wide eyes", "big eyes", "doe eyes", "puppy eyes", "sparkling eyes", "twinkling eyes", "shining eyes", "glittering eyes", "bright eyes", "clear eyes", "focused eyes", "intense gaze", "piercing gaze", "steely gaze", "hard stare", "cold stare", "icy stare", "warm gaze", "soft gaze", "tender gaze", "loving gaze", "adoring gaze", "gazing lovingly", "looking away", "averted eyes", "downcast eyes", "lowered eyes", "eyes closed", "shut eyes", "tightly closed eyes", "squinting", "narrowed eyes", "slitted eyes", "half-closed eyes", "sleepy eyes", "drowsy eyes", "tired eyes", "exhausted eyes", "weary eyes", "bloodshot eyes", "red eyes", "puffy eyes", "swollen eyes", "teary eyes", "watery eyes", "glistening eyes", "misty eyes", "glazed eyes", "unfocused eyes", "blank stare", "thousand-yard stare", "vacant stare", "empty stare", "hollow eyes", "sunken eyes", "dark circles", "bags under eyes", "shifty eyes", "darting eyes", "furtive glance", "sideways glance", "sidelong glance", "corner of eye", "peripheral vision", "eye contact", "direct gaze", "steady gaze", "unwavering gaze", "unflinching stare",
    
    // Mouth Expressions
    "open mouth", "mouth agape", "jaw dropped", "mouth wide open", "gaping mouth", "closed mouth", "pursed lips", "tight lips", "pressed lips", "thin lips", "pouting", "pout", "sulking", "sulky", "lip quivering", "trembling lip", "biting lip", "chewing lip", "licking lips", "tongue out", "sticking tongue out", "playful tongue", "cheeky tongue", "gritted teeth", "clenched teeth", "bared teeth", "snarl", "snarling", "grimace", "grimacing", "smirk", "smirking", "sneer", "sneering", "scowl", "scowling", "lips curved up", "upturned lips", "lips curved down", "downturned lips", "mouth corners up", "mouth corners down", "slight frown", "deep frown", "exaggerated frown", "subtle smile", "duck lips", "fish lips", "whistling", "blowing kiss", "kiss face", "kissy face", "puckered lips", "rosebud lips",
    
    // Eyebrow Expressions
    "raised eyebrows", "lifted eyebrows", "arched eyebrows", "high eyebrows", "surprised eyebrows", "questioning eyebrows", "one eyebrow raised", "single eyebrow up", "cocked eyebrow", "quizzical look", "furrowed brows", "knitted brows", "drawn brows", "scrunched brows", "angry brows", "stern brows", "worried brows", "concerned brows", "relaxed brows", "natural brows", "smooth brows", "straight brows", "low brows", "heavy brows", "brooding brows", "shadowed brows",
    
    // Head Position & Gestures
    "head tilted", "tilted head", "head to side", "cocked head", "head turned", "looking back", "looking over shoulder", "glancing back", "backward glance", "head down", "bowed head", "lowered head", "hung head", "head up", "lifted head", "raised head", "chin up", "chin raised", "chin tilted up", "chin down", "chin lowered", "chin tucked", "proud posture", "confident stance", "humble posture", "submissive posture", "defiant posture", "challenging look", "confrontational", "nodding", "shaking head", "head shake", "head nod", "affirmative nod", "negative shake",
    
    // Composite Expressions
    "laughing with eyes closed", "crying with smile", "bittersweet smile", "sad smile", "melancholic smile", "tearful smile", "trying not to cry", "holding back tears", "fighting tears", "suppressing emotion", "bottling emotions", "hiding feelings", "masking emotion", "feigning happiness", "pretending joy", "fake cheerfulness", "forced enthusiasm", "reluctant smile", "uncomfortable smile", "nervous smile", "anxious smile", "worried smile", "scared smile", "brave face", "putting on brave face", "maintaining composure", "keeping cool", "staying calm", "collected expression", "composed look", "dignified expression", "poised look", "graceful expression", "elegant demeanor",
    
    // Intense Emotions
    "rage", "fury", "wrath", "seething anger", "boiling anger", "explosive anger", "blind rage", "uncontrolled fury", "wild anger", "savage fury", "intense hatred", "deep loathing", "pure contempt", "utter disgust", "complete revulsion", "absolute terror", "sheer panic", "overwhelming fear", "paralyzing fear", "petrified", "frozen in fear", "shocked horror", "utter shock", "complete surprise", "total amazement", "pure joy", "absolute happiness", "complete bliss", "utter contentment", "total satisfaction", "profound sadness", "deep sorrow", "overwhelming grief", "crushing despair", "utter hopelessness", "complete devastation",
    
    // Subtle Expressions
    "hint of emotion", "trace of feeling", "barely visible", "almost imperceptible", "subtle change", "slight shift", "minor adjustment", "tiny movement", "microscopic change", "fleeting expression", "momentary look", "passing emotion", "transient feeling", "brief flash", "quick glimpse", "split second", "blink and miss", "ghost of smile", "shadow of frown", "whisper of emotion", "suggestion of feeling", "indication of mood", "sign of emotion",
    
    // Cultural & Specific Expressions
    "serene Buddha smile", "Mona Lisa smile", "enigmatic smile", "knowing smirk", "devilish grin", "angelic smile", "saintly expression", "demonic grin", "evil smile", "wicked grin", "sinister smile", "menacing grin", "threatening look", "intimidating stare", "predatory gaze", "hungry look", "lustful gaze", "desire-filled eyes", "passionate look", "fiery eyes", "burning gaze", "smoldering look", "sultry gaze", "bedroom eyes", "come-hither look", "inviting smile", "welcoming expression", "open expression", "receptive look", "approachable demeanor", "friendly face", "kind expression", "gentle look", "soft expression", "delicate features", "refined look", "sophisticated expression", "cultured demeanor", "worldly look", "experienced eyes", "wise expression", "knowing look", "sagacious gaze", "intelligent eyes", "sharp look", "keen gaze", "alert expression", "vigilant look", "watchful eyes", "observant gaze",
    
    // Animated & Exaggerated
    "cartoon surprise", "anime shock", "manga amazement", "exaggerated shock", "over-the-top surprise", "theatrical gasp", "dramatic reaction", "melodramatic expression", "hamming it up", "playing it up", "laying it on thick", "overacting", "scenery-chewing", "larger than life", "bigger than life", "amplified emotion", "heightened expression", "intensified look", "maximized feeling", "boosted emotion", "enhanced expression", "supercharged look", "turbocharged emotion", "souped-up expression", "jacked-up look",
    
    // Professional & Formal
    "professional smile", "business expression", "corporate look", "formal demeanor", "official expression", "diplomatic smile", "political face", "PR smile", "media-trained expression", "camera-ready look", "photogenic smile", "picture-perfect expression", "polished look", "refined expression", "cultivated demeanor", "practiced smile", "rehearsed expression", "staged look", "posed expression", "artificial smile", "manufactured look", "engineered expression", "calculated smile", "strategic expression", "tactical look",
    
    // Emotional States
    "depressed", "manic", "bipolar swing", "mood swing", "emotional", "unemotional", "feeling", "unfeeling", "sensitive", "insensitive", "vulnerable", "guarded", "open", "closed off", "receptive", "defensive", "approachable", "standoffish", "warm", "cold", "hot-tempered", "cool-headed", "passionate", "dispassionate", "enthusiastic", "apathetic", "energetic", "lethargic", "vivacious", "listless", "animated", "lifeless", "spirited", "dispirited", "upbeat", "downbeat", "optimistic", "pessimistic", "hopeful", "hopeless", "confident", "insecure", "self-assured", "doubtful", "certain", "uncertain", "decisive", "indecisive", "determined", "wavering", "resolute", "hesitant", "bold", "timid", "brave", "cowardly", "fearless", "fearful", "courageous", "scared", "heroic", "craven", "valiant", "pusillanimous", "intrepid", "fainthearted", "dauntless", "chicken-hearted", "undaunted", "lily-livered", "plucky", "yellow-bellied", "gutsy", "spineless", "ballsy", "weak-kneed", "tough", "soft", "hard", "tender", "rough", "gentle", "harsh", "mild", "severe", "lenient", "strict", "permissive", "rigid", "flexible", "firm", "yielding", "strong", "weak", "powerful", "powerless", "mighty", "feeble", "robust", "frail", "sturdy", "delicate", "solid", "fragile"
  ];

  // Settings state
  const [selectedModel, setSelectedModel] = useState('flux');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [customWidth, setCustomWidth] = useState('1024');
  const [customHeight, setCustomHeight] = useState('1024');
  const [style, setStyle] = useState('realistic');
  const [place, setPlace] = useState('');
  const [customPlace, setCustomPlace] = useState('');
  const [isCustomPlace, setIsCustomPlace] = useState(false);
  const [effect, setEffect] = useState('');
  const [background, setBackground] = useState('');
  const [customBackground, setCustomBackground] = useState('');
  const [isCustomBackground, setIsCustomBackground] = useState(false);
  const [sky, setSky] = useState('');
  const [customSky, setCustomSky] = useState('');
  const [isCustomSky, setIsCustomSky] = useState(false);
  const [weather, setWeather] = useState('');
  const [customWeather, setCustomWeather] = useState('');
  const [isCustomWeather, setIsCustomWeather] = useState(false);
  const [expression, setExpression] = useState('');
  const [customExpression, setCustomExpression] = useState('');
  const [isCustomExpression, setIsCustomExpression] = useState(false);
  const [expressionDropdownOpen, setExpressionDropdownOpen] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState('');
  const [seed, setSeed] = useState<string>('');
  const [useRandomSeed, setUseRandomSeed] = useState(true);
  const [numberOfImages, setNumberOfImages] = useState(4);
  const [isCustomNumber, setIsCustomNumber] = useState(false);
  const [customNumberOfImages, setCustomNumberOfImages] = useState('');
  const [shareToGallery, setShareToGallery] = useState(true);
  const [savingImages, setSavingImages] = useState<Set<string>>(new Set());
  const [savedImages, setSavedImages] = useState<Set<string>>(new Set());
  
  // Custom art style state
  const [customArtStyles, setCustomArtStyles] = useState<string[]>([]);
  const [newCustomStyle, setNewCustomStyle] = useState('');
  const [showCustomStyleInput, setShowCustomStyleInput] = useState(false);
  
  // Database art styles
  const { data: databaseArtStyles = [], isLoading: isLoadingDbStyles } = useQuery<UserArtStyle[]>({
    queryKey: ['/api/user-art-styles', user?.uid],
    enabled: !!user?.uid,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await fetch(`/api/user-art-styles?userId=${user?.uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch art styles');
      }
      return response.json();
    },
  });
  
  // Custom models state and query
  const { data: customModels = [], isLoading: isLoadingCustomModels, refetch: refetchCustomModels } = useQuery<CustomModel[]>({
    queryKey: ['/api/custom-models', user?.uid],
    enabled: !!user?.uid,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await fetch(`/api/custom-models?userId=${user?.uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch custom models');
      }
      return response.json();
    },
  });
  
  // Custom model dialog state
  const [showCustomModelDialog, setShowCustomModelDialog] = useState(false);
  const [customModelType, setCustomModelType] = useState<'huggingface'>('huggingface');
  const [customModelName, setCustomModelName] = useState('');
  const [customModelUrl, setCustomModelUrl] = useState('');
  const [customModelApiKey, setCustomModelApiKey] = useState('');
  const [isSavingCustomModel, setIsSavingCustomModel] = useState(false);
  
  // Custom art style information state
  interface StyleInfo {
    description: string;
    keywords: string;
    inspiration: string;
    characteristics: string;
  }
  const [customStylesInfo, setCustomStylesInfo] = useState<Record<string, StyleInfo>>({});
  
  // Custom art style information popup state
  const [showStyleInfoPopup, setShowStyleInfoPopup] = useState(false);
  const [currentStyleBeingDefined, setCurrentStyleBeingDefined] = useState('');
  const [styleDescription, setStyleDescription] = useState('');
  const [styleKeywords, setStyleKeywords] = useState('');
  const [styleInspiration, setStyleInspiration] = useState('');
  const [styleCharacteristics, setStyleCharacteristics] = useState('');

  // Custom effects state
  const [showCustomEffectDialog, setShowCustomEffectDialog] = useState(false);
  const [customEffectName, setCustomEffectName] = useState('');
  const [customEffectDescription, setCustomEffectDescription] = useState('');
  const [customEffectVisualImpact, setCustomEffectVisualImpact] = useState('');
  const [customEffectTechnicalDetails, setCustomEffectTechnicalDetails] = useState('');
  const [customEffectUseCases, setCustomEffectUseCases] = useState('');
  const [isSavingCustomEffect, setIsSavingCustomEffect] = useState(false);

  // Database custom effects query
  const { data: databaseCustomEffects = [], isLoading: isLoadingDbEffects, refetch: refetchCustomEffects } = useQuery<UserCustomEffect[]>({
    queryKey: ['/api/user-custom-effects', user?.uid],
    enabled: !!user?.uid,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await fetch(`/api/user-custom-effects?userId=${user?.uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch custom effects');
      }
      return response.json();
    },
  });

  // Cleanup object URLs only on component unmount
  useEffect(() => {
    return () => {
      createdUrlsRef.current.forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  // Load custom art styles from localStorage on mount
  useEffect(() => {
    const savedCustomStyles = localStorage.getItem('customArtStyles');
    if (savedCustomStyles) {
      setCustomArtStyles(JSON.parse(savedCustomStyles));
    }
    
    // Load custom styles info from localStorage
    const savedCustomStylesInfo = localStorage.getItem('customArtStylesInfo');
    if (savedCustomStylesInfo) {
      setCustomStylesInfo(JSON.parse(savedCustomStylesInfo));
    }
    
    // Check for selected art style from My Art Style page
    const selectedArtStyle = localStorage.getItem('selectedArtStyle');
    if (selectedArtStyle) {
      try {
        const styleData = JSON.parse(selectedArtStyle);
        if (styleData.source === 'database' || styleData.source === 'community') {
          // Set the style name
          setStyle(styleData.name);
          
          // Add to custom styles info if it has detailed information
          if (styleData.description || styleData.keywords || styleData.inspiration || styleData.characteristics) {
            setCustomStylesInfo(prev => ({
              ...prev,
              [styleData.name]: {
                description: styleData.description || '',
                keywords: styleData.keywords || '',
                inspiration: styleData.inspiration || '',
                characteristics: styleData.characteristics || ''
              }
            }));
          }
          
          toast({
            title: "Art style loaded!",
            description: `"${styleData.name}" is now selected for image generation.`,
          });
        }
        
        // Clear the selected style from localStorage
        localStorage.removeItem('selectedArtStyle');
      } catch (error) {
        console.error('Error loading selected art style:', error);
      }
    }
  }, [toast]);

  // Save custom art styles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('customArtStyles', JSON.stringify(customArtStyles));
  }, [customArtStyles]);
  
  // Save custom styles info to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('customArtStylesInfo', JSON.stringify(customStylesInfo));
  }, [customStylesInfo]);

  // Handle URL parameter for pre-selecting an effect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const effectParam = urlParams.get('effect');
    
    if (effectParam) {
      setEffect(effectParam);
      // Clear the URL parameter after setting the effect
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Function to initiate custom art style creation with popup
  const addCustomArtStyle = () => {
    const trimmedStyle = newCustomStyle.trim();
    if (trimmedStyle && !customArtStyles.some(style => style.toLowerCase() === trimmedStyle.toLowerCase())) {
      setCurrentStyleBeingDefined(trimmedStyle);
      setNewCustomStyle('');
      setShowCustomStyleInput(false);
      setShowStyleInfoPopup(true);
    }
  };

  // Function to save the custom art style with collected information
  const saveCustomArtStyleWithInfo = async () => {
    if (currentStyleBeingDefined) {
      // Add the style to the list
      setCustomArtStyles([...customArtStyles, currentStyleBeingDefined]);
      setStyle(currentStyleBeingDefined); // Automatically select the newly created style
      
      // Save the detailed information to state (which will auto-save to localStorage)
      const styleInfo = {
        description: styleDescription,
        keywords: styleKeywords,
        inspiration: styleInspiration,
        characteristics: styleCharacteristics
      };
      
      setCustomStylesInfo({
        ...customStylesInfo,
        [currentStyleBeingDefined]: styleInfo
      });
      
      // If user is logged in, also save to database
      if (user?.uid) {
        try {
          const response = await fetch('/api/user-art-styles', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.uid,
              name: currentStyleBeingDefined.trim(),
              description: styleDescription.trim() || null,
              keywords: styleKeywords.trim() || null,
              inspiration: styleInspiration.trim() || null,
              characteristics: styleCharacteristics.trim() || null
            }),
          });
          
          if (response.ok) {
            toast({
              title: "Custom art style created!",
              description: `"${currentStyleBeingDefined}" has been saved to your account and is ready to use.`,
            });
          } else {
            throw new Error('Failed to save to database');
          }
        } catch (error) {
          console.error('Error saving art style to database:', error);
          toast({
            title: "Art style created locally",
            description: `"${currentStyleBeingDefined}" was saved locally but couldn't be synced to your account.`,
          });
        }
      } else {
        toast({
          title: "Custom art style created!",
          description: `"${currentStyleBeingDefined}" has been saved locally. Sign in to save styles to your account.`,
        });
      }
      
      // Reset form and close popup
      setStyleDescription('');
      setStyleKeywords('');
      setStyleInspiration('');
      setStyleCharacteristics('');
      setCurrentStyleBeingDefined('');
      setShowStyleInfoPopup(false);
    }
  };

  // Function to remove a custom art style
  const removeCustomArtStyle = (styleToRemove: string) => {
    setCustomArtStyles(customArtStyles.filter(style => style !== styleToRemove));
    
    // Remove the style info as well
    const updatedStylesInfo = { ...customStylesInfo };
    delete updatedStylesInfo[styleToRemove];
    setCustomStylesInfo(updatedStylesInfo);
    
    if (style === styleToRemove) {
      setStyle('realistic'); // Reset to default if current style is removed
    }
  };

  // Helper function to get model display name
  const getModelDisplayName = (modelId: string): string => {
    if (modelId.startsWith('custom-')) {
      const customModelId = modelId.replace('custom-', '');
      const customModel = customModels.find(m => m.id === customModelId);
      return customModel ? customModel.name : modelId;
    }
    
    // Return friendly names for built-in models
    const modelNames: Record<string, string> = {
      'flux-schnell': 'Flux-Schnell',
      'flux-real': 'Flux-Real',
      'flux': 'Flux (fast)',
      'turbo': 'Turbo',
      'image-4': 'Image-4',
      'image-4-ultra': 'Image-4 Ultra'
    };
    
    return modelNames[modelId] || modelId;
  };

  // Function to save custom model
  const saveCustomModel = async () => {
    if (!user?.uid) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save custom models.",
        variant: "destructive",
      });
      return;
    }

    // Validation based on model type
    if (!customModelName.trim() || !customModelUrl.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingCustomModel(true);
    try {
      const response = await fetch('/api/custom-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          name: customModelName.trim(),
          modelType: customModelType,
          apiUrl: customModelUrl.trim(),
          apiKey: customModelApiKey.trim() || null,
          requestFormat: 'standard',
          isActive: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save custom model');
      }

      toast({
        title: "Custom model added!",
        description: `"${customModelName}" has been saved and is ready to use.`,
      });

      // Reset form and close dialog
      setCustomModelType('huggingface');
      setCustomModelName('');
      setCustomModelUrl('');
      setCustomModelApiKey('');
      setShowCustomModelDialog(false);

      // Refetch custom models
      refetchCustomModels();
    } catch (error) {
      console.error('Error saving custom model:', error);
      toast({
        title: "Failed to save",
        description: "Could not save custom model. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingCustomModel(false);
    }
  };

  // Function to save custom effect
  const saveCustomEffect = async () => {
    if (!user?.uid) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save custom effects.",
        variant: "destructive",
      });
      return;
    }

    if (!customEffectName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your custom effect.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingCustomEffect(true);
    try {
      const response = await fetch('/api/user-custom-effects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          name: customEffectName.trim(),
          description: customEffectDescription.trim() || null,
          visualImpact: customEffectVisualImpact.trim() || null,
          technicalDetails: customEffectTechnicalDetails.trim() || null,
          useCases: customEffectUseCases.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save custom effect');
      }

      toast({
        title: "Custom effect created!",
        description: `"${customEffectName}" has been saved and is ready to use.`,
      });

      // Reset form and close dialog
      setCustomEffectName('');
      setCustomEffectDescription('');
      setCustomEffectVisualImpact('');
      setCustomEffectTechnicalDetails('');
      setCustomEffectUseCases('');
      setShowCustomEffectDialog(false);

      // Refetch custom effects
      refetchCustomEffects();
    } catch (error) {
      console.error('Error saving custom effect:', error);
      toast({
        title: "Failed to save",
        description: "Could not save custom effect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingCustomEffect(false);
    }
  };

  // Function to delete custom model
  const deleteCustomModel = async (modelId: string) => {
    if (!user?.uid) return;

    try {
      const response = await fetch(`/api/custom-models/${modelId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete custom model');
      }

      toast({
        title: "Model deleted",
        description: "Custom model has been removed.",
      });

      // Refetch custom models
      refetchCustomModels();

      // Reset selected model if it was deleted
      if (selectedModel === `custom-${modelId}`) {
        setSelectedModel('flux');
      }
    } catch (error) {
      console.error('Error deleting custom model:', error);
      toast({
        title: "Delete failed",
        description: "Could not delete custom model. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Combined art styles for dropdown (predefined + custom + database)
  const databaseStyleNames = databaseArtStyles.map(style => style.name);
  const allArtStyles = [...artStyles, ...customArtStyles, ...databaseStyleNames];

  // Simplified configuration
  const guidance = '7.5';
  const strength = '0.8';

  // Handler for aspect ratio change with Adsterra ad integration
  const handleAspectRatioChange = (value: string) => {
    if (value === 'custom') {
      // Open Adsterra ad in new tab when custom aspect ratio is selected
      // Using noopener and noreferrer for security to prevent reverse-tabnabbing
      window.open('https://www.revenuecpmgate.com/bhww75bcue?key=1d9a547bb81b9ffacd93be046ec6b4bf', '_blank', 'noopener,noreferrer');
    }
    setAspectRatio(value);
  };

  // Handler for custom art style toggle with Adsterra ad integration
  const handleCustomStyleToggle = () => {
    if (!showCustomStyleInput) {
      // Open Adsterra ad in new tab when creating custom art style
      // Using noopener and noreferrer for security to prevent reverse-tabnabbing
      window.open('https://www.revenuecpmgate.com/bhww75bcue?key=1d9a547bb81b9ffacd93be046ec6b4bf', '_blank', 'noopener,noreferrer');
    }
    setShowCustomStyleInput(!showCustomStyleInput);
  };

  // Helper function to calculate dimensions from aspect ratio
  const getDimensions = () => {
    if (aspectRatio === 'custom') {
      // Clamp and round to nearest multiple of 64 for API compatibility
      const clampAndRound = (value: string, min = 256, max = 1536) => {
        const num = parseInt(value) || 1024;
        const clamped = Math.max(min, Math.min(max, num));
        return Math.round(clamped / 64) * 64;
      };
      return [clampAndRound(customWidth), clampAndRound(customHeight)];
    }
    
    // Use standard, API-friendly dimensions that are multiples of 64
    switch (aspectRatio) {
      case '1:1':
        return [1024, 1024];
      case '16:9':
        return [1024, 576];  // 1024/576 ≈ 1.78 (16:9)
      case '4:3':
        return [1024, 768];  // 1024/768 ≈ 1.33 (4:3)
      case '9:16':
        return [576, 1024];  // 576/1024 ≈ 0.56 (9:16)
      default:
        return [1024, 1024];
    }
  };

  // Helper function to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Helper function to save image to gallery
  const saveToGallery = async (image: GeneratedImage, imageBlob: Blob) => {
    try {
      const base64Data = await blobToBase64(imageBlob);
      
      await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: image.prompt,
          negativePrompt: image.negativePrompt,
          model: image.model,
          width: image.width,
          height: image.height,
          imageData: base64Data,
          artStyle: style, // Include the selected art style
          userDisplayName: user?.displayName || user?.email || 'Anonymous User'
        }),
      });
      
      toast({
        title: "Shared to gallery!",
        description: "Your image is now visible in the community gallery.",
      });
    } catch (error) {
      console.error('Failed to save image to gallery:', error);
      toast({
        title: "Share failed",
        description: "Could not share image to gallery. Image saved locally.",
        variant: "destructive",
      });
    }
  };

  // Helper function to generate a single image
  const generateSingleImage = async (promptToUse: string, imageIndex: number): Promise<GeneratedImage> => {
    let enhancedPrompt = promptToUse;
    
    // Add place if selected (custom or predefined)
    const currentPlace = isCustomPlace ? customPlace : place;
    if (currentPlace.trim()) {
      enhancedPrompt += ` in ${currentPlace}`;
    }
    
    // Add style with enhanced information for custom styles or database styles
    if (style && style.trim()) {
      const isCustomStyle = customArtStyles.includes(style) && customStylesInfo[style];
      const isDatabaseStyle = databaseArtStyles.find(dbStyle => dbStyle.name === style);
      
      if (isCustomStyle || isDatabaseStyle) {
        // Use detailed information for custom styles or database styles with sanitization and length limits
        let styleInfo;
        
        if (isCustomStyle) {
          styleInfo = customStylesInfo[style];
        } else if (isDatabaseStyle) {
          styleInfo = {
            description: isDatabaseStyle.description || '',
            keywords: isDatabaseStyle.keywords || '',
            inspiration: isDatabaseStyle.inspiration || '',
            characteristics: isDatabaseStyle.characteristics || ''
          };
        }
        
        let stylePrompt = `, ${style} style`;
        
        // Only proceed with style information if we have valid styleInfo
        if (styleInfo) {
          // Helper function to sanitize and limit text
          const sanitizeText = (text: string, maxLength = 50) => {
            return text
              .trim()
              .replace(/\s+/g, ' ') // Collapse whitespace
              .replace(/[\n\r]/g, ' ') // Remove newlines
              .substring(0, maxLength) // Limit length
              .trim();
          };
          
          // Collect all style information with limits
          const styleElements: string[] = [];
          
          if (styleInfo.description) {
            styleElements.push(sanitizeText(styleInfo.description, 60));
          }
          
          if (styleInfo.keywords) {
            styleElements.push(sanitizeText(styleInfo.keywords, 40));
          }
          
          if (styleInfo.inspiration) {
            styleElements.push(sanitizeText(styleInfo.inspiration, 30));
          }
          
          if (styleInfo.characteristics) {
            styleElements.push(sanitizeText(styleInfo.characteristics, 50));
          }
          
          // Join elements and apply total length limit to prevent URL overflow
          const additionalInfo = styleElements.join(', ');
          const maxTotalAdditionalLength = 200; // Conservative limit for URL compatibility
          const finalAdditionalInfo = additionalInfo.length > maxTotalAdditionalLength 
            ? additionalInfo.substring(0, maxTotalAdditionalLength).trim() + '...'
            : additionalInfo;
          
          if (finalAdditionalInfo) {
            stylePrompt += `, ${finalAdditionalInfo}`;
          }
        }
        
        enhancedPrompt += stylePrompt;
      } else {
        // Use simple style name for predefined styles
        enhancedPrompt += `, ${style} style`;
      }
    }
    
    // Add effect if selected (with enhanced information for custom effects)
    if (effect && effect.trim()) {
      const isDatabaseEffect = databaseCustomEffects.find(dbEffect => dbEffect.name === effect);
      
      if (isDatabaseEffect) {
        // Use detailed information for database custom effects with sanitization and length limits
        const effectInfo = {
          description: isDatabaseEffect.description || '',
          visualImpact: isDatabaseEffect.visualImpact || '',
          technicalDetails: isDatabaseEffect.technicalDetails || '',
          useCases: isDatabaseEffect.useCases || ''
        };
        
        let effectPrompt = `, with ${effect} effect`;
        
        // Helper function to sanitize and limit text
        const sanitizeText = (text: string, maxLength = 50) => {
          return text
            .trim()
            .replace(/\s+/g, ' ') // Collapse whitespace
            .replace(/[\n\r]/g, ' ') // Remove newlines
            .substring(0, maxLength) // Limit length
            .trim();
        };
        
        // Collect all effect information with limits
        const effectElements: string[] = [];
        
        if (effectInfo.visualImpact) {
          effectElements.push(sanitizeText(effectInfo.visualImpact, 60));
        }
        
        if (effectInfo.description) {
          effectElements.push(sanitizeText(effectInfo.description, 50));
        }
        
        if (effectInfo.technicalDetails) {
          effectElements.push(sanitizeText(effectInfo.technicalDetails, 40));
        }
        
        if (effectInfo.useCases) {
          effectElements.push(sanitizeText(effectInfo.useCases, 30));
        }
        
        // Join elements and apply total length limit to prevent URL overflow
        const additionalInfo = effectElements.join(', ');
        const maxTotalAdditionalLength = 180; // Conservative limit for URL compatibility
        const finalAdditionalInfo = additionalInfo.length > maxTotalAdditionalLength 
          ? additionalInfo.substring(0, maxTotalAdditionalLength).trim() + '...'
          : additionalInfo;
        
        if (finalAdditionalInfo) {
          effectPrompt += `, ${finalAdditionalInfo}`;
        }
        
        enhancedPrompt += effectPrompt;
      } else {
        // Use simple effect name for predefined effects
        enhancedPrompt += `, with ${effect} effect`;
      }
    }
    
    // Add expression if selected (custom or predefined)
    const currentExpression = isCustomExpression ? customExpression : expression;
    if (currentExpression.trim()) {
      enhancedPrompt += `, ${currentExpression}`;
    }
    
    // Add sky if selected (custom or predefined)
    const currentSky = isCustomSky ? customSky : sky;
    if (currentSky.trim()) {
      enhancedPrompt += `, under ${currentSky}`;
    }
    
    // Add weather if selected (custom or predefined)
    const currentWeather = isCustomWeather ? customWeather : weather;
    if (currentWeather.trim()) {
      enhancedPrompt += `, ${currentWeather} weather`;
    }
    
    // Add background if selected (custom or predefined)
    const currentBackground = isCustomBackground ? customBackground : background;
    if (currentBackground.trim()) {
      enhancedPrompt += `, on ${currentBackground}`;
    }
    
    // Add negative prompt if provided
    if (negativePrompt.trim()) {
      enhancedPrompt += `, --no ${negativePrompt.trim()}`;
    }
    
    // Apply robust global prompt length budget to prevent URL overflow
    const maxEncodedLength = 1800; // Conservative limit for URL safety
    let wasTruncated = false;
    
    // Priority-based trimming: preserve base prompt most, then style, then effect, then expression, then sky, then weather, then background, then place, finally negative
    const trimWithPriority = (basePrompt: string, styleSegment: string, placeSegment: string, effectSegment: string, expressionSegment: string, skySegment: string, weatherSegment: string, backgroundSegment: string, negativeSegment: string) => {
      const checkLength = (prompt: string) => encodeURIComponent(prompt).length;
      
      // Helper to trim at word boundaries safely
      const trimSafe = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        const trimmed = text.substring(0, maxLength);
        const lastSpace = trimmed.lastIndexOf(' ');
        return lastSpace > maxLength * 0.7 ? trimmed.substring(0, lastSpace) + '...' : trimmed + '...';
      };
      
      // Start with all segments - maintain correct order: base + place + style + effect + expression + sky + weather + background + negative
      let currentPrompt = basePrompt + placeSegment + styleSegment + effectSegment + expressionSegment + skySegment + weatherSegment + backgroundSegment + negativeSegment;
      
      // 1. First, try reducing custom style info if it was added
      if (checkLength(currentPrompt) > maxEncodedLength && styleSegment.includes(',') && styleSegment.length > 20) {
        // Fix: properly extract base style, accounting for leading comma
        const styleParts = styleSegment.split(',').filter(part => part.trim());
        const baseStyle = styleParts.length > 0 ? `, ${styleParts[0].trim()}` : styleSegment;
        styleSegment = baseStyle;
        currentPrompt = basePrompt + placeSegment + styleSegment + effectSegment + expressionSegment + skySegment + weatherSegment + backgroundSegment + negativeSegment;
        wasTruncated = true;
      }
      
      // 2. Remove effect if still too long
      if (checkLength(currentPrompt) > maxEncodedLength && effectSegment) {
        effectSegment = '';
        currentPrompt = basePrompt + placeSegment + styleSegment + expressionSegment + skySegment + weatherSegment + backgroundSegment + negativeSegment;
        wasTruncated = true;
      }
      
      // 3. Remove expression if still too long
      if (checkLength(currentPrompt) > maxEncodedLength && expressionSegment) {
        expressionSegment = '';
        currentPrompt = basePrompt + placeSegment + styleSegment + skySegment + weatherSegment + backgroundSegment + negativeSegment;
        wasTruncated = true;
      }
      
      // 4. Remove sky if still too long
      if (checkLength(currentPrompt) > maxEncodedLength && skySegment) {
        skySegment = '';
        currentPrompt = basePrompt + placeSegment + styleSegment + weatherSegment + backgroundSegment + negativeSegment;
        wasTruncated = true;
      }
      
      // 5. Remove weather if still too long
      if (checkLength(currentPrompt) > maxEncodedLength && weatherSegment) {
        weatherSegment = '';
        currentPrompt = basePrompt + placeSegment + styleSegment + backgroundSegment + negativeSegment;
        wasTruncated = true;
      }
      
      // 6. Remove background if still too long
      if (checkLength(currentPrompt) > maxEncodedLength && backgroundSegment) {
        backgroundSegment = '';
        currentPrompt = basePrompt + placeSegment + styleSegment + negativeSegment;
        wasTruncated = true;
      }
      
      // 7. Remove place if still too long
      if (checkLength(currentPrompt) > maxEncodedLength && placeSegment) {
        placeSegment = '';
        currentPrompt = basePrompt + styleSegment + negativeSegment;
        wasTruncated = true;
      }
      
      // 8. Remove negative prompt if still too long
      if (checkLength(currentPrompt) > maxEncodedLength && negativeSegment) {
        negativeSegment = '';
        currentPrompt = basePrompt + styleSegment;
        wasTruncated = true;
      }
      
      // 9. Finally, trim base prompt if absolutely necessary
      if (checkLength(currentPrompt) > maxEncodedLength) {
        const availableLength = maxEncodedLength - checkLength(styleSegment) - 100; // Account for URL overhead
        if (availableLength > 50) { // Ensure minimum viable prompt
          basePrompt = trimSafe(basePrompt, Math.floor(availableLength / 2)); // Conservative encoding estimate
          currentPrompt = basePrompt + styleSegment;
          wasTruncated = true;
        }
      }
      
      return { prompt: currentPrompt, wasTruncated };
    };
    
    // Construct explicit segments for deterministic trimming
    const basePrompt = promptToUse;
    const placeSegment = place.trim() ? ` in ${place}` : '';
    const effectSegment = effect.trim() ? `, with ${effect} effect` : '';
    const currentExpressionValue = isCustomExpression ? customExpression : expression;
    const expressionSegment = currentExpressionValue.trim() ? `, ${currentExpressionValue}` : '';
    const currentSkyValue = isCustomSky ? customSky : sky;
    const skySegment = currentSkyValue.trim() ? `, under ${currentSkyValue}` : '';
    const currentWeatherValue = isCustomWeather ? customWeather : weather;
    const weatherSegment = currentWeatherValue.trim() ? `, ${currentWeatherValue} weather` : '';
    const currentBackgroundValue = isCustomBackground ? customBackground : background;
    const backgroundSegment = currentBackgroundValue.trim() ? `, on ${currentBackgroundValue}` : '';
    const negativeSegment = negativePrompt.trim() ? `, --no ${negativePrompt.trim()}` : '';
    
    // Extract the style segment that was built earlier
    const styleStart = basePrompt.length + placeSegment.length;
    const styleEnd = enhancedPrompt.length - effectSegment.length - expressionSegment.length - skySegment.length - weatherSegment.length - backgroundSegment.length - negativeSegment.length;
    const styleSegment = enhancedPrompt.substring(styleStart, styleEnd);
    
    // Apply priority-based trimming and get result
    const result = trimWithPriority(basePrompt, styleSegment, placeSegment, effectSegment, expressionSegment, skySegment, weatherSegment, backgroundSegment, negativeSegment);
    enhancedPrompt = result.prompt;
    wasTruncated = result.wasTruncated;
    
    // Final safety check with assertion
    const finalEncodedLength = encodeURIComponent(enhancedPrompt).length;
    if (finalEncodedLength > maxEncodedLength) {
      // Hard fallback: trim to absolute limit
      const safeLength = Math.floor(maxEncodedLength * 0.6); // Very conservative
      enhancedPrompt = enhancedPrompt.substring(0, safeLength) + '...';
      wasTruncated = true;
    }
    
    // Show user-visible notification if truncated
    if (wasTruncated) {
      toast({
        title: "Prompt shortened",
        description: "Your prompt was automatically shortened to ensure reliable image generation.",
        variant: "default",
      });
    }
    
    const [width, height] = getDimensions();
    
    // Check if this is a custom model
    const isCustomModel = selectedModel.startsWith('custom-');
    
    // Determine API based on model
    let url: string;
    let isCustomModelRequest = false;
    const xevenModels = ['flux-schnell', 'flux-real'];
    const pollinationsModels = ['flux', 'turbo', 'image-4', 'image-4-ultra'];
    
    if (isCustomModel) {
      // Extract custom model ID
      const customModelId = selectedModel.replace('custom-', '');
      isCustomModelRequest = true;
      url = '/api/generate-with-custom-model'; // Will be a POST request
    } else if (xevenModels.includes(selectedModel)) {
      // Use xeven.workers.dev API with aspect ratio support
      url = `https://ai-image-api.xeven.workers.dev/img?prompt=${encodeURIComponent(enhancedPrompt)}&model=${selectedModel}&guidance=${guidance}&strength=${strength}&width=${width}&height=${height}`;
    } else if (pollinationsModels.includes(selectedModel)) {
      // Use pollinations.ai API
      const actualSeed = useRandomSeed ? Math.floor(Math.random() * 1000000) : (parseInt(seed) || Math.floor(Math.random() * 1000000));
      url = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${width}&height=${height}&seed=${actualSeed}&model=${selectedModel}&nologo=true`;
    } else {
      throw new Error('Unknown model selected');
    }
    
    // Proper retry logic with exponential backoff
    let response: Response | null = null;
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      let controller: AbortController | null = null;
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      
      try {
        controller = new AbortController();
        // Much more generous timeouts to allow for slow AI image generation APIs
        // Progressive timeout increases for retries: 60s, 90s, 120s
        const baseTimeout = 60000; // 60 seconds base
        const timeoutMultiplier = attempt; // 1x, 2x, 3x for attempts
        const timeoutDelay = baseTimeout * timeoutMultiplier;
        timeoutId = setTimeout(() => {
          if (controller) {
            controller.abort(`Request timeout after ${timeoutDelay / 1000} seconds (attempt ${attempt})`);
          }
        }, timeoutDelay);
        
        // Custom model requires POST request with JSON body
        if (isCustomModelRequest) {
          const customModelId = selectedModel.replace('custom-', '');
          
          // Get the current place (custom or predefined)
          const currentPlace = isCustomPlace ? customPlace : place;
          
          // Build options object with all UI features
          const options: Record<string, any> = {
            width,
            height,
            aspect_ratio: aspectRatio,
            ...(negativePrompt.trim() && { negative_prompt: negativePrompt.trim() }),
            ...(useRandomSeed ? {} : { seed: parseInt(seed) || Math.floor(Math.random() * 1000000) }),
            ...(style.trim() && { art_style: style.trim() }),
            ...(currentPlace.trim() && { place: currentPlace.trim() })
          };
          
          response = await fetch(url, {
            method: 'POST',
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              modelId: customModelId,
              prompt: enhancedPrompt,
              options
            })
          });
        } else {
          // Standard GET request for other models
          response = await fetch(url, {
            signal: controller.signal,
            headers: {
              'Accept': 'image/*'
            }
          });
        }
        
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        if (response.ok) break;
        
        lastError = new Error(`API Error: ${response.status} - ${response.statusText || 'Unknown error'}`);
        
        // Apply exponential backoff with jitter for all non-OK responses
        if (attempt < 3) {
          const baseDelay = Math.pow(2, attempt) * 1000; // Exponential: 2s, 4s
          const jitter = Math.random() * 1000; // Add up to 1s jitter
          await new Promise(resolve => setTimeout(resolve, baseDelay + jitter));
        }
      } catch (error) {
        // Ensure timeout is cleared in case of any error
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        if (error instanceof Error) {
          if (error.name === 'AbortError' || error.message.includes('aborted')) {
            lastError = new Error(`Request timeout for image ${imageIndex + 1} - please try again`);
          } else if (error.message === 'Failed to fetch') {
            lastError = new Error('Network error - please check your connection');
          } else {
            lastError = error;
          }
        } else {
          lastError = new Error('Unknown error occurred');
        }
        
        // For timeouts, still retry if we have attempts left
        if (attempt < 3) {
          const baseDelay = Math.pow(2, attempt) * 1000;
          const jitter = Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, baseDelay + jitter));
        }
      }
    }
    
    if (!response || !response.ok) {
      throw lastError || new Error(`Image generation service is currently unavailable for image ${imageIndex + 1}`);
    }
    
    let blob: Blob;
    
    // Custom models return JSON, other models return image blob directly
    if (isCustomModelRequest) {
      // Check for non-OK responses before parsing
      if (!response.ok) {
        let errorMsg = 'Unknown error';
        try {
          const errorJson = await response.json();
          errorMsg = errorJson.details || errorJson.error || JSON.stringify(errorJson);
        } catch (parseError) {
          // If JSON parsing fails, use status text
          errorMsg = response.statusText || 'Server error';
        }
        throw new Error(`Custom model error (${response.status}): ${errorMsg}`);
      }
      
      const jsonResponse = await response.json();
      
      // The custom model endpoint returns { success: true, data: {...} }
      // But also support direct responses for different API formats
      if (!jsonResponse.success && !jsonResponse.data && !jsonResponse.generatedImage && !jsonResponse.image && !jsonResponse.url) {
        const errorMsg = jsonResponse.error || jsonResponse.details || 'Invalid response from custom model';
        throw new Error(errorMsg);
      }
      
      // Try different possible response formats
      const imageData = 
        jsonResponse.data?.imageData || 
        jsonResponse.data?.image || 
        jsonResponse.data?.url ||
        jsonResponse.data?.generatedImage ||
        jsonResponse.generatedImage ||
        jsonResponse.image ||
        jsonResponse.url ||
        (typeof jsonResponse.data === 'string' ? jsonResponse.data : null);
      
      if (!imageData) {
        throw new Error('No image data found in custom model response');
      }
      
      // If it's a URL, fetch the image with timeout
      if (typeof imageData === 'string' && (imageData.startsWith('http://') || imageData.startsWith('https://'))) {
        const imgController = new AbortController();
        const imgTimeoutId = setTimeout(() => imgController.abort(), 30000); // 30s timeout for image fetch
        
        try {
          const imgResponse = await fetch(imageData, { signal: imgController.signal });
          clearTimeout(imgTimeoutId);
          
          if (!imgResponse.ok) {
            throw new Error(`Failed to fetch image from URL: ${imgResponse.status}`);
          }
          
          blob = await imgResponse.blob();
        } catch (fetchError) {
          clearTimeout(imgTimeoutId);
          throw new Error(`Failed to fetch image from custom model URL: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
        }
      } 
      // If it's base64 data
      else if (typeof imageData === 'string' && (imageData.startsWith('data:image/') || imageData.startsWith('/9j/') || imageData.startsWith('iVBOR'))) {
        // Convert base64 to blob with proper MIME type detection
        let mimeType = 'image/png'; // default
        let base64Data = imageData;
        
        if (imageData.startsWith('data:')) {
          // Extract MIME type from data URL
          const matches = imageData.match(/^data:([^;]+);base64,(.+)$/);
          if (matches) {
            mimeType = matches[1];
            base64Data = matches[2];
          } else {
            base64Data = imageData.split(',')[1];
          }
        } else {
          // Detect MIME from base64 signature
          if (imageData.startsWith('/9j/')) {
            mimeType = 'image/jpeg';
          } else if (imageData.startsWith('iVBOR')) {
            mimeType = 'image/png';
          }
        }
        
        try {
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          blob = new Blob([bytes], { type: mimeType });
        } catch (decodeError) {
          throw new Error(`Failed to decode base64 image data: ${decodeError instanceof Error ? decodeError.message : 'Unknown error'}`);
        }
      } else {
        throw new Error('Unsupported image format from custom model');
      }
    } else {
      // Standard models return blob directly
      blob = await response.blob();
    }
    
    if (blob.size === 0) {
      throw new Error(`Empty response from image generation service for image ${imageIndex + 1}`);
    }
    
    const imgUrl = URL.createObjectURL(blob);
    
    // Track the created URL for cleanup
    createdUrlsRef.current.push(imgUrl);
    
    // Generate unique ID with image index to avoid collisions
    const newImage: GeneratedImage = {
      id: `${Date.now()}-${imageIndex}-${Math.random().toString(36).substr(2, 9)}`,
      url: imgUrl,
      prompt: promptToUse,
      negativePrompt: negativePrompt.trim() || undefined,
      model: getModelDisplayName(selectedModel),
      timestamp: new Date(),
      width: width,
      height: height,
    };
    
    // Save to gallery if sharing is enabled
    if (shareToGallery) {
      // Don't await this to avoid blocking the UI
      saveToGallery(newImage, blob).catch(console.error);
    }
    
    return newImage;
  };

  const generateImage = async (customPrompt?: string) => {
    // Use custom prompt or fall back to state prompt
    const promptToUse = customPrompt || prompt;
    
    // Atomic check to prevent concurrent generations
    if (isGeneratingRef.current) {
      toast({
        title: "Generation in progress",
        description: "Please wait for the current generation to complete.",
        variant: "destructive",
      });
      return;
    }

    if (!promptToUse.trim()) {
      toast({
        title: "Enter a prompt",
        description: "Please describe what you'd like to create.",
        variant: "destructive",
      });
      return;
    }

    // Set ref atomically before state
    isGeneratingRef.current = true;
    setIsGenerating(true);
    
    try {
      // Generate all images with slight staggering to reduce API load
      const imagePromises = Array.from({ length: numberOfImages }, (_, i) => {
        // Add a small delay before starting each request to prevent overwhelming the API
        const startDelay = i * 1000; // 0s, 1s, 2s, 3s staggered starts
        
        return new Promise<GeneratedImage | null>(resolve => {
          setTimeout(async () => {
            try {
              const newImage = await generateSingleImage(promptToUse, i);
              // Add each image to the display as it's generated
              setGeneratedImages(prev => [newImage, ...prev]);
              
              // Show progress toast for multiple images
              if (numberOfImages > 1) {
                toast({
                  title: `Image ${i + 1} of ${numberOfImages} generated!`,
                  description: `Generated image ${i + 1} successfully.`,
                });
              }
              
              resolve(newImage);
            } catch (error) {
              // If one image fails, show error but continue with other images
              console.error(`Image ${i + 1} generation failed:`, error);
              toast({
                title: `Image ${i + 1} failed`,
                description: `Could not generate image ${i + 1} of ${numberOfImages}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                variant: "destructive",
              });
              resolve(null);
            }
          }, startDelay);
        });
      });
      
      // Wait for all images to complete (or fail)
      const results = await Promise.all(imagePromises);
      const generatedImagesArray = results.filter((img): img is GeneratedImage => img !== null);
      
      // Final success toast
      if (generatedImagesArray.length > 0) {
        if (numberOfImages === 1) {
          toast({
            title: "Image generated successfully!",
            description: "Your AI-generated image is ready.",
          });
        } else {
          toast({
            title: `Generated ${generatedImagesArray.length} images!`,
            description: `Successfully created ${generatedImagesArray.length} of ${numberOfImages} requested images.`,
          });
        }
      } else {
        throw new Error('No images were generated successfully');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.warn('Image generation failed:', errorMessage);
      
      let userFriendlyMessage = 'Please try again in a moment.';
      
      if (errorMessage.includes('Network error')) {
        userFriendlyMessage = 'Please check your internet connection and try again.';
      } else if (errorMessage.includes('timeout')) {
        userFriendlyMessage = 'The request took too long. Please try again.';
      } else if (errorMessage.includes('unavailable')) {
        userFriendlyMessage = 'The image generation service is temporarily unavailable.';
      }
      
      toast({
        title: "Generation failed",
        description: userFriendlyMessage,
        variant: "destructive",
      });
    } finally {
      isGeneratingRef.current = false;
      setIsGenerating(false);
    }
  };

  const clearInput = () => {
    setPrompt('');
  };

  const downloadImage = (imageUrl: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-${prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your image is being downloaded.",
    });
  };

  const regenerateImage = (image: GeneratedImage) => {
    if (isGeneratingRef.current) {
      toast({
        title: "Generation in progress",
        description: "Please wait for the current generation to complete.",
        variant: "destructive",
      });
      return;
    }
    
    // Set both prompt and negative prompt from the stored image
    setPrompt(image.prompt);
    if (image.negativePrompt) {
      setNegativePrompt(image.negativePrompt);
    } else {
      setNegativePrompt('');
    }
    
    generateImage(image.prompt);
  };

  const saveImage = async (image: GeneratedImage) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save images to your favorites.",
        variant: "destructive",
      });
      return;
    }

    // Check if image is already saved - prevent duplicate saves
    if (savedImages.has(image.id)) {
      toast({
        title: "Already saved",
        description: "This image is already in your favorites.",
        variant: "destructive",
      });
      return;
    }

    // Atomic check to prevent duplicate saves in progress
    if (savingRef.current.has(image.id)) {
      toast({
        title: "Save in progress",
        description: "This image is already being saved to your favorites.",
        variant: "destructive",
      });
      return;
    }

    // Mark as being saved atomically
    savingRef.current.add(image.id);
    setSavingImages(prev => {
      const newSet = new Set(prev);
      newSet.add(image.id);
      return newSet;
    });

    try {
      // Convert blob URL back to blob to get the base64 data URL
      const response = await fetch(image.url);
      const blob = await response.blob();
      const base64Data = await blobToBase64(blob);
      
      // Ensure it's a proper data URL
      if (!base64Data.startsWith('data:image/')) {
        throw new Error('Invalid image data format');
      }
      
      await apiRequest('POST', '/api/saved-images', {
        userId: user.uid,
        prompt: image.prompt,
        negativePrompt: image.negativePrompt,
        model: image.model,
        width: image.width,
        height: image.height,
        imageData: base64Data,
        artStyle: style,
        originalImageId: null // This is a generated image, not from community gallery
      });
      
      // Mark image as saved permanently
      setSavedImages(prev => {
        const newSet = new Set(prev);
        newSet.add(image.id);
        return newSet;
      });
      
      toast({
        title: "Image saved",
        description: "Image has been saved to your favorites!",
      });
    } catch (error) {
      console.error('Failed to save image:', error);
      toast({
        title: "Save failed",
        description: "Could not save image to favorites. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Ensure cleanup happens immediately and reliably
      savingRef.current.delete(image.id);
      setSavingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(image.id);
        return newSet;
      });
    }
  };

  const editImage = async (image: GeneratedImage) => {
    try {
      // Convert the image URL to a File object for editing
      const response = await fetch(image.url);
      const blob = await response.blob();
      const file = new File([blob], `generated-image-${image.id}.png`, { type: 'image/png' });
      
      // Convert the file to base64 for storage
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        
        // Store the image data temporarily in localStorage
        const imageForEdit = {
          file: {
            name: file.name,
            type: file.type,
            size: file.size,
            data: base64Data
          },
          originalPrompt: image.prompt,
          originalModel: image.model
        };
        
        localStorage.setItem('imageToEdit', JSON.stringify(imageForEdit));
        
        // Navigate to image-to-image page
        setLocation('/image-to-image');
        
        toast({
          title: "Redirecting to editor",
          description: "Opening image in the image-to-image editor...",
        });
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Failed to prepare image for editing:', error);
      toast({
        title: "Edit failed",
        description: "Could not prepare the image for editing. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteImage = (imageId: string) => {
    let imageToDelete: GeneratedImage | undefined;
    
    setGeneratedImages(prev => {
      imageToDelete = prev.find(img => img.id === imageId);
      return prev.filter(img => img.id !== imageId);
    });
    
    if (imageToDelete) {
      // Defer URL cleanup to avoid potential broken image flash
      setTimeout(() => {
        URL.revokeObjectURL(imageToDelete!.url);
        // Remove from our tracking array
        createdUrlsRef.current = createdUrlsRef.current.filter(url => url !== imageToDelete!.url);
      }, 0);
      
      toast({
        title: "Image deleted",
        description: "The generated image has been removed.",
      });
    }
  };

  const copyPrompt = () => {
    if (prompt.trim()) {
      navigator.clipboard.writeText(prompt);
      toast({
        title: "Copied to clipboard",
        description: "Your prompt has been copied to clipboard.",
      });
    }
  };

  const enhancePrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Enter a prompt first",
        description: "Please enter a basic prompt to enhance.",
        variant: "destructive",
      });
      return;
    }

    setIsEnhancing(true);
    
    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance prompt');
      }

      const data = await response.json();
      setPrompt(data.enhancedPrompt);
      
      toast({
        title: "Prompt enhanced!",
        description: "Your prompt has been improved with AI suggestions.",
      });
      
    } catch (error) {
      console.warn('Prompt enhancement failed:', error);
      toast({
        title: "Enhancement failed",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background p-4 relative">
      
      {/* Settings Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-card/95 backdrop-blur border-r border-border/50 z-50 transform transition-transform duration-300 ${settingsOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Settings</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSettingsOpen(false)}
              data-testid="button-close-settings"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Model Selection */}
            <div className="space-y-2">
              <Label htmlFor="model-select">Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger id="model-select" data-testid="select-model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flux-schnell">Flux-Schnell</SelectItem>
                  <SelectItem value="flux-real">Flux-Real</SelectItem>
                  <SelectItem value="flux">Flux (fast)</SelectItem>
                  <SelectItem value="turbo">Turbo</SelectItem>
                  <SelectItem value="image-4">Image-4</SelectItem>
                  <SelectItem value="image-4-ultra">Image-4 Ultra</SelectItem>
                  {customModels.length > 0 && (
                    <>
                      <SelectItem value="divider" disabled>---Custom Models---</SelectItem>
                      {customModels.map(model => (
                        <SelectItem key={model.id} value={`custom-${model.id}`}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!user?.uid) {
                    toast({
                      title: "Sign in required",
                      description: "Please sign in to add custom models.",
                      variant: "destructive",
                    });
                    return;
                  }
                  // Open Adsterra ad first
                  window.open('https://www.revenuecpmgate.com/bhww75bcue?key=1d9a547bb81b9ffacd93be046ec6b4bf', '_blank');
                  // Then open the custom model dialog
                  setShowCustomModelDialog(true);
                }}
                className="w-full mt-2 text-xs"
                data-testid="button-add-custom-model"
                title={!user?.uid ? "Sign in required to add custom models" : "Add a custom model"}
              >
                <Zap className="w-3 h-3 mr-1" />
                Add Custom Model
              </Button>
            </div>

            {/* Manage Custom Models */}
            {customModels.length > 0 && (
              <div className="space-y-2">
                <Label>Your Custom Models</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {customModels.map(model => (
                    <div key={model.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{model.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{model.apiUrl}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCustomModel(model.id)}
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        data-testid={`button-delete-model-${model.id}`}
                        title="Delete model"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <Label htmlFor="ratio-select">Aspect Ratio</Label>
              <Select value={aspectRatio} onValueChange={handleAspectRatioChange}>
                <SelectTrigger id="ratio-select" data-testid="select-ratio">
                  <SelectValue placeholder="Select ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">Square (1:1)</SelectItem>
                  <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
                  <SelectItem value="4:3">Landscape (4:3)</SelectItem>
                  <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              
              {aspectRatio === 'custom' && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Label htmlFor="custom-width" className="text-xs">Width</Label>
                    <Input
                      id="custom-width"
                      type="number"
                      placeholder="1024"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(e.target.value)}
                      min="256"
                      max="2048"
                      className="text-sm"
                      data-testid="input-custom-width"
                    />
                  </div>
                  <div>
                    <Label htmlFor="custom-height" className="text-xs">Height</Label>
                    <Input
                      id="custom-height"
                      type="number"
                      placeholder="1024"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(e.target.value)}
                      min="256"
                      max="2048"
                      className="text-sm"
                      data-testid="input-custom-height"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Place */}
            <div className="space-y-2">
              <Label htmlFor="place-select">Place/Location</Label>
              <Popover open={placeDropdownOpen} onOpenChange={setPlaceDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={placeDropdownOpen}
                    className="w-full justify-between"
                    data-testid="select-place"
                  >
                    {isCustomPlace && customPlace
                      ? `Custom: ${customPlace}`
                      : place
                      ? place.charAt(0).toUpperCase() + place.slice(1)
                      : "Select place..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search places..." />
                    <CommandEmpty>No place found.</CommandEmpty>
                    <CommandList className="max-h-60">
                      <CommandGroup>
                        <CommandItem
                          key="custom"
                          value="custom"
                          onSelect={() => {
                            // Open Adsterra ad in new tab when custom place is selected
                            // Using noopener and noreferrer for security to prevent reverse-tabnabbing
                            window.open('https://www.revenuecpmgate.com/bhww75bcue?key=1d9a547bb81b9ffacd93be046ec6b4bf', '_blank', 'noopener,noreferrer');
                            setIsCustomPlace(true);
                            setPlace('');
                            setPlaceDropdownOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              isCustomPlace ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          Custom Place
                        </CommandItem>
                        {places.map((placeOption) => (
                          <CommandItem
                            key={placeOption}
                            value={placeOption}
                            onSelect={(currentValue) => {
                              setPlace(currentValue === place ? "" : currentValue);
                              setIsCustomPlace(false);
                              setCustomPlace('');
                              setPlaceDropdownOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                place === placeOption && !isCustomPlace ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {placeOption.charAt(0).toUpperCase() + placeOption.slice(1)}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {isCustomPlace && (
                <Input
                  placeholder="Enter your custom place..."
                  value={customPlace}
                  onChange={(e) => setCustomPlace(e.target.value)}
                  data-testid="input-custom-place"
                  className="mt-2"
                />
              )}
              <p className="text-xs text-muted-foreground">
                Choose a location or setting for your image, or select "Custom Place" to enter your own
              </p>
            </div>

            {/* Style */}
            <div className="space-y-2">
              <Label htmlFor="style-select">Style</Label>
              <Popover open={styleDropdownOpen} onOpenChange={setStyleDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={styleDropdownOpen}
                    className="w-full justify-between"
                    data-testid="select-style"
                  >
                    {style
                      ? style.charAt(0).toUpperCase() + style.slice(1)
                      : "Select style..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search art styles..." />
                    <CommandEmpty>No art style found.</CommandEmpty>
                    <CommandList className="max-h-60">
                      <CommandGroup>
                        {allArtStyles.map((artStyle, index) => (
                          <CommandItem
                            key={`${artStyle}-${index}`}
                            value={artStyle}
                            onSelect={(currentValue) => {
                              setStyle(currentValue === style ? "" : currentValue);
                              setStyleDropdownOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                style === artStyle ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {artStyle.charAt(0).toUpperCase() + artStyle.slice(1)}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Choose from predefined or custom art styles
              </p>
            </div>

            {/* Custom Art Style Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Custom Art Style</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCustomStyleToggle}
                  data-testid="button-toggle-custom-style"
                  className="text-xs"
                >
                  {showCustomStyleInput ? "Cancel" : "Create New"}
                </Button>
              </div>

              {showCustomStyleInput && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter custom art style name (e.g., Discpretion for better learning art style)"
                      value={newCustomStyle}
                      onChange={(e) => setNewCustomStyle(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomArtStyle()}
                      className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      data-testid="input-custom-style"
                    />
                    <Button
                      onClick={addCustomArtStyle}
                      size="sm"
                      disabled={!newCustomStyle.trim()}
                      data-testid="button-add-custom-style"
                    >
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Create your own art style name to help with learning and organization
                  </p>
                </div>
              )}

              {customArtStyles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Your Custom Styles:</Label>
                  <div className="flex flex-wrap gap-1">
                    {customArtStyles.map((customStyle) => (
                      <div
                        key={customStyle}
                        className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-xs"
                      >
                        <span 
                          className="cursor-pointer hover:text-primary"
                          onClick={() => setStyle(customStyle)}
                          data-testid={`custom-style-${customStyle}`}
                        >
                          {customStyle.charAt(0).toUpperCase() + customStyle.slice(1)}
                        </span>
                        <button
                          onClick={() => removeCustomArtStyle(customStyle)}
                          className="text-muted-foreground hover:text-destructive ml-1"
                          data-testid={`remove-custom-style-${customStyle}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Effects */}
            <div className="space-y-2">
              <Label htmlFor="effect-select">Effects</Label>
              <Popover open={effectDropdownOpen} onOpenChange={setEffectDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={effectDropdownOpen}
                    className="w-full justify-between"
                    data-testid="select-effect"
                  >
                    {effect
                      ? effect.charAt(0).toUpperCase() + effect.slice(1)
                      : "Select effect..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search effects..." />
                    <CommandEmpty>No effect found.</CommandEmpty>
                    <CommandList className="max-h-60">
                      <CommandGroup>
                        <CommandItem
                          key="none"
                          value="none"
                          onSelect={() => {
                            setEffect('');
                            setEffectDropdownOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              effect === '' ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          None
                        </CommandItem>
                        {effects.map((effectOption, index) => (
                          <CommandItem
                            key={`${effectOption}-${index}`}
                            value={effectOption}
                            onSelect={(currentValue) => {
                              setEffect(currentValue === effect ? "" : currentValue);
                              setEffectDropdownOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                effect === effectOption ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {effectOption.charAt(0).toUpperCase() + effectOption.slice(1)}
                          </CommandItem>
                        ))}
                        {databaseCustomEffects.map((customEffect) => (
                          <CommandItem
                            key={customEffect.id}
                            value={customEffect.name}
                            onSelect={(currentValue) => {
                              setEffect(currentValue === effect ? "" : currentValue);
                              setEffectDropdownOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                effect === customEffect.name ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
                            {customEffect.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {user && (
                <Button
                  variant="outline"
                  onClick={() => {
                    window.open('https://www.revenuecpmgate.com/bhww75bcue?key=1d9a547bb81b9ffacd93be046ec6b4bf', '_blank', 'noopener,noreferrer');
                    setShowCustomEffectDialog(true);
                  }}
                  className="w-full"
                  data-testid="button-create-custom-effect"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create Custom Effect
                </Button>
              )}
              <p className="text-xs text-muted-foreground">
                Apply visual effects to enhance your generated image (900+ effects available)
              </p>
            </div>

            {/* Background */}
            <div className="space-y-2">
              <Label htmlFor="background-select">Select Background</Label>
              <Popover open={backgroundDropdownOpen} onOpenChange={setBackgroundDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={backgroundDropdownOpen}
                    className="w-full justify-between"
                    data-testid="select-background"
                  >
                    {isCustomBackground && customBackground
                      ? `Custom: ${customBackground}`
                      : background
                      ? background.charAt(0).toUpperCase() + background.slice(1)
                      : "Select background..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search backgrounds..." />
                    <CommandEmpty>No background found.</CommandEmpty>
                    <CommandList className="max-h-60">
                      <CommandGroup>
                        <CommandItem
                          key="custom"
                          value="custom"
                          onSelect={() => {
                            window.open('https://www.revenuecpmgate.com/bhww75bcue?key=1d9a547bb81b9ffacd93be046ec6b4bf', '_blank');
                            setIsCustomBackground(true);
                            setBackground('');
                            setBackgroundDropdownOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              isCustomBackground ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          Custom Background
                        </CommandItem>
                        <CommandItem
                          key="none"
                          value="none"
                          onSelect={() => {
                            setBackground('');
                            setIsCustomBackground(false);
                            setCustomBackground('');
                            setBackgroundDropdownOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              background === '' && !isCustomBackground ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          None
                        </CommandItem>
                        {backgrounds.map((backgroundOption, index) => (
                          <CommandItem
                            key={`${backgroundOption}-${index}`}
                            value={backgroundOption}
                            onSelect={(currentValue) => {
                              setBackground(currentValue === background ? "" : currentValue);
                              setIsCustomBackground(false);
                              setCustomBackground('');
                              setBackgroundDropdownOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                background === backgroundOption && !isCustomBackground ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {backgroundOption.charAt(0).toUpperCase() + backgroundOption.slice(1)}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {isCustomBackground && (
                <Input
                  placeholder="Enter your custom background..."
                  value={customBackground}
                  onChange={(e) => setCustomBackground(e.target.value)}
                  data-testid="input-custom-background"
                  className="mt-2"
                />
              )}
              <p className="text-xs text-muted-foreground">
                Choose from 500+ background options or select "Custom Background" to enter your own
              </p>
            </div>

            {/* Sky */}
            <div className="space-y-2">
              <Label htmlFor="sky-select">Choose Sky</Label>
              <Popover open={skyDropdownOpen} onOpenChange={setSkyDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={skyDropdownOpen}
                    className="w-full justify-between"
                    data-testid="select-sky"
                  >
                    {isCustomSky && customSky
                      ? `Custom: ${customSky}`
                      : sky
                      ? sky.charAt(0).toUpperCase() + sky.slice(1)
                      : "Select sky..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search sky options..." />
                    <CommandEmpty>No sky found.</CommandEmpty>
                    <CommandList className="max-h-60">
                      <CommandGroup>
                        <CommandItem
                          key="custom"
                          value="custom"
                          onSelect={() => {
                            window.open('https://www.revenuecpmgate.com/bhww75bcue?key=1d9a547bb81b9ffacd93be046ec6b4bf', '_blank');
                            setIsCustomSky(true);
                            setSky('');
                            setSkyDropdownOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              isCustomSky ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          Custom Sky
                        </CommandItem>
                        <CommandItem
                          key="none"
                          value="none"
                          onSelect={() => {
                            setSky('');
                            setIsCustomSky(false);
                            setCustomSky('');
                            setSkyDropdownOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              sky === '' && !isCustomSky ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          None
                        </CommandItem>
                        {skies.map((skyOption, index) => (
                          <CommandItem
                            key={`${skyOption}-${index}`}
                            value={skyOption}
                            onSelect={(currentValue) => {
                              setSky(currentValue === sky ? "" : currentValue);
                              setIsCustomSky(false);
                              setCustomSky('');
                              setSkyDropdownOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                sky === skyOption && !isCustomSky ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {skyOption.charAt(0).toUpperCase() + skyOption.slice(1)}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {isCustomSky && (
                <Input
                  placeholder="Enter your custom sky..."
                  value={customSky}
                  onChange={(e) => setCustomSky(e.target.value)}
                  data-testid="input-custom-sky"
                  className="mt-2"
                />
              )}
              <p className="text-xs text-muted-foreground">
                Choose from 700+ sky options to set the atmosphere for your image
              </p>
            </div>

            {/* Weather */}
            <div className="space-y-2">
              <Label htmlFor="weather-select">Choose Weather</Label>
              <Popover open={weatherDropdownOpen} onOpenChange={setWeatherDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={weatherDropdownOpen}
                    className="w-full justify-between"
                    data-testid="select-weather"
                  >
                    {isCustomWeather && customWeather
                      ? `Custom: ${customWeather}`
                      : weather
                      ? weather.charAt(0).toUpperCase() + weather.slice(1)
                      : "Select weather..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search weather conditions..." />
                    <CommandEmpty>No weather condition found.</CommandEmpty>
                    <CommandList className="max-h-60">
                      <CommandGroup>
                        <CommandItem
                          key="custom"
                          value="custom"
                          onSelect={() => {
                            setIsCustomWeather(true);
                            setWeather('');
                            setWeatherDropdownOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              isCustomWeather ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          Custom Weather
                        </CommandItem>
                        <CommandItem
                          key="none"
                          value="none"
                          onSelect={() => {
                            setWeather('');
                            setIsCustomWeather(false);
                            setCustomWeather('');
                            setWeatherDropdownOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              weather === '' && !isCustomWeather ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          None
                        </CommandItem>
                        {weathers.map((weatherOption, index) => (
                          <CommandItem
                            key={`${weatherOption}-${index}`}
                            value={weatherOption}
                            onSelect={(currentValue) => {
                              setWeather(currentValue === weather ? "" : currentValue);
                              setIsCustomWeather(false);
                              setCustomWeather('');
                              setWeatherDropdownOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                weather === weatherOption && !isCustomWeather ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {weatherOption.charAt(0).toUpperCase() + weatherOption.slice(1)}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {isCustomWeather && (
                <Input
                  placeholder="Enter your custom weather condition..."
                  value={customWeather}
                  onChange={(e) => setCustomWeather(e.target.value)}
                  data-testid="input-custom-weather"
                  className="mt-2"
                />
              )}
              <p className="text-xs text-muted-foreground">
                Select from 1100+ weather conditions or create your own custom weather condition
              </p>
            </div>

            {/* Expression */}
            <div className="space-y-2">
              <Label htmlFor="expression-select">Choose Expression</Label>
              <Popover open={expressionDropdownOpen} onOpenChange={setExpressionDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={expressionDropdownOpen}
                    className="w-full justify-between"
                    data-testid="select-expression"
                  >
                    {isCustomExpression && customExpression
                      ? `Custom: ${customExpression}`
                      : expression
                      ? expression.charAt(0).toUpperCase() + expression.slice(1)
                      : "Select expression..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search expressions..." />
                    <CommandEmpty>No expression found.</CommandEmpty>
                    <CommandList className="max-h-60">
                      <CommandGroup>
                        <CommandItem
                          key="custom"
                          value="custom"
                          onSelect={() => {
                            setIsCustomExpression(true);
                            setExpression('');
                            setExpressionDropdownOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              isCustomExpression ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          Custom Expression
                        </CommandItem>
                        <CommandItem
                          key="none"
                          value="none"
                          onSelect={() => {
                            setExpression('');
                            setIsCustomExpression(false);
                            setCustomExpression('');
                            setExpressionDropdownOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              expression === '' && !isCustomExpression ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          None
                        </CommandItem>
                        {expressions.map((expressionOption, index) => (
                          <CommandItem
                            key={`${expressionOption}-${index}`}
                            value={expressionOption}
                            onSelect={(currentValue) => {
                              setExpression(currentValue === expression ? "" : currentValue);
                              setIsCustomExpression(false);
                              setCustomExpression('');
                              setExpressionDropdownOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                expression === expressionOption && !isCustomExpression ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {expressionOption.charAt(0).toUpperCase() + expressionOption.slice(1)}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {isCustomExpression && (
                <Input
                  placeholder="Enter your custom expression..."
                  value={customExpression}
                  onChange={(e) => setCustomExpression(e.target.value)}
                  data-testid="input-custom-expression"
                  className="mt-2"
                />
              )}
              <p className="text-xs text-muted-foreground">
                Choose from 500+ expression options to set the mood and emotion
              </p>
            </div>

            {/* Negative Prompt */}
            <div className="space-y-2">
              <Label htmlFor="negative-prompt">Negative Prompt</Label>
              <Textarea
                id="negative-prompt"
                placeholder="Enter what you don't want in the image (e.g., blurry, low quality, text)"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                className="min-h-[80px] resize-none"
                data-testid="textarea-negative-prompt"
              />
              <p className="text-xs text-muted-foreground">
                Describe elements you want to avoid in the generated image
              </p>
            </div>

            {/* Number of Images */}
            <div className="space-y-2">
              <Label htmlFor="images-select">Number of Images</Label>
              <Select 
                value={isCustomNumber ? "custom" : numberOfImages.toString()} 
                onValueChange={(value) => {
                  if (value === "custom") {
                    setIsCustomNumber(true);
                    setNumberOfImages(parseInt(customNumberOfImages) || 1);
                  } else {
                    setIsCustomNumber(false);
                    setNumberOfImages(parseInt(value));
                  }
                }}
              >
                <SelectTrigger id="images-select" data-testid="select-images">
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  <SelectItem value="1">1 Image</SelectItem>
                  <SelectItem value="2">2 Images</SelectItem>
                  <SelectItem value="3">3 Images</SelectItem>
                  <SelectItem value="4">4 Images</SelectItem>
                  <SelectItem value="8">8 Images</SelectItem>
                  <SelectItem value="10">10 Images</SelectItem>
                  <SelectItem value="12">12 Images</SelectItem>
                  <SelectItem value="14">14 Images</SelectItem>
                  <SelectItem value="18">18 Images</SelectItem>
                  <SelectItem value="20">20 Images</SelectItem>
                  <SelectItem value="100">100 Images</SelectItem>
                  <SelectItem value="200">200 Images</SelectItem>
                  <SelectItem value="300">300 Images</SelectItem>
                  <SelectItem value="400">400 Images</SelectItem>
                  <SelectItem value="500">500 Images</SelectItem>
                  <SelectItem value="600">600 Images</SelectItem>
                  <SelectItem value="700">700 Images</SelectItem>
                  <SelectItem value="800">800 Images</SelectItem>
                  <SelectItem value="900">900 Images</SelectItem>
                  <SelectItem value="1000">1000 Images</SelectItem>
                  <SelectItem value="1100">1100 Images</SelectItem>
                  <SelectItem value="1200">1200 Images</SelectItem>
                  <SelectItem value="1300">1300 Images</SelectItem>
                  <SelectItem value="1400">1400 Images</SelectItem>
                  <SelectItem value="1500">1500 Images</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              
              {isCustomNumber && (
                <div className="mt-2">
                  <Input
                    type="number"
                    placeholder="Enter custom number (1-2000)"
                    value={customNumberOfImages}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCustomNumberOfImages(value);
                      const numValue = parseInt(value);
                      if (!isNaN(numValue) && numValue > 0) {
                        setNumberOfImages(Math.min(Math.max(numValue, 1), 2000));
                      }
                    }}
                    min="1"
                    max="2000"
                    className="text-sm"
                    data-testid="input-custom-number"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter any number between 1 and 2000 images
                  </p>
                </div>
              )}
            </div>

            {/* Share to Community */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="share-to-gallery"
                  checked={shareToGallery}
                  onCheckedChange={setShareToGallery}
                  data-testid="switch-share-gallery"
                />
                <Label htmlFor="share-to-gallery">Share to Community Gallery</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                When enabled, your generated images will be visible to all users in the community gallery.
              </p>
            </div>

            {/* Seed */}
            <div className="space-y-3">
              <Label>Seed</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={useRandomSeed}
                  onCheckedChange={setUseRandomSeed}
                  id="random-seed-toggle"
                  data-testid="switch-random-seed"
                />
                <Label htmlFor="random-seed-toggle" className="text-sm">
                  Random seed
                </Label>
              </div>
              
              {!useRandomSeed && (
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Enter seed number"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    className="flex-1"
                    min="0"
                    max="999999999"
                    data-testid="input-seed"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSeed(Math.floor(Math.random() * 1000000).toString())}
                    data-testid="button-generate-seed"
                    title="Generate random seed"
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                {useRandomSeed ? 'A random seed will be used for each generation' : 'Use the same seed to reproduce similar results'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {settingsOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setSettingsOpen(false)}
        />
      )}

      <div className="max-w-4xl mx-auto">
        
        {/* Top Section */}
        <div className="mb-8">
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-fit grid-cols-2 bg-muted/50">
              <TabsTrigger 
                value="image" 
                className="data-[state=active]:bg-[#8a3dff] data-[state=active]:text-white"
                data-testid="tab-image"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Image
              </TabsTrigger>
              <TabsTrigger 
                value="video" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                data-testid="tab-video"
              >
                <Video className="w-4 h-4 mr-2" />
                Video
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="image" className="mt-8">
              {/* Input Section */}
              <Card className="bg-card/50 backdrop-blur border-border/50 mb-8">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <Textarea
                        placeholder="Describe the piece you want to create..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[120px] bg-background/50 border-border/50 focus:border-primary/50 resize-none text-lg pr-12"
                        disabled={isGenerating}
                        data-testid="input-prompt"
                      />
                      
                      {/* Mini Enhance Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={enhancePrompt}
                        disabled={isEnhancing || !prompt.trim()}
                        className="absolute right-2 top-2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        data-testid="button-enhance-mini"
                        title="Enhance prompt with AI"
                      >
                        {isEnhancing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSettingsOpen(true)}
                          className="text-muted-foreground hover:text-foreground"
                          data-testid="button-settings"
                          title="Open settings"
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          Settings
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyPrompt}
                          disabled={!prompt.trim()}
                          className="text-muted-foreground hover:text-foreground"
                          data-testid="button-copy"
                          title="Copy prompt to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => generateImage()}
                          disabled={isGenerating || !prompt.trim()}
                          className="bg-[#8a3dff] hover:bg-[#7c36e6] text-white px-6"
                          data-testid="button-generate"
                        >
                          {isGenerating ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4 mr-2" />
                          )}
                          {isGenerating ? 'Generating...' : 'Generate'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generated Images Section */}
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-6">
                  {generatedImages.length === 0 && !isGenerating && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="relative mb-6">
                        <div className="w-24 h-24 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#8a3dff] rounded-full flex items-center justify-center">
                          <Send className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">
                        Click the Generate button to start creating
                      </h3>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-24 h-24 bg-primary/10 rounded-lg mb-6 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Creating your image...</h3>
                      <p className="text-muted-foreground">This may take a few moments</p>
                    </div>
                  )}

                  {generatedImages.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Generated Images</h3>
                        <span className="text-sm text-muted-foreground">
                          {generatedImages.length} image{generatedImages.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {generatedImages.map((image) => (
                          <div key={image.id} className="group" data-testid={`image-${image.id}`}>
                            <div 
                              className="relative overflow-hidden rounded-lg bg-muted/50 mb-3"
                              style={{ aspectRatio: `${image.width} / ${image.height}` }}
                            >
                              <img
                                src={image.url}
                                alt={`Generated: ${image.prompt}`}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              
                              {/* Delete Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteImage(image.id);
                                }}
                                className="absolute top-2 right-2 h-8 w-8 p-0 bg-red-500/80 hover:bg-red-600 text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                                data-testid={`button-delete-${image.id}`}
                                title="Delete image"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                              
                              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex flex-col gap-2">
                                  <p className="text-white text-xs font-medium line-clamp-1 mb-1">
                                    {image.prompt}
                                  </p>
                                  <div className="flex gap-2 flex-wrap">
                                    {/* Download Button */}
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        downloadImage(image.url, image.prompt);
                                      }}
                                      className="h-7 px-2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                                      data-testid={`button-download-${image.id}`}
                                      title="Download image"
                                    >
                                      <Download className="w-3 h-3 mr-1" />
                                      Download
                                    </Button>
                                    
                                    {/* Regenerate Button */}
                                    <Button
                                      variant="secondary" 
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        regenerateImage(image);
                                      }}
                                      className="h-7 px-2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                                      data-testid={`button-regenerate-${image.id}`}
                                      title="Regenerate image"
                                    >
                                      <RefreshCw className="w-3 h-3 mr-1" />
                                      Regenerate
                                    </Button>
                                    
                                    {/* Save Button */}
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        saveImage(image);
                                      }}
                                      disabled={savingImages.has(image.id) || savedImages.has(image.id)}
                                      className="h-7 px-2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm disabled:opacity-50"
                                      data-testid={`button-save-${image.id}`}
                                      title={
                                        savingImages.has(image.id) 
                                          ? "Saving to favorites..." 
                                          : savedImages.has(image.id) 
                                            ? "Already saved to favorites" 
                                            : "Save to favorites"
                                      }
                                    >
                                      {savingImages.has(image.id) ? (
                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                      ) : savedImages.has(image.id) ? (
                                        <Check className="w-3 h-3 mr-1" />
                                      ) : (
                                        <Save className="w-3 h-3 mr-1" />
                                      )}
                                      {savingImages.has(image.id) 
                                        ? 'Saving...' 
                                        : savedImages.has(image.id) 
                                          ? 'Saved' 
                                          : 'Save'}
                                    </Button>
                                    
                                    {/* Edit Button */}
                                    <Button
                                      variant="secondary"
                                      size="sm" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        editImage(image);
                                      }}
                                      className="h-7 px-2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                                      data-testid={`button-edit-${image.id}`}
                                      title="Edit image in image-to-image editor"
                                    >
                                      <Edit className="w-3 h-3 mr-1" />
                                      Edit
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-2 text-xs text-muted-foreground">
                              Generated: {image.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="video" className="mt-8">
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-24 h-24 bg-muted/50 rounded-lg mb-6 flex items-center justify-center">
                      <Video className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      Video generation coming soon
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Stay tuned for AI video generation features
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Custom Art Style Information Popup */}
      <Dialog open={showStyleInfoPopup} onOpenChange={setShowStyleInfoPopup}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Define Your Art Style</DialogTitle>
            <DialogDescription>
              Help us understand "{currentStyleBeingDefined}" by providing additional details that will enhance your art style.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="style-description">Description</Label>
              <Textarea
                id="style-description"
                placeholder="Describe what makes this art style unique..."
                value={styleDescription}
                onChange={(e) => setStyleDescription(e.target.value)}
                className="min-h-[60px] resize-none"
                data-testid="textarea-style-description"
              />
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <Label htmlFor="style-keywords">Keywords</Label>
              <Input
                id="style-keywords"
                placeholder="e.g., vibrant, detailed, learning-focused, educational"
                value={styleKeywords}
                onChange={(e) => setStyleKeywords(e.target.value)}
                data-testid="input-style-keywords"
              />
            </div>

            {/* Inspiration */}
            <div className="space-y-2">
              <Label htmlFor="style-inspiration">Inspiration</Label>
              <Input
                id="style-inspiration"
                placeholder="What inspired this style? Artists, movements, concepts..."
                value={styleInspiration}
                onChange={(e) => setStyleInspiration(e.target.value)}
                data-testid="input-style-inspiration"
              />
            </div>

            {/* Characteristics */}
            <div className="space-y-2">
              <Label htmlFor="style-characteristics">Key Characteristics</Label>
              <Textarea
                id="style-characteristics"
                placeholder="Colors, techniques, mood, or specific elements..."
                value={styleCharacteristics}
                onChange={(e) => setStyleCharacteristics(e.target.value)}
                className="min-h-[60px] resize-none"
                data-testid="textarea-style-characteristics"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowStyleInfoPopup(false);
                  setCurrentStyleBeingDefined('');
                  setStyleDescription('');
                  setStyleKeywords('');
                  setStyleInspiration('');
                  setStyleCharacteristics('');
                }}
                className="flex-1"
                data-testid="button-cancel-style-info"
              >
                Cancel
              </Button>
              <Button
                onClick={saveCustomArtStyleWithInfo}
                className="flex-1"
                data-testid="button-save-style-info"
              >
                Create Style
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Model Dialog */}
      <Dialog open={showCustomModelDialog} onOpenChange={setShowCustomModelDialog}>
        <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Custom Model</DialogTitle>
            <DialogDescription>
              Add a Hugging Face model or your own custom API endpoint.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4 flex-1 min-h-0 overflow-y-auto pr-2">
            {/* Model Type Selector */}
            <div className="space-y-2">
              <Label htmlFor="model-type">Model Type *</Label>
              <Select value={customModelType} onValueChange={(value: 'huggingface') => setCustomModelType(value)}>
                <SelectTrigger id="model-type" data-testid="select-model-type">
                  <SelectValue placeholder="Select model type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="huggingface">Hugging Face Model</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Use models from Hugging Face Inference API
              </p>
            </div>

            {/* Model Name */}
            <div className="space-y-2">
              <Label htmlFor="model-name">Model Name *</Label>
              <Input
                id="model-name"
                placeholder="e.g., FLUX.1 Schnell"
                value={customModelName}
                onChange={(e) => setCustomModelName(e.target.value)}
                data-testid="input-model-name"
              />
            </div>

            {/* Model ID / API URL */}
            <div className="space-y-2">
              <Label htmlFor="model-url">
                Model ID *
              </Label>
              <Input
                id="model-url"
                placeholder="black-forest-labs/FLUX.1-schnell"
                value={customModelUrl}
                onChange={(e) => setCustomModelUrl(e.target.value)}
                data-testid="input-model-url"
              />
              <p className="text-xs text-muted-foreground">
                The Hugging Face model identifier (e.g., black-forest-labs/FLUX.1-dev)
              </p>
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <Label htmlFor="model-api-key">
                API Key (Optional)
              </Label>
              <Input
                id="model-api-key"
                type="password"
                placeholder="hf_..."
                value={customModelApiKey}
                onChange={(e) => setCustomModelApiKey(e.target.value)}
                data-testid="input-model-api-key"
              />
              <p className="text-xs text-muted-foreground">
                Optional: Hugging Face API token for authentication
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCustomModelDialog(false);
                  setCustomModelType('huggingface');
                  setCustomModelName('');
                  setCustomModelUrl('');
                  setCustomModelApiKey('');
                }}
                className="flex-1"
                data-testid="button-cancel-custom-model"
              >
                Cancel
              </Button>
              <Button
                onClick={saveCustomModel}
                disabled={isSavingCustomModel}
                className="flex-1"
                data-testid="button-save-custom-model"
              >
                {isSavingCustomModel ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Add Model'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Effect Dialog */}
      <Dialog open={showCustomEffectDialog} onOpenChange={setShowCustomEffectDialog}>
        <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Create Custom Effect</DialogTitle>
            <DialogDescription>
              Define a custom visual effect with detailed information for better image generation results.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4 flex-1 min-h-0 overflow-y-auto pr-2">
            {/* Effect Name */}
            <div className="space-y-2">
              <Label htmlFor="effect-name">Effect Name *</Label>
              <Input
                id="effect-name"
                placeholder="e.g., Ethereal Glow, Vintage Film"
                value={customEffectName}
                onChange={(e) => setCustomEffectName(e.target.value)}
                data-testid="input-effect-name"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="effect-description">Description</Label>
              <Textarea
                id="effect-description"
                placeholder="Describe the overall appearance and mood of this effect..."
                value={customEffectDescription}
                onChange={(e) => setCustomEffectDescription(e.target.value)}
                className="min-h-[60px] resize-none"
                data-testid="textarea-effect-description"
              />
            </div>

            {/* Visual Impact */}
            <div className="space-y-2">
              <Label htmlFor="effect-visual-impact">Visual Impact</Label>
              <Textarea
                id="effect-visual-impact"
                placeholder="Describe how this effect changes colors, lighting, textures, etc..."
                value={customEffectVisualImpact}
                onChange={(e) => setCustomEffectVisualImpact(e.target.value)}
                className="min-h-[60px] resize-none"
                data-testid="textarea-effect-visual-impact"
              />
            </div>

            {/* Technical Details */}
            <div className="space-y-2">
              <Label htmlFor="effect-technical-details">Technical Details</Label>
              <Textarea
                id="effect-technical-details"
                placeholder="Technical aspects like blur, grain, distortion levels, filters..."
                value={customEffectTechnicalDetails}
                onChange={(e) => setCustomEffectTechnicalDetails(e.target.value)}
                className="min-h-[60px] resize-none"
                data-testid="textarea-effect-technical-details"
              />
            </div>

            {/* Use Cases */}
            <div className="space-y-2">
              <Label htmlFor="effect-use-cases">Use Cases</Label>
              <Textarea
                id="effect-use-cases"
                placeholder="When to use this effect: portraits, landscapes, product photos..."
                value={customEffectUseCases}
                onChange={(e) => setCustomEffectUseCases(e.target.value)}
                className="min-h-[60px] resize-none"
                data-testid="textarea-effect-use-cases"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCustomEffectDialog(false);
                  setCustomEffectName('');
                  setCustomEffectDescription('');
                  setCustomEffectVisualImpact('');
                  setCustomEffectTechnicalDetails('');
                  setCustomEffectUseCases('');
                }}
                className="flex-1"
                data-testid="button-cancel-custom-effect"
              >
                Cancel
              </Button>
              <Button
                onClick={saveCustomEffect}
                disabled={isSavingCustomEffect}
                className="flex-1"
                data-testid="button-save-custom-effect"
              >
                {isSavingCustomEffect ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Effect'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TextToImageGenerator;