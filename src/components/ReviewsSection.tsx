'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, Calendar, User } from 'lucide-react';
import ReviewForm from './ReviewForm';

interface Review {
  id: number;
  reviewer_name: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  verified_tenant: boolean;
  helpful_count: number;
  move_in_date?: string;
  lease_duration?: string;
  would_recommend: boolean;
}

interface ReviewsSectionProps {
  apartmentId: string;
  apartmentName: string;
}

export default function ReviewsSection({ apartmentId, apartmentName }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/reviews?apartmentId=${apartmentId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
      setTotalReviews(data.totalReviews || 0);
      
      console.log(`📊 Loaded ${data.totalReviews} reviews for apartment ${apartmentId}`);
      
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [apartmentId]);

  const handleReviewSubmitSuccess = () => {
    fetchReviews(); // Reload reviews after new submission
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Reviews Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h2>
            {totalReviews > 0 ? (
              <div className="flex items-center mt-2">
                {renderStars(averageRating, 'lg')}
                <span className="ml-3 text-2xl font-bold text-gray-900">{averageRating}</span>
                <span className="ml-2 text-gray-600">({totalReviews} review{totalReviews !== 1 ? 's' : ''})</span>
              </div>
            ) : (
              <p className="text-gray-600 mt-2">No reviews yet. Be the first to review!</p>
            )}
          </div>
          
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors font-semibold"
          >
            Write a Review
          </button>
        </div>

        {/* Rating Breakdown */}
        {totalReviews > 0 && (
          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter(r => r.rating === star).length;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                
                return (
                  <div key={star} className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 w-8">{star}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-2" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="bg-slate-100 rounded-full p-2 mr-3">
                      <User className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{review.reviewer_name}</h4>
                        {review.verified_tenant && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            Verified Tenant
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        {renderStars(review.rating, 'sm')}
                        <span className="ml-2 text-sm text-gray-600">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="ml-12">
                  <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                  <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                  
                  {/* Additional Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {review.move_in_date && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Moved in {formatDate(review.move_in_date)}
                      </div>
                    )}
                    {review.lease_duration && (
                      <span>Lease: {review.lease_duration}</span>
                    )}
                    {review.would_recommend && (
                      <span className="text-green-600 font-medium">✓ Recommends this property</span>
                    )}
                  </div>
                  
                  {/* Helpful Button */}
                  <div className="mt-3">
                    <button className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful_count})
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600 mb-4">Be the first to share your experience!</p>
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Write the First Review
            </button>
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          apartmentId={apartmentId}
          apartmentName={apartmentName}
          onClose={() => setShowReviewForm(false)}
          onSubmitSuccess={handleReviewSubmitSuccess}
        />
      )}
    </>
  );
}
