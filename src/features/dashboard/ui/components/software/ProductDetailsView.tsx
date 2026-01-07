import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CheckIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { useGetProductDetailsQuery } from "@features/dashboard/api/dashboard-api";
import { StartProjectModal } from "../modals/StartProjectModal";

type ProductDetailsViewProps = {
  readonly productId: string;
  readonly tokens: DashboardTokens;
  readonly onBack?: () => void;
};

type AddonFeature = {
  readonly id: string;
  readonly name: string;
  readonly price: string;
  readonly selected: boolean;
};

export const ProductDetailsView = ({ productId, tokens }: ProductDetailsViewProps) => {
  const { t } = useTranslation("landing");
  const productIdNum = parseInt(productId, 10);
  const isValidId = !isNaN(productIdNum) && productIdNum > 0;
  const { data: apiData, isLoading } = useGetProductDetailsQuery(productIdNum, {
    skip: !isValidId,
    refetchOnMountOrArgChange: true,
  });
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [isStartProjectModalOpen, setIsStartProjectModalOpen] = useState(false);

  // Reset state when productId changes
  useEffect(() => {
    setSelectedThumbnail(0);
    setSelectedAddons(new Set());
  }, [productId]);

  // Extract product data from API
  const product = apiData?.data;

  // Get media images for thumbnails
  const mediaThumbnails = useMemo(() => {
    if (product?.media && product.media.length > 0) {
      return product.media.map((m) => m.file_path);
    }
    // If no media, use the main image
    if (product?.image) {
      return [product.image];
    }
    return [];
  }, [product]);

  // Get addons as features
  const addonFeatures: AddonFeature[] = useMemo(() => {
    if (product?.addons && product.addons.length > 0) {
      return product.addons.map((addon) => ({
        id: `addon-${addon.id}`,
        name: addon.name,
        price: addon.price,
        selected: selectedAddons.has(`addon-${addon.id}`),
      }));
    }
    return [];
  }, [product?.addons, selectedAddons]);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`${tokens.cardBase} rounded-[20px] px-6 py-10 flex items-center justify-center min-h-[400px]`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#071FD7] border-t-transparent rounded-full animate-spin" />
          <span className={tokens.subtleText}>Loading product details...</span>
        </div>
      </div>
    );
  }

  // No data state
  if (!product) {
    return (
      <div className={`${tokens.cardBase} rounded-[20px] px-6 py-10 flex items-center justify-center min-h-[400px]`}>
        <div className="flex flex-col items-center gap-4">
          <span className={`text-xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
            Product not found
          </span>
          <span className={tokens.subtleText}>The product you're looking for doesn't exist.</span>
        </div>
      </div>
    );
  }

  const currentImage = selectedThumbnail < mediaThumbnails.length 
    ? mediaThumbnails[selectedThumbnail] 
    : product.image;

  return (
    <div className="flex flex-col gap-6">
      {/* Two Column Layout in One Container */}
      <div className={`${tokens.cardBase} rounded-[20px] px-6 py-10 transition-colors ${tokens.isDark ? "bg-transparent stroke" : "!bg-white"}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Images */}
          <div className="h-full">
            <div className="h-full">
              <div 
                className="relative rounded-[20px] overflow-hidden flex flex-col items-center justify-center gap-10 h-full min-h-[600px]"
                style={{
                  backgroundColor: '#FFFEF7',
                  backgroundImage: product.background_image ? `url(${product.background_image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {currentImage && (
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-auto object-cover relative z-10 flex-1"
                  />
                )}
                {/* Thumbnail Carousel - only show if there are multiple media items */}
                {mediaThumbnails.length > 1 && (
                  <div className="grid grid-cols-6 gap-3 pb-10 px-10 relative z-10">
                    {mediaThumbnails.map((thumbnail, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedThumbnail(index)}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                          selectedThumbnail === index
                            ? "border-black"
                            : "border-transparent"
                        }`}
                      >
                        <div className="relative border border-[#D8D8DD] aspect-square rounded-lg">
                          <img
                            src={thumbnail}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Description and Features */}
          <div className="flex flex-col gap-6">
            {/* Product Title and Type */}
            <div className="flex flex-col gap-2">
              <h1 className={`text-3xl md:text-4xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                {product.name}
              </h1>
              <p className={`text-lg ${tokens.isDark ? "text-white/70" : "text-black"}`}>
                {product.type}
              </p>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-2xl font-bold ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}>
                {product.price} EGP
              </span>
            </div>

            {/* Product Description */}
            <div>
              <p className={`text-base leading-relaxed whitespace-pre-line ${tokens.isDark ? "text-white/80" : "text-[#5C5C5C]"}`}>
                {product.description}
              </p>
              {product.note && (
                <p className={`text-sm mt-2 ${tokens.isDark ? "text-white/60" : "text-[#888888]"}`}>
                  <strong>Note:</strong> {product.note}
                </p>
              )}
            </div>

            {/* Addons Section - only show if there are addons */}
            {addonFeatures.length > 0 && (
              <div>
                <h2 className={`text-xl font-semibold mb-4 ${tokens.isDark ? "text-white" : "text-black"}`}>
                  {t("dashboard.product.additionalFeatures")}
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {addonFeatures.map((addon) => (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-[20px] border-2 transition-all text-left max-w-[450px] ${
                        addon.selected
                          ? tokens.isDark
                            ? "border-[#071FD7] bg-[#071FD7]/10"
                            : "border-[#071FD7] bg-[#071FD7]/5"
                          : tokens.isDark
                            ? "border-white/20 bg-transparent hover:border-white/30"
                            : "border-[#DBDBDB] bg-transparent hover:border-[#071FD7]/30"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors ${
                            addon.selected
                              ? "bg-[#071FD7]"
                              : tokens.isDark
                                ? "bg-transparent border-2 border-white/50"
                                : "bg-transparent border-2 border-[#DBDBDB]"
                          }`}
                        >
                          {addon.selected && (
                            <CheckIcon className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span
                          className={`text-sm md:text-base font-bold ${
                            tokens.isDark ? "text-white" : "text-[#3F3849]"
                          }`}
                        >
                          {addon.name}
                        </span>
                      </div>
                      <span className={`text-sm font-medium ${tokens.isDark ? "text-white/70" : "text-[#071FD7]"}`}>
                        +{addon.price} EGP
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments Section - only show if there are attachments */}
            {product.attachments && product.attachments.length > 0 && (
              <div>
                <h2 className={`text-xl font-semibold mb-4 ${tokens.isDark ? "text-white" : "text-black"}`}>
                  Attachments
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        tokens.isDark
                          ? "bg-white/10 text-white hover:bg-white/20"
                          : "bg-[#E6E9FB] text-[#071FD7] hover:bg-[#D6D9EB]"
                      }`}
                    >
                      Download PDF
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Start Project Button */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setIsStartProjectModalOpen(true)}
                className="inline-flex flex-wrap items-center gap-2 rounded-full bg-[#071FD7] text-white px-12 py-3 text-base font-medium cursor-pointer hover:bg-[#071FD7]/90 transition-colors"
              >
                {t("dashboard.product.startProject")}
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
