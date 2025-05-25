
  const form = document.getElementById('reviewForm');
  const nameInput = document.getElementById('name');
  const messageInput = document.getElementById('message');
  const ratingInput = document.getElementById('rating');
  const editIndexInput = document.getElementById('editIndex');
  const reviewsContainer = document.getElementById('reviewsContainer');

  function getReviews() {
    return JSON.parse(localStorage.getItem('weatherAppReviews') || '[]');
  }

  function setReviews(data) {
    localStorage.setItem('weatherAppReviews', JSON.stringify(data));
  }

  function formatDate(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function renderStars(rating) {
    rating = Number(rating);
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += i <= rating ? '⭐' : '☆';
    }
    return stars;
  }

  function renderReviews() {
    const reviews = getReviews();
    reviewsContainer.innerHTML = '';

    if (reviews.length === 0) {
      reviewsContainer.innerHTML = '<p style="color:#eee; font-style:italic;">No reviews yet. Be the first to review!</p>';
      return;
    }

    reviews.forEach((review, i) => {
      const card = document.createElement('div');
      card.className = 'review-card';
      card.innerHTML = `
        <div class="review-header">
          <div class="review-name">${escapeHtml(review.name)}</div>
          <div class="review-date">${formatDate(review.date)}</div>
        </div>
        <div class="review-rating">${renderStars(review.rating)}</div>
        <div class="review-message">${escapeHtml(review.message)}</div>
        <div class="review-actions">
          <button class="edit" aria-label="Edit review" onclick="editReview(${i})">Edit</button>
          <button class="delete" aria-label="Delete review" onclick="deleteReview(${i})">Delete</button>
        </div>
      `;
      reviewsContainer.appendChild(card);
    });
  }

  // Basic HTML escaping to avoid XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function clearForm() {
    nameInput.value = '';
    messageInput.value = '';
    ratingInput.value = '';
    editIndexInput.value = '';
    form.querySelector('button[type="submit"]').textContent = 'Submit Review';
  }

  function validateForm() {
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      alert('Please enter your name (at least 2 characters).');
      return false;
    }
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      alert('Please enter your review message (at least 10 characters).');
      return false;
    }
    if (!ratingInput.value) {
      alert('Please select a rating.');
      return false;
    }
    return true;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm()) return;

    const reviews = getReviews();
    const newReview = {
      name: nameInput.value.trim(),
      message: messageInput.value.trim(),
      rating: ratingInput.value,
      date: new Date().toISOString(),
    };

    const editIndex = editIndexInput.value;

    if (editIndex !== '') {
      // Update existing review
      reviews[editIndex] = {
        ...reviews[editIndex],
        ...newReview,
        date: new Date().toISOString(), // update date on edit
      };
      alert('Review updated successfully!');
    } else {
      // Add new review
      reviews.push(newReview);
      alert('Review added successfully!');
    }

    setReviews(reviews);
    clearForm();
    renderReviews();
  });

  window.editReview = function(index) {
    const reviews = getReviews();
    if (!reviews[index]) return;

    const review = reviews[index];
    nameInput.value = review.name;
    messageInput.value = review.message;
    ratingInput.value = review.rating;
    editIndexInput.value = index;

    form.querySelector('button[type="submit"]').textContent = 'Update Review';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.deleteReview = function(index) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    const reviews = getReviews();
    reviews.splice(index, 1);
    setReviews(reviews);
    renderReviews();
  };

  // Initial render on page load
  renderReviews();
