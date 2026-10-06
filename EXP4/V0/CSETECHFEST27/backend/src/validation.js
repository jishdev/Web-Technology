export const isEmail = value => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(String(value || '').trim());
export const isPhone = value => /^[6-9]\d{9}$/.test(String(value || '').trim());
export const isName = value => /^[a-zA-Z\s]{2,50}$/.test(String(value || '').trim());
export const isDept = value => /^[a-zA-Z\s]{2,30}$/.test(String(value || '').trim());
export const isInstitution = value => /^[a-zA-Z\s.,'-]{2,100}$/.test(String(value || '').trim());

export function validateRegistration(body) {
  const errors = {};
  if (!body.event?.trim()) errors.event = 'Event is required.';
  if (!isName(body.name)) errors.name = 'Name must contain 2–50 letters and spaces.';
  if (!isEmail(body.email)) errors.email = 'Valid email is required.';
  if (!isPhone(body.phone)) errors.phone = 'Valid 10-digit Indian mobile number is required.';
  if (!body.year?.trim()) errors.year = 'Year of study is required.';
  if (!isDept(body.dept)) errors.dept = 'Department is required.';
  if (!isInstitution(body.inst)) errors.inst = 'Institution name is required.';
  if (body.team && String(body.team).length > 100) errors.team = 'Team name is too long.';
  return errors;
}
