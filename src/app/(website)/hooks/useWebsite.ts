const useWebsite = () => {
  const handleGoodMorning = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours >= 12 && hours < 18) return "Good afternoon";
    return "Good evening";
  };

  return { handleGoodMorning };
};

export { useWebsite };
