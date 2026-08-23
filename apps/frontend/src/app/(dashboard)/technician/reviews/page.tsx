"use client";

import { Star, Sparkles, Gauge, Award } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { AnimatedCounter } from '@/components/motion/animated-counter';
import { useAuth } from '@/providers/auth-provider';
import { useTechnicianContext } from '@/hooks/use-technician-context';
import { useTechnicianReviews } from '@/hooks/use-reviews';

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
      ))}
    </div>
  );
}

export default function TechnicianReviewsPage() {
  const { session } = useAuth();
  const { data: techCtx } = useTechnicianContext(session?.user.id);
  const { data: reviews = [], isLoading } = useTechnicianReviews(techCtx?.id);

  const average = (key: 'qualityRating' | 'speedRating' | 'professionalismRating') =>
    reviews.length ? reviews.reduce((sum, r) => sum + r[key], 0) / reviews.length : 0;

  const breakdown = [
    { label: 'Quality', icon: Award, value: average('qualityRating') },
    { label: 'Speed', icon: Gauge, value: average('speedRating') },
    { label: 'Professionalism', icon: Sparkles, value: average('professionalismRating') },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
        <p className="mt-1 text-sm text-slate-500">What residents are saying about your work.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Reveal>
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white h-full relative overflow-hidden">
            <div aria-hidden className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
            <span className="relative text-xs font-semibold text-indigo-100 uppercase tracking-wide">Overall Rating</span>
            <div className="relative mt-2 flex items-end gap-2">
              <span className="text-5xl font-bold">
                <AnimatedCounter value={techCtx?.averageRating ?? 0} duration={1} />
              </span>
              <span className="text-lg text-indigo-200 mb-1">/ 5</span>
            </div>
            <p className="relative mt-1 text-sm text-indigo-200">from {reviews.length} reviews</p>
          </div>
        </Reveal>

        <StaggerGroup className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {breakdown.map(({ label, icon: Icon, value }) => (
            <StaggerItem key={label}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 h-full">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-indigo-600" />
                </div>
                <div className="mt-3 text-xl font-bold text-slate-900">{value.toFixed(1)}</div>
                <p className="mt-0.5 text-xs text-slate-500">{label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>

      {reviews.length > 0 ? (
        <StaggerGroup className="space-y-4">
          {reviews.map((review) => (
            <StaggerItem key={review.id}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{review.resident}</p>
                    <p className="text-xs text-slate-500">{review.unit}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Stars value={review.rating} />
                    <span className="text-[11px] text-slate-400">{review.date}</span>
                  </div>
                </div>
                {review.comment && <p className="mt-3 text-sm text-slate-600 leading-relaxed">{review.comment}</p>}
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-slate-400">
                  <span>Quality: {review.qualityRating}/5</span>
                  <span>Speed: {review.speedRating}/5</span>
                  <span>Professionalism: {review.professionalismRating}/5</span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center">
          <Star className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="mt-3 text-sm text-slate-500">{isLoading ? 'Loading…' : 'No reviews yet.'}</p>
        </div>
      )}
    </div>
  );
}
