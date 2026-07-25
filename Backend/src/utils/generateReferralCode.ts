export const generateReferralCode =
  () => {
    return (
      "GP" +
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()
    );
  };