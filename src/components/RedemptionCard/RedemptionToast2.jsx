import React, { useState, useEffect } from "react";
import modalClose from "../../assets/icons/modalClose.svg";
import "../CommentModal/CommentModal.scss"
import { Box, Text, Flex, Image } from "@chakra-ui/react";
import checkImg from "../../assets/images/check.png";
import Confetti from "react-confetti";

export const RedemptionToast2 = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    setShowConfetti(true);
    const confettiTimeout = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(confettiTimeout);
  }, []);


  const closeModal = () => {
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <>
      <button className="reward__claim-button-approve">
        Claim
      </button>
    <Box
      position="fixed"
      bottom="20px"
      right="20px"
      width="500px"
      zIndex={9999}
    >
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={600}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 1000 }}
        />
      )}

      <Flex align="center" className="modal">
        <img
          className="modalX"
          src={modalClose}
          alt="closeModal"
          onClick={closeModal}
          aria-label="close modal"
        />
        <Image src={checkImg} alt="success Icon" boxSize="80px" mr={4} />
        <Box>
          <Text
            mb={2}
            fontWeight="bold"
            fontFamily="Corben"
            fontSize="25px"
            paddingTop="10px"
          >
            Success!
          </Text>
          <Text mb={2} fontWeight="bold" marginTop="-5px">
            A Community Manager will reach out shortly with the next steps.
          </Text>
        </Box>
      </Flex>
    </Box>
    </>
  );
};