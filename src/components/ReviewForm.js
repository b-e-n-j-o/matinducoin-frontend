import React, { useState } from 'react';

const ReviewForm = ({ productId }) => {
  const [review, setReview] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const reviewData = {
      productId,
      review
    };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Review submitted:', data);
        setReview('');
        // Handle successful review submission
      })
      .catch(error => console.error('Error submitting review:', error));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded shadow">
      <div className="mb-4">
        <label className="block text-gray-700">Votre avis</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full p-2 border rounded"
        ></textarea>
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Soumettre
      </button>
    </form>
  );
};

export default ReviewForm;
