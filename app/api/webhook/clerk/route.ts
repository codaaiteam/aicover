import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// This is the webhook handler
export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  
  if (eventType === 'user.created') {
    const { id, email_addresses, username, image_url } = evt.data;
    
    // Get the user's primary email
    const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id);
    
    if (!primaryEmail) {
      return new Response('No primary email found', {
        status: 400
      });
    }

    try {
      // Insert the user into Supabase
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: primaryEmail.email_address,
          nickname: username || primaryEmail.email_address.split('@')[0],
          avatar_url: image_url,
          uuid: id,
          credits: {
            one_time_credits: 1,
            monthly_credits: 0,
            total_credits: 1,
            used_credits: 0,
            left_credits: 1
          }
        });

      if (error) {
        console.error('Error inserting user:', error);
        return new Response('Error inserting user', {
          status: 500
        });
      }

      return new Response('User created successfully', {
        status: 200
      });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return new Response('Error processing webhook', {
        status: 500
      });
    }
  }

  return new Response('Webhook processed', {
    status: 200
  });
}
