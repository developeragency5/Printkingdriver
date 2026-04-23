import Layout from "@/components/Layout";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

type Brand = 'All' | 'HP' | 'Canon' | 'Epson' | 'Brother' | 'Lexmark' | 'Samsung';

const drivers = [
  { id: 1, brand: 'HP', model: 'HP LaserJet Pro M404n', version: 'v40.10.1140', os: ['Win10', 'Win11', 'macOS'], color: 'bg-blue-600' },
  { id: 2, brand: 'HP', model: 'HP DeskJet 3755', version: 'v40.14.1607', os: ['Win10', 'Win11'], color: 'bg-blue-600' },
  { id: 3, brand: 'HP', model: 'HP OfficeJet Pro 9015e', version: 'v41.5.2549', os: ['Win10', 'Win11', 'macOS'], color: 'bg-blue-600' },
  { id: 4, brand: 'Canon', model: 'Canon PIXMA MG3620', version: 'v1.02', os: ['Win10', 'Win11', 'macOS'], color: 'bg-red-600' },
  { id: 5, brand: 'Canon', model: 'Canon imageCLASS MF3010', version: 'v19.5', os: ['Win10', 'Win11'], color: 'bg-red-600' },
  { id: 6, brand: 'Epson', model: 'Epson EcoTank ET-2800', version: 'v2.56.01', os: ['Win10', 'Win11', 'macOS'], color: 'bg-teal-600' },
  { id: 7, brand: 'Brother', model: 'Brother HL-L2350DW', version: 'v1.6.0', os: ['Win10', 'Win11', 'macOS'], color: 'bg-blue-800' },
  { id: 8, brand: 'Lexmark', model: 'Lexmark MS621dn', version: 'v3.3.2', os: ['Win10', 'Win11'], color: 'bg-slate-600' },
  { id: 9, brand: 'Samsung', model: 'Samsung Xpress M2020W', version: 'v3.12.29.05', os: ['Win10', 'Win11', 'macOS'], color: 'bg-indigo-900' },
];

const brands: Brand[] = ['All', 'HP', 'Canon', 'Epson', 'Brother', 'Lexmark', 'Samsung'];

export default function Drivers() {
  const [filter, setFilter] = useState<Brand>('All');
  const filtered = filter === 'All' ? drivers : drivers.filter(d => d.brand === filter);

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-12 pb-4 max-w-6xl">
        <h1 className="font-heading font-[800] text-3xl md:text-4xl mb-2">Explore Drivers</h1>
        <p className="text-muted-foreground mb-8">Browse our informational directory of printer drivers by brand.</p>

        <div className="flex flex-wrap gap-2 mb-10">
          {brands.map(b => (
            <button
              key={b}
              data-testid={`filter-${b.toLowerCase()}`}
              onClick={() => setFilter(b)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors border ${filter === b ? 'bg-primary border-primary text-white shadow-sm' : 'bg-white border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'}`}
            >
              {b}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((d, i) => (
            <div key={d.id} data-testid={`card-driver-${i}`} className="bg-white border border-border rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold text-white tracking-wider uppercase ${d.color}`}>
                  {d.brand}
                </span>
                <span className="text-xs text-muted-foreground font-mono">{d.version}</span>
              </div>

              <h3 className="font-heading font-bold text-base mb-3">{d.model}</h3>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {d.os.map(os => (
                  <span key={os} className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs font-medium border border-border">
                    {os}
                  </span>
                ))}
              </div>

              <div className="mt-auto space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-green-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Official Driver · Verified
                </div>
                <Link href="/contact" className="block w-full text-center px-4 py-2 border border-border text-sm text-foreground font-semibold rounded-lg hover:border-primary hover:text-primary transition-colors">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
