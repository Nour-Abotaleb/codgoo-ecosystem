import { useState } from "react";
import { CheckIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
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

export const ProductDetailsView = ({ productId, tokens, onBack }: ProductDetailsViewProps) => {
  // productId and onBack are kept in props for API compatibility but not currently used
  void productId;
  void onBack;
  const [selectedThumbnail, setSelectedThumbnail] = useState(4); // 5th thumbnail (index 4) is selected
  const [features, setFeatures] = useState<FeatureOption[]>(defaultFeatures);
  const [isStartProjectModalOpen, setIsStartProjectModalOpen] = useState(false);

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
      <div className={`${tokens.cardBase} rounded-2xl px-6 py-10 transition-colors ${tokens.isDark ? "!bg-[#1E1B2E]" : "!bg-white"}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Images */}
          <div>
            {/* Main Product Image */}
            <div className="mb-6">
              <div className="relative bg-[#FFFEF7] rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-10">
                <img
                  src={prDetailsImg}
                  alt="Product details"
                  className="w-full h-auto object-contain"
                />
                 {/* Thumbnail Carousel */}
                 <div className="grid grid-cols-6 gap-3 pb-10 px-10">
                 {productThumbnails.map((_thumbnail, index) => (
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
                         src={prDetailsImg}
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
                Mobile App Development
                </h1>
                <p className={`text-lg ${tokens.isDark ? "text-white/70" : "text-black"}`}>
                Cross-Platform App Development
                </p>
            </div>
            {/* Product Description */}
            <div>
              <p className={`text-base leading-relaxed ${tokens.isDark ? "text-white/80" : "text-[#5C5C5C]"}`}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </div>

            {/* Additional Features Section */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${tokens.isDark ? "text-white" : "text-black"}`}>
                Additional Features
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {features.map((feature) => (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => toggleFeature(feature.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left max-w-[450px] ${
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
        onSave={(data) => {
          console.log("Project data:", data);
          // Handle project submission here
        }}
      />
    </div>
  );
};

