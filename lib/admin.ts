export const ADMIN_EMAILS = [
  'anilava.babaun@gmail.com',
  'anilava.babun@gmail.com',
  'anilava.babu@gmail.com'
];

export function isAdmin(email: string | undefined | null) {
  if (!email) return false;
  return ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email.toLowerCase());
}
