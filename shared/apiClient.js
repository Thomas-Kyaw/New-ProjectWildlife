// shared/apiClient.js
export const fetchWildlifeData = async () => {
  const response = await fetch('https://api.example.com/wildlife');
  const data = await response.json();
  return data;
};
