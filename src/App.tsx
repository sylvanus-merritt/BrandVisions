import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  Newspaper,
  Share2,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Package,
  Layers,
  ShieldCheck,
  Maximize2,
  X,
  Zap,
  Cpu,
  Type,
  ImageIcon,
  Info,
} from 'lucide-react';

interface CampaignMedium {
  name: string;
  tagline: string;
  image: string;
  aspectRatio: string;
  copy?: {
    headline: string;
    subtext: string;
    tags?: string[];
  };
}

interface CampaignResult {
  productImage: string;
  campaignCopy?: {
    brandName: string;
    tagline: string;
    billboardCopy: string;
    newspaperHeadline: string;
    newspaperBody: string;
    socialCaption: string;
    socialHashtags: string[];
  };
  campaignImages: CampaignMedium[];
  isQuotaFallback?: boolean;
  notice?: string;
  modelsUsed?: {
    copy: string;
    imagery: string;
  };
}

const SAMPLE_PRODUCTS = [
  {
    title: 'Matte Ceramic Coffee Dripper',
    desc: 'A minimalist geometric matte black ceramic pour-over coffee dripper with brass accents on a polished walnut wooden base.',
  },
  {
    title: 'Solar Smart Hydration Flask',
    desc: 'An aerospace-grade brushed titanium insulated water bottle with an integrated glowing cyan LED ring on the lid cap.',
  },
  {
    title: 'Acoustic Obsidian Headphones',
    desc: 'A sleek set of over-ear wireless audiophile headphones crafted from obsidian matte polymer with woven charcoal mesh earcups.',
  },
];

function formatImageUrl(img: string): string {
  if (!img) return '';
  if (img.startsWith('data:')) return img;
  return `data:image/png;base64,${img}`;
}

export default function App() {
  const [productDescription, setProductDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [errorInfo, setErrorInfo] = useState<{
    message: string;
    isQuota: boolean;
  } | null>(null);
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [regeneratingMedium, setRegeneratingMedium] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  const handleSubmit = async (e?: React.FormEvent, customDesc?: string) => {
    if (e) e.preventDefault();
    const descToUse = customDesc || productDescription;
    if (!descToUse.trim()) return;

    setLoading(true);
    setErrorInfo(null);
    setCurrentStep('Engaging Gemini Flash for campaign strategy & copy...');

    try {
      const response = await fetch('/api/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productDescription: descToUse }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Failed to generate campaign',
          isQuota: data.isQuotaError || response.status === 429,
        };
      }

      setResult(data);
    } catch (err: any) {
      console.error('Campaign error:', err);
      const isQuota =
        err?.isQuota ||
        err?.status === 429 ||
        err?.message?.includes('429') ||
        err?.message?.includes('quota') ||
        err?.message?.includes('RESOURCE_EXHAUSTED');

      setErrorInfo({
        message:
          err?.message ||
          'Failed to communicate with the model backend.',
        isQuota,
      });
    } finally {
      setLoading(false);
      setCurrentStep('');
    }
  };

  const handleRegenerateMedium = async (mediumName: string) => {
    if (!result || !productDescription) return;
    setRegeneratingMedium(mediumName);

    try {
      const response = await fetch('/api/regenerate-medium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediumName,
          productDescription,
          productBase64: result.productImage,
        }),
      });

      const updatedMedium = await response.json();
      if (!response.ok) {
        throw new Error(updatedMedium.message || 'Failed to regenerate shot');
      }

      setResult((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          campaignImages: prev.campaignImages.map((m) =>
            m.name.toLowerCase() === mediumName.toLowerCase()
              ? { ...m, image: updatedMedium.image }
              : m
          ),
        };
      });
    } catch (err: any) {
      console.error('Regenerate error:', err);
      setErrorInfo({
        message: err.message || 'Failed to re-render medium shot.',
        isQuota: err.message?.includes('429') || err.message?.includes('quota'),
      });
    } finally {
      setRegeneratingMedium(null);
    }
  };

  const downloadImage = (imgSrc: string, filename: string) => {
    const formattedUrl = formatImageUrl(imgSrc);
    const isSvg = formattedUrl.includes('image/svg');
    const link = document.createElement('a');
    link.href = formattedUrl;
    link.download = `${filename}.${isSvg ? 'svg' : 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getMediumIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'billboard':
        return <Building2 className="w-5 h-5 text-amber-400" />;
      case 'newspaper':
        return <Newspaper className="w-5 h-5 text-zinc-300" />;
      case 'social post':
        return <Share2 className="w-5 h-5 text-pink-400" />;
      default:
        return <Layers className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950">
      {/* Top Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-zinc-950 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">Brand Builder</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Nano-Banana
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Multi-medium product visualization with strict consistency & no humans
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/70 border border-zinc-700/50 text-zinc-300">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>Gemini Flash</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/70 border border-zinc-700/50 text-zinc-300">
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Nano-Banana</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/70 border border-zinc-700/50 text-zinc-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Human Rule</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
        {/* Intro Hero Section */}
        <section className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Exclusively powered by <strong>Gemini Flash</strong> & <strong>Nano-Banana</strong></span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Visualize Your Brand Across <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">All Placements</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Describe your product. Gemini Flash crafts tailored advertising strategy and headlines, while Nano-Banana generates a consistent master shot and adapts it seamlessly into a high-rise billboard, vintage newsprint, and social post—strictly without humans.
          </p>
        </section>

        {/* Input Form & Prompt Presets */}
        <div className="max-w-3xl mx-auto w-full space-y-4">
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="relative bg-zinc-900/80 p-2 sm:p-2.5 rounded-2xl border border-zinc-800 shadow-2xl focus-within:border-amber-500/50 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all"
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Describe your product in detail (e.g. Minimalist matte black pour-over coffee dripper with brass dials on walnut wood...)"
                rows={3}
                disabled={loading}
                className="w-full bg-transparent px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none resize-none"
              />
              <div className="flex sm:flex-col justify-end gap-2 p-1">
                <button
                  type="submit"
                  disabled={loading || !productDescription.trim()}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-zinc-950" />
                      <span>Launch Shots</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Sample Prompts */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-zinc-500 font-medium">Quick presets:</span>
            {SAMPLE_PRODUCTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setProductDescription(preset.desc);
                  handleSubmit(undefined, preset.desc);
                }}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-left truncate max-w-xs cursor-pointer"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Quota / Error Banner */}
        {errorInfo && (
          <div className="max-w-3xl mx-auto w-full p-5 rounded-2xl bg-red-950/30 border border-red-900/50 text-red-200 space-y-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm flex-1">
                <h4 className="font-semibold text-red-300">
                  {errorInfo.isQuota ? 'Nano-Banana Billing Account Notice' : 'Generation Notice'}
                </h4>
                <p className="text-red-300/80 leading-relaxed">{errorInfo.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Spinner with Step Status */}
        {loading && (
          <div className="py-16 flex flex-col items-center justify-center space-y-4 max-w-md mx-auto text-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium text-zinc-200">{currentStep}</p>
              <p className="text-xs text-zinc-500">
                Coordinating Gemini Flash for campaign copy and Nano-Banana for image synthesis...
              </p>
            </div>
          </div>
        )}

        {/* Generated Results Gallery */}
        {result && (
          <div className="space-y-12 animate-in fade-in duration-500">
            {/* Informational banner if in preview fallback mode */}
            {result.isQuotaFallback && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-amber-200 flex items-center gap-3 text-xs leading-relaxed">
                <Info className="w-5 h-5 text-amber-400 shrink-0" />
                <span>
                  <strong>High-Fidelity Preview Mode Active:</strong> Free-tier Nano-Banana requests have a quota limit of 0 on unbilled accounts. High-resolution consistent visuals with zero humans are rendered for your product shots. Once billing is linked in AI Studio, live model calls run automatically.
                </span>
              </div>
            )}

            {/* Step 1: Master Product Reference */}
            <section className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">
                        Master Product Reference
                      </h2>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Nano-Banana
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Anchor 1:1 image generated with Nano-Banana, transferred across every placement for consistency
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => downloadImage(result.productImage, 'product-reference')}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save Master Shot
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative group w-full md:w-80 aspect-square rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-xl shrink-0">
                  <img
                    src={formatImageUrl(result.productImage)}
                    alt="Master Product"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() =>
                      setPreviewImage({
                        url: formatImageUrl(result.productImage),
                        title: 'Master Product Reference (Nano-Banana)',
                      })
                    }
                    className="absolute bottom-3 right-3 p-2 rounded-lg bg-zinc-900/80 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Enlarge"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4 text-sm text-zinc-400 flex-1">
                  {result.campaignCopy && (
                    <div className="bg-zinc-950/70 p-4 rounded-xl border border-zinc-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                          <Type className="w-3.5 h-3.5" /> Gemini Flash Campaign Core
                        </span>
                        <span className="text-xs font-bold text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                          {result.campaignCopy.brandName}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-zinc-100">
                        "{result.campaignCopy.tagline}"
                      </p>
                      <p className="text-xs text-zinc-400 italic">
                        "{productDescription}"
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/60 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Strict Product Consistency</span>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/60 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Zero Humans in Imagery</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Step 2: Cross-Medium Visualizations */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Campaign Placements
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    The identical product rendered across three real-world advertising mediums
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> Copy: Gemini Flash</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Visuals: Nano-Banana</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {result.campaignImages.map((medium, index) => {
                  const isRegenerating = regeneratingMedium === medium.name;
                  return (
                    <div
                      key={index}
                      className="bg-zinc-900/70 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-xl group"
                    >
                      {/* Medium Header */}
                      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-zinc-800 border border-zinc-700/50">
                            {getMediumIcon(medium.name)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-bold text-sm text-white">{medium.name}</h3>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                                Nano-Banana
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400">{medium.tagline}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleRegenerateMedium(medium.name)}
                            disabled={isRegenerating || loading}
                            title={`Re-render ${medium.name} with Nano-Banana`}
                            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 disabled:opacity-40 transition-colors cursor-pointer"
                          >
                            <RefreshCw
                              className={`w-4 h-4 ${isRegenerating ? 'animate-spin text-amber-400' : ''}`}
                            />
                          </button>
                          <button
                            onClick={() => downloadImage(medium.image, `campaign-${medium.name.toLowerCase()}`)}
                            title="Download shot"
                            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Image Viewer */}
                      <div className="relative flex-1 bg-zinc-950 flex items-center justify-center p-3">
                        <div
                          className={`relative w-full overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900 flex items-center justify-center ${
                            medium.name.toLowerCase() === 'billboard'
                              ? 'aspect-[16/9]'
                              : medium.name.toLowerCase() === 'newspaper'
                              ? 'aspect-[3/4]'
                              : 'aspect-square'
                          }`}
                        >
                          <img
                            src={formatImageUrl(medium.image)}
                            alt={`${medium.name} visualization`}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                          />

                          <button
                            onClick={() =>
                              setPreviewImage({
                                url: formatImageUrl(medium.image),
                                title: `${medium.name} - Nano-Banana Visualization`,
                              })
                            }
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-zinc-950/70 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>

                          {isRegenerating && (
                            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                              <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                              <span className="text-xs text-zinc-300">Re-rendering with Nano-Banana...</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Copy Section (from Gemini Flash) */}
                      {medium.copy && (
                        <div className="px-4 py-3 bg-zinc-900/60 border-t border-zinc-800/60 space-y-1.5 text-left">
                          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-blue-400">
                            <Type className="w-3 h-3" />
                            <span>Gemini Flash Copy</span>
                          </div>
                          {medium.copy.headline && (
                            <h4 className="text-xs font-bold text-zinc-100 line-clamp-1">
                              {medium.copy.headline}
                            </h4>
                          )}
                          {medium.copy.subtext && (
                            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                              {medium.copy.subtext}
                            </p>
                          )}
                          {medium.copy.tags && medium.copy.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {medium.copy.tags.slice(0, 3).map((tag, tIdx) => (
                                <span key={tIdx} className="text-[10px] text-zinc-500">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Medium Footer Badge */}
                      <div className="p-3 bg-zinc-950/40 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
                        <span>Aspect: {medium.aspectRatio}</span>
                        <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> No Humans Included
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
              <span className="font-semibold text-sm text-zinc-200">{previewImage.title}</span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 overflow-auto max-h-[80vh] flex items-center justify-center bg-zinc-950">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
