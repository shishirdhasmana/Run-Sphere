'use client';

import { useState } from 'react';
import { Target, Activity, Flame, Footprints, Calculator } from 'lucide-react';

export default function GoalPlanner() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [desiredWeight, setDesiredWeight] = useState('');
  
  const [results, setResults] = useState(null);

  const calculateGoal = (e) => {
    e.preventDefault();
    
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const dw = parseFloat(desiredWeight);

    if (!w || !h || !dw) return;

    // BMR estimate (Mifflin-St Jeor simplified for average male 30yo)
    const bmr = 10 * w + 6.25 * h - 145;
    const tdee = bmr * 1.2;

    // Assume safe weight loss of 0.5kg/week -> 550 kcal/day deficit
    // We get 250 from diet, 300 from running.
    // If desired weight is >= current weight, assume maintenance/gain 
    let dailyCalories = tdee;
    let runningCaloriesPerDay = 0;

    if (dw < w) {
      dailyCalories = tdee - 250;
      runningCaloriesPerDay = 300;
    }

    const weeklyRunningCalories = runningCaloriesPerDay * 7;
    // Running burns ~1 kcal per kg per km.
    const weeklyDistance = weeklyRunningCalories / w;

    setResults({
      dailyCalories: Math.round(dailyCalories),
      weeklyDistance: weeklyDistance.toFixed(2),
      bmr: Math.round(bmr),
      isWeightLoss: dw < w
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Target className="w-8 h-8 text-brand" />
          Goal Planner
        </h1>
        <p className="text-text-secondary mt-2">
          Enter your metrics to get a personalized running and diet plan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-[#141414]/90 backdrop-blur-xl border border-[#2a2a2a] rounded-2xl p-6 shadow-xl">
          <form onSubmit={calculateGoal} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Current Weight (kg)</label>
              <input 
                type="number" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                placeholder="e.g. 80"
                required
                min="30"
                max="300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Height (cm)</label>
              <input 
                type="number" 
                value={height} 
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                placeholder="e.g. 180"
                required
                min="100"
                max="250"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Desired Weight (kg)</label>
              <input 
                type="number" 
                value={desiredWeight} 
                onChange={(e) => setDesiredWeight(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                placeholder="e.g. 75"
                required
                min="30"
                max="300"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-brand hover:bg-[#e04302] text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Calculate Plan
            </button>
          </form>
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-6 animate-fade-in">
            {results.isWeightLoss ? (
              <div className="bg-[#141414]/90 backdrop-blur-xl border border-brand/30 rounded-2xl p-6 shadow-[0_0_15px_rgba(252,76,2,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-brand" />
                  Your Action Plan
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                      <Footprints className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Distance to Run</p>
                      <p className="text-2xl font-bold text-white">{results.weeklyDistance} <span className="text-base font-normal text-text-secondary">km / week</span></p>
                      <p className="text-sm text-text-secondary mt-1">
                        Running this distance burns ~2,100 kcal per week, accelerating your weight loss safely.
                      </p>
                    </div>
                  </div>

                  <div className="h-px w-full bg-[#2a2a2a]"></div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                      <Flame className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Daily Calorie Intake</p>
                      <p className="text-2xl font-bold text-white">{results.dailyCalories} <span className="text-base font-normal text-text-secondary">kcal / day</span></p>
                      <p className="text-sm text-text-secondary mt-1">
                        Based on your BMR ({results.bmr} kcal), this creates a healthy 250 kcal dietary deficit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#141414]/90 backdrop-blur-xl border border-[#2a2a2a] rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Maintenance Plan</h3>
                <p className="text-text-secondary">
                  Your desired weight is greater than or equal to your current weight. Focus on maintenance:
                </p>
                <div className="mt-4 p-4 bg-[#1f1f1f] rounded-xl border border-[#2a2a2a]">
                  <p className="text-lg text-white font-medium">Eat ~{results.dailyCalories} kcal / day</p>
                  <p className="text-sm text-text-secondary mt-1">Maintain your current activity level and run as desired for cardiovascular health.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
