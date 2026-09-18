import { useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronDown, Clock3, Compass, Menu as MenuIcon, Phone, Search, ShoppingBag, Star, X } from 'lucide-react';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Hisar+Haveli+Hisar+Haryana';

type Dish = { name: string; description: string; price: string; category: string; tag?: string };
const dishes: Dish[] = [
  { name: 'Paneer Tikka', description: 'Charred cottage cheese, capsicum, onion', price: '₹270', category: 'Tandoori' },
  { name: 'Paneer Butter Masala', description: 'Silky tomato gravy, soft paneer', price: '₹250', category: 'Paneer' },
  { name: 'Kadhai Paneer', description: 'Crushed spices, peppers, finished hot', price: '₹270', category: 'Paneer', tag: 'local pick' },
  { name: 'Shahi Paneer', description: 'Cashew cream, cardamom, mellow spice', price: '₹290', category: 'Paneer' },
  { name: 'Chilli Paneer', description: 'Crisp paneer, green chilli, soy', price: '₹290', category: 'Paneer' },
  { name: 'Dal Fry', description: 'Yellow lentils, tempering, coriander', price: '₹100', category: 'Indian curry' },
  { name: 'Rajma Masala', description: 'Slow-cooked kidney beans, homestyle', price: '₹150', category: 'Indian curry' },
  { name: 'Mix Veg', description: 'Seasonal vegetables, cumin and ginger', price: '₹150', category: 'Indian curry' },
  { name: 'Palak Paneer', description: 'Garden spinach, paneer, gentle heat', price: '₹180', category: 'Indian curry' },
  { name: 'Tandoori Roti', description: 'Clay-oven bread, brushed with butter', price: '₹15', category: 'Breads' },
  { name: 'Missi Roti', description: 'Gram flour, ajwain, a little crisp', price: '₹30', category: 'Breads' },
  { name: 'Butter Naan', description: 'Soft leavened naan, melted butter', price: '₹60', category: 'Breads', tag: 'best with gravy' },
  { name: 'Garlic Naan', description: 'Roasted garlic, coriander, tandoor', price: '₹90', category: 'Breads' },
  { name: 'Masala Dosa', description: 'Crisp rice crepe, potato masala', price: '₹140', category: 'South Indian' },
  { name: 'Paneer Masala Dosa', description: 'Classic dosa with a paneer filling', price: '₹170', category: 'South Indian' },
  { name: 'Idli Sambar', description: 'Steamed rice cakes, hot sambar', price: '₹80', category: 'South Indian' },
  { name: 'Veg Manchurian', description: 'Crisp vegetable dumplings, tangy sauce', price: '₹150', category: 'Tandoori' },
  { name: 'Paneer Tikka Sandwich', description: 'Toasted bread, spiced paneer, chutney', price: '₹140', category: 'Tandoori' },
  { name: 'Mango Shake', description: 'Thick seasonal mango, chilled', price: '₹90', category: 'Shakes' },
  { name: 'Cold Coffee', description: 'Slow blended coffee, ice cream', price: '₹100', category: 'Shakes' },
  { name: 'Fresh Lime Soda', description: 'Sweet or salted, made to order', price: '₹60', category: 'Shakes' },
  { name: 'Jeera Rice', description: 'Basmati rice, cumin, ghee', price: '₹120', category: 'Rice' },
  { name: 'Veg Pulao', description: 'Fragrant rice, garden vegetables', price: '₹150', category: 'Rice' },
  { name: 'Gulab Jamun', description: 'Two warm syrup-soaked dumplings', price: '₹40', category: 'Sweets' },
  { name: 'Gajar Ka Halwa', description: 'Seasonal carrot, slow-cooked with khoya', price: '₹60', category: 'Sweets', tag: 'seasonal' },
  { name: 'Plain Curd', description: 'Cool, set, and lightly tangy', price: '₹50', category: 'Salad / Raita' },
  { name: 'Boondi Raita', description: 'Yoghurt, boondi, roasted cumin', price: '₹70', category: 'Salad / Raita' },
  { name: 'Haveli Thali', description: 'Dal, sabzi, bread, rice, raita, sweet', price: '₹250', category: 'Thali', tag: 'full meal' },
  { name: 'Special Seasonal Thali', description: 'A rotating plate built for hungry days', price: '₹300', category: 'Seasonal' },
];

const categories = ['All', 'Paneer', 'Indian curry', 'Breads', 'Tandoori', 'South Indian', 'Shakes', 'Rice', 'Sweets', 'Thali'];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Header({ onOrder }: { onOrder: () => void }) {
  const [open, setOpen] = useState(false);
  const go = (id: string) => { setOpen(false); scrollToId(id); };
  return (
    <header className="nav-blur fixed left-0 right-0 top-0 z-40 text-[#f7f0df]">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4 md:px-8">
        <button data-testid="button-brand-home" onClick={() => go('top')} className="group flex items-center gap-3 text-left">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-[#f5ad32] text-[#f5ad32] font-display text-xl">ह</span>
          <span><span className="block font-display text-xl leading-none">Hisar Haveli</span><span className="eyebrow mt-1 block text-[#f5ad32]">veg dhaba · hisar</span></span>
        </button>
        <nav className={`absolute left-4 right-4 top-[74px] max-h-0 overflow-hidden rounded-2xl bg-[#173b3a] px-5 opacity-0 transition-all duration-300 md:static md:flex md:max-h-none md:items-center md:gap-8 md:rounded-none md:bg-transparent md:p-0 md:opacity-100 ${open ? 'mobile-menu-open' : ''}`}>
          <button data-testid="link-menu" onClick={() => go('menu')} className="block border-b border-[#f7f0df]/15 py-3 text-sm md:border-0 md:py-0">The menu</button>
          <button data-testid="link-story" onClick={() => go('story')} className="block border-b border-[#f7f0df]/15 py-3 text-sm md:border-0 md:py-0">Our room</button>
          <button data-testid="link-visit" onClick={() => go('visit')} className="block py-3 text-sm md:py-0">Find us</button>
        </nav>
        <div className="flex items-center gap-2">
          <button data-testid="button-order-header" onClick={onOrder} className="hidden rounded-full bg-[#f5ad32] px-5 py-2.5 text-sm font-bold text-[#173b3a] transition-transform hover:-translate-y-0.5 sm:block">Order for pickup <ArrowRight className="ml-1 inline size-4" /></button>
          <button data-testid="button-mobile-menu" aria-label="Toggle navigation" onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-full border border-[#f7f0df]/35 md:hidden">{open ? <X className="size-5" /> : <MenuIcon className="size-5" />}</button>
        </div>
      </div>
    </header>
  );
}

function Hero({ onOrder }: { onOrder: () => void }) {
  return (
    <section id="top" className="hero pt-28">
      <div className="mx-auto grid min-h-[690px] max-w-[1240px] items-center gap-12 px-5 pb-20 md:grid-cols-[1.05fr_.95fr] md:px-8">
        <div className="hero-copy reveal">
          <div className="mb-8 flex items-center gap-5">
            <div className="stamp text-[#f7f0df]">Open every day<br /><span className="text-[#f5ad32]">6:30 am — 11:30 pm</span><br />Hisar, Haryana</div>
            <div className="eyebrow max-w-[180px] leading-relaxed text-[#f7f0df]/75">A proper North Indian meal, without the fuss.</div>
          </div>
          <p className="eyebrow mb-5 text-[#f5ad32]">Est. for hungry people</p>
          <h1 className="display-word max-w-[850px]">Come hungry.<br /><span className="text-[#f5ad32]">Leave looked after.</span></h1>
          <p className="mt-8 max-w-[470px] text-lg leading-relaxed text-[#f7f0df]/80">Hisar Haveli is a veg-only dhaba where the tandoor stays warm, the rotis arrive fast, and every table gets something worth passing around.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button data-testid="button-view-menu" onClick={() => scrollToId('menu')} className="rounded-full bg-[#f5ad32] px-6 py-3.5 font-bold text-[#173b3a] transition-transform hover:-translate-y-1">See what’s cooking <ArrowDown className="ml-2 inline size-4" /></button>
            <button data-testid="button-order-hero" onClick={onOrder} className="rounded-full border border-[#f7f0df]/45 px-6 py-3.5 font-semibold transition-colors hover:bg-[#f7f0df] hover:text-[#173b3a]">Order for pickup</button>
            <a data-testid="link-directions-hero" href={mapsUrl} target="_blank" rel="noreferrer" className="rounded-full border border-[#f7f0df]/45 px-6 py-3.5 font-semibold transition-colors hover:bg-[#f7f0df] hover:text-[#173b3a]"><Compass className="mr-2 inline size-4" /> Get directions</a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-[#f7f0df]/75">
            <span><Star className="mr-1 inline size-4 fill-[#f5ad32] text-[#f5ad32]" /> 4.3 on Maps</span><span className="h-1 w-1 rounded-full bg-[#f5ad32]" /><span>₹200–400 per person</span><span className="h-1 w-1 rounded-full bg-[#f5ad32]" /><span>100% vegetarian</span>
          </div>
        </div>
        <div className="relative hidden min-h-[560px] md:block reveal delay-2">
          <div className="photo-frame absolute right-0 top-4 h-[470px] w-[78%] rotate-2 rounded-[2rem] border-[10px] border-[#f7f0df] shadow-2xl" />
          <div className="absolute bottom-12 left-0 w-[260px] rounded-2xl bg-[#f7f0df] p-5 text-[#173b3a] shadow-xl -rotate-6">
            <p className="eyebrow text-[#a63c2f]">The house rule</p><p className="mt-3 font-display text-3xl leading-tight">No one leaves with an empty plate.</p>
          </div>
          <div className="absolute right-0 top-[58%] rounded-full border border-[#f5ad32] bg-[#173b3a] px-5 py-3 text-sm text-[#f5ad32] -rotate-3">Bamboo ceiling. Big appetites.</div>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-[#f7f0df]/60"><span className="eyebrow">Scroll for the good stuff</span><ArrowDown className="mx-auto mt-2 size-4 animate-bounce" /></div>
    </section>
  );
}

function Marquee() {
  return <div className="marquee bg-[#f5ad32] py-3 text-[#173b3a]"><div className="marquee-track gap-12"><span className="eyebrow">Paneer worth talking about</span><span>—</span><span className="eyebrow">Fresh tandoor, all day</span><span>—</span><span className="eyebrow">A table for every kind of hungry</span><span>—</span><span className="eyebrow">Paneer worth talking about</span></div></div>;
}

function Story() {
  return (
    <section id="story" className="bg-[#f7f0df] px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1240px] items-center gap-14 md:grid-cols-[.85fr_1.15fr]">
        <div className="relative min-h-[470px]">
          <div className="bamboo absolute left-0 top-0 h-[330px] w-[78%] rounded-[2rem] p-8 text-[#173b3a] shadow-lg"><span className="eyebrow">inside the haveli</span><p className="mt-28 font-display text-5xl leading-[.9]">A little<br />rough.<br /><span className="text-[#a63c2f]">Very real.</span></p></div>
          <div className="brick absolute bottom-0 right-0 h-[270px] w-[68%] rounded-[2rem] border-[12px] border-[#f7f0df] shadow-xl"><div className="flex h-full items-end justify-between p-5 text-[#f7f0df]"><span className="font-display text-2xl">HISAR<br />HAVELI</span><span className="eyebrow -rotate-90">since forever-ish</span></div></div>
        </div>
        <div>
          <div className="section-kicker eyebrow">Why locals come back</div>
          <h2 className="mt-5 max-w-[600px] font-display text-5xl leading-[.95] text-[#173b3a] md:text-7xl">The room is bright. The food has a point of view.</h2>
          <p className="mt-7 max-w-[560px] text-lg leading-relaxed text-[#173b3a]/70">Bamboo above, brick around you, a little bustle from the kitchen — it is the sort of room that works for a quick breakfast, a family dinner, or the extra round of naan nobody planned for.</p>
          <div className="mt-10 grid max-w-[580px] grid-cols-2 gap-4 border-t border-[#173b3a]/20 pt-6 sm:grid-cols-4">
            <div><span className="font-display text-3xl text-[#a63c2f]">01</span><p className="mt-2 text-sm">Veg-only kitchen</p></div><div><span className="font-display text-3xl text-[#a63c2f]">02</span><p className="mt-2 text-sm">Fresh from tandoor</p></div><div><span className="font-display text-3xl text-[#a63c2f]">03</span><p className="mt-2 text-sm">Easy on the wallet</p></div><div><span className="font-display text-3xl text-[#a63c2f]">04</span><p className="mt-2 text-sm">Open till late</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MenuSection({ onOrder }: { onOrder: () => void }) {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const visible = useMemo(() => dishes.filter((dish) => (category === 'All' || dish.category === category) && `${dish.name} ${dish.description}`.toLowerCase().includes(query.toLowerCase())), [category, query]);
  return (
    <section id="menu" className="bg-[#cad6bd] px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div><div className="section-kicker eyebrow">The menu</div><h2 className="mt-5 font-display text-6xl leading-[.9] text-[#173b3a] md:text-8xl">Build your<br /><span className="text-[#a63c2f]">own feast.</span></h2></div>
          <div className="max-w-[350px] text-[#173b3a]/70"><p>These are the dishes people point at when they say, “one more thing.” Order preparation takes 15–20 minutes, so settle in or call ahead from the listing.</p><button data-testid="button-order-menu" onClick={onOrder} className="mt-5 font-semibold text-[#a63c2f] underline decoration-2 underline-offset-4">How pickup works <ArrowRight className="ml-1 inline size-4" /></button></div>
        </div>
        <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <button data-testid={`button-filter-${item.toLowerCase().replaceAll(' ', '-')}`} key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${category === item ? 'border-[#173b3a] bg-[#173b3a] text-[#f7f0df]' : 'border-[#173b3a]/25 text-[#173b3a] hover:bg-[#f7f0df]/60'}`}>{item}</button>)}</div>
          <label className="flex min-w-[220px] items-center gap-2 rounded-full border border-[#173b3a]/25 bg-[#f7f0df]/50 px-4 py-2 text-sm text-[#173b3a]/65"><Search className="size-4" /><input data-testid="input-menu-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the menu" className="w-full bg-transparent outline-none placeholder:text-[#173b3a]/50" /></label>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {visible.map((dish, index) => <article data-testid={`card-dish-${dish.name.toLowerCase().replaceAll(' ', '-')}`} key={dish.name} className={`menu-card group rounded-2xl p-5 transition-all ${index === 0 ? 'md:row-span-2 md:p-7' : ''}`}><div className="flex items-start justify-between gap-5"><div><div className="flex flex-wrap items-center gap-2"><h3 className={`font-display ${index === 0 ? 'text-4xl' : 'text-2xl'} leading-tight text-[#173b3a]`}>{dish.name}</h3>{dish.tag && <span className="eyebrow rounded-full bg-[#f5ad32] px-2 py-1 text-[9px] text-[#173b3a]">{dish.tag}</span>}</div><p className="mt-2 max-w-[330px] text-sm text-[#173b3a]/60">{dish.description}</p></div><span className="font-mono-custom text-lg text-[#a63c2f]">{dish.price}</span></div><div className="mt-7 flex items-center justify-between text-xs text-[#173b3a]/50"><span>{dish.category}</span><span className="opacity-0 transition-opacity group-hover:opacity-100">Add to your table <ArrowRight className="ml-1 inline size-3" /></span></div></article>)}
        </div>
        {visible.length === 0 && <div className="menu-card mt-6 rounded-2xl p-10 text-center"><p className="font-display text-3xl text-[#173b3a]">Nothing by that name today.</p><button data-testid="button-reset-menu" onClick={() => { setQuery(''); setCategory('All'); }} className="mt-3 text-sm font-semibold text-[#a63c2f] underline">Show the full menu</button></div>}
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-[#a63c2f]/25 bg-[#a63c2f]/10 p-5 text-[#173b3a] sm:flex-row sm:items-center sm:justify-between"><p className="text-sm"><span className="font-bold text-[#a63c2f]">A small heads-up:</span> GST is charged extra. Once an order is placed, it cannot be cancelled.</p><span className="eyebrow whitespace-nowrap text-[#a63c2f]">15–20 min prep</span></div>
      </div>
    </section>
  );
}

function Visit({ onCall }: { onCall: () => void }) {
  return (
    <section id="visit" className="bg-[#173b3a] px-5 py-24 text-[#f7f0df] md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1240px] gap-14 md:grid-cols-[1fr_.85fr]">
        <div><div className="section-kicker eyebrow text-[#f5ad32]">Come by today</div><h2 className="mt-5 max-w-[700px] font-display text-6xl leading-[.9] md:text-8xl">The table<br /><span className="text-[#f5ad32]">is waiting.</span></h2><p className="mt-8 max-w-[470px] text-lg leading-relaxed text-[#f7f0df]/70">For an early breakfast, a post-work thali, or the dinner you do not want to cook — Hisar Haveli is open daily, all day.</p><div className="mt-10 flex flex-wrap gap-3"><a data-testid="link-directions-visit" href={mapsUrl} target="_blank" rel="noreferrer" className="rounded-full bg-[#f5ad32] px-6 py-3.5 font-bold text-[#173b3a] transition-transform hover:-translate-y-1"><Compass className="mr-2 inline size-4" /> Directions</a><button data-testid="button-call-visit" onClick={onCall} className="rounded-full border border-[#f7f0df]/35 px-6 py-3.5 font-semibold hover:bg-[#f7f0df] hover:text-[#173b3a]"><Phone className="mr-2 inline size-4" /> Call / order</button></div></div>
        <div className="rounded-[2rem] border border-[#f7f0df]/20 bg-[#f7f0df]/[.07] p-7 md:p-9"><div className="flex items-center justify-between border-b border-[#f7f0df]/15 pb-6"><h3 className="font-display text-3xl">Plan your stop</h3><Clock3 className="size-6 text-[#f5ad32]" /></div><div className="space-y-6 pt-7"><div><span className="eyebrow text-[#f5ad32]">Hours</span><p className="mt-2 text-2xl">Every day <span className="text-[#f7f0df]/55">·</span> 6:30 am – 11:30 pm</p></div><div><span className="eyebrow text-[#f5ad32]">Address</span><p className="mt-2 text-xl">Hisar, Haryana</p><p className="mt-1 text-sm text-[#f7f0df]/55">Open the map for the exact pin and directions.</p></div><div><span className="eyebrow text-[#f5ad32]">Good to know</span><div className="mt-3 space-y-2 text-sm text-[#f7f0df]/70"><p><Check className="mr-2 inline size-4 text-[#f5ad32]" /> Veg-only kitchen</p><p><Check className="mr-2 inline size-4 text-[#f5ad32]" /> ₹200–400 per person</p><p><Check className="mr-2 inline size-4 text-[#f5ad32]" /> 15–20 min order preparation</p></div></div></div></div>
      </div>
    </section>
  );
}

function Footer() {
  return <footer className="bg-[#f5ad32] px-5 py-10 text-[#173b3a] md:px-8"><div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-7 md:flex-row md:items-end"><div><p className="font-display text-4xl">Hisar Haveli</p><p className="mt-2 text-sm">A veg-only dhaba in Hisar, Haryana.</p></div><div className="flex flex-wrap gap-x-6 gap-y-2 text-sm"><button data-testid="button-footer-menu" onClick={() => scrollToId('menu')}>Menu</button><button data-testid="button-footer-visit" onClick={() => scrollToId('visit')}>Visit</button><a data-testid="link-footer-maps" href={mapsUrl} target="_blank" rel="noreferrer">Directions <ArrowRight className="ml-1 inline size-3" /></a></div><p className="eyebrow text-[#173b3a]/60">Made for full plates</p></div></footer>;
}

function Home() {
  const [notice, setNotice] = useState<string | null>(null);
  const showOrder = () => { setNotice('Orders take 15–20 minutes to prepare. Use the Maps listing to call ahead; once placed, an order cannot be cancelled.'); scrollToId('menu'); };
  const showCall = () => setNotice('For a call or pickup order, use the phone action on the Hisar Haveli Maps listing — we do not publish a number here.');
  return <div className="site-shell grain min-h-[100dvh]"><Header onOrder={showOrder} /><main><Hero onOrder={showOrder} /><Marquee /><Story /><MenuSection onOrder={showOrder} /><Visit onCall={showCall} /></main><Footer />{notice && <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[560px] -translate-x-1/2 rounded-2xl border border-[#f5ad32]/50 bg-[#173b3a] p-4 text-sm text-[#f7f0df] shadow-2xl"><div className="flex items-start gap-3"><ShoppingBag className="mt-0.5 size-5 shrink-0 text-[#f5ad32]" /><p className="flex-1 leading-relaxed">{notice}</p><button data-testid="button-close-notice" aria-label="Close notice" onClick={() => setNotice(null)}><X className="size-5 text-[#f7f0df]/70" /></button></div></div>}</div>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;