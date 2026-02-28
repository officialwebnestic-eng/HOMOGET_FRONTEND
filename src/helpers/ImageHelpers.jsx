 const  IMAGE_BASE_URL =   import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:3000/agents";


export const getImageUrl = (filename) => {
  if (!filename) return null;
  // If it's already a full URL, don't add the prefix again
  if (filename.startsWith('http')) return filename; 
  
  return `${IMAGE_BASE_URL}/${filename}`;
};

  export const getAvatarFallback = (name) => {
    const initials =
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "A";
    return `https://ui-avatars.com/api/?name=${initials}&background=C5A059&color=fff&bold=true`;
  };