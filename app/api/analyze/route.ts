
// main-site/app/api/listings/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Environment variables with fallbacks
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const AI_API_URL = process.env.AI_API_URL || '';
const ADMIN_WEBHOOK_URL = process.env.ADMIN_WEBHOOK_URL || 'https://unimart-admin-ecru.vercel.app/';

function normalizeString(value: any, fallback = '') {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  return fallback;
}

function normalizeNumber(value: any, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function normalizeArray(value: any) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}

function formatAdminPayload(listingData: any, sellerData: any) {
  const tags = normalizeArray(listingData.tags);
  const imageUrls = normalizeArray(listingData.imageUrls);

  return {
    event: 'listing_submission',
    source: 'unimart-listing',
    submitted_at: new Date().toISOString(),
    seller: {
      name: normalizeString(sellerData.sellerName),
      email: normalizeString(sellerData.sellerEmail),
      phone: normalizeString(sellerData.sellerPhone),
      type: normalizeString(sellerData.userType, 'seller'),
      location: normalizeString(sellerData.location, 'Not specified'),
    },
    product: {
      title: normalizeString(listingData.title),
      description: normalizeString(listingData.description),
      category: normalizeString(listingData.category),
      brand: normalizeString(listingData.brand),
      condition: normalizeString(listingData.condition),
      price: normalizeNumber(listingData.price),
      discount: normalizeNumber(listingData.discount),
      edition: normalizeString(listingData.edition),
      deliveryType: normalizeString(listingData.deliveryType),
      paymentMethod: normalizeString(listingData.paymentMethod),
      tags,
      imageUrls,
      status: normalizeString(listingData.status || 'pending'),
    },
    metadata: {
      image_count: imageUrls.length,
      confidence_score: normalizeNumber(listingData.confidence, 0),
      listing_url: normalizeString(listingData.listingUrl),
      backend_saved: Boolean(listingData.id),
    },
  };
}

// Helper function to send webhook notification to admin
async function sendWebhookNotification(listingData: any, sellerData: any) {
  try {
    const payload = formatAdminPayload(listingData, sellerData);

    console.log('📤 Sending admin webhook payload...');

    // Fire and forget - don't await
    fetch(ADMIN_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    .then(async response => {
      const text = await response.text();
      if (!response.ok) {
        console.error(`❌ Admin webhook responded with ${response.status}:`, text);
      } else {
        console.log('✅ Admin webhook sent successfully:', text);
      }
    })
    .catch(error => console.error('❌ Admin webhook error (non-blocking):', error));

    return { success: true };
  } catch (error) {
    console.error('❌ Webhook setup error:', error);
    return { success: false, error };
  }
}

// Validate required fields for listing submission
function validateListingFields(body: any): string[] {
  const required = ['sellerName', 'sellerEmail', 'title', 'description', 'category', 'condition', 'price'];
  return required.filter(field => !body[field]);
}

// Handle POST requests (AI analysis + listing submission)
export async function POST(req: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] 🚀 POST request received`);
  
  try {
    const contentType = req.headers.get('content-type') || '';
    console.log(`[${requestId}] Content-Type:`, contentType);
    
    // Case 1: AI Analysis - FormData with image
    if (contentType.includes('multipart/form-data')) {
      console.log(`[${requestId}] 📸 Processing image for AI analysis...`);
      
      try {
        const formData = await req.formData();
        const imageFile = formData.get('image') as File | null;
        
        if (!imageFile) {
          return NextResponse.json({
            success: false,
            error: 'No image file provided'
          }, { status: 400 });
        }

        console.log(`[${requestId}] Image received:`, {
          name: imageFile.name,
          size: imageFile.size,
          type: imageFile.type
        });
        
        // Check if AI service is configured
        if (!AI_API_URL) {
          console.log(`[${requestId}] ⚠️ AI_API_URL not configured, using mock data`);
          
          // Generate mock data based on image filename (for demo)
          const mockTitle = imageFile.name 
            ? imageFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ')
            : 'Premium Product';
          
          return NextResponse.json({
            success: true,
            type: 'ai-analysis',
            listing: {
              title: mockTitle,
              description: `This high-quality ${mockTitle.toLowerCase()} is in excellent condition. Perfect for anyone looking for a reliable product that delivers exceptional value.`,
              category: 'electronics',
              condition: 'good',
              price: 49.99,
              brand: 'Generic',
              confidence: 0.85,
              estimatedValue: '45-60',
              suggestedTags: ['electronics', 'gadget', 'like-new']
            },
            formTemplate: {
              condition: ['excellent', 'good', 'fair', 'poor'],
              deliveryType: ['shipping', 'pickup', 'both'],
              paymentMethod: ['cash', 'bank transfer', 'mobile money']
            }
          });
        }
        
        // Forward to actual AI service
        console.log(`[${requestId}] 📤 Forwarding to AI service:`, AI_API_URL);
        
        const aiResponse = await fetch(AI_API_URL, {
          method: 'POST',
          body: formData,
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          throw new Error(`AI service responded with ${aiResponse.status}: ${errorText}`);
        }

        const aiData = await aiResponse.json();
        console.log(`[${requestId}] ✅ AI analysis complete`);
        
        return NextResponse.json({
          success: true,
          type: 'ai-analysis',
          listing: aiData.listing || aiData,
          formTemplate: aiData.formTemplate || {}
        });
        
      } catch (error) {
        console.error(`[${requestId}] ❌ AI analysis error:`, error);
        return NextResponse.json({
          success: false,
          error: error instanceof Error ? error.message : 'AI analysis failed',
          type: 'ai-analysis'
        }, { status: 500 });
      }
    }
    
    // Case 2: Listing Submission - JSON data
    else if (contentType.includes('application/json')) {
      console.log(`[${requestId}] 📝 Submitting listing to backend...`);
      console.log(`[${requestId}] Backend URL:`, BACKEND_URL);
      
      try {
        const body = await req.json();
        console.log(`[${requestId}] Request body keys:`, Object.keys(body));
        
        // Validate required fields
        const missing = validateListingFields(body);
        
        if (missing.length > 0) {
          console.log(`[${requestId}] ❌ Missing fields:`, missing);
          return NextResponse.json({
            success: false,
            error: `Missing required fields: ${missing.join(', ')}`
          }, { status: 400 });
        }

        // Prepare data for backend
        const listingData = {
          ...body,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        // Send to Express backend with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log(`[${requestId}] ⏱️ Request timeout - aborting`);
          controller.abort();
        }, 15000); // 15 second timeout

        console.log(`[${requestId}] 📤 Sending to backend:`, `${BACKEND_URL}/api/listings`);

        const backendResponse = await fetch(`${BACKEND_URL}/api/listings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(listingData),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await backendResponse.json();
        console.log(`[${requestId}] ✅ Backend response received`);

        if (!backendResponse.ok) {
          throw new Error(data.error || `Backend error: ${backendResponse.status}`);
        }

        // After successful save, trigger webhook notification (non-blocking)
        const sellerData = {
          sellerName: body.sellerName,
          sellerEmail: body.sellerEmail,
          sellerPhone: body.sellerPhone || 'Not provided',
          userType: body.userType || 'student',
          location: body.location || 'Not specified'
        };
        
        // Fire and forget webhook
        sendWebhookNotification(listingData, sellerData);

        return NextResponse.json({
          success: true,
          type: 'submission',
          data: data.data || data,
          message: 'Listing saved successfully',
          listingId: data.data?.id || data.id
        });
        
      } catch (error: any) {
        console.error(`[${requestId}] ❌ Submission error:`, error);
        
        if (error.name === 'AbortError') {
          return NextResponse.json({
            success: false,
            error: 'Backend request timed out. Please try again.',
            type: 'submission'
          }, { status: 504 });
        }
        
        return NextResponse.json({
          success: false,
          error: error.message || 'Failed to save listing',
          type: 'submission'
        }, { status: 500 });
      }
    }
    
    else {
      console.log(`[${requestId}] ❌ Unsupported content type:`, contentType);
      return NextResponse.json({
        success: false,
        error: 'Unsupported content type. Please use multipart/form-data or application/json'
      }, { status: 400 });
    }

  } catch (error) {
    console.error(`[${requestId}] ❌ Unhandled error:`, error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        requestId
      },
      { status: 500 }
    );
  }
}

// Handle GET requests - fetch listings with filters
export async function GET(req: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] 🔍 GET request received`);
  
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sellerEmail = searchParams.get('sellerEmail');
    const limit = searchParams.get('limit') || '50';
    const page = searchParams.get('page') || '1';
    
    // Build URL with query parameters
    let url = `${BACKEND_URL}/api/listings`;
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (sellerEmail) params.append('sellerEmail', sellerEmail);
    if (limit) params.append('limit', limit);
    if (page) params.append('page', page);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log(`[${requestId}] 📡 Fetching from:`, url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Backend responded with ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`[${requestId}] ✅ Successfully fetched ${data.data?.length || 0} listings`);

    return NextResponse.json({
      success: true,
      data: data.data || data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: data.total || data.data?.length || 0
      }
    });
    
  } catch (error: any) {
    console.error(`[${requestId}] ❌ Error fetching listings:`, error);
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, error: 'Request timed out' },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch listings',
        details: error.message,
        requestId
      },
      { status: 500 }
    );
  }
}

// Handle PATCH requests - update listing status
export async function PATCH(req: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] ✏️ PATCH request received`);
  
  try {
    const body = await req.json();
    const { id, status } = body;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Listing ID is required'
      }, { status: 400 });
    }
    
    if (!status) {
      return NextResponse.json({
        success: false,
        error: 'Status is required'
      }, { status: 400 });
    }
    
    console.log(`[${requestId}] Updating listing ${id} to status: ${status}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${BACKEND_URL}/api/listings/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to update listing: ${response.status}`);
    }

    console.log(`[${requestId}] ✅ Listing ${id} updated successfully`);
    
    return NextResponse.json({ 
      success: true, 
      data: data.data || data,
      message: `Listing status updated to ${status}`
    });
    
  } catch (error: any) {
    console.error(`[${requestId}] ❌ Error updating listing:`, error);
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, error: 'Request timed out' },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId
      },
      { status: 500 }
    );
  }
}

// Handle DELETE requests - remove listing
export async function DELETE(req: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] 🗑️ DELETE request received`);
  
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Listing ID is required'
      }, { status: 400 });
    }
    
    console.log(`[${requestId}] Deleting listing:`, id);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${BACKEND_URL}/api/listings/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to delete listing: ${response.status}`);
    }

    console.log(`[${requestId}] ✅ Listing ${id} deleted successfully`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Listing deleted successfully'
    });
    
  } catch (error: any) {
    console.error(`[${requestId}] ❌ Error deleting listing:`, error);
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, error: 'Request timed out' },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId
      },
      { status: 500 }
    );
  }
}