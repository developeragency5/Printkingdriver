import React from "react";
import SectionHeader from "./SectionHeader";
import DriverCard from "./DriverCard";

interface DriverGridProps {
  title: string;
  subtitle: string;
  cards: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
    active?: boolean;
    slug?: string;
  }>;
  columns?: 3 | 4;
}

export default function DriverGrid({ title, subtitle, cards, columns = 4 }: DriverGridProps) {
  const gridClass = columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";

  return (
    <div className="mb-16 md:mb-20">
      <SectionHeader title={title} subtitle={subtitle} />
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridClass} gap-6`}>
        {cards.map((card, i) => (
          <DriverCard
            key={i}
            title={card.title}
            description={card.description}
            icon={card.icon}
            active={card.active}
            slug={card.slug}
          />
        ))}
      </div>
    </div>
  );
}
