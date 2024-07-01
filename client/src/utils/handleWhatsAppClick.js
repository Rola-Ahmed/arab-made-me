export function WhatsAppTab({ phoneNumber }) {
  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  return handleWhatsAppClick;
}
