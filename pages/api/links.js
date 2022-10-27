// Put this code in the following path of your Next.js website:
// /pages/api/preview/links.js
// this "routing" function knows how to convert a DatoCMS record
// into canonical URL within the website
const generatePreviewLink = ({ item, itemType, locale }) => {
  const localePrefix = locale === "en" ? "" : `/${locale}`;
  switch (itemType.attributes.api_key) {
    case "post":
      return {
        label: "Loclahost",
        url: `/posts/${item.attributes.slug}`,
      };
    default:
      return null;
  }
};
const handler = (req, res) => {
  // setup CORS permissions
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");
  // This will allow OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).send("ok");
  }
  const previewLink = generatePreviewLink(req.body);
  if (!previewLink) {
    return res.status(200).json({ previewLinks: [] });
  }
  const previewLinks = [
    {label: previewLink.label, url: `${process.env.SITE_URL}${previewLink.url}`},
    // we generate the Preview Mode URL:
    {
      label: `${previewLink.label} - Preview`,
      url: `${process.env.SITE_URL}/api/preview?redirect=${previewLink.url}`,
    },
  ];
  return res.status(200).json({ previewLinks });
};
export default handler;