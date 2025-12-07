import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Back link skeleton */}
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* Left: Image Gallery Skeleton */}
                        <div className="bg-gray-50 p-8 flex items-center justify-center min-h-[400px] md:min-h-[600px]">
                            <div className="w-64 h-64 bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center text-gray-400">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                        </div>

                        {/* Right: Product Details Skeleton */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            {/* Title */}
                            <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>

                            {/* Price */}
                            <div className="h-8 w-1/4 bg-gray-200 rounded animate-pulse mb-6"></div>

                            {/* Description lines */}
                            <div className="space-y-3 mb-8">
                                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <div className="flex-1 h-14 bg-gray-200 rounded-xl animate-pulse"></div>
                                <div className="flex-1 h-14 bg-gray-200 rounded-xl animate-pulse"></div>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
