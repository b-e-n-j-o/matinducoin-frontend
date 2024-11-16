import React, { useEffect, useState } from 'react';

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5002/api/products/${productId}/reviews`)
      .then(response => response.json())
      .then(data => setReviews(data))
      .catch(error => console.error('Error fetching reviews:', error));
  }, [productId]);

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Avis des clients</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-700">Aucun avis pour le moment.</p>
      ) : (
        reviews.map((review, index) => (
          <div key={index} className="mb-4">
            <p className="text-gray-700">{review}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
