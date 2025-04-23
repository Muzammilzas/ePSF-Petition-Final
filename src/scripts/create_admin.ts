import { supabase } from '../services/supabase';

async function createAdminUser() {
  try {
    // Step 1: Create the user
    const { data: userData, error: signUpError } = await supabase.auth.signUp({
      email: 'timeshare@epublicsf.org',
      password: 'REPLACE_WITH_SECURE_PASSWORD', // You should replace this with a secure password
    });

    if (signUpError) {
      console.error('Error creating user:', signUpError.message);
      return;
    }

    if (!userData.user) {
      console.error('No user data returned');
      return;
    }

    console.log('User created successfully:', userData.user.email);

    // Step 2: Add the user to the admins table
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .insert([
        {
          user_id: userData.user.id,
          email: userData.user.email,
        },
      ])
      .select()
      .single();

    if (adminError) {
      console.error('Error adding admin:', adminError.message);
      return;
    }

    console.log('Admin record created successfully:', adminData);

    // Step 3: Verify admin status
    const { data: verifyData, error: verifyError } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();

    if (verifyError) {
      console.error('Error verifying admin:', verifyError.message);
      return;
    }

    console.log('Admin status verified:', verifyData);

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createAdminUser(); 