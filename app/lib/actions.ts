'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import email from 'next-auth/providers/email';

// ...
export async function googleAuthenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('google');
  } catch (error) {
    if (error instanceof AuthError) {
      return 'google log in failed'
    }
    throw error;
  }
}

export async function GoogleSignOut(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signOut();
  } catch (error) {
    throw error;
  }
}

const FormSchema = z.object({
  id: z.string(),
  first_name: z.string({
    invalid_type_error: 'Please enter a firstname.',
  }),
  last_name: z.string({
    invalid_type_error: 'Please enter a lastname.',
  }),
  email: z.coerce.string().email({
    message: 'Invalid email address.',
  }),
  phone: z.coerce
    .number()
    .gt(0, { message: 'Please enter phone number' }),
  skill: z.string({
    invalid_type_error: 'Please enter a skill.',
  }),
  rate: z.coerce
    .number()
    .gt(0, { message: 'Please enter a rate salary greater than $0.' }),
  city: z.string({
    invalid_type_error: 'Please enter a city.',
  }),
  visa: z.string({
    invalid_type_error: 'Please enter a visa.',
  }),
  referred: z.string({
    invalid_type_error: 'Please enter a referred by.',
  }),
  date: z.string(),
});

const Create_candidate = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    first_name?: string[];
    last_name?: string[];
    email: string[];
    phone: string[];
    skill: string[];
    rate: string[];
    city: string[];
    visa: string[];
    referred: string[];
  };
  message?: string | null;
};

export async function create_candidate(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = Create_candidate.safeParse({
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    skill: formData.get('skill'),
    rate: formData.get('rate'),
    city: formData.get('city'),
    visa: formData.get('visa'),
    referred: formData.get('referred')
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Candidate.',
    };
  }

  // Prepare data for insertion into the database
  console.log(validatedFields.data);
  const { first_name, 
          last_name, 
          email,
          phone,
          skill,
          rate,
          city,
          visa,
          referred } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];
  const name = first_name + last_name;
  // Insert data into the database
  /*
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
  */

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/candidate_list');
  redirect('/candidate_list');
}