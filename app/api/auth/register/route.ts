import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, full_name } = await request.json();
    console.log('📝 Attempting registration for:', email);
    
    const supabase = createClient();
    console.log('🔧 Supabase client created');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name,
        },
        emailRedirectTo: `${new URL(request.url).origin}/api/auth/callback`,
      },
    });

    if (error) {
      console.error('❌ Supabase Auth Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('✅ Registration successful for:', email);
    return NextResponse.json({ user: data.user }, { status: 200 });

  } catch (err: any) {
    console.error('🔥 Internal Register Error:', err.message);
    return NextResponse.json({ error: 'Internal Server Error: ' + err.message }, { status: 500 });
  }
}

