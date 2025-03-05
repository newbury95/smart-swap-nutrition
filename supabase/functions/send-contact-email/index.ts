
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  recipientEmail: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message, recipientEmail }: ContactEmailRequest = await req.json();

    // Log the received data
    console.log('Contact form submission received:', { name, email, subject, recipientEmail });

    // Validate inputs
    if (!name || !email || !subject || !message || !recipientEmail) {
      throw new Error('Missing required fields');
    }

    // For now we'll simulate email sending, as we don't have email provider API keys configured
    // In a production environment, you would integrate with an email service like Resend, SendGrid, etc.
    
    // Simulating successful email delivery
    console.log('Would send email to:', recipientEmail);
    console.log('From:', email);
    console.log('Subject:', subject);
    console.log('Message content:', message);
    
    // TODO: In production, replace this with actual email sending code using a service provider

    return new Response(
      JSON.stringify({ success: true, message: 'Contact form submitted successfully' }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error('Error in send-contact-email function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  }
});
