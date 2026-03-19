import { motion } from "motion/react";
import { ArrowRight, ExternalLink, Star } from "lucide-react";

type ProjectCardProps = {
  name: string;
  fullName: string;
  description: string;
  language: string | null;
  stars: number;
  url: string;
  liveUrl?: string | null;
  updatedAt: string;
};

function toShortDescription(text: string, maxWords = 15) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")}...`;
}

function formatDate(input: string) {
  return new Date(input).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ProjectCard({
  name,
  fullName,
  description,
  language,
  stars,
  url,
  liveUrl,
  updatedAt,
}: ProjectCardProps) {
  const shortDescription = toShortDescription(description, 15);
  const repoBanner = `https://opengraph.githubassets.com/1/${fullName}`;
  const homepagePreview = liveUrl
    ? `https://image.thum.io/get/width/1200/noanimate/${encodeURIComponent(liveUrl)}`
    : null;
  const previewImage = homepagePreview ?? repoBanner;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group cursor-pointer block"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-6 bg-white/5 border border-white/10">
        <img
          src={previewImage}
          alt={name}
          referrerPolicy="no-referrer"
          onError={(event) => {
            if (event.currentTarget.src !== repoBanner) {
              event.currentTarget.src = repoBanner;
            }
          }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="text-2xl font-bold mb-3">{name}</h3>
      <p className="text-white/50 mb-4 min-h-12">{shortDescription || "No description provided."}</p>
      <div className="flex items-center gap-3 mb-3 text-xs uppercase tracking-widest text-white/40">
        {language && <span>{language}</span>}
        <span className="flex items-center gap-1">
          <Star size={12} />
          {stars}
        </span>
        <span>Updated {formatDate(updatedAt)}</span>
      </div>
      <div className="flex items-center gap-5 text-accent font-medium">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center group-hover:gap-2 transition-all"
        >
          <span>View Repository</span>
          <ArrowRight size={18} className="ml-1" />
        </a>
        {liveUrl && (
          <a href={liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-white/70 hover:text-accent">
            <ExternalLink size={15} />
            <span className="text-sm">Live Demo</span>
          </a>
        )}
      </div>
    </motion.div>
  );
}
