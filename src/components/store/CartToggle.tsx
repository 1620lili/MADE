// src/components/store/CartToggle.tsx
"use client";

import { useState } from "react";
import CartRecommendations from "./CartRecommendations";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

// Dummy data for demonstration – replace with real data as needed
const dummyRecommendations: Product[] = [
  {
    id: "1",
    name: "Aether Pro Hybrid Mouse",
    price: 189000,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZvPrZ_TeDgd_3DOYeSDKRSTQPCpkwMn_GFvRRyYjXhll4Z_Z1deVQ8neyc46GTd4E60lvbw_SC8QRN8x8awV6W3oSFN9gWcUePyxe6x2WxrUDoedDhlq-o3XEecd4qexIi-5PUnfLcEzFJjgl9Go-MaOU7mxazeAjTbcwcJn7OoHLTL87FsTjenTlSSAXWFJwT7dV8Du-OxbglBiBE4GvF4QMxoCMFGkyofqDSKdNiC1c0A04l-6NWI7sAT8JZOp29S1GHJrv4gNw",
  },
  {
    id: "2",
    name: "Titan Desk Mat",
    price: 45000,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_34bEFhZ4xoV0i8FCrY9tX1GJzA0CF1OkIp3RpK01oQuaMh1J7DIwL_oP8qFPIGAkq-_p3y6zKyY-GTvbP4Vpm2UT8IHlptJk9dEADIuIzZTw6jqaiVruzEnODnNPUBOjOfKYv5M56_xH1hmf0nPltS4RqujVrK-CqcEJmquO7Og5xOd0YdLqDDQJeTY69A0vD8g37OFi1qnmqy2EVZozGL_3txdl0E7RpeMKSbdj43qRqZKfGEwIgoumnUn2rPEexSokiLWIFVmw",
  },
  {
    id: "3",
    name: "Vector Pro Arm",
    price: 129000,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGytKFqfmcnU12Tl1qRYDyUAwMNCHYv3Fa8sIj-miJIV_mGnyTyE3djYKFAimIBLisTMIwdDwoA97QiMd7PJoWUEf4ZzEW0q70Zb_QNevhezKwAYe6eDv5bLdq_1F1XxRvTMX9laQ0Nwx_skpvj6WkeScVFqIFwqekZJZ3lygoLOxhtNA4AOqiAdAuvgS_n29iRcWoPIeuszE0p_dTLrmtgObEkVIwZaPXQrstH88YjEODhZYt1PUhHDPwvZeG7ihJLsDQhdA3vUlB",
  },
  {
    id: "4",
    name: "Neon Cable Sleeves",
    price: 39000,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEo72md2v2KBhrNx-8Q27dNemv_ZHl2M4_TtQeH2xnJorCWriQPE6MDVauFdsK7xiUZPWbL4Z41v7IQlzbDoNTGO7PM-SJArsrrOPVB3CV4wkr3jAp8iR_IOUSFaGpM56RrL2fVkxvS2COnAWHZHtFhXIDSOkdzfUeB1MNveajvCslpZu7v5hJVc7dh2ZjMyd1NooXFZ-8AqLGjgMOckg1t535mSlRqmUj9lInhQT-CSP4gYY4ovaJz2NBWc_NhuCrA0OtRKEdzC54",
  },
];

export default function CartToggle() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className="relative cursor-pointer active:scale-95 transition-all" onClick={handleOpen}>
        <span className="material-symbols-outlined text-[#00FFC2]" data-icon="shopping_cart">shopping_cart</span>
        <span className="absolute -top-2 -right-2 bg-primary-container text-on-primary-container text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
          {dummyRecommendations.length}
        </span>
      </div>
      <CartRecommendations isOpen={open} onClose={handleClose} recommendations={dummyRecommendations} />
    </>
  );
}
