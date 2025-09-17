import React from 'react';

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsSectionProps {
  apartmentId: string;
  className?: string;
}

export default function ReviewsSection({ apartmentId, className = "" }: ReviewsSectionProps) {
  // Mock reviews data - in real app would fetch from API
  const reviews: Review[] = [
    {
      id: '1',
      author: 'John D.',
      rating: 5,
      comment: 'Great apartment with excellent amenities!',
      date: '2024-01-15'
    },
    {
      id: '2',
      author: 'Sarah M.',
      rating: 4,
      comment: 'Nice location and responsive management.',
      date: '2024-01-10'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-4">Reviews</h3>
      
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{review.author}</span>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}