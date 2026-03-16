import React, { useState } from 'react';
import { Heart, CreditCard, ShieldCheck } from 'lucide-react';
import './Donations.css';

const PREDEFINED_AMOUNTS = [100, 500, 1000];

const Donations = () => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleAmountClick = (value) => {
    setAmount(value.toString());
  };

  const handleDonate = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    setIsProcessing(true);

    // Mock Payment Gateway processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  return (
    <div className="donations-container animate-fade-in">
      <div className="learning-header text-center mb-6">
        <Heart size={48} className="mx-auto mb-4 text-red bounce-animation" color="#EF4444" fill="#EF4444" />
        <h2>Support Our Mission</h2>
        <p>Your contribution helps provide equipment, nutrition, and professional coaching to talented underprivileged athletes.</p>
      </div>

      {paymentSuccess ? (
        <div className="donation-success-card card text-center animate-fade-in">
          <ShieldCheck size={64} className="mx-auto mb-4 text-success" color="var(--success-color)" />
          <h3>Thank You For Your Support!</h3>
          <p className="text-secondary mb-6">
            Your generous donation of ₹{amount} has been processed successfully. A receipt has been sent to your registered email.
          </p>
          <button 
            className="btn-primary" 
            onClick={() => { setPaymentSuccess(false); setAmount(''); }}
          >
            Make Another Donation
          </button>
        </div>
      ) : (
        <div className="donation-form-card card animate-fade-in" style={{animationDelay: '0.1s'}}>
          <form onSubmit={handleDonate}>
            <label className="input-label mb-2 block">Select Amount (₹)</label>
            <div className="amount-grid mb-6">
              {PREDEFINED_AMOUNTS.map((val) => (
                <button
                  type="button"
                  key={val}
                  className={`amount-btn ${amount === val.toString() ? 'active' : ''}`}
                  onClick={() => handleAmountClick(val)}
                >
                  ₹{val}
                </button>
              ))}
            </div>

            <div className="input-group mb-6">
              <label className="input-label">Or enter custom amount (₹)</label>
              <input
                type="number"
                className="input-field amount-input"
                min="10"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="secure-payment-badge mb-6">
              <ShieldCheck size={18} color="var(--success-color)" />
              <span>100% Secure Payment Guarantee</span>
            </div>

            <button 
              type="submit" 
              className={`btn-primary w-full btn-donate ${isProcessing ? 'processing' : ''}`}
              disabled={isProcessing}
            >
              {isProcessing ? (
                'Processing Payment...'
              ) : (
                <>
                  <CreditCard size={18} /> Donate ₹{amount || '0'} Now
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Donations;
