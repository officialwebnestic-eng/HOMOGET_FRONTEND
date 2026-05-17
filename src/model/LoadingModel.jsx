import React from 'react';

// Your existing skeleton components

const Skeleton = ({ width = '100%', height = '1rem', className = '', rounded = 'md', animated = true }) => {
    const roundedClasses = {
        none: '',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full'
    };
    return (
        <div
            className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ${roundedClasses[rounded]} ${animated ? 'animate-pulse' : ''
                } ${className}`}
            style={{ width, height }}
        />
    );
};

const ShimmerSkeleton = ({ width = '100%', height = '1rem', className = '', rounded = 'md' }) => {
    const roundedClasses = {
        none: '',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full'
    };
    return (
        <div
            className={`relative bg-gray-200 overflow-hidden ${roundedClasses[rounded]} ${className}`}
            style={{ width, height }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
            <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
        </div>
    );
};

const CardSkeleton = ({ showAvatar = true, lines = 3, animated = true }) => (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
        {showAvatar && (
            <div className="flex items-center space-x-4 mb-4">
                <Skeleton width="3rem" height="3rem" rounded="full" animated={animated} />
                <div className="flex-1 space-y-2">
                    <Skeleton width="40%" height="1rem" animated={animated} />
                    <Skeleton width="60%" height="0.875rem" animated={animated} />
                </div>
            </div>
        )}
        <div className="space-y-3">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    width={i === lines - 1 ? '70%' : '100%'}
                    height="1rem"
                    animated={animated}
                />
            ))}
        </div>
    </div>
);

const TableSkeleton = ({ rows = 5, columns = 4, animated = true }) => (
    <div className="w-full">
        {/* Table Header */}
        <div className="grid gap-4 p-4 border-b bg-gray-50" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, i) => (
                <Skeleton key={i} height="1.25rem" width="80%" animated={animated} />
            ))}
        </div>
        {/* Table Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid gap-4 p-4 border-b" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                    <Skeleton
                        key={colIndex}
                        height="1rem"
                        width={colIndex === 0 ? '90%' : '70%'}
                        animated={animated}
                    />
                ))}
            </div>
        ))}
    </div>
);

const ListSkeleton = ({ items = 5, showIcon = true, animated = true }) => (
    <div className="space-y-4">
        {Array.from({ length: items }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-3 border rounded-lg">
                {showIcon && (
                    <Skeleton width="2.5rem" height="2.5rem" rounded="md" animated={animated} />
                )}
                <div className="flex-1 space-y-2">
                    <Skeleton width="60%" height="1rem" animated={animated} />
                    <Skeleton width="40%" height="0.875rem" animated={animated} />
                </div>
            </div>
        ))}
    </div>
);

// The hook that returns only the LoadingModel component
export const useLoading = ({
    type, 
    count, 
    variant, 
    animated = true,
    ...props
} = {}) => {
    const LoadingModel = ({ isLoading }) => {
        if (!isLoading) return null;
        // Choose skeleton variant
        const SkeletonComponent = variant === 'shimmer' ? ShimmerSkeleton : Skeleton;

        switch (type) {
            case 'card':
                return (
                    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 p-4">
                        {Array.from({ length: count }).map((_, i) => (
                            <div key={i} className="m-2 max-w-sm w-full">
                                <CardSkeleton {...props} />
                            </div>
                        ))}
                    </div>
                );
            case 'table':
                return (
                    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 p-4 w-full max-w-4xl">
                        <div className="w-full max-h-full overflow-auto">
                            {Array.from({ length: count }).map((_, i) => (
                                <div key={i} className="mb-4">
                                    <TableSkeleton {...props} />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'list':
                return (
                    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 p-4 max-w-2xl">
                        {Array.from({ length: count }).map((_, i) => (
                            <div key={i} className="mb-4">
                                <ListSkeleton {...props} />
                            </div>
                        ))}
                    </div>
                );
            case 'text':
                return (
                    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 p-4 max-w-2xl">
                        {Array.from({ length: count }).map((_, i) => (
                            <Skeleton
                                key={i}
                                width={i === count - 1 ? '70%' : '100%'}
                                height="1.25rem"
                                animated={animated}
                                {...props}
                            />
                        ))}
                    </div>
                );
            case 'custom':
                return (
                    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 p-4 max-w-4xl">
                        {Array.from({ length: count }).map((_, i) => (
                            <SkeletonComponent key={i} animated={animated} {...props} />
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return LoadingModel;
};