import { Metadata } from "next";
import ServiceDetailsPage from "./ServiceDetailsPage";

const BACKEND_URL = "https://api.thegroome.com";
const WEBSITE_URL = "https://thegroome.com";

async function getService(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/users/services/${id}`, {
      next: { revalidate: 300 },
    });

    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch metadata for service:", error);
    return null;
  }
}

// 1. Ensure the type definition perfectly matches Next.js specifications
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Await the parameters safely
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    return {
      title: "Service",
      description: "Service experience details.",
    };
  }

  // 2. Normalize image field mapping to look for both architectures 
  // (matching your client component layout)
  const rawImages = service.images || service.service_images || [];
  const primaryImage = rawImages[0];

  const imageUrl = primaryImage?.image_url
    ? primaryImage.image_url.startsWith("http")
      ? primaryImage.image_url
      : `${BACKEND_URL}${primaryImage.image_url}`
    : `${WEBSITE_URL}/placeholder.png`;

  const shareUrl = `${WEBSITE_URL}/services/${id}`;
  const finalPrice =
    service.discount_price != null
      ? Number(service.price) - Number(service.discount_price)
      : Number(service.price);

  const cleanDescription = service.description || `Book ${service.name} starting from ₹${finalPrice}.`;

  return {
    metadataBase: new URL(WEBSITE_URL),
    title: service.name,
    description: cleanDescription,
    openGraph: {
      title: service.name,
      description: cleanDescription,
      url: shareUrl,
      siteName: "TheGroome",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: service.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: service.name,
      description: cleanDescription,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// 3. Bind the async params context directly to the Page execution thread
export default async function Page({ params }: PageProps) {
  // We await this to make sure Next.js completes the server cycle perfectly
  await params; 
  
  return <ServiceDetailsPage />;
}