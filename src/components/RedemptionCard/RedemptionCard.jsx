import Coin from "../../assets/images/points-coin.png";
import "./RedemptionCard.scss";
import rewardOptionsData from "../../data/reward-options.json";
import { RedemptionToast2 } from "./RedemptionToast2";
import { useState } from "react";

export default function RedemptionCard({ points, deductPoints }) {
  const [isClaimed, setIsClaimed] = useState(false);

  // console.log(points);
  return (
    <>
      {rewardOptionsData.map((reward) => {
        const canClaim = points >= reward.points;
        const handleRewardClaim = () => {
          deductPoints(reward.points);
          setIsClaimed(true);
        };
        return (
          <section key={reward.id} className="reward reward--error">
            <div className="reward__heading-top">
              <div className="reward__heading-top-container">
                <h1 className="reward__title">{reward.name}</h1>
              </div>
              <div className="reward__content">
                <p className="reward__description">{reward.detail}</p>
                <div className="reward__point-container">
                  <img src={Coin} alt="coin icon" className="coin-icon" />
                  <span className="reward__required-points">
                    {reward.points} points
                  </span>
                </div>
              </div>
              <div className="reward__button-container">
                {canClaim ? (
                  <button
                    className="reward__claim-button-approve"
                    onClick={handleRewardClaim}
                  >
                    Claim
                  </button>
                ) : (
                  <button className="reward__claim-button-error" disabled>
                    Not Enough Points
                  </button>
                )}
              </div>
              {isClaimed ? <RedemptionToast2 /> : null}
            </div>
          </section>
        );
      })}
    </>
  );
}
