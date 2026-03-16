import React, { useState, useEffect } from 'react';
import { Calculator, Info, Activity } from 'lucide-react';
import './BMI.css';

const BMI = () => {
  const [height, setHeight] = useState(''); // cm
  const [weight, setWeight] = useState(''); // kg
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('var(--royal-blue)');

  // Calculate BMI
  useEffect(() => {
    if (height && weight && Number(height) > 0 && Number(weight) > 0) {
      const hMeters = Number(height) / 100;
      const calcBmi = (Number(weight) / (hMeters * hMeters)).toFixed(1);
      setBmi(calcBmi);
      localStorage.setItem('user_bmi', calcBmi);

      // Determine Category
      if (calcBmi < 18.5) {
        setCategory('Underweight');
        setColor('#3B82F6'); // Blue
      } else if (calcBmi >= 18.5 && calcBmi <= 24.9) {
        setCategory('Healthy');
        setColor('#10B981'); // Green
      } else if (calcBmi >= 25 && calcBmi <= 29.9) {
        setCategory('Overweight');
        setColor('#F59E0B'); // Orange
      } else {
        setCategory('Obese');
        setColor('#EF4444'); // Red
      }
    } else {
      setBmi(null);
      setCategory('');
    }
  }, [height, weight]);

  // Calculate meter needle rotation (0 to 180 deg max mapping BMI 10 to 40)
  const getMeterRotation = () => {
    if (!bmi) return 0;
    const clampedBmi = Math.min(Math.max(Number(bmi), 10), 40);
    // Maps 10-40 BMI to 0-180 degrees
    return ((clampedBmi - 10) / 30) * 180;
  };

  return (
    <div className="bmi-container animate-fade-in">
      <div className="learning-header">
        <h2>BMI Calculator</h2>
        <p>Monitor your Body Mass Index for optimal sports performance.</p>
      </div>

      <div className="bmi-card card animate-fade-in">
        <form className="bmi-form mb-6" onSubmit={e => e.preventDefault()}>
          <div className="form-row">
            <div className="input-group flex-1">
              <label className="input-label">Height (cm)</label>
              <input 
                type="number" 
                className="input-field text-center text-lg" 
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
                min="50" max="250"
              />
            </div>
            <div className="input-group flex-1">
              <label className="input-label">Weight (kg)</label>
              <input 
                type="number" 
                className="input-field text-center text-lg" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                min="20" max="300"
              />
            </div>
          </div>
        </form>

        <div className="bmi-meter-wrapper">
          {/* SVG Half-Circle Meter */}
          <div className="meter-svg-container">
             <svg viewBox="0 0 200 100" className="bmi-meter-bg">
               {/* Underweight Zone */}
               <path d="M 10 90 A 80 80 0 0 1 50 20 L 70 45 A 50 50 0 0 0 35 90 Z" fill="#3B82F6" opacity="0.8"/>
               {/* Healthy Zone */}
               <path d="M 50 20 A 80 80 0 0 1 150 20 L 130 45 A 50 50 0 0 0 70 45 Z" fill="#10B981" opacity="0.9"/>
               {/* Overweight Zone */}
               <path d="M 150 20 A 80 80 0 0 1 180 55 L 155 70 A 50 50 0 0 0 130 45 Z" fill="#F59E0B" opacity="0.8"/>
               {/* Obese Zone */}
               <path d="M 180 55 A 80 80 0 0 1 190 90 L 165 90 A 50 50 0 0 0 155 70 Z" fill="#EF4444" opacity="0.8"/>
             </svg>
             
             {/* Needle */}
             <div 
               className="meter-needle" 
               style={{ 
                 transform: `rotate(${getMeterRotation()}deg)`,
                 opacity: bmi ? 1 : 0.3
               }}
             >
               <div className="needle-head"></div>
               <div className="needle-base"></div>
             </div>
          </div>

          <div className="bmi-result-text mt-4">
            <h3 className="result-number" style={{ color: bmi ? color : 'var(--text-secondary)' }}>
              {bmi || '--.-'}
            </h3>
            <span className="result-category" style={{ backgroundColor: bmi ? color : 'var(--border-color)' }}>
              {category || 'Enter your details'}
            </span>
          </div>
        </div>
      </div>

      {bmi && (
        <div className="health-suggestions card animate-fade-in" style={{animationDelay: '0.2s', borderLeft: `4px solid ${color}`}}>
          <h3 className="flex items-center gap-2 mb-2"><Activity size={18} color={color} /> Health Advice</h3>
          <p className="text-secondary text-sm">
            {category === 'Underweight' && "Consider a strength training program and consulting our sports nutritionist to safely build muscle mass."}
            {category === 'Healthy' && "Great job! Maintain your current routine. Consider checking out our Online Learning section to refine your athletic techniques."}
            {category === 'Overweight' && "Focus on cardiovascular activities like the Running module. Consult a coach to create a sustainable fitness plan."}
            {category === 'Obese' && "Start with low-impact exercises and structured diets. The Eagle Brothers coaches are here to guide you toward your fitness goals."}
          </p>
        </div>
      )}

      {/* Info Card */}
      <div className="info-card mt-6">
        <Info size={16} className="text-blue flex-shrink-0 mt-1" />
        <p className="text-sm text-secondary m-0">
          BMI is a useful screening tool but does not diagnose body fatness or health. Athletes heavily muscular may have a high BMI without being overweight.
        </p>
      </div>

    </div>
  );
};

export default BMI;
