import { motion } from 'framer-motion';

const MedicineSkeleton = () => {
  return (
    <div className="bg-card-bg/50 backdrop-blur-md rounded-xl overflow-hidden border border-white/5 h-full flex flex-col p-4 gap-4">
      {/* Image Skeleton */}
      <div className="h-48 bg-white/5 animate-pulse rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>
      
      {/* Info Skeleton */}
      <div className="space-y-3">
        <div className="h-5 bg-white/10 rounded-md w-3/4 animate-pulse" />
        <div className="h-3 bg-white/5 rounded-md w-1/2 animate-pulse" />
        
        <div className="flex items-center justify-between mt-4">
          <div className="h-6 bg-white/10 rounded-md w-1/4 animate-pulse" />
          <div className="h-10 bg-primary-purple/20 rounded-lg w-1/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default MedicineSkeleton;
