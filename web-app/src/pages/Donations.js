import React, { useState } from 'react';
import '../styles/Donations.css';

const Donations = () => {
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount(''); // Clear custom amount if a predefined amount is selected
  };

  const handleCustomAmountChange = (e) => {
    setSelectedAmount('');
    setCustomAmount(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const donationAmount = selectedAmount || customAmount;
    if (donationAmount && donationAmount > 0) {
      alert(`Thank you for donating $${donationAmount}!`);
    } else {
      alert('Please enter a valid donation amount.');
    }
  };

  return (
    <div className="donations-page">
      <h1>Support Our Conservation Efforts</h1>
      <p>Your donation helps us protect endangered wildlife and preserve their habitats.</p>

      <form className="donation-form" onSubmit={handleSubmit}>
        <h2>Select Donation Amount</h2>
        <div className="amount-options">
          <button
            type="button"
            className={`amount-button ${selectedAmount === '10' ? 'selected' : ''}`}
            onClick={() => handleAmountClick('10')}
          >
            $10
          </button>
          <button
            type="button"
            className={`amount-button ${selectedAmount === '25' ? 'selected' : ''}`}
            onClick={() => handleAmountClick('25')}
          >
            $25
          </button>
          <button
            type="button"
            className={`amount-button ${selectedAmount === '50' ? 'selected' : ''}`}
            onClick={() => handleAmountClick('50')}
          >
            $50
          </button>
          <button
            type="button"
            className={`amount-button ${selectedAmount === '100' ? 'selected' : ''}`}
            onClick={() => handleAmountClick('100')}
          >
            $100
          </button>
        </div>

        <h3>Or Enter a Custom Amount</h3>
        <input
          type="number"
          value={customAmount}
          onChange={handleCustomAmountChange}
          placeholder="Enter custom amount"
          min="1"
        />

        <h2>Enter Your Payment Details</h2>
        <div className="payment-details">
          <label>Name on Card</label>
          <input type="text" placeholder="John Doe" required />
          <label>Card Number</label>
          <input type="text" placeholder="1234 5678 9012 3456" required />
          <label>Expiration Date</label>
          <input type="text" placeholder="MM/YY" required />
          <label>CVV</label>
          <input type="text" placeholder="123" required />
        </div>

        <button type="submit" className="submit-button">
          Donate Now
        </button>
      </form>
    </div>
  );
};

export default Donations;
