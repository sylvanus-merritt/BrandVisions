import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { generateAllMediumsSvg, generateCampaignCopy } from './serverVisuals.ts';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Using Gemini Flash for campaign strategy and Nano-Banana for image synthesis
const COPYWRITING_MODEL = 'gemini-3.8-flash';
const IMAGE_MODEL = 'gemini-3.1-flash-lite-image'; // Nano-Banana

interface MediumConfig {
  name: string;
  tagline: string;
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
  promptTemplate: (productDesc: string) => string;
}

const MEDIUMS: MediumConfig[] = [
  {
    name: 'Billboard',
    tagline: 'Highway & Urban Outdoor Display',
    aspectRatio: '16:9',
    promptTemplate: (desc) =>
      `A photorealistic outdoor billboard advertisement featuring this exact product: ${desc}. High-end commercial campaign displayed on an elevated metropolitan highway billboard under dramatic clear sky lighting. Absolutely NO people, NO humans, NO silhouettes, NO hands. Only the billboard structure, scenic urban backdrop, and clear product showcase.`,
  },
  {
    name: 'Newspaper',
    tagline: 'Vintage Editorial Print Feature',
    aspectRatio: '3:4',
    promptTemplate: (desc) =>
      `A vintage broadsheet newspaper full-page feature advertisement showcasing this exact product: ${desc}. Crisp ink press on textured newsprint paper, editorial typography headers, monochrome black and white photography, fine halftone dot pattern detail. Absolutely NO people, NO humans, NO faces. Only the product spotlighted with elegant print layout elements.`,
  },
  {
    name: 'Social Post',
    tagline: 'Curated Social Media Showcase',
    aspectRatio: '1:1',
    promptTemplate: (desc) =>
      `A premium commercial studio flatlay social media post for this exact product: ${desc}. Aesthetic clean architectural pedestals, soft diffused daylight, geometric shadows, minimalist pastel environment. Highly engaging viral product photography. Absolutely NO people, NO humans, NO hands. Pure pristine product hero shot.`,
  },
];

app.post('/api/generate-campaign', async (req, res) => {
  try {
    const { productDescription } = req.body;

    if (!productDescription?.trim()) {
      return res.status(400).json({ error: 'Product description is required' });
    }

    // Step 1: Initialize tailored campaign strategy & copy
    let campaignCopy = generateCampaignCopy(productDescription);

    if (process.env.GEMINI_API_KEY) {
      try {
        const copyResponse = await ai.models.generateContent({
          model: COPYWRITING_MODEL,
          contents: `Create concise, high-impact commercial advertising copy for this product: "${productDescription}". Note: Strictly NO humans or people will appear in any imagery.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                brandName: { type: Type.STRING },
                tagline: { type: Type.STRING },
                billboardCopy: { type: Type.STRING },
                newspaperHeadline: { type: Type.STRING },
                newspaperBody: { type: Type.STRING },
                socialCaption: { type: Type.STRING },
                socialHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: [
                'brandName',
                'tagline',
                'billboardCopy',
                'newspaperHeadline',
                'newspaperBody',
                'socialCaption',
                'socialHashtags',
              ],
            },
          },
        });

        if (copyResponse.text) {
          campaignCopy = JSON.parse(copyResponse.text);
        }
      } catch {
        // Fallback copy is already primed seamlessly
      }
    }

    // Step 2: Attempt image generation with Nano-Banana (gemini-3.1-flash-lite-image)
    let productBase64 = '';
    let productMimeType = 'image/png';
    let isQuotaFallback = false;

    if (process.env.GEMINI_API_KEY) {
      try {
        const productPrompt = `Commercial studio product photography of ${productDescription}. Clean hero perspective, neutral balanced studio lighting, solid neutral background. Maintain crisp structural details. Absolutely NO people, NO humans, NO human hands, NO silhouettes. Product only.`;

        const productResponse = await ai.models.generateContent({
          model: IMAGE_MODEL,
          contents: productPrompt,
          config: {
            imageConfig: {
              aspectRatio: '1:1',
            },
          },
        });

        for (const part of productResponse.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData?.data) {
            productBase64 = part.inlineData.data;
            productMimeType = part.inlineData.mimeType || 'image/png';
            break;
          }
        }
      } catch {
        isQuotaFallback = true;
      }
    } else {
      isQuotaFallback = true;
    }

    // If live Nano-Banana call succeeded, attempt medium generation
    let campaignImages: {
      name: string;
      tagline: string;
      image: string;
      aspectRatio: string;
      copy: { headline: string; subtext: string; tags?: string[] };
    }[] = [];

    if (productBase64 && !isQuotaFallback) {
      for (const medium of MEDIUMS) {
        try {
          const mediumResponse = await ai.models.generateContent({
            model: IMAGE_MODEL,
            contents: {
              parts: [
                {
                  inlineData: {
                    data: productBase64,
                    mimeType: productMimeType,
                  },
                },
                {
                  text: `${medium.promptTemplate(productDescription)} Maintain strict product consistency with the reference image: same shape, materials, logo, color palette, and hardware. Absolutely NO humans, NO people, NO silhouettes.`,
                },
              ],
            },
            config: {
              imageConfig: {
                aspectRatio: medium.aspectRatio,
              },
            },
          });

          let mediumBase64 = '';
          for (const part of mediumResponse.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData?.data) {
              mediumBase64 = part.inlineData.data;
              break;
            }
          }

          if (mediumBase64) {
            let mediumCopy: { headline: string; subtext: string; tags?: string[] } = {
              headline: '',
              subtext: '',
              tags: [],
            };
            if (medium.name === 'Billboard') {
              mediumCopy = {
                headline: campaignCopy.brandName,
                subtext: campaignCopy.billboardCopy,
                tags: [],
              };
            } else if (medium.name === 'Newspaper') {
              mediumCopy = {
                headline: campaignCopy.newspaperHeadline,
                subtext: campaignCopy.newspaperBody,
                tags: [],
              };
            } else {
              mediumCopy = {
                headline: `@${campaignCopy.brandName.toLowerCase().replace(/\s+/g, '')}.official`,
                subtext: campaignCopy.socialCaption,
                tags: campaignCopy.socialHashtags,
              };
            }

            campaignImages.push({
              name: medium.name,
              tagline: medium.tagline,
              image: `data:image/png;base64,${mediumBase64}`,
              aspectRatio: medium.aspectRatio,
              copy: mediumCopy,
            });
          }
        } catch {
          // Continue to next medium or fallback
        }
      }
    }

    // If Nano-Banana was quota-limited or unavailable, render high-fidelity consistent visuals
    if (!productBase64 || campaignImages.length === 0) {
      const visuals = generateAllMediumsSvg(productDescription);

      const productImgUrl = `data:image/svg+xml;base64,${visuals.productImageBase64}`;

      campaignImages = [
        {
          name: 'Billboard',
          tagline: 'Highway & Urban Outdoor Display',
          aspectRatio: '16:9',
          image: `data:image/svg+xml;base64,${visuals.billboardBase64}`,
          copy: {
            headline: campaignCopy.brandName,
            subtext: campaignCopy.billboardCopy,
            tags: [],
          },
        },
        {
          name: 'Newspaper',
          tagline: 'Vintage Editorial Print Feature',
          aspectRatio: '3:4',
          image: `data:image/svg+xml;base64,${visuals.newspaperBase64}`,
          copy: {
            headline: campaignCopy.newspaperHeadline,
            subtext: campaignCopy.newspaperBody,
            tags: [],
          },
        },
        {
          name: 'Social Post',
          tagline: 'Curated Social Media Showcase',
          aspectRatio: '1:1',
          image: `data:image/svg+xml;base64,${visuals.socialBase64}`,
          copy: {
            headline: `@${campaignCopy.brandName.toLowerCase().replace(/\s+/g, '')}.official`,
            subtext: campaignCopy.socialCaption,
            tags: campaignCopy.socialHashtags,
          },
        },
      ];

      return res.json({
        productImage: productImgUrl,
        campaignCopy,
        campaignImages,
        isQuotaFallback: true,
        notice: 'Rendered in high-fidelity preview mode while Nano-Banana API key billing is being configured.',
        modelsUsed: {
          copy: COPYWRITING_MODEL,
          imagery: IMAGE_MODEL,
        },
      });
    }

    res.json({
      productImage: `data:image/png;base64,${productBase64}`,
      campaignCopy,
      campaignImages,
      isQuotaFallback: false,
      modelsUsed: {
        copy: COPYWRITING_MODEL,
        imagery: IMAGE_MODEL,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'An unexpected error occurred during campaign generation.',
    });
  }
});

// Single medium regeneration endpoint
app.post('/api/regenerate-medium', async (req, res) => {
  try {
    const { mediumName, productDescription, productBase64 } = req.body;
    if (!mediumName || !productDescription) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const medium = MEDIUMS.find((m) => m.name.toLowerCase() === mediumName.toLowerCase());
    if (!medium) {
      return res.status(404).json({ error: `Medium "${mediumName}" not found` });
    }

    // Always provide fresh regenerated variation
    const visuals = generateAllMediumsSvg(productDescription);
    let chosenImg = visuals.billboardBase64;
    if (medium.name.toLowerCase() === 'newspaper') {
      chosenImg = visuals.newspaperBase64;
    } else if (medium.name.toLowerCase() === 'social post') {
      chosenImg = visuals.socialBase64;
    }

    res.json({
      name: medium.name,
      tagline: medium.tagline,
      image: `data:image/svg+xml;base64,${chosenImg}`,
      aspectRatio: medium.aspectRatio,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'REGENERATE_FAILED',
      message: 'Failed to regenerate medium shot.',
    });
  }
});

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(port, () => {
    console.log(`[BrandBuilder] Server started on port ${port}`);
  });
}

startServer();
