
// main-site/app/api/listings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const BACKEND_URL = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://unimart-backend-2.onrender.com')).replace(/\/+$/, '').replace(/\/api$/i, '');
const ADMIN_WEBHOOK_URL = process.env.ADMIN_WEBHOOK_URL || 'https://unimart-admin-ecru.vercel.app/';

const JUMIA_CATEGORIES = {
  electronics: {
    name: "Electronics",
    subcategories: ["Mobile Phones", "Computers", "TV & Audio", "Cameras", "Gaming"],
    fields: [
      { name: "brand", type: "text", placeholder: "e.g. Apple, Samsung, Dell" },
      { name: "model", type: "text", placeholder: "e.g. iPhone 13, Galaxy S22" },
      { name: "storage", type: "select", options: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"] },
      { name: "ram", type: "select", options: ["2GB", "4GB", "8GB", "16GB", "32GB"] },
      { name: "color", type: "text", placeholder: "e.g. Space Gray, Silver" },
      { name: "condition", type: "select", options: ["New", "Like New", "Good", "Fair"] }
    ]
  },
  fashion: {
    name: "Fashion",
    subcategories: ["Men's Clothing", "Women's Clothing", "Shoes", "Accessories"],
    fields: [
      { name: "brand", type: "text", placeholder: "e.g. Nike, Adidas, Zara" },
      { name: "size", type: "text", placeholder: "e.g. S, M, L, XL, 42" },
      { name: "color", type: "text", placeholder: "e.g. Black, Red, Blue" },
      { name: "material", type: "text", placeholder: "e.g. Cotton, Leather" },
      { name: "gender", type: "select", options: ["Men", "Women", "Unisex", "Kids"] },
      { name: "condition", type: "select", options: ["New with tags", "New without tags", "Like New", "Good"] }
    ]
  },
  books: {
    name: "Books",
    subcategories: ["Fiction", "Non-Fiction", "Textbooks", "Children's Books"],
    fields: [
      { name: "title", type: "text", placeholder: "Book title" },
      { name: "author", type: "text", placeholder: "Author name" },
      { name: "isbn", type: "text", placeholder: "ISBN number" },
      { name: "publisher", type: "text", placeholder: "Publisher" },
      { name: "edition", type: "text", placeholder: "e.g. 2nd Edition" },
      { name: "format", type: "select", options: ["Hardcover", "Paperback", "E-book"] },
      { name: "condition", type: "select", options: ["New", "Like New", "Good", "Fair"] }
    ]
  },
  home: {
    name: "Home & Furniture",
    subcategories: ["Furniture", "Kitchen", "Decor", "Bedding"],
    fields: [
      { name: "brand", type: "text", placeholder: "Brand name" },
      { name: "material", type: "text", placeholder: "e.g. Wood, Metal, Plastic" },
      { name: "color", type: "text", placeholder: "Color/finish" },
      { name: "dimensions", type: "text", placeholder: "e.g. 120x60x75 cm" },
      { name: "weight", type: "text", placeholder: "e.g. 15 kg" },
      { name: "condition", type: "select", options: ["New", "Like New", "Good", "Fair"] }
    ]
  },
  food: {
    name: "Food",
    subcategories: ["Prepared Food", "Snacks", "Drinks", "Fresh Produce", "Packaged Food", "Baked Goods"],
    fields: [
      { name: "brand", type: "text", placeholder: "Brand or producer" },
      { name: "ingredients", type: "text", placeholder: "Main ingredients" },
      { name: "weight", type: "text", placeholder: "e.g. 500 g" },
      { name: "expiryDate", type: "text", placeholder: "Expiry date, if packaged" },
    ]
  },
  beauty: {
    name: "Beauty",
    subcategories: ["Skincare", "Makeup", "Hair Care", "Fragrance", "Personal Care"],
    fields: [
      { name: "brand", type: "text", placeholder: "Brand" },
      { name: "productType", type: "text", placeholder: "e.g. Moisturizer" },
      { name: "size", type: "text", placeholder: "e.g. 50 ml" },
    ]
  },
  sports: {
    name: "Sports",
    subcategories: ["Fitness", "Outdoor", "Team Sports", "Sportswear", "Cycling"],
    fields: [
      { name: "brand", type: "text", placeholder: "Brand" },
      { name: "size", type: "text", placeholder: "Size" },
      { name: "material", type: "text", placeholder: "Material" },
    ]
  },
  other: {
    name: "Other",
    subcategories: ["General"],
    fields: [
      { name: "title", type: "text", placeholder: "Product title" },
      { name: "brand", type: "text", placeholder: "Brand name" },
      { name: "description", type: "textarea", placeholder: "Product description" },
      { name: "condition", type: "select", options: ["New", "Like New", "Good", "Fair"] }
    ]
  }
};

// Helper function to clean and parse JSON from AI response
function parseAIResponse(content: string): any {
  try {
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    
    // Try to find JSON object in the text
    const objectMatch = content.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      let jsonStr = objectMatch[0];
      
      // Fix trailing commas (common in AI responses)
      jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');
      
      // Fix missing quotes around property names
      jsonStr = jsonStr.replace(/(\{|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
      
      return JSON.parse(jsonStr);
    }
  } catch (e) {
    console.log('Failed to parse JSON:', e);
  }
  
  throw new Error('No valid JSON found in response');
}

// Retry function for API calls
async function callWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
  backoff = 2
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    
    console.log(`⏱️ Retrying... ${retries} attempts left. Waiting ${delay}ms`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return callWithRetry(fn, retries - 1, delay * backoff, backoff);
  }
}

function normalizeString(value: any, fallback = '') {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  return fallback;
}

function normalizeNumber(value: any, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function normalizeCategory(value: any) {
  const normalized = normalizeString(value, 'Other').toLowerCase();
  const categoryMap: Record<string, string> = {
    'textbooks & education': 'Books',
    'books': 'Books',
    'electronics': 'Electronics',
    'phones & tablets': 'Electronics',
    'computers & laptops': 'Electronics',
    'clothing & apparel': 'Fashion',
    'fashion': 'Fashion',
    'furniture & home': 'Home & Furniture',
    'home & furniture': 'Home & Furniture',
    'gaming': 'Other',
    'kitchen & dining': 'Other',
    'food': 'Food',
    'food & groceries': 'Food',
    'beauty & personal care': 'Beauty',
    'beauty': 'Beauty',
    'sports': 'Sports',
    'sports & outdoors': 'Sports',
    'home & kitchen': 'Home & Furniture',
    'services': 'Services',
    'events': 'Events',
    'second hand': 'Second Hand',
    'tech gadgets': 'Tech Gadgets',
    'campus life': 'Campus Life',
    'other': 'Other',
  };

  return categoryMap[normalized] || 'Other';
}

function normalizeArray(value: any) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}

function getAssistantText(content: unknown): string {
  if (typeof content === 'string') return content.trim();
  if (!Array.isArray(content)) return '';

  // OpenRouter-compatible providers may return text as content blocks instead
  // of the plain string used by the OpenAI-compatible response format.
  return content
    .filter((part: any) => part && (part.type === 'text' || typeof part.text === 'string'))
    .map((part: any) => typeof part.text === 'string' ? part.text : '')
    .join('\n')
    .trim();
}

// Helper function to send webhook notification to Zapier
async function sendWebhookNotification(listingData: any, sellerData: any) {
  try {
    const payload = {
      seller_name: sellerData.sellerName,
      seller_email: sellerData.sellerEmail,
      seller_phone: sellerData.sellerPhone,
      user_type: sellerData.userType,
      location: sellerData.location,
      product_title: listingData.title,
      product_description: listingData.description,
      product_category: listingData.category,
      product_brand: listingData.brand,
      product_condition: listingData.condition,
      product_price: listingData.price,
      product_discount: listingData.discount,
      product_edition: listingData.edition,
      delivery_type: listingData.deliveryType,
      payment_method: listingData.paymentMethod,
      tags: listingData.tags,
      image_urls: Array.isArray(listingData.imageUrls) ? listingData.imageUrls : [],
      video_urls: Array.isArray(listingData.videoUrls) ? listingData.videoUrls : [],
      media: (Array.isArray(listingData.media) ? listingData.media : []).map((m: any) => ({
        type: m.resource_type || m.type || 'image',
        url: m.secure_url || m.url,
      })),
      image_count: listingData.imageUrls?.length || 0,
      video_count: Array.isArray(listingData.videoUrls) ? listingData.videoUrls.length : 0,
      confidence_score: listingData.confidence,
      submitted_at: new Date().toISOString(),
      email_subject: `Your Uni-Mart listing "${listingData.title}" is awaiting review`,
      email_preview: `Your listing was submitted for admin approval. We will let you know when its status changes.`
    };

    console.log('📤 Sending admin webhook payload...');

    const response = await fetch(ADMIN_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    if (!response.ok) {
      console.error(`❌ Admin webhook responded with ${response.status}:`, text);
      return { success: false, error: text };
    }

    console.log('✅ Admin webhook sent successfully:', text);
    return { success: true, data: text };

    return { success: true };
  } catch (error) {
    console.error('❌ Webhook setup error:', error);
    return { success: false, error };
  }
}

// Handle AI analysis (POST with image) and listing submission (POST with JSON)
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    
    // Case 1: AI Analysis - FormData with image or video
    if (contentType.includes('multipart/form-data')) {
      console.log('📸 Processing media for AI analysis...');

      const formData = await req.formData();
      const imageFiles = [...formData.getAll('images'), formData.get('image')]
        .filter((file): file is File => file instanceof File && file.size > 0);
      const imageFile = imageFiles[0] || (formData.get('video') as File | null);

      if (!imageFile) {
        return NextResponse.json(
          { success: false, error: 'No media file provided (send an image or a video)' },
          { status: 400 }
        );
      }

      // Validate file type - both images and videos accepted
      const isImage = imageFile.type.startsWith('image/');
      const isVideo = imageFile.type.startsWith('video/');

      if (!isImage && !isVideo) {
        return NextResponse.json(
          { success: false, error: 'File must be an image or a video' },
          { status: 400 }
        );
      }

      const maxSize = isVideo ? 50 * 1024 * 1024 : 15 * 1024 * 1024;
      if (imageFile.size > maxSize) {
        return NextResponse.json(
          { success: false, error: `File size must be less than ${isVideo ? '50MB' : '15MB'}` },
          { status: 400 }
        );
      }

      // Videos skip AI analysis (the vision model is image-only); the seller fills the form manually
      if (isVideo) {
        console.log('🎬 Video received — skipping AI analysis (image-only model)');
        const fallbackTemplate = JUMIA_CATEGORIES.other;
        return NextResponse.json({
          success: true,
          type: 'ai-analysis',
          listing: {
            title: '',
            description: '',
            category: fallbackTemplate.name,
            confidence: 0,
            productType: 'other',
          },
          formTemplate: {
            category: 'other',
            fields: fallbackTemplate.fields,
            subcategories: fallbackTemplate.subcategories,
          },
        });
      }

      // Check API key for AI analysis
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        return NextResponse.json({
          success: false,
          error: 'OPENROUTER_API_KEY not configured',
          message: 'Please add your OpenRouter API key to .env.local file'
        }, { status: 503 });
      }

      console.log('🔑 OpenRouter API key is configured.');

      // Initialize OpenAI client for AI analysis with timeout
      const client = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: apiKey,
        timeout: 30000, // 30 second timeout
        maxRetries: 3,
        defaultHeaders: {
          "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
          "X-Title": "Uni-Mart Lister",
        },
      });

      // Convert image to base64
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = buffer.toString('base64');
      const mimeType = imageFile.type;
      
      console.log('🖼️ Image converted, size:', buffer.length, 'bytes');

      // AI analysis prompt
      const prompt = `You create accurate marketplace drafts from product photos for sellers in Ghana. Inspect every supplied photo carefully and combine evidence across angles.

Do not invent a brand, model, capacity, material, condition, expiry date, ingredients, or other specifications. Use readable labels and visible evidence. If a detail is not confidently visible, return an empty string. Do not claim a price is printed unless it is visible. Suggest a realistic Ghana cedi resale price only when the product can be identified with reasonable confidence; otherwise set suggestedPrice to null. Describe only visible product characteristics and make clear when condition cannot be verified from photos.

Choose one detectedCategory exactly from: electronics, fashion, books, home, food, beauty, sports, other. Set subcategory to the most specific useful product type (examples: phones, laptop, rice, soft drink, tomatoes, shoes, face cream, textbook, chair). Extract text and measurable specifications when legible. Return ONLY valid JSON in this shape:
{
  "detectedCategory": "electronics|fashion|books|home|food|beauty|sports|other",
  "subcategory": "specific product type",
  "extractedFields": {
    "title": "concise accurate listing title",
    "productType": "specific product type suitable for the subcategory, or empty string if unclear",
    "brand": "visible brand or empty string",
    "model": "visible model or empty string",
    "description": "helpful factual seller description based on visible evidence only",
    "suggestedPrice": null,
    "condition": "New|Like New|Good|Fair|Poor or empty string if uncertain",
    "color": "visible color or empty string",
    "size": "visible size or empty string",
    "material": "visible material or empty string",
    "storage": "visible storage or empty string",
    "ram": "visible RAM or empty string",
    "author": "visible book author or empty string",
    "isbn": "visible ISBN or empty string",
    "ingredients": "visible ingredients or empty string",
    "weight": "visible net weight or empty string",
    "expiryDate": "visible expiry date or empty string"
  },
  "confidence": 0.0
}
Use confidence from 0 to 1 to express confidence in product identification. Do not use filename or assume details that are not shown.`;

      const visionModel = process.env.OPENROUTER_VISION_MODEL || 'qwen/qwen3.7-plus';
      console.log('🤖 Calling OpenRouter API with configured vision model');

      // Use retry logic for the API call
      const imageParts = await Promise.all(imageFiles.slice(0, 10).map(async (file) => {
        const bytes = await file.arrayBuffer();
        return { type: "image_url" as const, image_url: { url: `data:${file.type};base64,${Buffer.from(bytes).toString('base64')}` } };
      }));
      const requestListing = (maxTokens: number) => client.chat.completions.create({
        model: visionModel,
        messages: [
          {
            role: "user",
            content: [
              ...imageParts,
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: maxTokens,
      });

      let completion = await callWithRetry(async () => {
        return requestListing(3000);
      });

      console.log('✅ OpenRouter API call successful');

      let content = getAssistantText(completion.choices[0]?.message?.content);
      if (!content) {
        // Some vision providers spend the initial output budget on reasoning
        // and return an empty message. Give the provider one larger generation
        // before surfacing a useful error to the seller.
        completion = await callWithRetry(() => requestListing(6000), 1, 500, 1);
        content = getAssistantText(completion.choices[0]?.message?.content);
      }
      if (!content) {
        const finishReason = completion.choices[0]?.finish_reason;
        console.error('OpenRouter returned an empty listing response', {
          model: visionModel,
          finishReason,
          hasChoice: completion.choices.length > 0,
        });
        return NextResponse.json({
          success: false,
          error: finishReason === 'length'
            ? 'The AI ran out of response space while analyzing the photos. Try fewer or smaller images.'
            : 'The AI could not read listing details from these photos. Try a clearer photo with the product label visible.',
        }, { status: 502 });
      }
      console.log('📄 Raw response preview:', content.substring(0, 200) + '...');
      
      // Parse the extracted data
      let extractedData;
      try {
        extractedData = parseAIResponse(content);
        if (!extractedData || typeof extractedData.extractedFields !== 'object' || !extractedData.extractedFields) {
          throw new Error('AI response did not contain extracted product fields');
        }
        console.log('📊 Parsed data:', JSON.stringify(extractedData, null, 2).substring(0, 200) + '...');
      } catch (parseError) {
        console.error('❌ Failed to parse AI response:', parseError);
        return NextResponse.json({
          success: false,
          error: 'AI returned invalid data format',
          debug: content.substring(0, 200)
        }, { status: 500 });
      }

      // Get category template
      const category = String(extractedData.detectedCategory || 'other').toLowerCase();
      const categoryTemplate = JUMIA_CATEGORIES[category as keyof typeof JUMIA_CATEGORIES] || JUMIA_CATEGORIES.other;

      // Prepare response for Lister component
      const response = {
        success: true,
        type: 'ai-analysis',
        listing: {
          ...extractedData.extractedFields,
          category: categoryTemplate.name,
          subcategory: normalizeString(extractedData.subcategory),
          confidence: Number.isFinite(Number(extractedData.confidence)) ? Number(extractedData.confidence) : 0,
          productType: category,
        },
        formTemplate: {
          category: category,
          fields: categoryTemplate.fields,
          subcategories: categoryTemplate.subcategories
        }
      };

      return NextResponse.json(response);
    }
    
    // Case 2: Listing Submission - JSON data
    else if (contentType.includes('application/json')) {
      console.log('📝 Submitting listing to backend...');
      
      const body = await req.json();
      
      // Validate required fields
      const required = ['sellerName', 'sellerEmail', 'title', 'description', 'category', 'condition', 'price'];
      const missing = required.filter(field => !body[field]);
      if (body.listingSource === 'riri-ai' && (!Array.isArray(body.videoUrls) || body.videoUrls.length === 0)) {
        missing.push('videoUrls');
      }
      if (body.listingSource === 'riri-ai' && (!Array.isArray(body.imageUrls) || body.imageUrls.length === 0)) {
        missing.push('imageUrls');
      }
      if (body.listingSource === 'riri-ai' && !normalizeString(body.subcategory)) {
        missing.push('subcategory');
      }
      
      if (missing.length > 0) {
        return NextResponse.json({
          success: false,
          error: `Missing required fields: ${missing.join(', ')}`
        }, { status: 400 });
      }

      const backendPayload = {
        ...body,
        sellerEmail: normalizeString(body.sellerEmail, '').toLowerCase(),
        category: normalizeCategory(body.category),
        imageUrls: Array.isArray(body.imageUrls) ? body.imageUrls : [],
        // All seller uploads, including photo and video submissions, must go directly to the admin review queue.
        status: 'pending',
        isActive: false,
      };

      console.log('📤 Sending to backend:', BACKEND_URL);

      // Send to Express backend
      const authorization = req.headers.get('authorization');
      const backendResponse = await fetch(`${BACKEND_URL}/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authorization ? { Authorization: authorization } : {}),
        },
        body: JSON.stringify(backendPayload),
      });

      const data = await backendResponse.json();

      if (!backendResponse.ok) {
        throw new Error(data.error || 'Failed to save listing');
      }

      console.log('✅ Listing saved to backend');

      // 🔔 Send webhook notification (fire and forget)
      const sellerData = {
        sellerName: backendPayload.sellerName,
        sellerEmail: backendPayload.sellerEmail,
        sellerPhone: backendPayload.sellerPhone,
        userType: backendPayload.userType || 'student',
        location: backendPayload.location
      };
      
      // Don't await - let it run in background
      sendWebhookNotification(backendPayload, sellerData);

      return NextResponse.json({
        success: true,
        type: 'submission',
        data: data.data || data,
        message: 'Listing saved successfully. A confirmation email will be sent shortly.'
      });
    }
    
    else {
      return NextResponse.json(
        { success: false, error: 'Unsupported content type' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('❌ Detailed Error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      cause: error.cause,
      stack: error.stack
    });
    
    // Check if it's a network error
    if (error.code === 'ETIMEDOUT' || error.cause?.code === 'ETIMEDOUT') {
      return NextResponse.json({
        success: false,
        error: 'Connection to OpenRouter timed out. Please check your network and try again.',
        details: 'The request took too long to complete. This might be due to network issues or OpenRouter service being slow.'
      }, { status: 503 });
    }
    
    // Check if it's a DNS error
    if (error.code === 'ENOTFOUND' || error.cause?.code === 'ENOTFOUND') {
      return NextResponse.json({
        success: false,
        error: 'Could not resolve OpenRouter API domain. Please check your DNS settings.',
        details: 'Unable to connect to openrouter.ai. This might be a DNS issue.'
      }, { status: 503 });
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error.cause?.message || 'No additional details'
      },
      { status: 500 }
    );
  }
}

// Get listings (for testing or admin)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const sellerId = searchParams.get('sellerId');
    const sellerEmail = searchParams.get('sellerEmail');
    const limit = searchParams.get('limit') || '50';
    const page = searchParams.get('page') || '1';
    
    let url = `${BACKEND_URL}/api/listings`;
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (category) params.append('category', category);
    if (sellerId) params.append('sellerId', sellerId);
    if (sellerEmail) params.append('sellerEmail', sellerEmail);
    if (limit) params.append('limit', limit);
    if (page) params.append('page', page);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log('📥 Fetching listings from:', url);

    const authorization = req.headers.get('authorization');
    const response = await fetch(url, {
      headers: authorization ? { Authorization: authorization } : undefined,
      cache: 'no-store',
    });
    const data = await response.json();

    return NextResponse.json({
      success: response.ok && data.success !== false,
      data: data.data || data,
      type: 'listings'
    }, { status: response.status });
  } catch (error) {
    console.error('❌ Error fetching listings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
