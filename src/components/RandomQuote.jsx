import { BsTrash3 } from "react-icons/bs";
import { useState, useEffect } from 'react';
import axios from 'axios';

const RandomQuote = () => {
  const [quote, setQuote] = useState(null);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load saved quotes from Local Storage when the component mounts
  useEffect(() => {
    const savedQuotesFromLocalStorage = JSON.parse(localStorage.getItem('savedQuotes')) || [];
    setSavedQuotes(savedQuotesFromLocalStorage);
  }, []);

  // Fetch a random quote from the API
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/quotes/random');
        setQuote(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  const getNewQuote = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://dummyjson.com/quotes/random');
      setQuote(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const saveQuote = () => {
    const updatedQuotes = [...savedQuotes, quote];
    setSavedQuotes(updatedQuotes);
    localStorage.setItem('savedQuotes', JSON.stringify(updatedQuotes));
  };

  const deleteQuote = (indexToDelete) => {
    const updatedQuotes = savedQuotes.filter((_, index) => index !== indexToDelete);
    setSavedQuotes(updatedQuotes);
    localStorage.setItem('savedQuotes', JSON.stringify(updatedQuotes));
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="spinner"></div>
    </div>
  );

  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-patrick">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-start border-2 border-black">
        <p className="text-xl font-semibold mb-4 pb-5">"{quote?.quote}"</p>
        <p className="text-md text-gray-700">~ {quote?.author}</p>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={saveQuote}
            className="px-4 py-1 border-2 border-black bg-transparent text-black rounded-lg hover:bg-black hover:text-white"
          >
            Save 
          </button>
          <button
            onClick={getNewQuote}
            className="px-4 py-2 border-2 border-black bg-transparent text-black rounded-lg hover:bg-black hover:text-white"
          >
            Re-generate
          </button>
        </div>
      </div>

      <div className="mt-8 w-full max-w-md">
        <h2 className="text-lg font-semibold text-start mb-4">Saved Quotes</h2>
        {savedQuotes.length === 0 ? (
          <p className="text-center text-gray-500">No saved quotes.</p>
        ) : (
          <ul className="space-y-4">
            {savedQuotes.map((savedQuote, index) => (
              <li key={index} className="bg-white p-4 rounded-lg shadow border-2 border-black">
                <div className="flex flex-col">
                  <div className="mb-4">
                    <p className="text-md font-semibold pb-2">"{savedQuote.quote}"</p>
                    <p className="text-sm text-gray-700">~ {savedQuote.author}</p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => deleteQuote(index)}
                      className="px-2 py-1 border-2 border-black bg-transparent text-black rounded-lg hover:bg-black hover:text-white flex items-center"
                    >
                      <BsTrash3 className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RandomQuote;
