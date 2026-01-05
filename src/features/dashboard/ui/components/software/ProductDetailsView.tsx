import { useState, useMemo } from "react";
import { CheckIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { useGetProductDetailsQuery } from "@features/dashboard/api/dashboard-api";
import { StartProjectModal } from "../modals/StartProjectModal";
import prDetailsImg from "@assets/images/software/pr-details1.svg";
import productImg1 from "@assets/images/software/product-img1.svg";
import productImg2 from "@assets/images/software/product-img2.svg";
import productImg3 from "@assets/images/software/product-img3.svg";

type ProductDetailsViewProps = {
  readonly productId: string;
  readonly tokens: DashboardTokens;
  readonly onBack?: () => void;
};

type FeatureOption = {
  readonly id: string;
  readonly name: string;
  readonly selected: boolean;
};

const defaultFeatures: FeatureOption[] = [
  { id: "figma-1", name: "Figma Design", selected: false },
  { id: "payment-1", name: "Payment Gateway integration", selected: true },
  { id: "figma-2", name: "Figma Design", selected: false },
  { id: "payment-2", name: "Payment Gateway integration", selected: true },
];

const productThumbnails = [
  productImg1,
  productImg2,
  productImg3,
  productImg1,
  productImg2,
  productImg3,
];

export const ProductDetailsView = ({ productId, tokens }: ProductDetailsViewProps) => {
  const productIdNum = parseInt(productId, 10);
  const { data: apiData } = useGetProductDetailsQuery(productIdNum);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [features, setFeatures] = useState<FeatureOption[]>(defaultFeatures);
  const [isStartProjectModalOpen, setIsStartProjectModalOpen] = useState(false);

  // Extract product data from API
  const productData = useMemo(() => {
    if (apiData?.data) {
      return {
        name: apiData.data.name,
        subtitle: apiData.data.type || "Product",
        description: apiData.data.description,
        price: apiData.data.price,
        note: apiData.data.note,
        image: apiData.data.image || prDetailsImg,
        background_image: apiData.data.background_image || null,
        media: apiData.data.media || [],
        addons: apiData.data.addons || [],
        attachments: apiData.data.attachments || [],
      };
    }
    return {
      name: "Mobile App Development",
      subtitle: "Cross-Platform App Development",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      price: "0",
      note: "",
      image: prDetailsImg,
      background_image: null,
      media: [],
      addons: [],
      attachments: [],
    };
  }, [apiData]);

  // Generate addon features from API data
  const addonFeatures = useMemo(() => {
    if (productData.addons.length > 0) {
      return productData.addons.map((addon: any, idx: number) => ({
        id: `addon-${addon.id}`,
        name: addon.name,
        selected: idx < 2, // First 2 selected by default
      }));
    }
    return defaultFeatures;
  }, [productData.addons]);

  // Use addon features if available, otherwise use default
  const displayFeatures = useMemo(() => {
    if (addonFeatures.length > 0) {
      return addonFeatures;
    }
    return features;
  }, [addonFeatures, features]);

  // Get media images for thumbnails
  const mediaThumbnails = useMemo(() => {
    if (productData.media.length > 0) {
      return productData.media.map((m: any) => m.file_path);
    }
    return productThumbnails;
  }, [productData.media]);

  const toggleFeature = (id: string) => {
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === id ? { ...feature, selected: !feature.selected } : feature
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Two Column Layout in One Container */}
      <div className={`${tokens.cardBase} rounded-[20px] px-6 py-10 transition-colors ${tokens.isDark ? "bg-tansparent stroke " : "!bg-white"}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Images */}
          <div className="h-full">
            {/* Main Product Image */}
            <div className="h-full">
              <div 
                className="relative rounded-[20px] overflow-hidden flex flex-col items-center justify-center gap-10 h-full min-h-[600px]"
                style={{
                  backgroundColor: '#FFFEF7',
                  backgroundImage: productData.background_image ? `url(${productData.background_image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <img
                  src={selectedThumbnail < mediaThumbnails.length ? mediaThumbnails[selectedThumbnail] : productData.image}
                  alt="Product details"
                  className="w-full h-auto object-contain relative z-10 flex-1"
                />
                 {/* Thumbnail Carousel */}
                 <div className="grid grid-cols-6 gap-3 pb-10 px-10 relative z-10">
                 {mediaThumbnails.map((_thumbnail, index) => (
                     <button
                     key={index}
                     type="button"
                     onClick={() => setSelectedThumbnail(index)}
                     className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                         selectedThumbnail === index
                         ? "border-black"
                         : tokens.isDark
                             ? "border-transparent"
                             : "border-transparent"
                     }`}
                     >
                     <div className="relative border border-[#D8D8DD] aspect-square rounded-lg">
                         <img
                         src={_thumbnail}
                         alt={`Thumbnail ${index + 1}`}
                         className="w-full h-full object-cover"
                         />
                     </div>
                     </button>
                 ))}
                 </div>
              </div>
            </div>

          </div>

          {/* Right Column - Description and Features */}
          <div className="flex flex-col gap-6">
            {/* Product Title and Subtitle */}
            <div className="flex flex-col gap-2">
                <h1 className={`text-3xl md:text-4xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                {productData.name}
                </h1>
                <p className={`text-lg ${tokens.isDark ? "text-white/70" : "text-black"}`}>
                {productData.subtitle}
                </p>
            </div>
            {/* Product Description */}
            <div>
              <p className={`text-base leading-relaxed ${tokens.isDark ? "text-white/80" : "text-[#5C5C5C]"}`}>
                {productData.description}
              </p>
              {productData.note && (
                <p className={`text-sm mt-2 ${tokens.isDark ? "text-white/60" : "text-[#888888]"}`}>
                  <strong>Note:</strong> {productData.note}
                </p>
              )}
            </div>

            {/* Additional Features Section */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${tokens.isDark ? "text-white" : "text-black"}`}>
                {displayFeatures.length > 0 ? "Additional Features" : "Addons"}
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {displayFeatures.map((feature) => (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => toggleFeature(feature.id)}
                  className={`flex items-center gap-3 p-3 rounded-[20px] border-2 transition-all text-left max-w-[450px] ${
                    feature.selected
                      ? tokens.isDark
                        ? "border-[#071FD7] bg-[#071FD7]/10"
                        : "border-[#071FD7] bg-[#071FD7]/5"
                      : tokens.isDark
                        ? "border-white/20 bg-transparent hover:border-white/30"
                        : "border-[#DBDBDB] bg-transparent hover:border-[#071FD7]/30"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors ${
                      feature.selected
                        ? "bg-[#071FD7]"
                        : tokens.isDark
                          ? "bg-transparent border-2 border-white/50"
                          : "bg-transparent border-2 border-[#DBDBDB]"
                    }`}
                  >
                    {feature.selected && (
                      <CheckIcon className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span
                    className={`text-sm md:text-base font-bold ${
                      feature.selected
                        ? tokens.isDark
                          ? "text-white"
                          : "text-[#3F3849]"
                        : tokens.isDark
                          ? "text-white"
                          : "text-[#3F3849]"
                    }`}
                  >
                    {feature.name}
                  </span>
                </button>
                ))}
              </div>
            </div>

            {/* Start Project Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsStartProjectModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[#071FD7] text-white px-12 py-3 text-base font-medium cursor-pointer hover:bg-[#071FD7]/90 transition-colors"
              >
                Start Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Start Project Modal */}
      <StartProjectModal
        tokens={tokens}
        isOpen={isStartProjectModalOpen}
        onClose={() => setIsStartProjectModalOpen(false)}
      />
    </div>
  );
};

