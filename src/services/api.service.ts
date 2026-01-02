import axios from "axios";

export const getGiphyByText = async (searchtext: string) => {
  const apiKey = import.meta.env.VITE_GIPHY_API_KEY;
  try {
    const res = await axios.get(
      `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchtext}&limit=1&offset=0&rating=g&lang=en&bundle=messaging_non_clips`
    );

    if (res?.data?.meta?.status === 200) {
      return res.data.data; 
    }

    return [];
  } catch (e) {
    console.log(e);
    return [];
  }
};
