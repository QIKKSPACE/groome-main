import { Metadata } from "next";
import ProductPage from "./ProductPage";

const BACKEND_URL = "https://api.thegroome.com";
const WEBSITE_URL = "https://thegroome.com";

async function getProduct(id: string) {
  const res = await fetch(`${BACKEND_URL}/users/products/${id}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  return data.product; // Return the actual product object
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product",
      description: "Product not found",
    };
  }

  const primaryImage =
    product.images?.find((img: any) => img.is_primary) ||
    product.images?.[0];

  const imageUrl = primaryImage?.image_url
    ? primaryImage.image_url.startsWith("http")
      ? primaryImage.image_url
      : `${BACKEND_URL}${primaryImage.image_url}`
    : `${WEBSITE_URL}/placeholder.png`;

  const shareUrl = `${WEBSITE_URL}/product/${id}`;

  return {
    metadataBase: new URL(WEBSITE_URL),

    title: product.name,
    description: product.description || "Browse this product on TheGroome.",

   openGraph: {
  title: product.name,
  description: product.description || "Browse this product on TheGroome.",
  url: shareUrl,
  siteName: "TheGroome",
  type: "website",
  images: [
    {
      url: imageUrl,
      width: 1200,
      height: 630,
      alt: product.name,
    },
  ],
},

    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description || "Browse this product on TheGroome.",
      images: [imageUrl],
    },
  };
}

export default function Page() {
  return <ProductPage />;
}