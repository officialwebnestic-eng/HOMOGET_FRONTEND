// src/helpers/GetLiveDubaiTrends.js

const getLiveDubaiTrends = async () => {
  // Free public JSON data hosting endpoint
  const API_URL = "https://api.jsonbin.io/v3/b/6684ff25ad19ca34f8e29a3a?meta=false";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    
    return await response.json(); 
  } catch (error) {
    console.error("API Call Failed:", error);
    return null;
  }
};

export default getLiveDubaiTrends;