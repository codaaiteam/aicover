import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';

interface Env {
  CLERK_WEBHOOK_SECRET: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    console.log('Received webhook request');

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Get the headers
    const svix_id = request.headers.get("svix-id");
    const svix_timestamp = request.headers.get("svix-timestamp");
    const svix_signature = request.headers.get("svix-signature");

    console.log('Headers:', { svix_id, svix_timestamp, svix_signature });

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('Missing svix headers');
      return new Response('Error occurred -- no svix headers', {
        status: 400
      });
    }

    // Get the body
    const payload = await request.json();
    const body = JSON.stringify(payload);
    
    console.log('Received webhook payload:', payload);

    // Create a new Svix instance with your webhook secret
    const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);

    let evt: any;

    // Verify the webhook
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
      console.log('Webhook verified successfully');
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Error occurred', {
        status: 400
      });
    }

    // Handle the webhook
    const eventType = evt.type;
    console.log('Event type:', eventType);
    
    if (eventType === 'user.created') {
      const { id, email_addresses, username, image_url, first_name, last_name } = evt.data;
      console.log('Processing user data:', { id, email_addresses, username, image_url, first_name, last_name });
      
      // Get the user's primary email
      const primaryEmail = email_addresses.find((email: any) => email.id === evt.data.primary_email_address_id);
      
      if (!primaryEmail) {
        console.error('No primary email found');
        return new Response('No primary email found', {
          status: 400
        });
      }

      // Initialize Supabase client
      const supabase = createClient(
        env.SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY
      );

      try {
        console.log('Attempting to insert user into Supabase');
        // Insert the user into Supabase
        const { data, error } = await supabase
          .from('users')
          .insert({
            email: primaryEmail.email_address,
            nickname: username || first_name || primaryEmail.email_address.split('@')[0],
            avatar_url: image_url,
            uuid: id,
            clerk_user_id: id,  
            credits: 1 // 
          });

        if (error) {
          console.error('Error inserting user:', error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }

        console.log('User inserted successfully:', data);
        return new Response(JSON.stringify({ success: true, data }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Error processing webhook:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Webhook processed' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
};
