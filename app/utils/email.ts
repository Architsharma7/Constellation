export const handleSendEmail = (
  subject: string,
  body: any,
  recipient: string
) => {
  const emailSubject = encodeURIComponent(subject);
  const emailBody = encodeURIComponent(body);

  const mailtoLink = `mailto:${recipient}?subject=${emailSubject}&body=${emailBody}`;
  window.location.href = mailtoLink;
  return;
};
