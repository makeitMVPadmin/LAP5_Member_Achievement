import upvoteImg from "../../assets/images/upvote.png";
import markAsRead from "../../assets/images/markAsRead.png";
import bookmark from "../../assets/images/bookmark.png";
import commentsIcon from "../../assets/images/comments.png";
import uploadIcon from "../../assets/images/upload-square-svgrepo-com.png";
import {
  ChakraProvider,
  Box,
  useDisclosure,
  Collapse,
  IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

import "./RedemptionOptions.scss";

export default function RedemptionOptions() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <ChakraProvider>
      <Box textAlign="left" mt={4}>
        <Box className="header-container" onClick={onToggle}>
          <h2 className="rewards-redemption-title">How to Earn Points</h2>
          <IconButton
            className="custom-size"
            aria-label={isOpen ? "Hide Options" : "Show Options"}
            icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            backgroundColor={"white"}
            color={"#0099ff"}
          />
        </Box>

        <Collapse in={isOpen}>
          <Box className="daily-redemption-options-container2" mt={4}>
            <p className="options-description options-description-first">
              Earn points by completing any of the actions listed below! Please
              note: certain actions have daily restrictions. You are welcome to
              continue completing these actions, but will only accumulate points
              up to the daily restriction.
            </p>
            <div className="redemption-options">
              <div className="redemption-options-cards">
                <div className="redemption-options-card">
                  <div className="option-icon">
                    <img
                      className="redemption__img"
                      src={upvoteImg}
                      alt="Like a resource"
                      width="24"
                      height="24"
                    />
                    <div>
                      <p className="item-text">Like a resource</p>
                      <div>
                        <p className="points">+2 points</p>
                      </div>
                    </div>
                  </div>
                  <div className="daily-limit">Daily limit: 14 points</div>
                </div>
                <div className="redemption-options-card">
                  <div className="option-icon">
                    <img
                      className="redemption__img"
                      src={markAsRead}
                      alt="Mark a resource as read"
                      width="24"
                      height="24"
                    />
                    <div>
                      <p className="item-text">Mark resource as read</p>
                      <div>
                        <p className="points">+10 points</p>
                      </div>
                    </div>
                  </div>
                  <div className="daily-limit">No daily limit</div>
                </div>
                <div className="redemption-options-card">
                  <div className="option-icon">
                    <img
                      className="redemption__img redemption__img-bookmark"
                      src={bookmark}
                      alt="Suggest a resource"
                      width="24"
                      height="24"
                    />
                    <div>
                      <p className="item-text">Bookmark a resource</p>
                      <div>
                        <p className="points">+20 points</p>
                      </div>
                    </div>
                  </div>
                  <div className="daily-limit">No daily limit</div>
                </div>
                <div className="redemption-options-card">
                  <div className="option-icon">
                    <img
                      className="redemption__img"
                      src={uploadIcon}
                      alt="Submit a resource"
                      width="24"
                      height="24"
                    />
                    <div>
                      <p className="item-text">Submit a resource</p>
                      <div>
                        <p className="points">+50 points</p>
                      </div>
                    </div>
                  </div>
                  <div className="daily-limit">No daily limit</div>
                </div>
                <div className="redemption-options-card">
                  <div className="option-icon">
                    <img
                      className="redemption__img"
                      src={commentsIcon}
                      alt="Comment on a resource"
                      width="24"
                      height="24"
                    />
                    <div>
                      <p className="item-text">Comment on a resource</p>
                      <div>
                        <p className="points">+10 points</p>
                      </div>
                    </div>
                  </div>
                  <div className="daily-limit">No daily limit</div>
                </div>
              </div>
            </div>
          </Box>
        </Collapse>
      </Box>
    </ChakraProvider>
  );
}
