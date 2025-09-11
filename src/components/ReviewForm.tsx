'use client';

import { useState } from 'react';
import { Star, X, Check } from 'lucide-react';

interface ReviewFormProps {
  apartmentId: string;
  apartmentName: string;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export default function ReviewForm({ apartmentId, apartmentName, onClose, onSubmitSuccess }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    reviewerName: '',
    reviewerEmail: '',
    rating: 0,
    title: '',
    comment: '',
    verifiedTenant: false,
    moveInDate: '',
    leaseDuration: '',
    wouldRecommend: true
  });
  
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apartmentId: parseInt(apartmentId),
          ...formData
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit review');
      }
      
      console.log('Review submitted successfully:', result.review);
      onSubmitSuccess();
      onClose();
      
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Apartment Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900">Reviewing: {apartmentName}</h3>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating *
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-colors"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || formData.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm text-gray-600">
                {formData.rating > 0 ? `${formData.rating} out of 5 stars` : 'Select rating'}
              </span>
            </div>
          </div>

          {/* Personal Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={formData.reviewerName}
                onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.reviewerEmail}
                onChange={(e) => setFormData({ ...formData, reviewerEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              placeholder="e.g., Great location and amenities"
              required
            />
          </div>

          {/* Review Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              placeholder="Share your experience living here..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 50 characters. Be specific about what you liked or didn't like.
            </p>
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Move-in Date (Optional)
              </label>
              <input
                type="date"
                value={formData.moveInDate}
                onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lease Duration (Optional)
              </label>
              <select
                value={formData.leaseDuration}
                onChange={(e) => setFormData({ ...formData, leaseDuration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              >
                <option value="">Select duration</option>
                <option value="6 months">6 months</option>
                <option value="12 months">12 months</option>
                <option value="18 months">18 months</option>
                <option value="24 months">24 months</option>
                <option value="Month-to-month">Month-to-month</option>
              </select>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.verifiedTenant}
                onChange={(e) => setFormData({ ...formData, verifiedTenant: e.target.checked })}
                className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                I am/was a verified tenant at this property
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.wouldRecommend}
                onChange={(e) => setFormData({ ...formData, wouldRecommend: e.target.checked })}
                className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                I would recommend this property to others
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || formData.rating === 0}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                isSubmitting || formData.rating === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-slate-600 text-white hover:bg-slate-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
