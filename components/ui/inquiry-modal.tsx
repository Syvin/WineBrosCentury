import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Plus, Minus, Info, CheckCircle2, ChevronRight } from "lucide-react";
import { Sedan } from "next/font/google";
import { getInventory } from "@/lib/actions/inventory";
import { preloadAllImages, getCachedImage } from "@/lib/image-cache";
import type { Inventory } from "@/types/database";

const sedan = Sedan({
  variable: "--font-sedan",
  subsets: ["latin"],
  weight: "400",
});

export function InquiryModal({ isOpen, onClose, defaultOption = "" }: { isOpen: boolean; onClose: () => void; defaultOption?: string }) {
  const [mounted, setMounted] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterVintage, setFilterVintage] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    establishment: "",
    email: "",
    remarks: ""
  });
  const [mobileTab, setMobileTab] = useState<"cellar" | "form">("cellar");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  // Get unique categories and vintages from inventory
  const categories = useMemo(() => Array.from(new Set(inventory.map(b => b.category))), [inventory]);
  const vintages = useMemo(() => Array.from(new Set(inventory.map(b => b.vintage))).sort(), [inventory]);

  // Filter inventory based on active filters
  const filteredInventory = useMemo(() => {
    return inventory.filter((b: Inventory) => {
      if (filterCategory && b.category !== filterCategory) return false;
      if (filterVintage && b.vintage !== filterVintage) return false;
      return true;
    });
  }, [inventory, filterCategory, filterVintage]);

  useEffect(() => {
    setMounted(true);
    setIsLoading(true);
    getInventory().then((inv) => {
      setInventory(inv);
      // Preload all images into shared cache
      const urls = inv.map(b => b.image_url).filter(Boolean) as string[];
      preloadAllImages(urls);
    }).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  // Manage body scroll and Lenis bypass
  useEffect(() => {
    const lenis = (window as any).lenis || (window as any).Lenis;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (lenis?.stop) lenis.stop();
      setQuantities(defaultOption ? { [defaultOption]: 1 } : {});
      setStatus("idle");
      setFormData({ name: "", establishment: "", email: "", remarks: "" });
      setMobileTab("cellar");
    } else {
      document.body.style.overflow = '';
      if (lenis?.start) lenis.start();
    }
  }, [isOpen, defaultOption]);

  const handleIncrement = (value: string) => {
    setQuantities(prev => ({ ...prev, [value]: (prev[value] || 0) + 1 }));
  };

  const handleDecrement = (value: string) => {
    setQuantities(prev => {
      const next = { ...prev, [value]: Math.max(0, (prev[value] || 0) - 1) };
      if (next[value] === 0) delete next[value];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalSelectedCount === 0 || !formData.name || !formData.email) return;

    setStatus("submitting");

    const requestedItems = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = inventory.find(i => i.id === id);
        return item ? `${item.name} (${item.vintage}) x${qty}` : `Unknown Item (${id}) x${qty}`;
      })
      .join(", ");

    const finalMessage = `${formData.establishment ? formData.establishment + " — " : ""}Requested: ${requestedItems}. Remarks: ${formData.remarks}`.trim();

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.name,
          email: formData.email,
          message: finalMessage,
        }),
      });

      if (!res.ok) {
        setStatus("idle");
        alert("Failed to submit inquiry. Please try again.");
        return;
      }

      setStatus("success");
      setTimeout(onClose, 3000);
    } catch (err) {
      console.error(err);
      setStatus("idle");
      alert("Failed to connect. Please try again.");
    }
  };

  if (!mounted) return null;

  const totalSelectedCount = Object.values(quantities).reduce((a, b) => a + b, 0);
  const isValid = formData.name.length > 2 && formData.email.includes("@") && totalSelectedCount > 0;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 backdrop-blur-3xl bg-black/90"
      >
        <motion.div
          initial={{ scale: 0.98, y: 10, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.98, y: 10, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
          className="max-w-[1100px] w-full h-[100dvh] md:h-[800px] bg-zinc-950 border-0 md:border md:border-white/10 rounded-none md:rounded-[40px] relative overflow-hidden flex flex-col md:flex-row shadow-2xl"
        >
          {/* Mobile Tabs */}
          <div className="flex md:hidden sticky top-0 z-50 bg-zinc-950 border-b border-white/10 w-full shrink-0">
             <button onClick={() => setMobileTab("cellar")} className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${mobileTab === "cellar" ? "text-[#D4A04A] border-b-2 border-[#D4A04A] bg-[#D4A04A]/5" : "text-white/40"}`}>
               Cellar
             </button>
             <button onClick={() => setMobileTab("form")} className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${mobileTab === "form" ? "text-[#D4A04A] border-b-2 border-[#D4A04A] bg-[#D4A04A]/5" : "text-white/40"}`}>
               Inquiry {totalSelectedCount > 0 && `(${totalSelectedCount})`}
             </button>
             <button onClick={onClose} className="p-4 flex items-center justify-center text-white/50 hover:text-white border-l border-white/5">
               <X className="w-5 h-5" />
             </button>
          </div>
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-center p-12"
            >
              <CheckCircle2 className="w-20 h-20 text-yellow-600 mb-8" />
              <h2 className={`${sedan.className} text-5xl text-white mb-4 tracking-tight`}>Requisition Received</h2>
              <p className="text-white/40 text-sm max-w-sm mx-auto uppercase tracking-widest leading-relaxed">
                Our concierge will reach out to your establishment shortly to finalize logistics.
              </p>
              <button onClick={onClose} className="mt-12 text-[10px] text-yellow-600 font-bold uppercase tracking-[0.4em] hover:text-white transition-colors">Return to Gallery</button>
            </motion.div>
          ) : null}

          {/* subtle accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-600/5 blur-[120px] pointer-events-none" />

          {/* LEFT PANEL: Form & Context */}
          <div className={`w-full md:w-[40%] p-6 md:p-12 flex-col justify-between shrink-0 overflow-y-auto z-10 border-r border-white/5 bg-zinc-950 ${mobileTab === "form" ? "flex" : "hidden md:flex"}`} data-lenis-prevent>
            <div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                title="Close"
                className="hidden md:flex absolute top-6 left-6 md:relative md:top-0 md:left-0 md:mb-12 w-10 h-10 flex-col items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <X className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
              </button>

              <div className="space-y-3 mb-6 mt-12 md:mt-0">
                <span className="text-yellow-600/80 uppercase tracking-[0.6em] text-[10px] font-bold block flex items-center gap-2">
                  <Info className="w-3 h-3" /> Wholesale Concierge
                </span>
                <h2 className={`${sedan.className} text-4xl text-white tracking-tight font-light`}>Allocated<br />Acquisitions</h2>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold pt-3 leading-relaxed max-w-[280px]">
                  Specify desired inventory for custom B2B pricing and procurement logistics.
                </p>
              </div>

              {/* Filter Controls */}
              <div className="space-y-4 mb-8">
                <h3 className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/50">Filters</h3>
                <div className="relative group">
                  <select
                    value={filterCategory || ""}
                    onChange={(e) => setFilterCategory(e.target.value || null)}
                    className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-yellow-600/40 transition-all text-white placeholder:text-white/20 text-[10px] tracking-[0.3em] font-bold appearance-none cursor-pointer"
                  >
                    <option value="" className="text-black">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="text-black">{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-3 h-3 rotate-90" />
                  </div>
                </div>
                <div className="relative group">
                  <select
                    value={filterVintage || ""}
                    onChange={(e) => setFilterVintage(e.target.value ? Number(e.target.value) : null)}
                    className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-yellow-600/40 transition-all text-white placeholder:text-white/20 text-[10px] tracking-[0.3em] font-bold appearance-none cursor-pointer"
                  >
                    <option value="" className="text-black">All Vintages</option>
                    {vintages.map(vin => (
                      <option key={vin} value={vin} className="text-black">{vin}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-3 h-3 rotate-90" />
                  </div>
                </div>
              </div>

              <form className="space-y-8" id="inquiry-form" onSubmit={handleSubmit}>
                <div className="relative group">
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="REPRESENTATIVE NAME"
                    aria-label="Representative Name"
                    className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-yellow-600/40 transition-all text-white placeholder:text-white/20 text-[10px] tracking-[0.3em] font-bold"
                  />
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    value={formData.establishment}
                    onChange={(e) => setFormData({ ...formData, establishment: e.target.value })}
                    placeholder="ESTABLISHMENT / ENTITY"
                    aria-label="Company or Establishment"
                    className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-yellow-600/40 transition-all text-white placeholder:text-white/20 text-[10px] tracking-[0.3em] font-bold"
                  />
                </div>
                <div className="relative group">
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="SECURE EMAIL CONTACT"
                    aria-label="Contact Email"
                    className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-yellow-600/40 transition-all text-white placeholder:text-white/20 text-[10px] tracking-[0.3em] font-bold"
                  />
                </div>
                <div className="relative group mt-6">
                  <textarea
                    rows={2}
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="SPECIAL INSTRUCTIONS / REMARKS"
                    aria-label="Specific Requirements or Remarks"
                    className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-yellow-600/40 transition-all text-white placeholder:text-white/20 resize-none text-[10px] tracking-[0.3em] font-bold"
                  />
                </div>
              </form>
            </div>

            <div className="pt-8 md:pt-12 pb-4">
              <button
                form="inquiry-form"
                disabled={!isValid || status === "submitting"}
                className={`w-full py-5 rounded-full border transition-all duration-700 uppercase tracking-[0.5em] text-[11px] font-bold flex items-center justify-center gap-4 relative overflow-hidden group/submit ${isValid
                  ? 'border-yellow-600/40 bg-yellow-600/20 text-white shadow-[0_0_30px_rgba(202,138,4,0.15)] ring-1 ring-yellow-600/20'
                  : 'border-white/10 bg-white/[0.02] text-white/20 cursor-not-allowed'
                  }`}>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 via-transparent to-transparent opacity-0 group-hover/submit:opacity-100 transition-opacity duration-1000" />
                <span className="relative z-10">
                  {status === "submitting" ? "Securing Allocation..." : "Submit Requisition"}
                </span>
                <Send className={`w-3.5 h-3.5 relative z-10 transition-transform duration-700 ${isValid && status === "idle" ? 'group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1 text-yellow-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: Dynamic Grid Catalog */}
          <div className={`w-full md:w-[60%] bg-zinc-900/50 flex-col relative z-10 overflow-hidden h-full ${mobileTab === "cellar" ? "flex" : "hidden md:flex"}`}>
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-zinc-950/50 backdrop-blur-md sticky top-0 z-20">
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/50">Global Cellar</h3>
              <span className="text-[10px] font-bold px-3 py-1 bg-white/5 rounded-full text-white/70 tracking-widest border border-white/10">
                {totalSelectedCount > 0 ? `${totalSelectedCount} Selected` : 'Awaiting Selection'}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8" data-lenis-prevent>
              {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-20">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col rounded-[20px] border border-white/5 bg-white/[0.01] overflow-hidden">
                      <div className="aspect-[4/5] w-full bg-zinc-950/80 relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="h-4 w-3/4 bg-white/5 rounded mb-2" />
                          <div className="h-3 w-1/3 bg-yellow-600/20 rounded mb-1" />
                          <div className="h-2 w-1/4 bg-white/5 rounded" />
                        </div>
                      </div>
                      <div className="p-3 bg-zinc-950/40 border-t border-white/5 mt-auto">
                        <div className="h-10 w-full bg-white/5 rounded-xl" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-20">
                {filteredInventory.map(opt => {
                  const qty = quantities[opt.id] || 0;
                  const isSelected = qty > 0;

                  return (
                    <div key={opt.id} className={`relative flex flex-col rounded-[20px] border transition-all duration-500 overflow-hidden group ${isSelected
                      ? 'border-yellow-600/40 bg-yellow-600/[0.03] shadow-[0_0_20px_rgba(202,138,4,0.05)]'
                      : 'border-white/5 bg-white/[0.01] hover:border-white/15'
                      }`}>
                      {/* Card Image */}
                      <div className="aspect-[4/5] w-full relative bg-zinc-950/80 overflow-hidden">
                        {opt.image_url ? (
                          <img 
                            src={opt.image_url} 
                            alt={opt.name} 
                            className={`w-full h-full object-cover transition-all duration-700 ${isSelected ? 'opacity-90 scale-105' : 'opacity-40 group-hover:opacity-70 group-hover:scale-105'}`}
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-900"><Info className="w-6 h-6 text-white/10" /></div>
                        )}
                        {/* Gradient Fade */}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                        {/* Card Details floating on image */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white leading-tight mb-2 opacity-90 line-clamp-2">{opt.name} ({opt.vintage})</h4>
                          <p className="text-[9px] text-yellow-600 font-bold tracking-widest uppercase">₱{opt.price.toLocaleString()}</p>
                          <p className="text-[8px] text-white/50 tracking-widest uppercase mt-1">{opt.stock} in stock</p>
                        </div>
                      </div>

                      {/* Control Bar */}
                      <div className="p-3 bg-zinc-950/40 border-t border-white/5 mt-auto">
                        {isSelected ? (
                          <div className="flex items-center justify-between bg-zinc-950/80 rounded-xl p-1 border border-white/10 backdrop-blur-sm ring-1 ring-white/5">
                            <button type="button" aria-label={`Decrease quantity of ${opt.name}`} onClick={() => handleDecrement(opt.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.03] hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300 border border-white/5">
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[12px] font-bold text-yellow-600 tracking-widest">{qty}</span>
                            <button type="button" aria-label={`Increase quantity of ${opt.name}`} onClick={() => handleIncrement(opt.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-yellow-600/10 hover:bg-yellow-600/20 text-yellow-600 hover:text-yellow-500 transition-all duration-300 border border-yellow-600/20">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleIncrement(opt.id)}
                            className="w-full py-3 rounded-xl border border-white/10 bg-white/[0.03] text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-yellow-600/10 hover:border-yellow-600/40 hover:text-white text-white/50 transition-all duration-500 group/btn"
                          >
                            <span className="group-hover/btn:scale-105 transition-transform duration-500 inline-block">Request Allocation</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                </div>
              )}
            </div>

            {/* Mobile Submit Button - Fixed to bottom */}
            <div className="md:hidden border-t border-white/5 p-4 bg-zinc-950 sticky bottom-0 z-30">
              <button
                onClick={() => setMobileTab("form")}
                className="w-full py-4 rounded-full border border-[#D4A04A]/40 bg-[#D4A04A]/15 text-[#f5e6d0] uppercase tracking-[0.4em] text-[11px] font-bold flex items-center justify-center gap-3 active:scale-95 shadow-[0_0_20px_rgba(202,138,4,0.1)] transition-transform"
              >
                Proceed to Inquiry <ChevronRight className="w-3.5 h-3.5 text-[#D4A04A]" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>,
  document.body
);
}

