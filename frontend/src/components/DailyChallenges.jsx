import { format } from 'date-fns';
import { Target, Flag, CheckCircle2, Shield } from 'lucide-react';










export default function DailyChallenges({ challenges }) {
  const getIcon = (type) => {
    switch (type) {
      case 'capture':return <Flag className="w-5 h-5" />;
      case 'defend':return <Shield className="w-5 h-5" />;
      case 'distance':return <Target className="w-5 h-5" />;
      default:return <Target className="w-5 h-5" />;
    }
  };

  return (
    <div className="glass-card p-6 h-full animate-fade-in-up stagger-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Daily Challenges</h3>
        <span className="text-sm text-text-secondary">{format(new Date(), 'MMM d')}</span>
      </div>

      <div className="space-y-4">
        {challenges.length === 0 ?
        <p className="text-text-secondary text-sm">No active challenges for today.</p> :

        challenges.map((challenge, index) => {
          const progress = Math.min(100, challenge.currentValue / challenge.targetValue * 100);

          return (
            <div
              key={challenge._id}
              className={`p-4 rounded-xl border transition-all duration-300 ${
              challenge.isCompleted ?
              'bg-brand/5 border-brand/20' :
              'bg-black/40 border-[#2a2a2a]'}`
              }>
              
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${challenge.isCompleted ? 'bg-brand/20 text-brand' : 'bg-[#1f1f1f] text-text-secondary'}`}>
                      {getIcon(challenge.type)}
                    </div>
                    <div>
                      <p className={`font-medium ${challenge.isCompleted ? 'text-white' : 'text-text-primary'}`}>
                        {challenge.description}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        {challenge.currentValue} / {challenge.targetValue} {challenge.type === 'distance' ? 'km' : challenge.type === 'defend' ? 'health restored' : 'territories'}
                      </p>
                    </div>
                  </div>
                  {challenge.isCompleted &&
                <CheckCircle2 className="w-5 h-5 text-brand" />
                }
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-[#1f1f1f] rounded-full overflow-hidden">
                  <div
                  className={`h-full transition-all duration-1000 ease-out ${challenge.isCompleted ? 'bg-brand' : 'bg-brand/70'}`}
                  style={{ width: `${progress}%` }} />
                
                </div>
              </div>);

        })
        }
      </div>
    </div>);

}